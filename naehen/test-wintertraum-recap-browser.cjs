"use strict";
/* Real Wintertraum Nähbilanz integration QA.
   Run the actual app's recap and archive renderer with synthetic park sessions.
   Does not touch a live account or Supabase. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const root=__dirname;
const shots=path.join(root,"wintertraum-responsive-qa");
fs.mkdirSync(shots,{recursive:true});
const fixture=path.join(root,".wintertraum-recap-qa.html");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
fs.writeFileSync(fixture,html);
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const patched=app.replace(/\s*bootstrap\(\);\s*\}\)\(\);\s*$/,
  '\n  window.__WINTER_RECAP_QA__={renderRecap,openArchiveDay,isWintertraumDay};\n})();');
assert.notEqual(patched,app,"Could not expose real seasonal recap renderer for QA");
const data={
  day:{
    id:"qa-winter-visit",park_slug:"phantasialand",
    started_at:"2026-12-05T11:00:00+01:00",
    ended_at:"2026-12-05T20:00:00+01:00"
  },
  summer:{
    id:"qa-summer-visit",park_slug:"phantasialand",
    started_at:"2026-08-05T11:00:00+02:00",
    ended_at:"2026-08-05T19:00:00+02:00"
  },
  sessions:[
    {rideId:"taron",rideName:"Taron",status:"ridden",type:"regular",duration:1200000,posted:30,
      startedAt:Date.parse("2026-12-05T12:15:00+01:00")},
    {rideId:"fly",rideName:"F.L.Y.",status:"ridden",type:"single",duration:600000,posted:25,
      startedAt:Date.parse("2026-12-05T18:00:00+01:00")},
    {rideId:"wintershow-magic-symphony",rideName:"Magic Symphony",status:"ridden",type:"regular",duration:0,
      startedAt:Date.parse("2026-12-05T19:50:00+01:00")}
  ]
};
(async()=>{
  const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  try{
    for(const width of [320,375,430,768,1024,1440]){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
      await page.goto("file://"+fixture,{waitUntil:"domcontentloaded"});
      await page.addScriptTag({content:patched});
      await page.waitForFunction(()=>!!window.__WINTER_RECAP_QA__);
      await page.evaluate(({day,sessions})=>{
        document.querySelectorAll(".gate,.auth").forEach(x=>x.remove());
        document.getElementById("app").classList.remove("hidden");
        document.body.dataset.park="phantasialand";
        document.body.dataset.season="wintertraum";
        window.__WINTER_RECAP_QA__.renderRecap(sessions,day);
        document.getElementById("recapSheet").classList.add("show");
      },data);
      const stats=await page.evaluate(()=>{
        const sheet=document.getElementById("recapSheet");
        const card=sheet.querySelector(".sheetCard");
        const hero=sheet.querySelector(".wtRecapHero");
        const title=sheet.querySelector(".wtRecapHero h3");
        const close=sheet.querySelector(".close");
        const action=sheet.querySelector('[data-close="recapSheet"].btn');
        const rect=card.getBoundingClientRect();
        return {
          modal:sheet.dataset.wintertraum,
          count:sheet.querySelector(".wtRecapTotal strong")?.textContent,
          split:sheet.querySelector(".wtRecapTotal small")?.textContent,
          moments:[...sheet.querySelectorAll(".wtRecapMoment strong")].map(x=>x.textContent),
          height:rect.height,width:rect.width,left:rect.left,right:rect.right,
          scrollWidth:card.scrollWidth,clientWidth:card.clientWidth,
          hero:!!hero,heroImg:getComputedStyle(hero).backgroundImage,
          titleFont:getComputedStyle(title).fontFamily,
          closeSize:close.getBoundingClientRect().width,
          actionHeight:action.getBoundingClientRect().height,
          gridColumns:getComputedStyle(sheet.querySelector(".wtRecapMetrics")).gridTemplateColumns.split(" ").length,
          bg:getComputedStyle(card).backgroundImage,
          nerds:sheet.querySelectorAll(".wtRecapNerd .recapStat").length,
          all:sheet.textContent
        };
      });
      const at=width+"px";
      assert.equal(stats.modal,"true",at+" seasonal recap marker missing");
      assert.equal(stats.count,"3",at+" ride + show count wrong");
      assert.ok(stats.split.includes("2 Rides")&&stats.split.includes("1 Shows"),at+" count split wrong");
      assert.deepEqual(stats.moments,["Taron","F.L.Y.","Magic Symphony"],at+" winter moments chronology wrong");
      assert.ok(stats.heroImg.includes("wintertraum-berlin-original.jpg"),at+" official Berlin image missing");
      assert.ok(stats.titleFont.includes("Berkshire Swash"),at+" decorative title font missing");
      assert.ok(stats.nerds>=8,at+" existing nerd stats missing");
      assert.ok(stats.right<=width+2&&stats.left>=-2,at+" sheet overflows viewport");
      assert.ok(stats.scrollWidth<=stats.clientWidth+3,at+" recap card horizontally overflows");
      assert.ok(stats.closeSize>=44&&stats.actionHeight>=44,at+" tap targets too small");
      assert.ok(stats.bg.includes("linear-gradient"),at+" winter palette missing");
      assert.ok(stats.all.includes("Single Rider")&&stats.all.includes("Echte Queue"),at+" existing ride/queue stats missing");
      await page.screenshot({path:path.join(shots,"wintertraum-finished-day-"+width+"px.png"),animations:"disabled"});

      // A finished winter day remains winter-styled in the archived visit.
      await page.evaluate(({day,sessions})=>{
        document.getElementById("recapSheet").classList.remove("show");
        window.__WINTER_RECAP_QA__.openArchiveDay(day.id,{day,sessions});
      },data);
      const archived=await page.evaluate(()=>{
        const el=document.getElementById("archiveDetailSheet");
        return {
          marker:el.dataset.wintertraum,
          title:el.querySelector(".wtArchiveIntro h3")?.textContent,
          content:el.querySelector(".wtArchiveIntro")?.textContent,
          timeline:el.querySelectorAll(".archiveRideRow").length,
          horizontalOverflow:el.querySelector(".sheetCard").scrollWidth-el.querySelector(".sheetCard").clientWidth
        };
      });
      assert.equal(archived.marker,"true",at+" historical winter visit not detected");
      assert.ok(archived.title&&archived.content.includes("3 Erlebnisse"),at+" archived winter hero missing");
      assert.equal(archived.timeline,3,at+" archived timeline must preserve entries");
      assert.ok(archived.horizontalOverflow<=3,at+" archive horizontal overflow");

      // A summer visit of the same park must not inherit the winter skin.
      await page.evaluate(({summer})=>{
        window.__WINTER_RECAP_QA__.renderRecap([],summer);
        document.getElementById("recapSheet").classList.add("show");
      },data);
      assert.equal(await page.locator("#recapSheet").getAttribute("data-wintertraum"),null,
        at+" summer park day wrongly winter-styled");
      assert.equal(await page.locator("#recapSheet .wtRecapHero").count(),0,
        at+" nonwinter day got seasonal hero");
      await page.close();
    }
    console.log("PASS Wintertraum finished-day recap and archive on 320,375,430,768,1024,1440px; real app renderer, ride/show chronology, winter date and summer isolation");
  }finally{
    await browser.close();
    try{fs.rmSync(fixture);}catch(_){}
  }
})().catch(err=>{console.error(err);process.exitCode=1;});
