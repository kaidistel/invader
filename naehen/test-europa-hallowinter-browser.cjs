"use strict";
/* Reuse the real Europa-Park module, park selection and ride detail implementation.
   HALLOWinter only, no writes to Supabase or actual user profiles. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require("playwright");
const dir=__dirname,shots=path.join(dir,"hallowinter-browser-qa");
fs.mkdirSync(shots,{recursive:true});
const fixture=path.join(dir,".hallowinter-browser-qa.html");
const source=fs.readFileSync(path.join(dir,"index.html"),"utf8");
fs.writeFileSync(fixture,source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,""));
const app=fs.readFileSync(path.join(dir,"app.js"),"utf8");
function createApp(date){
  const mock=app.replace("const WINTERTRAUM_DATE = phantasialandLocalDate();",
    'const WINTERTRAUM_DATE = "'+date+'";');
  assert.notEqual(mock,app);
  const patch=mock.replace(/\s*bootstrap\(\);\s*\}\)\(\);\s*$/,
    '\n  window.__EUROPA_QA__={gate:EUROPA_HALLOWINTER_ACTIVE,openPark,renderParkPicker,openRideDetail,parkModuleFor,park:PARKS["europa-park"],setLocal:()=>{localMode=true;},setParkCategory:()=>{selectedVenueKind="park";}};\n})();');
  assert.notEqual(patch,mock);
  return patch;
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
   for(const width of [320,375,430,768,1024,1440]){
     const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
     await page.goto("file://"+fixture,{waitUntil:"domcontentloaded"});
     await page.addScriptTag({path:path.join(dir,"europa-park-config.js")});
     await page.addScriptTag({content:createApp("2026-11-18")});
     const result=await page.evaluate(async()=>{
       document.querySelectorAll(".gate,.auth").forEach(x=>x.remove());
       window.__EUROPA_QA__.setLocal();
       window.__EUROPA_QA__.setParkCategory();
       window.__EUROPA_QA__.renderParkPicker();
       const parkCard=document.querySelector('.parkChoice[data-park="europa-park"]');
       const season=parkCard?.dataset.season;
       const cardImg=parkCard?.querySelector(".parkChoiceArt")?.getAttribute("src");
       await window.__EUROPA_QA__.openPark("europa-park",{pushHistory:false});
       const section=document.getElementById("hallowinterSection");
       const hero=document.querySelector("#homeView>.hero");
       const rect=hero.getBoundingClientRect();
       const intro=section.getBoundingClientRect();
       const style=getComputedStyle(hero);
       const totalRides=document.querySelectorAll("#rides .ride").length;
       const voltron=document.querySelector('#rides .ride[data-detail="voltron-nevera"]');
       const voltronSrc=voltron?.querySelector(".rideArt")?.getAttribute("src");
       return {
         season,cardImg,activeSeason:document.body.dataset.season,sectionShown:!section.hidden,
         title:document.getElementById("parkDayHeadline").textContent,
         introWidth:intro.width,heroWidth:rect.width,heroLeft:rect.left,heroRight:rect.right,
         fullPageWidth:document.documentElement.scrollWidth,
         headerStyle:style.backgroundImage,headerHeight:rect.height,
         decorFont:getComputedStyle(hero.querySelector("h1")).fontFamily,
         parkCardCount:document.querySelectorAll('.parkChoice[data-park="europa-park"]').length,
         rideCount:totalRides,voltronSrc,
         voltronCount:document.querySelectorAll('#rides .ride[data-detail="voltron-nevera"]').length
       };
     });
     const tag=width+"px";
     assert.equal(result.season,"hallowinter",tag+" picker season");
     assert.equal(result.activeSeason,"hallowinter",tag+" active season");
     assert.equal(result.sectionShown,true,tag+" section hidden");
     assert.ok(result.title.includes("HALLOWinter"),tag+" winter intro missing");
     assert.equal(result.voltronCount,1,tag+" Voltron duplicate or missing");
     assert.ok(result.voltronSrc?.includes("europa-park-hallowinter-voltron.jpg"),tag+" Voltron card should be seasonal photo");
     assert.ok(result.headerStyle.includes("europa-park-hallowinter-voltron.jpg"),tag+" seasonal hero photo missing");
     assert.ok(result.decorFont.includes("Cormorant Garamond"),tag+" editorial type missing");
     assert.ok(result.fullPageWidth<=width+4,tag+" horizontal overflow "+result.fullPageWidth);
     assert.ok(result.heroLeft>=-2&&result.heroRight<=width+2,tag+" hero outside viewport");
     assert.ok(result.headerHeight>350,tag+" hero collapsed");
     assert.ok(result.rideCount>20,tag+" original Europa-Park ride list lost");
     await page.screenshot({path:path.join(shots,"europa-hallowinter-"+width+"px.png"),animations:"disabled"});
     if(width===375||width===1024){
       await page.evaluate(async()=>window.__EUROPA_QA__.openRideDetail("voltron-nevera"));
       const ride=await page.evaluate(()=>{
         const x=document.getElementById("rideSheet");
         return {open:x.classList.contains("show"),name:document.getElementById("rideTitle").textContent,
           img:document.getElementById("worldArtImage").getAttribute("src"),
           control:document.getElementById("rideQueueBtn").textContent};
       });
       assert.equal(ride.open,true,tag+" Voltron details not open");
       assert.ok(ride.name.includes("Voltron"),tag+" Voltron name missing");
       assert.ok(ride.img.includes("europa-park-hallowinter-voltron.jpg"),tag+" official Voltron photo not in detail");
       assert.ok(ride.control.includes("ANSTELLEN"),tag+" queue functionality missing");
       await page.screenshot({path:path.join(shots,"voltron-hallowinter-"+width+"px.png"),animations:"disabled"});
     }
     await page.close();
   }
   const outside=await browser.newPage({viewport:{width:390,height:900}});
   await outside.goto("file://"+fixture,{waitUntil:"domcontentloaded"});
   await outside.addScriptTag({path:path.join(dir,"europa-park-config.js")});
   await outside.addScriptTag({content:createApp("2026-12-01")});
   const off=await outside.evaluate(async()=>{
     document.querySelectorAll(".gate,.auth").forEach(x=>x.remove());
     window.__EUROPA_QA__.setLocal();
     await window.__EUROPA_QA__.openPark("europa-park",{pushHistory:false});
     return {
       enabled:window.__EUROPA_QA__.gate,season:document.body.dataset.season,
       story:document.getElementById("hallowinterSection").hidden,
       art:window.__EUROPA_QA__.parkModuleFor("europa-park").worlds["voltron-nevera"].artUrl||"",
       count:document.querySelectorAll("#rides .ride[data-detail='voltron-nevera']").length
     };
   });
   assert.equal(off.enabled,false,"HALLOWinter should end on 27 Nov");
   assert.equal(off.season,undefined,"Europa Park December should not inherit HALLOWinter");
   assert.equal(off.story,true,"HALLOWinter editorial section must hide after 27 Nov");
   assert.ok(!off.art.includes("europa-park-hallowinter-voltron.jpg"),"Voltron original art must return after season");
   assert.equal(off.count,1,"Attraction remains in the normal season");
   await outside.close();
   console.log("PASS Europa-Park HALLOWinter responsive 320/375/430/768/1024/1440px and Voltron details; off-season isolation");
 }finally{
   await browser.close();
   try{fs.rmSync(fixture)}catch(_){}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
