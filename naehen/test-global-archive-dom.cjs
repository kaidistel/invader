// Run: node test-global-archive-dom.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const app=fs.readFileSync(path.join(__dirname,"app.js"),"utf8");
function extract(start,end){
 const a=app.indexOf(start),b=app.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a);return app.slice(a,b);
}
function node(dataset={}){
 const active=new Set();return {dataset,innerHTML:"",attrs:{},
 classList:{toggle:(k,v)=>v?active.add(k):active.delete(k),contains:k=>active.has(k)},
 setAttribute(k,v){this.attrs[k]=v}};
}
const dom={"#allDaysSummary":node(),"#allDaysList":node()};
const filter=["all","park","fair"].map(x=>node({archiveFilter:x}));
const nav=["homeView","logView","archiveView","allDaysView","profileView"].map(x=>node({view:x}));
nav.forEach(x=>dom["#"+x.dataset.view]=node());
const one=s=>dom[s]||null;
const many=s=>s==="#allDaysView [data-archive-filter]"?filter:s==="[data-view]"?nav:[];
const entries=[
 {day:{id:"park",park_slug:"phantasialand",started_at:"2026-08-01T09:00:00Z",ended_at:"2026-08-01T18:00:00Z"},sessions:[{rideName:"Taron",status:"ridden",duration:120000}]},
 {day:{id:"fair",park_slug:"gallimarkt-leer-2026",started_at:"2026-10-15T10:00:00Z",ended_at:"2026-10-15T22:00:00Z"},sessions:[{rideName:"Playball",status:"ridden",duration:180000}]}
];
const parks={"phantasialand":{name:"Phantasialand"},"gallimarkt-leer-2026":{name:"Gallimarkt Leer"}};
const isFair=slug=>slug==="gallimarkt-leer-2026";
const facts=(day,sessions)=>({rides:1,queueMs:sessions[0].duration,
 parkMs:new Date(day.ended_at)-new Date(day.started_at),topRide:{name:sessions[0].rideName,count:1}});
const recap=(n,label)=>"<span>"+n+" "+label+"</span>";
const render=new Function("one","many","entries","parks","isFair","facts","recap",
 "const $=one,$$=many,globalArchiveEntries=entries,PARKS=parks,venueIsFair=isFair,buildDayFacts=facts,recapStat=recap,escapeHtml=String,formatDurationHuman=String,parkDayDateLabel=day=>day.started_at;let globalArchiveFilter='all';\n"+
 extract("  function renderGlobalArchive() {","  function openGlobalArchiveFromPicker(")+
 "\nreturn {renderGlobalArchive,setFilter:x=>globalArchiveFilter=x};")(one,many,entries,parks,isFair,facts,recap);
render.renderGlobalArchive();
assert.ok(dom["#allDaysList"].innerHTML.includes('data-all-days-id="park"'));
assert.ok(dom["#allDaysList"].innerHTML.includes('data-all-days-id="fair"'));
render.setFilter("fair");render.renderGlobalArchive();
assert.ok(dom["#allDaysList"].innerHTML.includes('data-all-days-id="fair"'));
assert.ok(!dom["#allDaysList"].innerHTML.includes('data-all-days-id="park"'));
assert.equal(filter[2].attrs["aria-pressed"],"true");
render.setFilter("park");render.renderGlobalArchive();
assert.ok(dom["#allDaysList"].innerHTML.includes('data-all-days-id="park"'));
assert.ok(!dom["#allDaysList"].innerHTML.includes('data-all-days-id="fair"'));
let refresh=0;
const switchView=new Function("one","many","refresh",
 "const $=one,$$=many,refreshGlobalArchive=refresh,renderParkArchive=()=>{},showParkPicker=()=>{};let activeParkSlug=null;\n"+
 extract("  function switchView(viewId) {",'  window.addEventListener("popstate"')+
 "\nreturn switchView;")(one,many,()=>refresh++);
switchView("allDaysView");
assert.equal(refresh,1);
assert.ok(nav.find(x=>x.dataset.view==="allDaysView").classList.contains("active"));
assert.ok(!nav.find(x=>x.dataset.view==="homeView").classList.contains("active"));
assert.ok(!dom["#allDaysView"].classList.contains("hidden"));
console.log("PASS: global archived days are visible; park/fair filters and navigation work");
