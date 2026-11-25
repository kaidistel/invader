(function(root){
'use strict';
const no=/\b(?:dorm(?:itory|itorium|s)?|hostel bed|bunk(?:\s+bed)?|shared|sharing|communal|mixed|female only|male only|bed in|bedspace|bed space|schlafsaal|mehrbett|gemeinschaft|bett im|bett in|etagenbett|dortoir|lit en|cama en|posto letto|letto in|camerata)\b/i;
const yes=/\b(?:private (?:room|apartment|studio|suite)|single room|double room|twin room|king room|queen room|einzelzimmer|doppelzimmer|zweibettzimmer|apartment|appartement|studio|suite|villa|bungalow|chalet|cottage|holiday home|entire (?:home|unit|place)|habitaci[oó]n (?:individual|doble)|chambre (?:simple|double|individuelle))\b/i;
const compact=/^(?:(?:standard|deluxe|superior|economy|classic|comfort|budget|executive|basic|small|large)\s+)*(?:single|double|twin|king|queen)(?:\s+(?:bed|room|zimmer))?$/i;
function isPrivate(r){
 if(!r||typeof r!=='object')return false;
 const name=String(r.room_name||r.name||'').normalize('NFKC').trim();
 const type=String(r.room_type||r.accommodation_type||'');
 const text=name+' '+type+' '+String(r.description||'');
 if(!name||no.test(text)||/mehrbett|gemeinschaftszimmer|schlafsaal|dormitory|sharedroom|bunkbed/i.test(text)||r.is_shared===true||r.shared_room===true||r.is_dormitory===true||r.is_private===false||r.private_room===false)return false;
 return r.is_private===true||r.private_room===true||r.entire_unit===true||yes.test(name+' '+type)||compact.test(name);
}
function privateRooms(v){return (Array.isArray(v?.room_options)?v.room_options:[]).filter(r=>isPrivate(r)&&String(r.currency||v.currency).toUpperCase()==='EUR'&&Number.isFinite(Number(r.price))&&Number(r.price)>0).sort((a,b)=>Number(a.price)-Number(b.price))}
function aircraft(f){const a=f?.aircraft_type??f?.aircraft_model??f?.aircraft??f?.equipment;return typeof a==='string'&&a.trim()?a.trim():a&&typeof a==='object'?String(a.name||a.model||a.type||a.code||'').trim():''}
function code(v){return typeof v==='string'?v.trim():String(v?.iata||v?.code||'').trim()}
function minutes(v){return v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))&&Number(v)>=0?Math.round(Number(v)):null}
function timediff(a,b){if(typeof a!=='string'||typeof b!=='string'||!/(Z|[+-]\d\d:\d\d)$/i.test(a)||!/(Z|[+-]\d\d:\d\d)$/i.test(b))return null;const m=(Date.parse(b)-Date.parse(a))/60000;return Number.isFinite(m)&&m>=0?Math.round(m):null}
function extras(f){
 if(!f)return {segments:[],layovers:[],aircraft:''};
 const raw=[f.segments,f.flight_segments,f.legs].find(a=>Array.isArray(a)&&a.length)||[];
 const segments=raw.filter(s=>s&&typeof s==='object'&&(s.from||s.origin||s.departure_airport)&&(s.to||s.destination||s.arrival_airport)).map(s=>({from:code(s.from||s.origin||s.departure_airport),to:code(s.to||s.destination||s.arrival_airport),departure:s.departure_time||s.departure?.time||'',arrival:s.arrival_time||s.arrival?.time||'',number:[s.carrier_code,s.flight_number].filter(Boolean).join(' '),aircraft:aircraft(s)}));
 const explicit=[f.layovers,f.stopovers,f.connections].find(a=>Array.isArray(a)&&a.length)||[];
 const layovers=explicit.map(l=>({airport:code(l?.airport||l?.airport_code||l?.iata||l?.location),minutes:minutes(l?.duration_minutes??l?.layover_minutes??l?.connection_minutes)})).filter(l=>l.airport||l.minutes!==null);
 for(let i=0;i<segments.length-1;i++){const a=segments[i],b=segments[i+1];if(a.to&&a.to===b.from&&!layovers.some(l=>l.airport===a.to))layovers.push({airport:a.to,minutes:timediff(a.arrival,b.departure)})}
 return {segments,layovers,aircraft:aircraft(f)}
}
const q={isPrivate,privateRooms,extras,timediff};root.TripQuality=q;if(typeof module==='object'&&module.exports)module.exports=q;
})(globalThis);
