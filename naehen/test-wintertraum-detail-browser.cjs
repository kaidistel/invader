"use strict";
/* Wintertraum attraction detail QA: real Chromium layout, original imagery,
   existing live queue / SR / Quick Pass controls, six responsive widths. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {chromium}=require("playwright");
const root=__dirname,shots=path.join(root,"wintertraum-responsive-qa");
fs.mkdirSync(shots,{recursive:true});
const fixture=path.join(root,".wintertraum-detail-qa.html");
let html=fs.readFileSync(path.join(root,"index.html"),"utf8");
html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
fs.writeFileSync(fixture,html);
const cases=[];
for(const w of [320,375,430,768,1024,1440])cases.push({width:w,ride:"taron"});
cases.push({width:375,ride:"fly"},{width:1024,ride:"fly"});
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const measurements=[];
 try{
  for(const {width,ride} of cases){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
   await page.goto("file://"+fixture,{waitUntil:"domcontentloaded"});
   await page.evaluate(ride=>{
    document.body.dataset.park="phantasialand";
    document.body.dataset.season="wintertraum";
    const sheet=document.querySelector("#rideSheet");
    sheet.dataset.park="phantasialand";
    sheet.dataset.world=ride;
    sheet.classList.add("show");
    document.querySelector("#worldArtImage").src=ride==="taron"
      ? "./assets/wintertraum-taron-original.jpg"
      : "./assets/wintertraum-fly-original.jpg";
    document.querySelector("#worldCaption").textContent=ride==="taron"?"Nachtfahrt durch Klugheim":"Rookburgh bei Nacht";
    document.querySelector("#rideZone").textContent=ride==="taron"?"Mystery · Klugheim":"Berlin · Rookburgh";
    document.querySelector("#rideTitle").textContent=ride==="taron"?"Taron":"F.L.Y.";
    document.querySelector("#rideDetailWait").textContent="35 min";
    document.querySelector("#rideDetailStatus").textContent="Als geöffnet gemeldet · Daten von Queue-Times.";
    document.querySelector("#srCommunity").innerHTML='<div class="srBox"><b>👤 Single Rider</b><p class="meta">Separate Warteschlange verfügbar.</p></div>';
    document.querySelector("#rideExtraFacts").classList.remove("hidden");
    document.querySelector("#rideExtraFacts").innerHTML='<div class="rideFactGrid"><div class="rideFactCard"><span>Hersteller</span><b>Intamin</b></div><div class="rideFactCard"><span>Typ</span><b>Launch Coaster</b></div></div>';
    const quick=document.querySelector("#rideQuickPass");
    quick.hidden=false;
    quick.innerHTML='<span class="npr-detail-label">QUICK PASS</span><p>Optionaler Zugang</p><a class="npr-detail-link" href="https://shop.phantasialand.de/de/quick-pass">Zum offiziellen Shop</a><small>Keine bestätigte Restwartezeit</small>';
   },ride);
   await page.locator("#rideSheet .sheetCard").waitFor({state:"visible"});
   await page.evaluate(()=>document.querySelector("#worldArtImage").decode().catch(()=>{}));
   const data=await page.evaluate(()=>{
    const box=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    const sel=q=>document.querySelector("#rideSheet "+q);
    const c=sel(".sheetCard");
    return {
      viewport:window.innerWidth,sheet:box(c),clientWidth:c.clientWidth,scrollWidth:c.scrollWidth,
      close:box(sel(".close")),title:box(sel("#rideTitle")),queue:box(sel("#rideQueueBtn")),
      hero:box(sel(".worldArt")),kicker:box(sel(".winterDetailKicker")),
      artWidth:sel("#worldArtImage").naturalWidth,artHeight:sel("#worldArtImage").naturalHeight,
      cardBackground:getComputedStyle(c).backgroundImage,
      titleFont:getComputedStyle(sel("#rideTitle")).fontFamily,
      infoFont:getComputedStyle(sel("#rideDetailStatus")).fontFamily,
      waitFont:getComputedStyle(sel("#rideDetailWait")).fontFamily,
      buttonFont:getComputedStyle(sel("#rideQueueBtn")).fontFamily,
      buttonHeight:box(sel("#rideQueueBtn")).h,
      waitBg:getComputedStyle(sel("#rideDetailWait")).backgroundImage,
      quickVisible:getComputedStyle(sel("#rideQuickPass")).display,
      quickLink:sel("#rideQuickPass a")?.getAttribute("href"),
      ornaments:getComputedStyle(sel(".worldOrnament")).display,
      badgeDisplay:getComputedStyle(sel(".worldBadge")).display,
      isWinterBadgeVisible:getComputedStyle(sel(".winterDetailKicker")).display
    };
   });
   const p=width+"px/"+ride;
   assert.ok(data.sheet.x>=-2&&data.sheet.right<=width+2,p+" sheet overflow viewport: "+JSON.stringify(data.sheet));
   assert.ok(data.sheet.w>Math.min(width*.85,620),p+" sheet unexpectedly narrow");
   assert.ok(data.scrollWidth<=data.clientWidth+3,p+" detail has horizontal scroll: "+data.scrollWidth+"/"+data.clientWidth);
   assert.ok(data.artWidth>0&&data.artHeight>0,p+" authentic local photo did not load");
   assert.ok(data.hero.h>=255&&data.hero.h<=345,p+" photographic header wrong height: "+data.hero.h);
   assert.ok(data.titleFont.includes("Berkshire Swash"),p+" title font should be Berkshire: "+data.titleFont);
   assert.ok(data.infoFont.includes("Inter")&&data.waitFont.includes("Inter")&&data.buttonFont.includes("Inter"),p+" body UI must use readable Inter");
   assert.ok(data.title.y>=data.sheet.y+120,p+" title is hidden behind photo");
   assert.ok(data.close.x>=data.sheet.x&&data.close.right<=data.sheet.right+2,p+" close button outside sheet");
   assert.ok(data.buttonHeight>=44,p+" queue action too small");
   assert.ok(data.cardBackground.includes("linear-gradient"),p+" missing winter sheet background");
   assert.ok(data.waitBg.includes("linear-gradient"),p+" missing highlighted wait information");
   assert.ok(data.quickVisible!=="none"&&data.quickLink==="https://shop.phantasialand.de/de/quick-pass",p+" Quick Pass UI lost");
   assert.equal(data.ornaments,"none",p+" scenic summer ornament visible in Wintertraum");
   assert.equal(data.badgeDisplay,"none",p+" scenic badge visible in Wintertraum");
   assert.notEqual(data.isWinterBadgeVisible,"none",p+" winter seasonal label hidden");
   await page.screenshot({path:path.join(shots,"wintertraum-detail-"+ride+"-"+width+"px.png"),animations:"disabled"});
   measurements.push({p,width:Math.round(data.sheet.w),titleY:Math.round(data.title.y),height:Math.round(data.sheet.h)});
   await page.close();
  }
  console.log("PASS Wintertraum details in Chromium: 320, 375, 430, 768, 1024, 1440 px, plus F.L.Y.");
  console.log(JSON.stringify(measurements,null,2));
 }finally{await browser.close();try{fs.rmSync(fixture);}catch{}}
})().catch(err=>{console.error(err);process.exitCode=1;});
