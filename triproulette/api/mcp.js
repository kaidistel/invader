// Read-only server-side MCP transport; no booking methods or arbitrary upstream URLs.
const ENDPOINT='https://mcp.lastminute.com/mcp';
const ORIGIN='https://kaidistel.github.io';
const limits=new Map();
function rate(key){const now=Date.now(),slot=limits.get(key)||{n:0,t:now};if(now-slot.t>60000){slot.n=0;slot.t=now}slot.n++;limits.set(key,slot);if(limits.size>2000)limits.clear();return slot.n<=45}
export default async function handler(req,res){
 const origin=req.headers.origin;
 if(origin===ORIGIN){res.setHeader('Access-Control-Allow-Origin',ORIGIN);res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, MCP-Protocol-Version, Mcp-Session-Id');res.setHeader('Access-Control-Expose-Headers','Mcp-Session-Id');res.setHeader('Vary','Origin')}
 res.setHeader('Cache-Control','no-store');
 if(origin&&origin!==ORIGIN&&origin!=='https://triproulette-two.vercel.app')return res.status(403).json({error:'Origin not permitted'});
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return res.status(405).end();
 const key=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 if(!rate(key))return res.status(429).json({error:'Too many requests'});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body}catch{return res.status(400).end()}
 if(!b||typeof b!=='object'||Array.isArray(b)||JSON.stringify(b).length>12000||b.jsonrpc!=='2.0')return res.status(400).end();
 if(!['initialize','notifications/initialized','tools/list','tools/call'].includes(b.method))return res.status(403).end();
 if(b.method==='tools/call'){
  const a=b.params?.arguments||{}, iso=/^\d{4}-\d{2}-\d{2}$/;
  const tool=b.params?.name;
  if(tool==='select_hotel_options'){
   if(!/^\d{1,20}$/.test(String(a.search_id))||!/^\d{1,20}$/.test(String(a.hotel_internal_id))||!iso.test(a.date_from)||!iso.test(a.date_to)||!(Date.parse(a.date_to)>Date.parse(a.date_from))||Object.keys(a).some(k=>!['search_id','hotel_internal_id','date_from','date_to'].includes(k)))return res.status(400).json({error:'Invalid room inquiry'});
  }else if(tool==='generate_booking_link'){
   if(!/^[a-zA-Z0-9_:.=-]{1,500}$/.test(String(a.pricing_id))||!/^[-a-zA-Z0-9_:.=+\/]{1,1000}$/.test(String(a.rate_id))||Object.keys(a).some(k=>!['pricing_id','rate_id'].includes(k)))return res.status(400).json({error:'Invalid link inquiry'});
  }else{
  if(b.params?.name!=='search_flight_and_hotel_package'||!(/^[A-Z]{3}$/.test(a.origin)&&/^[A-Z]{3}$/.test(a.destination))||!iso.test(a.date_from)||!iso.test(a.date_to)||!(Date.parse(a.date_to)>Date.parse(a.date_from))||Date.parse(a.date_to)-Date.parse(a.date_from)>30*86400000||![1,2].includes(Number(a.adults)))return res.status(400).json({error:'Invalid package search'});
  const allowed=['origin','destination','date_from','date_to','adults','ch_ages','lang','sort','max_results','accommodation_type'];if(Object.keys(a).some(k=>!allowed.includes(k)))return res.status(400).end();
  if(a.max_results!==undefined&&(!Number.isFinite(Number(a.max_results))||Number(a.max_results)>10))return res.status(400).end();
  }
 }
 try{
  const headers={'Content-Type':'application/json','Accept':'application/json, text/event-stream'};
  for(const k of ['mcp-session-id','mcp-protocol-version'])if(typeof req.headers[k]==='string'&&req.headers[k].length<512)headers[k]=req.headers[k];
  const upstream=await fetch(ENDPOINT,{method:'POST',headers,body:JSON.stringify(b),signal:AbortSignal.timeout(24000)});
  const sid=upstream.headers.get('mcp-session-id');if(sid)res.setHeader('Mcp-Session-Id',sid);
  if(!upstream.ok){await upstream.body?.cancel();return res.status(upstream.status).json({error:'Provider HTTP '+upstream.status})}
  if(upstream.status===202||b.method==='notifications/initialized'){await upstream.body?.cancel();return res.status(202).end()}
  let value;
  if((upstream.headers.get('content-type')||'').includes('text/event-stream')){
    const reader=upstream.body.getReader(),decoder=new TextDecoder();let buf='';
    try{while(!value){const r=await reader.read();if(r.done)break;buf+=decoder.decode(r.value,{stream:true});if(buf.length>4000000)throw Error('Response too large');const lines=buf.split(/\r?\n/);buf=lines.pop();for(const line of lines){if(line.startsWith('data:')){try{const m=JSON.parse(line.slice(5));if(m.id===b.id){value=m;break}}catch{}}}}}finally{await reader.cancel().catch(()=>{})}
  }else value=await upstream.json();
  if(!value)return res.status(502).json({error:'No provider response'});
  return res.status(200).json(value)
 }catch(e){return res.status(502).json({error:'Provider unavailable: '+e.message})}
}