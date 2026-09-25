for(const b of document.querySelectorAll('[data-action]'))b.addEventListener('click',()=>command(b.dataset.action));
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{
  if(moving()||state.estop)return;state.mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));$('autoPanel').classList.toggle('active',state.mode==='auto');$('manualPanel').classList.toggle('active',state.mode==='manual');render();
});
for(const b of document.querySelectorAll('[data-manual]'))b.addEventListener('click',()=>{
  if(state.mode!=='manual'||state.estop||!state.power||state.loaded===0||state.gatesOpen||!state.restraints||!state.clear)return;
  const target=b.dataset.manual==='to40'?HALF_POS:b.dataset.manual==='toTop'?TOP_POS:0;startMove(target,Math.max(3,Math.abs(target-state.height)/4),'manual',target===0?'MANUELL · STATION':target===HALF_POS?'MANUELL · 40 m':'MANUELL · TOP');log('Manuelle Zielhöhe: '+(target===TOP_POS?'TOP':target+' m')+'.');
});

for(const b of document.querySelectorAll('[data-hold]')){
  const v=b.dataset.hold==='up'?1:-1;
  const start=e=>{e.preventDefault();if(state.mode!=='manual'||state.estop||!state.power||state.loaded===0||state.gatesOpen||!state.restraints||!state.clear)return;state.manualHold=v;b.classList.add('holding');};
  const stop=e=>{e?.preventDefault();state.manualHold=0;b.classList.remove('holding');};
  b.addEventListener('pointerdown',start);b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('pointerleave',stop);
}

document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));
  currentView=b.dataset.view;renderFast();
}));

$('nightMode').addEventListener('change',()=>$('stage').classList.toggle('night',$('nightMode').checked));
$('topHold').addEventListener('input',()=>$('holdValue').textContent=(+$('topHold').value).toFixed(1)+' s');
$('help').onclick=()=>$('manualDialog').showModal();$('sources').onclick=()=>$('researchDialog').showModal();
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('fullscreen').onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen();}catch{log('Vollbild im Browser nicht verfügbar.');}};

document.addEventListener('visibilitychange',()=>document.body.classList.toggle('paused',document.hidden));

function flashDrop(){const s=$('stage');s.classList.remove('drop-flash');void s.offsetWidth;s.classList.add('drop-flash');setTimeout(()=>s.classList.remove('drop-flash'),450);}

let audio=null,master=null;
function ensureAudio(){if(audio)return;audio=new (window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=.14;master.connect(audio.destination);}
function tone(freq=300,dur=.08,type='square',gain=.04){if(!state.sound)return;ensureAudio();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g).connect(master);o.start();o.stop(audio.currentTime+dur+.02);}
function whoosh(){tone(95,.32,'sawtooth',.07)}function whooshTick(){tone(72,.05,'triangle',.016)}function brakeFx(){tone(190,.45,'sawtooth',.045)}function alarmFx(){tone(120,.5,'square',.07)}function buzzFx(){tone(420,.22,'square',.04)}
$('sound').onclick=async()=>{ensureAudio();await audio.resume();state.sound=!state.sound;$('sound').setAttribute('aria-pressed',String(state.sound));$('sound').querySelector('span').textContent=state.sound?'FX an':'FX aus';tone(620,.08);};

let micCtx=null,micStream=null,micGain=null,micSource=null;
async function initMic(){
  if(micGain)return true;
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    micCtx=new (window.AudioContext||window.webkitAudioContext)();micSource=micCtx.createMediaStreamSource(micStream);
    const hp=micCtx.createBiquadFilter();hp.type='highpass';hp.frequency.value=120;
    const comp=micCtx.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=5;
    const delay=micCtx.createDelay(.2);delay.delayTime.value=.035;
    micGain=micCtx.createGain();micGain.gain.value=0;
    micSource.connect(hp).connect(comp).connect(delay).connect(micGain).connect(micCtx.destination);
    $('micHint').textContent='Mikrofon bereit · Taste gedrückt halten. Kopfhörer empfohlen.';return true;
  }catch(e){$('micHint').textContent='Mikrofon nicht verfügbar oder Berechtigung abgelehnt.';log('Reko-Mikrofon konnte nicht gestartet werden.');return false;}
}
async function pttOn(e){e.preventDefault();if(!await initMic())return;await micCtx.resume();micGain.gain.setTargetAtTime(.38,micCtx.currentTime,.02);$('ptt').classList.add('live');$('ptt').textContent='🎙 REKO LIVE';}
function pttOff(e){e?.preventDefault();if(micGain&&micCtx)micGain.gain.setTargetAtTime(0,micCtx.currentTime,.03);$('ptt').classList.remove('live');$('ptt').textContent='🎙 HALTEN ZUM REKOMMANDIEREN';}
$('ptt').addEventListener('pointerdown',pttOn);$('ptt').addEventListener('pointerup',pttOff);$('ptt').addEventListener('pointercancel',pttOff);$('ptt').addEventListener('pointerleave',pttOff);

function youtubeId(input){
  input=input.trim();if(/^[\w-]{11}$/.test(input))return input;
  try{const u=new URL(input);if(u.hostname.includes('youtu.be'))return u.pathname.split('/').filter(Boolean)[0];if(u.hostname.includes('youtube.com')){if(u.searchParams.get('v'))return u.searchParams.get('v');const p=u.pathname.split('/').filter(Boolean);if(['shorts','embed','live'].includes(p[0]))return p[1];}}catch{}return null;
}
$('loadMusic').onclick=()=>{const id=youtubeId($('youtubeUrl').value);if(!id){$('playerWrap').innerHTML='<div class="player-placeholder">Ungültiger YouTube-Link</div>';return;}$('playerWrap').innerHTML='<iframe title="YouTube Musik" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';log('YouTube-Musik geladen.');};

let last=performance.now(),ui=0;
function loop(now){const dt=(now-last)/1000;last=now;update(dt);ui+=dt;if(ui>.12){render();ui=0;}requestAnimationFrame(loop)}
log('Schichtbeginn. Hauptschalter einschalten.');render();requestAnimationFrame(loop);
