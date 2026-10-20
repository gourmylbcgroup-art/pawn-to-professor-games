/* Grade 4 Unit 4 V39: lazy on-demand audio. Each user's browser fetches only the clicked MP3 via the CDN.
   Missing teacher recordings safely fall back to browser speech synthesis. */
(function () {
 'use strict';
 const manifest=window.G4VOICE_MANIFEST||{};
 function key(s){return String(s||'').toLowerCase().replace(/[’]/g,"'").replace(/___/g,'...').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
 const media=new Audio();media.preload='none';media.volume=1;
 let serial=0,activeResolve=null,waitingTimer=null,waitingResolve=null,mediaTimeout=null;
 const stats={recorded:0,fallback:0,errors:0,cancelled:0};
 function clearWait(){if(waitingTimer){clearTimeout(waitingTimer);waitingTimer=null}const r=waitingResolve;waitingResolve=null;if(r)r()}
 function settle(){if(mediaTimeout){clearTimeout(mediaTimeout);mediaTimeout=null}const resolve=activeResolve;activeResolve=null;media.onended=null;media.onerror=null;media.onabort=null;if(resolve)resolve()}
 function stop(){serial++;if(mediaTimeout){clearTimeout(mediaTimeout);mediaTimeout=null}clearWait();stats.cancelled++;settle();media.pause();try{media.currentTime=0}catch(e){}try{if('speechSynthesis'in window)window.speechSynthesis.cancel()}catch(e){}}
 function synth(s,token){
  return new Promise(resolve=>{
   if(token!==serial){resolve();return}
   if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){resolve();return}
   stats.fallback++;
   const u=new SpeechSynthesisUtterance(String(s));u.lang='en-US';u.rate=.70;u.pitch=1;u.volume=1;
   activeResolve=resolve;
   u.onend=settle;u.onerror=settle;
   try{window.speechSynthesis.speak(u)}catch(e){stats.errors++;settle()}
  });
 }
 function one(s,token){
  if(token!==serial)return Promise.resolve();
  const path=manifest[key(s)];
  if(!path)return synth(s,token);
  return new Promise(resolve=>{
   if(token!==serial){resolve();return}
   activeResolve=resolve;
   media.onended=()=>{if(token===serial)settle()};
   let failed=false;const failure=()=>{if(token!==serial||failed)return;failed=true;if(mediaTimeout){clearTimeout(mediaTimeout);mediaTimeout=null}media.pause();stats.errors++;media.onended=null;media.onerror=null;activeResolve=null;synth(s,token).then(resolve)};
   media.onerror=failure;mediaTimeout=setTimeout(failure,6500);
   media.onabort=null;
   try{
    if(media.getAttribute('src')!==path){media.setAttribute('src',path);media.load()}
    else media.currentTime=0;
    const r=media.play();
    if(r&&typeof r.catch==='function')r.catch(failure);
    stats.recorded++;
   }catch(e){failure()}
  });
 }
 // Reuse the same HTMLAudioElement for every line, preserving sequential-playback permissions on Safari.
 function play(s){stop();return one(s,serial)}
 function sequence(parts,pause=900){
  const list=(parts||[]).filter(x=>String(x||'').trim());stop();const token=serial;
  (async()=>{for(let i=0;i<list.length;i++){
   if(token!==serial)return;
   await one(list[i],token);
   if(token!==serial)return;
   if(i<list.length-1)await new Promise(r=>{waitingResolve=r;waitingTimer=setTimeout(()=>{waitingTimer=null;waitingResolve=null;r()},Math.max(0,pause))});
  }})().catch(()=>{});
 }
 // Prefetch no more than two on-screen audio fragments, on good connections only.
 const warmed=new Set();
 function warm(lines){
  try{
   if(navigator.connection?.saveData||['slow-2g','2g'].includes(navigator.connection?.effectiveType))return;
   const paths=[...new Set((lines||[]).map(x=>manifest[key(x)]).filter(Boolean))].slice(0,2);
   for(const path of paths){if(warmed.has(path)||warmed.size>=8)continue;warmed.add(path);
    const link=document.createElement('link');link.rel='prefetch';link.as='fetch';link.href=path;document.head.appendChild(link)}
  }catch(e){}
 }
 window.G4Voice={play,sequence,stop,warm,has:s=>!!manifest[key(s)],key,stats,recordingCount:Object.keys(manifest).length};
})();
