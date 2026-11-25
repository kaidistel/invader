(function(root){
'use strict';
const cheap=new Set('BUD TIA SOF KRK WAW RIX VNO BEG SKP AGP OPO RAK AGA IST AYT MLA ROM MIL BCN NAP CTA LIS PMI MAD ALC TUN'.split(' '));
const medium=new Set('ATH SVQ CAI HRG SSH DJE TBS EVN PRG VIE PAR LON DUB LCA TFS LPA FNC CPH RBA FEZ CMN'.split(' '));
const far=new Set('NYC BOS YTO BKK DEL CPT NBO DSS DXB AUH MCT DOH JED AMM BAK'.split(' '));
const airports=['DUS','CGN','AMS','EIN','BER','FRA','BRU','HAM','HAJ','DTM','BRE','FMO'];
const ttl=14*86400000, key=(j,p)=>[j.origin,j.target[0],p.adults].join('|');
function priority(j,p,history,now=Date.now()){
 const c=j.target[0],n=(Date.parse(j.w[1])-Date.parse(j.w[0]))/86400000,base=cheap.has(c)?0:medium.has(c)?16:far.has(c)?(p.budget/p.adults<550?65:23):30;
 let s=base+Math.max(0,airports.indexOf(j.origin))*1.5+n*3;const world=root.TripWorldData;if(p.focus&&p.focus!=='all'&&world)s-=world.score(c,p.focus)*.12;const alt=new Set(['CGN','EIN','DTM','BER','HAM']);if(cheap.has(c)&&alt.has(j.origin))s-=4;
 const h=history[key(j,p)];if(h&&now-h.at<ttl&&Number.isFinite(h.price)&&h.price>0){const ratio=h.price/p.budget;s+=Math.max(-30,Math.min(45,(ratio-1)*32));if(h.w===j.w.join('/'))s-=10}
 return s
}
function jobs(p,windows,places,history={},now=Date.now()){
 const dest=p.destination==='ANY'?places:places.filter(x=>x[0]===p.destination),groups=[];
 for(const target of dest){const g=[];for(const origin of p.airport)for(const w of windows)if(origin!==target[0])g.push({origin,target,w});g.sort((a,b)=>priority(a,p,history,now)-priority(b,p,history,now));if(g.length)groups.push(g)}
 // Interleave destinations and avoid exhausting one city before seeing others.
 const all=[],first=groups.map(g=>g[0]).sort((a,b)=>priority(a,p,history,now)-priority(b,p,history,now));const early=first.slice(0,8);all.push(...early);const earlySet=new Set(early.map(j=>j.target[0]));const alternatives=groups.filter(g=>earlySet.has(g[0].target[0])).map(g=>g.slice(1).find(x=>x.origin!==g[0].origin)||g[1]).filter(Boolean).sort((a,b)=>priority(a,p,history,now)-priority(b,p,history,now));all.push(...alternatives.slice(0,4),...first.slice(8));const seen=new Set(all);for(let depth=1;groups.some(g=>g.length>depth);depth++){const round=groups.map(g=>g[depth]).filter(j=>j&&!seen.has(j)).sort((a,b)=>priority(a,p,history,now)-priority(b,p,history,now));all.push(...round)}return all
}
function record(history,j,p,price,now=Date.now()){
 if(!Number.isFinite(price)||price<=0)return;const k=key(j,p),old=history[k];history[k]={price:old&&now-old.at<ttl&&old.w===j.w.join('/')?Math.min(old.price,price):price,w:j.w.join('/'),at:now};
 for(const k of Object.keys(history))if(now-history[k].at>ttl)delete history[k];
 const keys=Object.keys(history).sort((a,b)=>history[b].at-history[a].at);for(const k of keys.slice(300))delete history[k]
}
const S={jobs,record,priority,key};root.TripSmart=S;if(typeof module==='object'&&module.exports)module.exports=S;
})(globalThis);