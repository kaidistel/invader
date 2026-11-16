"use strict";
// Real responsive browser test. Uses original local JPG files, not mocks for imagery.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require("playwright");
const root=__dirname,qaDir=path.join(root,"wintertraum-responsive-qa");
fs.mkdirSync(qaDir,{recursive:true});
const fixture=path.join(root,".wintertraum-responsive-fixture.html");
let html=fs.readFileSync(path.join(root,"index.html"),"utf8");
html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
fs.writeFileSync(fixture,html);
function card(id,title,image,wait,zone){
 return '<article class="ride" data-park="phantasialand" data-world="'+id+'" data-detail="'+id+'">'+
 '<img class="rideArt" src="'+image+'" alt="">'+
 '<button class="fav" aria-label="Favorit">★</button>'+
 '<div class="rideMain"><div class="rideTop"><div><h3>'+title+'</h3><div class="zone">'+zone+'</div></div></div>'+
 '<div class="meta"><span class="trend">→ stabil</span><div class="wtRideActions">'+
 '<button class="btn secondary" data-queue="'+id+'">ANSTELLEN</button>'+
 '<button class="btn ghost" data-detail-btn="'+id+'">DETAILS</button></div></div></div>'+
 '<div class="wait"><strong>'+wait+'</strong><small>MIN · LIVE</small></div></article>';
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const measurements=[];
 try{
  for(const width of [320,375,430,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
   await page.goto("file://"+fixture,{waitUntil:"domcontentloaded"});
   await page.evaluate(cards=>{
    document.body.dataset.park="phantasialand";
    document.body.dataset.season="wintertraum";
    for(const id of ["installGate","setupGate","authGate","parkPicker"])document.getElementById(id)?.remove();
    document.getElementById("app")?.classList.remove("hidden");
    document.getElementById("nav")?.classList.remove("hidden");
    for(const id of ["wintertraumSection","nightPlanner","winterShowStat"])document.getElementById(id).hidden=false;
    document.getElementById("nightPlannerPreview").textContent="4 Erlebnisse im Abendplan · Nächste Fahrt 17:40 Taron";
    document.getElementById("dataLabel").textContent="LIVE · VOR 1 MINUTE";
    document.getElementById("rides").innerHTML=cards;
   },card("taron","Taron","./assets/wintertraum-taron-original.jpg","35","Mystery · Klugheim")+
     card("fly","F.L.Y.","./assets/wintertraum-fly-original.jpg","20","Berlin · Rookburgh"));
   await page.locator("#rides .ride").first().waitFor({state:"visible"});
   await page.evaluate(()=>Promise.all([...document.querySelectorAll("#rides img")].map(i=>i.decode().catch(()=>{}))));
   const data=await page.evaluate(()=>{
     const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
     const hero=document.querySelector("#homeView>.hero"),cards=[...document.querySelectorAll("#rides .ride")];
     return {viewport:window.innerWidth,docWidth:document.documentElement.scrollWidth,
      hero:rect(hero),heroBg:getComputedStyle(hero).backgroundImage,
      planner:rect(document.querySelector("#nightPlanner")),
      cards:cards.map(rect),btns:cards.map(c=>[...c.querySelectorAll(".wtRideActions .btn")].map(rect)),
      ticketBg:getComputedStyle(cards[0].querySelector(".rideMain")).backgroundImage,
      ticketInk:getComputedStyle(cards[0].querySelector("h3")).color,
      plannerBg:getComputedStyle(document.querySelector(".nightPlanner")).backgroundColor,
      favorites:cards.map(c=>rect(c.querySelector(".fav"))),
      images:[...document.querySelectorAll("#rides .rideArt")].map(i=>({naturalWidth:i.naturalWidth})),
      columns:getComputedStyle(document.querySelector("#rides")).gridTemplateColumns};
   });

   if(data.docWidth>width+3){
    const offenders=await page.evaluate(()=>{
      return [...document.querySelectorAll("*")].map(el=>{
        const r=el.getBoundingClientRect(),st=getComputedStyle(el);
        return {tag:el.tagName.toLowerCase(),id:el.id,classes:String(el.className||"").slice(0,90),
          left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),
          display:st.display,position:st.position,overflowX:st.overflowX,scrollWidth:el.scrollWidth};
      }).filter(x=>x.display!=="none"&&x.position!=="fixed"&&(x.right>window.innerWidth+5||x.left< -5))
      .sort((a,b)=>b.right-a.right).slice(0,18);
    });
    console.log("RESPONSIVE OVERFLOW "+width+"px:",JSON.stringify(offenders,null,2));
    await page.screenshot({path:path.join(qaDir,"overflow-"+width+"px.png"),fullPage:true,animations:"disabled"});
   }
   assert.ok(data.docWidth<=width+3,width+"px viewport horizontal overflow: "+data.docWidth);
   assert.ok(data.hero.width>width*.78&&data.hero.height>390,width+"px hero not prominent");
   assert.ok(data.heroBg.includes("wintertraum-berlin-original.jpg"),width+"px Berlin image absent");
   assert.ok(data.planner.width>width*.78,width+"px planner width wrong");
   assert.equal(data.cards.length,2);
   for(let i=0;i<data.cards.length;i++){
     const c=data.cards[i],buttons=data.btns[i];
     assert.ok(c.right<=width+3,width+"px ride overflow");
     assert.equal(buttons.length,2);
     assert.ok(buttons.every(x=>x.width>=65&&x.height>=43),width+"px tiny buttons");
     assert.ok(buttons[0].right<=buttons[1].x+2,width+"px buttons overlap");
     assert.ok(buttons.every(x=>x.x>=c.x-2&&x.right<=c.right+2),width+"px buttons outside card");
   }
   assert.ok(data.ticketBg.includes("linear-gradient"),width+"px winter ticket surface missing");
   assert.ok(data.ticketInk.includes("20, 44, 65")||data.ticketInk.includes("20, 44, 65"),width+"px ride title should be dark ink on paper, not white on photo: "+data.ticketInk);
   for(let i=0;i<data.favorites.length;i++){
     assert.ok(data.favorites[i].top<data.cards[i].y+90,width+"px favorite must stay on the photo corner");
   }
   assert.ok(data.images.every(i=>i.naturalWidth>0),width+"px original photos not rendered");
   await page.screenshot({path:path.join(qaDir,"wintertraum-"+width+"px.png"),fullPage:true,animations:"disabled"});
   measurements.push({width,docWidth:data.docWidth,heroHeight:Math.round(data.hero.height),cardWidth:Math.round(data.cards[0].width),cardHeight:Math.round(data.cards[0].height),buttonWidth:Math.round(data.btns[0][0].width),columns:data.columns});
   await page.close();
  }
  console.log("PASS Browser layout: 320, 375, 430, 768, 1024, 1440px");
  console.log(JSON.stringify(measurements,null,2));
 }finally{await browser.close();try{fs.rmSync(fixture);}catch{}}
})().catch(e=>{console.error(e);process.exitCode=1;});
