(function(root){
'use strict';
// One shared queue, with a rolling request budget and bounded in-flight work.
// No sleeping in a FIFO reservation: a newly discovered room can jump ahead of pending route searches.
function createLimiter({max=4,budget=40,windowMs=60000,gap=200,now=Date.now}={}){
 let active=0,starts=[],queue=[],timer=null,serial=0;
 function pump(){
  if(timer!==null){clearTimeout(timer);timer=null}
  const t=now();starts=starts.filter(v=>t-v<windowMs);
  for(let i=queue.length-1;i>=0;i--)if(queue[i].signal?.aborted){const q=queue.splice(i,1)[0];q.cleanup();q.reject(new DOMException('Abgebrochen','AbortError'))}
  if(!queue.length||active>=max)return;
  const delay=Math.max(0,starts.length>=budget?starts[0]+windowMs-t:0,starts.length?starts[starts.length-1]+gap-t:0);
  if(delay){timer=setTimeout(pump,delay);return}
  queue.sort((a,b)=>a.priority-b.priority||a.serial-b.serial);const q=queue.shift();q.cleanup();starts.push(t);active++;let released=false;
  q.resolve(()=>{if(released)return;released=true;active--;pump()});pump()
 }
 function acquire(priority=2,signal){
  if(signal?.aborted)return Promise.reject(new DOMException('Abgebrochen','AbortError'));
  return new Promise((resolve,reject)=>{const abort=()=>pump();const q={priority,serial:serial++,signal,resolve,reject,cleanup:()=>signal?.removeEventListener('abort',abort)};queue.push(q);signal?.addEventListener('abort',abort,{once:true});pump()})
 }
 return {acquire,stats:()=>({active,queued:queue.length,started:starts.filter(t=>now()-t<windowMs).length})}
}
function profileKey(p){return JSON.stringify([p.destination,p.airport.slice().sort(),p.start,p.end,+p.min,+p.max,+p.adults,!!p.school])}

function routeKey(o){return [o.origin,o.destination,o.start,o.end].join('|')}
function offerKey(o){return routeKey(o)+'|'+o.hotelId}
function eligibleSnapshots(snapshots,p,jobs,now=Date.now(),ttl=300000){
 const valid=new Set(jobs.map(j=>[j.origin,j.target[0],...j.w].join('|'))),out=new Map();
 for(const [key,s] of snapshots){let profile;try{profile=JSON.parse(key)}catch{continue}if(!Array.isArray(profile)||Number(profile[6])!==Number(p.adults)||!Array.isArray(s?.rows))continue;
 for(const o of s.rows){if(!o||!valid.has(routeKey(o))||!Number.isFinite(o.verifiedAt)||now-o.verifiedAt>=ttl||now<o.verifiedAt)continue;const k=offerKey(o),old=out.get(k);if(!old||old.verifiedAt<o.verifiedAt)out.set(k,o)}}
 return [...out.values()].sort((a,b)=>a.price-b.price)
}
function groupOffers(rows){const groups=new Map();for(const o of rows){if(!groups.has(o.destination))groups.set(o.destination,[]);groups.get(o.destination).push(o)}return [...groups].map(([code,offers])=>({code,offers,best:offers.reduce((a,b)=>a.price<=b.price?a:b)}))}

const ROUTE_TTL=300000, ROUTE_LIMIT=400;
function routeCacheKey(j,p){return JSON.stringify(['v3',j.origin,j.target[0],...j.w,Number(p.adults),p.destination==='ANY'?2:5,'de','1,2,3,5,6,7,8,9,12,13,14'])}
function usableRoute(entry,now=Date.now()){return !!entry&&Number.isFinite(entry.at)&&entry.at<=now&&now-entry.at<ROUTE_TTL&&Array.isArray(entry.rows)&&entry.rows.length<=5}
function planRoutes(jobs,p,cache,now=Date.now()){const hits=[],misses=[];for(const j of jobs){const entry=cache.get(routeCacheKey(j,p));if(!p.fresh&&usableRoute(entry,now))hits.push({j,entry});else misses.push(j)}return {hits,misses}}
function packRoutes(cache,now=Date.now()){return [...cache].filter(([,e])=>usableRoute(e,now)).sort((a,b)=>b[1].at-a[1].at).slice(0,ROUTE_LIMIT)}
const api={createLimiter,profileKey,eligibleSnapshots,groupOffers,routeKey,offerKey,routeCacheKey,usableRoute,planRoutes,packRoutes};root.TripSpeed=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(globalThis);