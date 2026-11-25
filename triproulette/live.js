(()=>{
'use strict';
const $=id=>document.getElementById(id),form=$('profile'),day=86400000,Q=globalThis.TripQuality,S=globalThis.TripSmart;
const origins=['DUS','AMS','FMO','CGN','DTM','HAJ','BRE','HAM','EIN','FRA','BRU','BER'];
const places=[
['RAK','Marrakesch','Marokko'],['IST','Istanbul','Türkei'],['MLA','Malta','Malta'],['AGP','Málaga','Spanien'],['TUN','Tunis','Tunesien'],['CAI','Kairo','Ägypten'],['BUD','Budapest','Ungarn'],['TIA','Tirana','Albanien'],['SOF','Sofia','Bulgarien'],['OPO','Porto','Portugal'],['HRG','Hurghada','Ägypten'],['FNC','Madeira','Portugal'],['AGA','Agadir','Marokko'],['ATH','Athen','Griechenland'],['AYT','Antalya','Türkei'],['ROM','Rom','Italien'],['BCN','Barcelona','Spanien'],['DJE','Djerba','Tunesien'],['AMM','Amman','Jordanien'],['TBS','Tiflis','Georgien'],['LIS','Lissabon','Portugal'],['BEG','Belgrad','Serbien'],['KRK','Krakau','Polen'],['LON','London','Großbritannien'],['DUB','Dublin','Irland'],['RIX','Riga','Lettland'],['VNO','Vilnius','Litauen'],['WAW','Warschau','Polen'],['PRG','Prag','Tschechien'],['VIE','Wien','Österreich'],['PAR','Paris','Frankreich'],['MIL','Mailand','Italien'],['NAP','Neapel','Italien'],['CTA','Catania','Italien'],['PMI','Mallorca','Spanien'],['SVQ','Sevilla','Spanien'],['MAD','Madrid','Spanien'],['ALC','Alicante','Spanien'],['TFS','Teneriffa','Spanien'],['LPA','Gran Canaria','Spanien'],['LCA','Larnaka','Zypern'],['SSH','Sharm el-Sheikh','Ägypten'],['SKP','Skopje','Nordmazedonien'],['EVN','Jerewan','Armenien'],['KEF','Reykjavík','Island'],['OSL','Oslo','Norwegen'],['CPH','Kopenhagen','Dänemark'],['STO','Stockholm','Schweden'],['HEL','Helsinki','Finnland'],['TLL','Tallinn','Estland'],['RBA','Rabat','Marokko'],['FEZ','Fès','Marokko'],['CMN','Casablanca','Marokko'],['DXB','Dubai','VAE'],['AUH','Abu Dhabi','VAE'],['MCT','Maskat','Oman'],['DOH','Doha','Katar'],['JED','Dschidda','Saudi-Arabien'],['BAK','Baku','Aserbaidschan'],['NYC','New York','USA'],['BOS','Boston','USA'],['YTO','Toronto','Kanada'],['BKK','Bangkok','Thailand'],['DEL','Delhi','Indien'],['CPT','Kapstadt','Südafrika'],['NBO','Nairobi','Kenia'],['DSS','Dakar','Senegal']];
for(const code of origins){const l=document.createElement('label'),i=document.createElement('input');i.type='checkbox';i.name='airport';i.value=code;i.checked=origins.indexOf(code)<8;l.append(i,code);$('airports').append(l)}
for(const [code,city,country] of places){$('liveDest').add(new Option(city+' · '+country,code))}
const local=['localhost','127.0.0.1'].includes(location.hostname);
const endpoint=local?'/mcp':location.hostname==='triproulette-two.vercel.app'?'/api/mcp':'https://triproulette-two.vercel.app/api/mcp';
let session='',protocol='2025-03-26',seq=0,stop=false,running=false,controller,results=[],errors=[],profile=null,checked=0,success=0,empty=0;
let nextRequest=0,detailController,runId=0,detailActive=0,detailQueue=[],detailPaused=false,pageSize=18,redrawTimer=0;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let routeHistory={};try{routeHistory=JSON.parse(localStorage.getItem('naehen-route-hints-v1')||'{}')||{};if(Array.isArray(routeHistory)||typeof routeHistory!=='object')routeHistory={}}catch{}
let jobQueue=[],jobTotal=0,toolConfig=null,cooldown=0,rateTimer=0;const remember=(j,p,price)=>{S.record(routeHistory,j,p,price);try{localStorage.setItem('naehen-route-hints-v1',JSON.stringify(routeHistory))}catch{}};
async function pace(signal){const now=Date.now(),slot=Math.max(now,nextRequest);nextRequest=slot+1500;if(slot>now)await wait(slot-now);if(signal?.aborted)throw new DOMException('Abgebrochen','AbortError')}
const status=s=>$('liveStatus').textContent=s;
const safeUrl=s=>{try{const u=new URL(s);return u.protocol==='https:'?u.href:null}catch{return null}};
const dateString=t=>new Date(t).toISOString().slice(0,10);
const now=new Date(),today=dateString(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()));
for(const el of [form.elements.start,form.elements.end])el.min=today;
if(form.elements.start.value<today){form.elements.start.value=today;form.elements.end.value=dateString(Date.parse(today)+4*day)}
function data(){const d=new FormData(form);return {...Object.fromEntries(d),airport:d.getAll('airport'),adults:Number(d.get('adults'))}}
function schoolConflict(a,b){for(let t=Date.parse(a);t<=Date.parse(b);t+=day){let d=new Date(t).getUTCDay();if(d===4||d===1&&((t-Date.parse('2026-12-07'))/day)%14===0)return true}return false}
function dates(p){const out=[];for(let t=Date.parse(p.start);t<=Date.parse(p.end);t+=day)for(let n=+p.min;n<=+p.max;n++){let e=t+n*day;if(e>Date.parse(p.end))continue;let a=dateString(t),b=dateString(e);if(a>=today&&(!p.school||!schoolConflict(a,b)))out.push([a,b])}return out}
async function rpc(method,params,notify=false,requestSignal){await pace(requestSignal);const id=++seq;const headers={'Content-Type':'application/json','Accept':'application/json, text/event-stream'};if(method!=='initialize')headers['MCP-Protocol-Version']=protocol;if(session)headers['Mcp-Session-Id']=session;const timeout=AbortSignal.timeout(45000);const signal=requestSignal?AbortSignal.any([requestSignal,timeout]):timeout;const response=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',...(notify?{}:{id}),method,params}),signal});if(!response.ok){let detail='';try{detail=(await response.json()).error||''}catch{}throw Error('HTTP '+response.status+(detail?' · '+detail:''))}if(!requestSignal?.aborted)session=response.headers.get('Mcp-Session-Id')||session;if(notify){await response.body?.cancel();return null}let msg;if((response.headers.get('content-type')||'').includes('text/event-stream')){const reader=response.body.getReader(),decoder=new TextDecoder();let buf='';try{while(!msg){const {done,value}=await reader.read();if(done)break;buf+=decoder.decode(value,{stream:true});const lines=buf.split(/\r?\n/);buf=lines.pop();for(const line of lines){if(!line.startsWith('data:'))continue;try{const m=JSON.parse(line.slice(5));if(m.id===id){msg=m;break}}catch{}}}}finally{await reader.cancel().catch(()=>{})}}else msg=await response.json();if(!msg)throw Error('Keine auswertbare Antwort');if(msg.error)throw Error(msg.error.message);return msg.result}
function parse(r){if(r.isError)throw Error(r.content?.[0]?.text||'Anbieterfehler');if(r.structuredContent)return r.structuredContent;for(const c of r.content||[]){if(c.type==='text'){try{return JSON.parse(c.text)}catch{}}}throw Error('Unbekanntes Antwortformat')}
function extract(v,out=[],context={}){if(!v||typeof v!=='object')return out;const c={...context,search_id:v.search_id||context.search_id,currency:v.currency||v.price_range?.currency||context.currency};if((v.hotel?.name||v.name&&v.internal_id_hotel)&&v.price_total!==undefined){out.push({...v,hotel:v.hotel||{name:v.name,stars:v.stars,rating:Number(v.rating)>10?Number(v.rating)/10:v.rating,main_image:v.image},_context:c});return out}for(const x of Object.values(v))extract(x,out,c);return out}
function node(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e}
const fmt=new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'});

const meals={ROOM_ONLY:'Ohne Verpflegung',BED_BREAKFAST:'Frühstück',HALF_BOARD:'Halbpension',FULL_BOARD:'Vollpension',ALL_INCLUSIVE:'All Inclusive'};
const dialog=node('dialog');dialog.style.cssText='width:min(680px,94vw);max-height:85vh;overflow:auto;border:1px solid #273044;border-radius:22px;padding:22px;box-shadow:0 12px 50px #000a;color:#f7f9fc;background:#121722';document.body.append(dialog);
const closeDialog=()=>{dialog.close()};
function baseDialog(title){dialog.replaceChildren();const row=node('div');row.style.cssText='display:flex;gap:12px;align-items:center;justify-content:space-between';const h=node('h2',title),b=node('button','Schließen','secondary');b.type='button';b.onclick=closeDialog;row.append(h,b);dialog.append(row);if(!dialog.open)dialog.showModal()}
function findLink(v){if(!v||typeof v!=='object')return null;for(const [k,val] of Object.entries(v)){if(typeof val==='string'&&/(booking|deeplink|url|link)/i.test(k)){const u=safeUrl(val);if(u)return u}if(typeof val==='object'){const u=findLink(val);if(u)return u}}return null}
async function showRooms(o){
 baseDialog(o.title);const notice=node('p','Lade konkrete Zimmerpreise und Reisezeiten …');dialog.append(notice);
 try{
  const v=await roomData(o,true);
  if(!v.success)throw Error(v.message||v.error||'Keine Zimmerdaten verfügbar');
  notice.textContent=v.hotel?.address||'';
  for(const [key,title] of [['outbound','Hinreise'],['inbound','Rückreise']]){const f=v.flight_details?.[key];if(!f)continue;dialog.append(node('h3',title),node('p',f.from+' → '+f.to+' · '+(f.carrier_code||'')+' '+(f.flight_number||'')+' · '+(f.direct?'Direkt':'Mit Umstieg')),node('p','Abfahrt/Abflug: '+(f.departure_time||'–')+' · Ankunft: '+(f.arrival_time||'–')));if(/^Q/.test(f.from)||/^Q/.test(f.to))dialog.append(node('p','Achtung: Bahnhof-/Rail-&-Fly-Code möglich. Tatsächlichen Flughafen und Zugabschnitt prüfen.'))}
  dialog.append(node('h3','Zimmer und Gesamtpreise'));
  const rooms=Q.privateRooms(v);
  if(!rooms.length)dialog.append(node('p','Kein eindeutig privates Zimmer verfügbar.'));
  for(const r of rooms){
   const section=node('div');section.style.cssText='border:1px solid #273044;border-radius:12px;padding:12px;margin:10px 0;background:#171e2b';
   section.append(node('strong',(r.room_name||'Zimmer')+' · '+fmt.format(Number(r.price))),node('p',(meals[r.meal_plan]||r.meal_plan||'Verpflegung unbekannt')+' · '+(r.cancellation||'Stornierung prüfen')),node('p','Private Zimmerkategorie · endgültigen Endpreis auf Buchungsseite prüfen.'));
   if(v.pricing_id&&r.rate_id!==undefined){const b=node('button','Buchungslink erstellen');b.type='button';b.onclick=async()=>{b.disabled=true;b.textContent='Link wird geladen …';try{const v2=parse(await rpc('tools/call',{name:'generate_booking_link',arguments:{pricing_id:String(v.pricing_id),rate_id:String(r.rate_id)}}));const u=findLink(v2);if(!u)throw Error(v2.message||'Kein Buchungslink erhalten');const a=node('a','Angebot bei lastminute.com öffnen');a.href=u;a.target='_blank';a.rel='noopener noreferrer';b.replaceWith(a)}catch(e){b.disabled=false;b.textContent='Erneut versuchen';section.append(node('p',e.message))}};section.append(b)}
   dialog.append(section)
  }
 }catch(e){notice.textContent='Zimmerabfrage fehlgeschlagen: '+e.message}
}


function roomData(o,retry=false){
 if(o.detail)return Promise.resolve(o.detail);
 if(o.detailPromise)return o.detailPromise;
 if(o.detailError&&!retry)return Promise.reject(Error(o.detailError));
 o.detailError='';const token=runId,signal=detailController?.signal;
 o.detailPromise=(async()=>{try{
 const v=parse(await rpc('tools/call',{name:'select_hotel_options',arguments:{search_id:Number(o.searchId),hotel_internal_id:Number(o.hotelId),date_from:o.start,date_to:o.end}},false,signal));
 if(!v.success)throw Error(v.message||v.error||'Keine Flugdetails verfügbar');
 if(token===runId){o.detail=v;o.detailError='';const rooms=Q.privateRooms(v);o.privateRoom=rooms[0]||null;if(o.privateRoom){o.price=Number(o.privateRoom.price);remember({origin:o.origin,target:[o.destination],w:[o.start,o.end]},profile,o.price)}scheduleDraw()}return v
 }catch(e){if(token===runId){o.detailError=e.message;if(/HTTP 429/.test(e.message)){detailPaused=true;cooldown=Date.now()+65000;updateMore()}scheduleDraw()}throw e}finally{o.detailPromise=null}})();return o.detailPromise
}
function scheduleDraw(){if(redrawTimer)return;redrawTimer=setTimeout(()=>{redrawTimer=0;draw()},120)}
function queueDetails(rows){if(detailPaused)return;detailQueue=rows.filter(o=>o.searchId&&o.hotelId&&!o.detail&&!o.detailPromise&&!o.detailError).sort((a,b)=>a.price-b.price);while(detailActive<3&&detailQueue.length){const o=detailQueue.shift();if(o.detail||o.detailPromise||o.detailError)continue;const token=runId;detailActive++;roomData(o).catch(()=>{}).finally(()=>{detailActive--;if(token===runId)scheduleDraw();else if(detailQueue.length)scheduleDraw()})}}
const clock=t=>typeof t==='string'?t.match(/T(\d{2}:\d{2})/)?.[1]||'–':'–';
const shortDate=t=>typeof t==='string'&&/^\d{4}-\d{2}-\d{2}/.test(t)?t.slice(8,10)+'.'+t.slice(5,7)+'.':'';
function flightRow(f,label){const r=node('div',undefined,'flight-row'),left=node('div',undefined,'flight-label');left.append(node('span',label,'eyebrow'),node('strong',[f.carrier_code,f.flight_number].filter(Boolean).join(' ')||'Verbindung'));const dep=node('div',undefined,'flight-time'),arr=node('div',undefined,'flight-time');dep.append(node('strong',clock(f.departure_time)),node('span',(f.from||'–')+' · '+shortDate(f.departure_time)));arr.append(node('strong',clock(f.arrival_time)),node('span',(f.to||'–')+' · '+shortDate(f.arrival_time)));const route=node('div',undefined,'flight-route');let mins=Number(f.duration_minutes);route.append(node('span',Number.isFinite(mins)&&mins>0?Math.floor(mins/60)+'h '+mins%60+'m':'Dauer unbekannt'),node('div','→','flight-line'),node('span',f.direct===true?'Direkt':f.direct===false?'Mit Umstieg':'Umstieg unbekannt'));r.append(left,dep,route,arr);return r}
function durationLabel(m){return m===null||m===undefined?'Dauer nicht angegeben':Math.floor(m/60)+' h '+m%60+' min'}
function extraPanel(f){const q=Q.extras(f),box=node('div',undefined,'flight-extras');if(q.segments.length){for(const s of q.segments){const line=node('div',undefined,'segment');line.append(node('strong',(s.from||'–')+' → '+(s.to||'–')),node('span',[clock(s.departure)+' – '+clock(s.arrival),s.number,s.aircraft||'Flugzeugtyp nicht gemeldet'].filter(Boolean).join(' · ')));box.append(line)}}else box.append(node('div','Flugzeug: '+(q.aircraft||'Typ nicht gemeldet'),'equipment'));
if(q.layovers.length){for(const l of q.layovers)box.append(node('div','Umstieg '+(l.airport||'Ort nicht gemeldet')+' · '+durationLabel(l.minutes),'layover'))}else if(f.direct===false)box.append(node('div','Umsteigeort und Aufenthaltsdauer nicht gemeldet','layover'));return box}

function flightPanel(o){const panel=node('div',undefined,'flight-panel');const f=o.detail?.flight_details;if(f?.outbound||f?.inbound){if(f.outbound)panel.append(flightRow(f.outbound,'HIN'),extraPanel(f.outbound));if(f.inbound)panel.append(flightRow(f.inbound,'ZURÜCK'),extraPanel(f.inbound));if([f.outbound,f.inbound].some(x=>x&&(/^Q/.test(x.from)||/^Q/.test(x.to))))panel.append(node('small','Bahnhof-/Rail-&-Fly-Code: Zugabschnitt und Flughafen prüfen.','rail-note'));return panel}
 panel.append(node('div',undefined,'flight-pending'));const p=panel.firstChild;p.append(node('strong',o.origin+' → '+o.destination+' → '+o.origin),node('span',o.detailError?'Flugdetails konnten nicht geladen werden.':detailPaused?'Anfragelimit erreicht. Details manuell abrufen.':o.detail?'Keine konkreten Flugzeiten geliefert.':o.searchId&&o.hotelId?'Flugzeiten werden automatisch geladen …':'Keine Flugdetails vom Anbieter verfügbar.'));if(o.detailError){const b=node('button','Erneut laden','secondary');b.type='button';b.onclick=()=>roomData(o,true).catch(()=>{});p.append(b)}return panel}

function destinationHero(o){
 const T=globalThis.TripThemes,t=T?.catalog[o.destination],hero=node('div',undefined,'destination-hero'),photo=safeUrl(o.photo);
 if(t)hero.style.setProperty('--destination-accent',t.accent);
 const picture=node('div',undefined,'destination-picture');if(photo)picture.style.backgroundImage='url('+JSON.stringify(photo)+')';hero.append(picture);
 const flag=T?.flag(o.destination);if(flag){const flagImg=node('img',undefined,'destination-flag');flagImg.src=flag;flagImg.alt='';flagImg.loading='lazy';hero.append(flagImg)}
 const text=node('div',undefined,'destination-copy');text.append(node('span',t?.theme||'REISEWELT','destination-eyebrow'),node('strong',o.city),node('span',o.country,'destination-country'));hero.append(text);
 const caption=node('div',undefined,'destination-caption');caption.append(node('span',photo?'Hotelbild · '+o.title:'Reiseziel · '+o.city));hero.append(caption);
 if(t)T.lookup(o.destination).then(info=>{if(!info||!hero.isConnected)return;picture.style.backgroundImage='url('+JSON.stringify(info.photo)+')';caption.replaceChildren(node('span',t.landmark+' · '));const a=node('a',info.author+' / '+info.license);a.href=info.source;a.target='_blank';a.rel='noopener noreferrer';a.title='Bildquelle und Lizenz';caption.append(a)});
 return hero;
}

function draw(){const root=$('liveResults');root.replaceChildren();const budget=+(profile||data()).budget;const verified=results.filter(x=>x.privateRoom);const matching=verified.filter(x=>!$('budgetOnly').checked||x.price<=budget);const pending=results.filter(x=>x.searchId&&x.hotelId&&!x.detail&&!x.detailError);const rejected=results.filter(x=>x.detail&&!x.privateRoom).length;matching.sort($('sort').value==='rating'?(a,b)=>(+b.rating||0)-(+a.rating||0)||a.price-b.price:(a,b)=>a.price-b.price);$('coverage').textContent=checked+' / '+jobTotal+' Kombinationen geprüft · '+verified.length+' Angebote mit privater Zimmerkategorie · '+pending.length+' in Zimmerprüfung · '+rejected+' ohne passenden Zimmertyp';$('errors').textContent=errors.join('\n');const candidates=pending.filter(o=>!$('budgetOnly').checked||o.price<=budget);if(matching.length<pageSize)queueDetails(candidates);updateMore();if(!matching.length){const msg=candidates.length&&!detailPaused?'Zimmer werden geprüft. Erst eindeutig private Zimmer erscheinen in der Liste.':running?'Suche läuft – nur Angebote mit privater Zimmerkategorie werden angezeigt.':verified.length?'Keine geprüften Privatzimmer im Budget. Budgetfilter deaktivieren, um weitere Preise zu sehen.':detailPaused?'Anfragelimit erreicht. Keine ungeprüften Zimmer werden angezeigt.':results.length?'Keine passenden privaten Zimmer bestätigt. Budgetfilter deaktivieren, um weitere Kandidaten prüfen zu lassen.':'Noch keine passenden Ergebnisse.';root.append(node('div',msg,'empty'));return}
const visible=matching.slice(0,pageSize);for(const o of visible){const a=node('article',undefined,'deal-card themed-card');const theme=globalThis.TripThemes?.catalog[o.destination];if(theme){a.style.setProperty('--destination-accent',theme.accent);a.style.setProperty('--flag-image','url('+JSON.stringify(globalThis.TripThemes.flag(o.destination))+')')}a.append(destinationHero(o));const d=node('div',undefined,'deal-body');d.append(node('span',o.city+' · '+o.country,'destination-tag'),node('h3',o.title),node('p',(o.stars?'★ '+o.stars+' · ':'')+(o.rating?'Bewertung '+o.rating+'/10 · ':'')+o.nights+' Nächte · '+profile.adults+' Erw.'),node('div','✓ '+o.privateRoom.room_name+' · '+(meals[o.privateRoom.meal_plan]||o.privateRoom.meal_plan||'Verpflegung nicht angegeben'),'room-pill'),flightPanel(o));const pr=node('div',undefined,'price');pr.append(node('div',fmt.format(o.price)),node('small','Zimmerpreis inkl. Reise für '+profile.adults+' · Buchungspreis prüfen'));if(o.searchId&&o.hotelId){const b=node('button','Zimmer & Preis prüfen');b.type='button';b.style.cssText='font-size:13px;margin-top:8px';b.onclick=()=>showRooms(o);pr.append(b)}else if(o.url){const link=node('a','Beim Anbieter ansehen');link.href=o.url;link.target='_blank';link.rel='noopener noreferrer';pr.append(link)}else{const link=node('a','Anbieter öffnen');link.href='https://www.lastminute.de/';link.target='_blank';link.rel='noopener noreferrer';pr.append(link);pr.append(node('small','Kein direkter Angebotslink'))}a.append(d,pr);root.append(a)}if(matching.length>visible.length||candidates.length&&matching.length>=pageSize){const more=node('button','Weitere Angebote prüfen und anzeigen','secondary');more.type='button';more.onclick=()=>{pageSize+=12;draw()};root.append(more)}if(matching.length<pageSize)queueDetails(candidates)}
$('budgetOnly').onchange=draw;$('sort').onchange=draw;
$('liveStop').onclick=()=>{stop=true;controller?.abort();status('Suche wird gestoppt …')};
function updateMore(){const b=$('searchMore');if(!b)return;const left=jobQueue.length,remaining=Math.max(0,cooldown-Date.now());b.hidden=!profile||!left&&!detailPaused;b.disabled=running||remaining>0;b.textContent=remaining>0?'Anfragelimit · weitere Suche in '+Math.ceil(remaining/1000)+' s':left?'Weitere Ziele durchsuchen ('+left+' offen)':'Zimmerprüfung fortsetzen';if(remaining>0&&!rateTimer)rateTimer=setTimeout(()=>{rateTimer=0;updateMore()},1000)}
$('searchMore').onclick=()=>{if(running||Date.now()<cooldown)return;if(detailPaused){detailPaused=false;for(const o of results)if(/HTTP 429/.test(o.detailError||''))o.detailError='';scheduleDraw()}if(jobQueue.length)runBatch();else updateMore()};
async function connect(){if(toolConfig)return toolConfig;const init=await rpc('initialize',{protocolVersion:protocol,capabilities:{},clientInfo:{name:'TripRoulette',version:'1.0'}},false,controller.signal);protocol=init.protocolVersion||protocol;await rpc('notifications/initialized',{},true,controller.signal);const list=await rpc('tools/list',{},false,controller.signal);const tool=list.tools.find(t=>t.name==='search_flight_and_hotel_package');if(!tool)throw Error('Paketsuche nicht verfügbar');toolConfig=tool;return tool}
async function runBatch(){
 if(running||!jobQueue.length)return;running=true;stop=false;controller=new AbortController();const p=profile;let fatal='',consecutive=0,issued=0;
 // First wave is deliberately small, further waves preserve existing offers and session.
 const limit=Math.min(jobQueue.length,p.destination==='ANY'?(checked===0?18:24):24);
 $('liveStart').disabled=true;$('liveStop').disabled=false;updateMore();draw();
 try{
 status('Verbindung zur Live-Suche …');const tool=await connect(),props=tool.inputSchema?.properties||{};
 const dedup=new Set(results.map(o=>[o.origin,o.destination,o.start,o.end,o.hotelId].join('|')));
 async function worker(){while(!stop&&!fatal&&issued<limit&&jobQueue.length){
 const j=jobQueue.shift();issued++;status('SmartSearch · '+checked+' / '+jobTotal+' geprüft · '+j.origin+' → '+j.target[1]);
 try{
 const args={origin:j.origin,destination:j.target[0],date_from:j.w[0],date_to:j.w[1],adults:props.adults?.type==='integer'||props.adults?.type==='number'?p.adults:String(p.adults),ch_ages:'',lang:'de',sort:'price',max_results:p.destination==='ANY'?2:5,accommodation_type:'1,2,3,5,6,7,8,9,12,13,14'};
 for(const k of Object.keys(args))if(!Object.hasOwn(props,k))delete args[k];
 const v=parse(await rpc('tools/call',{name:tool.name,arguments:args},false,controller.signal));if(v.success===false)throw Error(v.message||v.error||'Anbieterfehler');const rows=extract(v);success++;consecutive=0;if(!rows.length)empty++;
 let low=Infinity;
 for(const x of rows){const price=Number(x.price_total),currency=String(x.currency||x._context.currency||'').toUpperCase();if(!Number.isFinite(price)||price<=0||!['EUR','€'].includes(currency))continue;low=Math.min(low,price);const hotelId=x.internal_id_hotel||x.hotel.internal_id_hotel;const key=[j.origin,j.target[0],...j.w,hotelId].join('|');if(!hotelId||!x._context.search_id||dedup.has(key))continue;dedup.add(key);results.push({title:x.hotel.name,price,origin:j.origin,destination:j.target[0],city:j.target[1],country:j.target[2],start:j.w[0],end:j.w[1],nights:(Date.parse(j.w[1])-Date.parse(j.w[0]))/day,stars:x.hotel.stars,rating:x.hotel.rating,photo:x.hotel.main_image,searchId:x._context.search_id,hotelId,carrier:x.carrier,url:safeUrl(x.booking_url||x.booking_link||x.deeplink||x.url)})}
 if(Number.isFinite(low))remember(j,p,low);
 // Update immediately, so room/flight checks begin while other routes are loading.
 }catch(err){if(stop){jobQueue.unshift(j);break}if(/HTTP 429/.test(err.message)){jobQueue.unshift(j);fatal='Anfragelimit erreicht. Ergebnisse bleiben erhalten.';detailPaused=true;cooldown=Date.now()+65000;break}errors.push(j.origin+' → '+j.target[0]+': '+err.message);consecutive++;if(consecutive>=4)fatal='Mehrere Anbieterfehler. Bisherige Ergebnisse bleiben erhalten.'}
 checked++;$('progress').value=checked;scheduleDraw()
 }}
 await Promise.all(Array.from({length:4},()=>worker()));
 if(fatal)status(fatal);else if(stop)status('Gestoppt · '+checked+' Kombinationen geprüft.');else status(jobQueue.length?'Schnellsuche abgeschlossen · '+checked+' von '+jobTotal+' geprüft. Weitere Ziele können ergänzt werden.':'Alle Kombinationen des Zielkatalogs geprüft.');
 }catch(err){if(stop)status('Suche gestoppt.');else{errors.push(err.message);status('Suche unterbrochen: '+err.message);$('diagnostics').open=true;toolConfig=null;if(/HTTP 429/.test(err.message)){cooldown=Date.now()+65000;detailPaused=true}}}
 finally{running=false;controller=null;$('liveStart').disabled=false;$('liveStop').disabled=true;draw();updateMore()}
}
form.onsubmit=e=>{e.preventDefault();if(running)return;const p=data(),span=(Date.parse(p.end)-Date.parse(p.start))/day;
 if(span>31||span<1||+p.min>+p.max||+p.min<1||+p.max>30){status('Bitte einen Zeitraum von maximal 31 Tagen und gültige Reisedauern wählen.');return}
 const windows=dates(p),jobs=S.jobs(p,windows,places,routeHistory);if(!jobs.length){status('Keine gültige Kombination. Prüfe Datum, Flughäfen und Schulfilter.');return}
 if(Date.now()<cooldown){status('Anfragelimit: bitte nach der angezeigten Pause erneut suchen.');return}
 profile=p;runId++;detailController?.abort();detailController=new AbortController();detailQueue=[];detailPaused=false;pageSize=12;session='';toolConfig=null;results=[];errors=[];checked=success=empty=0;jobQueue=jobs;jobTotal=jobs.length;$('progress').max=jobTotal;$('progress').value=0;runBatch()
};

})();