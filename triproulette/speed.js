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
const api={createLimiter,profileKey};root.TripSpeed=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(globalThis);