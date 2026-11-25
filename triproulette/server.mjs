import http from 'node:http';
import {readFile} from 'node:fs/promises';
const root=new URL('./',import.meta.url), endpoint='https://mcp.lastminute.com/mcp';
const server=http.createServer(async(req,res)=>{
try{
 const path=new URL(req.url,'http://127.0.0.1').pathname;
 if(req.method==='GET'&&['/','/index.html','/live.js','/quality.js','/themes.js'].includes(path)){
  const file=path==='/'?'index.html':path.slice(1);
  const body=await readFile(new URL(file,root));
  res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(body)
 }
 if(req.method!=='POST'||path!=='/mcp'){res.writeHead(404);return res.end('Not found')}
 if(req.headers.origin&&!['http://127.0.0.1:8765','http://localhost:8765'].includes(req.headers.origin)){res.writeHead(403);return res.end('Origin not allowed')}
 let body='';for await(const c of req){body+=c;if(body.length>20000){res.writeHead(413);return res.end()}}
 const msg=JSON.parse(body);
 if(!['initialize','notifications/initialized','tools/list','tools/call'].includes(msg.method)||msg.method==='tools/call'&&msg.params?.name!=='search_flight_and_hotel_package'){res.writeHead(403);return res.end('Read-only package search only')}
 const headers={'Content-Type':'application/json','Accept':'application/json, text/event-stream'};
 for(const key of ['mcp-session-id','mcp-protocol-version'])if(req.headers[key])headers[key]=req.headers[key];
 const abort=new AbortController();res.on('close',()=>abort.abort());
 const upstream=await fetch(endpoint,{method:'POST',headers,body,signal:AbortSignal.any([abort.signal,AbortSignal.timeout(42000)])});
 const out={'Content-Type':upstream.headers.get('content-type')||'application/json','Cache-Control':'no-store'};
 if(upstream.headers.get('mcp-session-id'))out['Mcp-Session-Id']=upstream.headers.get('mcp-session-id');
 res.writeHead(upstream.status,out);
 if(upstream.body){for await(const chunk of upstream.body){if(res.destroyed)break;res.write(chunk)}}
 res.end();
}catch(e){if(!res.headersSent)res.writeHead(502,{'Content-Type':'text/plain; charset=utf-8'});res.end(String(e.message))}
});
server.listen(8765,'127.0.0.1',()=>console.log('TripRoulette lokal: http://127.0.0.1:8765/'));
