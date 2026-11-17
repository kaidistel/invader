"use strict";
/* Real Chromium QA for the optional Wintertraum snow canvas. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const root=__dirname;
const screenshots=path.join(root,"wintertraum-responsive-qa");
fs.mkdirSync(screenshots,{recursive:true});
const file=path.join(root,".wintertraum-snow-qa.html");
let html=fs.readFileSync(path.join(root,"index.html"),"utf8");
html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
html=html.replace("</body>",'<script defer src="./wintertraum-snow.js?v=180"></script></body>');
fs.writeFileSync(file,html);
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const output=[];
 try{
  for(const width of [320,375,768,1440]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"no-preference"});
   await page.goto("file://"+file,{waitUntil:"domcontentloaded"});
   await page.evaluate(()=>{
     document.querySelectorAll(".gate,.auth").forEach(x=>x.remove());
     document.getElementById("app").classList.remove("hidden");
     document.body.dataset.park="phantasialand";
     document.body.dataset.season="wintertraum";
     window.NAEHEN_WINTER_SNOW?.refresh();
   });
   await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW?.getState().frames >= 3,{timeout:7000});
   const state=await page.evaluate(()=>{
     const c=document.getElementById("winterSnowCanvas");
     const btn=document.getElementById("winterSnowToggle");
     const pixels=c.getContext("2d").getImageData(0,0,c.width,c.height).data;
     let visiblePixels=0;
     for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)visiblePixels++;
     return {
       ...window.NAEHEN_WINTER_SNOW.getState(),
       canvasVisible:!c.hidden,
       pressed:btn.getAttribute("aria-pressed"),
       toggleVisible:!btn.hidden,
       canvasPointer:getComputedStyle(c).pointerEvents,
       canvasZ:Number(getComputedStyle(c).zIndex),
       scrollbarWidth:document.documentElement.scrollWidth,
       visiblePixels,
       btnWidth:Math.round(btn.getBoundingClientRect().width)
     };
   });
   assert.equal(state.running,true,width+": snow must animate in Wintertraum");
   assert.equal(state.toggleVisible,true,width+": snow switch missing");
   assert.equal(state.pressed,"true",width+": pressed button not synchronized");
   assert.equal(state.canvasVisible,true,width+": snow canvas should be visible");
   assert.equal(state.canvasPointer,"none",width+": snow must not block controls");
   assert.ok(state.flakes>=18&&state.flakes<=80,width+": unexpected particle count");
   assert.ok(state.flakes>=Math.min(80,Math.max(18,Math.round((width*900)/12500)))-1,width+": snow density not increased");
   assert.equal(await page.locator("#winterSnowCanvas").evaluate(el=>getComputedStyle(el).opacity),"0.65",width+": snow opacity mismatch");
   assert.ok(state.visiblePixels>25,width+": snow is not visibly rendered to canvas");
   assert.equal(state.spriteVariants,6,width+": snow must use six pre-rendered textures");
   assert.equal(state.layers.far+state.layers.mid+state.layers.near,state.flakes,
     width+": all snowflakes must have a valid depth layer");
   assert.ok(state.layers.far>0&&state.layers.mid>0,
     width+": at least distant and middle-depth flakes should be visible");
   assert.ok(state.scrollbarWidth<=width+3,width+": snow button causes horizontal page overflow");
   assert.ok(state.btnWidth>=42,width+": snow switch tap target too small");
   await page.screenshot({path:path.join(screenshots,"wintertraum-snow-"+width+"px.png"),animations:"disabled"});

   // User should be able to stop and resume the animation immediately.
   await page.locator("#winterSnowToggle").click();
   const off=await page.evaluate(()=>({
     ...window.NAEHEN_WINTER_SNOW.getState(),
     hidden:document.getElementById("winterSnowCanvas").hidden,
     pressed:document.getElementById("winterSnowToggle").getAttribute("aria-pressed"),
     stored:localStorage.getItem("naehen:wintertraum:snowfall")
   }));
   assert.equal(off.running,false);
   assert.equal(off.hidden,true);
   assert.equal(off.pressed,"false");
   assert.equal(off.stored,"off");
   await page.locator("#winterSnowToggle").click();
   await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running);
   assert.equal(await page.evaluate(()=>localStorage.getItem("naehen:wintertraum:snowfall")),"on");

   // Never snow in other parks, pickers or overlay dialogs.
   await page.evaluate(()=>{document.body.dataset.park="movie-park-germany";});
   await page.waitForFunction(()=>!window.NAEHEN_WINTER_SNOW.getState().running);
   assert.equal(await page.locator("#winterSnowToggle").isVisible(),false);
   await page.evaluate(()=>{
     document.body.dataset.park="phantasialand";
     document.body.dataset.season="wintertraum";
   });
   await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running);
   await page.evaluate(()=>document.body.classList.add("modalOpen"));
   await page.waitForFunction(()=>!window.NAEHEN_WINTER_SNOW.getState().running);
   await page.evaluate(()=>document.body.classList.remove("modalOpen"));
   await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running);

   // Both seasonal details must retain the real snowfall above the sheet.
   for(const sheetId of ["rideSheet","nightPlannerSheet","recapSheet","archiveDetailSheet"]){
     await page.evaluate(id=>{
       const sheet=document.getElementById(id);
       if(id==="recapSheet" || id==="archiveDetailSheet") sheet.dataset.wintertraum="true";
       sheet.classList.add("show");
       document.body.classList.add("modalOpen");
       if(id==="rideSheet"){
         sheet.dataset.park="phantasialand";
         sheet.dataset.world="taron";
         document.getElementById("rideTitle").textContent="Taron";
         document.getElementById("worldArtImage").src="./assets/wintertraum-taron-original.jpg";
       }
     },sheetId);
     await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running &&
       document.getElementById("winterSnowCanvas").dataset.detailOverlay==="true",null,{timeout:8000});
     const detail=await page.evaluate(id=>{
       const canvas=document.getElementById("winterSnowCanvas");
       const sheet=document.getElementById(id);
       const close=sheet.querySelector(".close");
       const r=close.getBoundingClientRect();
       return {
         snowZ:Number(getComputedStyle(canvas).zIndex),
         sheetZ:Number(getComputedStyle(sheet).zIndex),
         snowPointer:getComputedStyle(canvas).pointerEvents,
         closeReached:document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)===close,
         visible:!canvas.hidden
       };
     },sheetId);
     assert.ok(detail.snowZ>detail.sheetZ,width+": snowfall behind "+sheetId);
     assert.equal(detail.snowPointer,"none",width+": snow must not capture taps in "+sheetId);
     assert.equal(detail.visible,true,width+": snow stopped inside "+sheetId);
     assert.equal(detail.closeReached,true,width+": close button blocked in "+sheetId);
     if(sheetId==="rideSheet")await page.screenshot({
       path:path.join(screenshots,"wintertraum-snow-ride-detail-"+width+"px.png"),
       animations:"disabled"
     });
     await page.evaluate(id=>{
       document.getElementById(id).classList.remove("show");
       document.body.classList.remove("modalOpen");
     },sheetId);
     await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running &&
       !("detailOverlay" in document.getElementById("winterSnowCanvas").dataset));
   }

   // Unrelated overlays still pause the animation, even if a winter detail is open.
   await page.evaluate(()=>{
     document.getElementById("rideSheet").classList.add("show");
     document.getElementById("queueSheet").classList.add("show");
     document.body.classList.add("modalOpen");
   });
   await page.waitForFunction(()=>!window.NAEHEN_WINTER_SNOW.getState().running);
   await page.evaluate(()=>{
     document.getElementById("rideSheet").classList.remove("show");
     document.getElementById("queueSheet").classList.remove("show");
     document.body.classList.remove("modalOpen");
   });
   await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running);

   // Accessibility: respects OS motion settings without overriding the stored choice.
   await page.emulateMedia({reducedMotion:"reduce"});
   await page.waitForFunction(()=>!window.NAEHEN_WINTER_SNOW.getState().running && document.getElementById("winterSnowToggle").disabled);
   assert.equal(await page.locator("#winterSnowToggle").isDisabled(),true);
   assert.equal(await page.locator("#winterSnowCanvas").isVisible(),false);
   await page.emulateMedia({reducedMotion:"no-preference"});
   // Playwright may not dispatch matchMedia('change') on restoring emulated media.
   // Explicit refresh tests the app's same lifecycle hook used on pageshow/resize.
   await page.evaluate(()=>window.NAEHEN_WINTER_SNOW.refresh());
   await page.waitForFunction(()=>window.NAEHEN_WINTER_SNOW.getState().running,null,{timeout:8000});
   output.push({width,flakes:state.flakes,visiblePixels:state.visiblePixels,toggleWidth:state.btnWidth,overflow:false,states:"on/off, park, modal, reduced motion"});
   await page.close();
  }
  console.log("PASS Snowfall: 320/375/768/1440px, visible canvas, toggling, park isolation, modal pause, reduced motion.");
  console.log(JSON.stringify(output,null,2));
 }finally{
  await browser.close();
  try{fs.rmSync(file);}catch(_){}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
