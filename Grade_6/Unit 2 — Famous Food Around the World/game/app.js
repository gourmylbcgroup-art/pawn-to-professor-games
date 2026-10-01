'use strict';

const PAIRS=[
 {id:'tw',country:'Taiwan',food:'xiao long bao',flag:'tw',countryImg:'assets/country_taiwan.webp',foodImg:'assets/food_taiwan.webp',clue:'assets/clue_taiwan.webp'},
 {id:'jp',country:'Japan',food:'sushi',flag:'jp',countryImg:'assets/country_japan.webp',foodImg:'assets/food_japan.webp'},
 {id:'kr',country:'Korea',food:'kimchi',flag:'kr',countryImg:'assets/country_korea.webp',foodImg:'assets/food_korea.webp',clue:'assets/clue_missing_country.webp'},
 {id:'us',country:'The USA',food:'burgers',flag:'us',countryImg:'assets/country_usa.webp',foodImg:'assets/food_usa.webp'},
 {id:'uk',country:'The UK',food:'Fish and Chips',flag:'gb',countryImg:'assets/country_uk.webp',foodImg:'assets/food_uk.webp',clue:'assets/clue_partial_uk.webp'},
 {id:'es',country:'Spain',food:'paella',flag:'es',countryImg:'assets/country_spain.webp',foodImg:'assets/food_spain.webp',clue:'assets/clue_wrong_spain.webp'},
 {id:'za',country:'South Africa',food:'bunny chow',flag:'za',countryImg:'assets/country_south_africa.webp',foodImg:'assets/food_south_africa.webp',clue:'assets/clue_missing_food.webp'},
 {id:'ar',country:'Argentina',food:'empanadas',flag:'ar',countryImg:'assets/country_argentina.webp',foodImg:'assets/food_argentina.webp',clue:'assets/clue_empanada.webp'}
];

const FLAG_SVGS={
 tw:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#d60022"/><rect width="28" height="20" fill="#002b7f"/><circle cx="14" cy="10" r="5.5" fill="#fff"/><circle cx="14" cy="10" r="2.2" fill="#002b7f"/></svg>`,
 jp:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#fff"/><circle cx="32" cy="22" r="11" fill="#bc002d"/></svg>`,
 kr:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#fff"/><circle cx="32" cy="22" r="10" fill="#c60c30"/><path d="M22 22a10 10 0 0 0 20 0 5 5 0 0 1-10 0 5 5 0 0 0-10 0" fill="#003478"/></svg>`,
 us:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#fff"/>${Array.from({length:7},(_,i)=>`<rect y="${i*6.76}" width="64" height="3.4" fill="#b22234"/>`).join('')}<rect width="28" height="19" fill="#3c3b6e"/></svg>`,
 gb:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#012169"/><path d="M0 0 64 44M64 0 0 44" stroke="#fff" stroke-width="10"/><path d="M0 0 64 44M64 0 0 44" stroke="#c8102e" stroke-width="5"/><path d="M32 0v44M0 22h64" stroke="#fff" stroke-width="14"/><path d="M32 0v44M0 22h64" stroke="#c8102e" stroke-width="8"/></svg>`,
 es:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#aa151b"/><rect y="11" width="64" height="22" fill="#f1bf00"/></svg>`,
 za:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="22" fill="#de3831"/><rect y="22" width="64" height="22" fill="#002395"/><polygon points="0,0 25,22 0,44" fill="#000"/><path d="M0 7 19 22 0 37M64 12H31L18 22l13 10h33" fill="none" stroke="#fff" stroke-width="10"/><path d="M0 9 17 22 0 35M64 14H32L21 22l11 8h32" fill="none" stroke="#007a4d" stroke-width="6"/></svg>`,
 ar:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><rect width="64" height="44" fill="#74acdf"/><rect y="14.7" width="64" height="14.6" fill="#fff"/><circle cx="32" cy="22" r="4" fill="#f6b40e"/></svg>`
};
const svgUri=s=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(s);
const FLAGS=Object.entries(FLAG_SVGS).map(([code,svg])=>({code,img:svgUri(svg),name:PAIRS.find(p=>p.flag===code)?.country||code}));

// 36 logical positions mapped over the supplied board artwork.
const PATH=[
 [9,33],[14,31],[19,32],[24,35],[29,38],[34,40],[39,39],[44,40],[49,40],[54,39],[59,40],[64,39],[69,38],[74,37],[79,35],[84,34],[89,36],[93,42],
 [92,53],[88,58],[83,59],[78,61],[72,62],[67,62],[62,60],[57,62],[52,64],[47,65],[42,64],[37,62],[32,60],[27,59],[22,58],[17,56],[12,58],[8,63]
];
const FINISH=PATH.length-1;
const SPECIAL={4:'stamp',9:'airport',13:'stamp',17:'detective',21:'stamp',25:'airport',29:'detective',33:'customs',35:'finish'};

const state={level:4,teams:[],current:0,busy:false,sound:true,tts:true,rotate:true,lastQuestionIds:[],routeBonus:0,customsPassed:new Set()};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sample=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

class AudioManager{
 constructor(){this.ctx=null;this.ready=false}
 init(){if(this.ready)return; const C=window.AudioContext||window.webkitAudioContext;if(C){this.ctx=new C();this.ready=true}}
 tone(freq=620,dur=.12,type='sine',gain=.045){if(!state.sound)return;this.init();if(!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(this.ctx.destination);o.start(t);o.stop(t+dur)}
 correct(){this.tone(660,.11);setTimeout(()=>this.tone(880,.13),95)}
 wrong(){this.tone(180,.18,'square',.025)}
 roll(){[330,440,550].forEach((f,i)=>setTimeout(()=>this.tone(f,.06),i*55))}
 stamp(){[620,780,980].forEach((f,i)=>setTimeout(()=>this.tone(f,.09),i*75))}
}
const audio=new AudioManager();

const JIA_AUDIO_CUES={"dice_1":{"start":0.0,"duration":1.123265},"dice_2":{"start":1.123265,"duration":0.809796},"dice_3":{"start":1.933061,"duration":1.358367},"dice_4":{"start":3.291428,"duration":1.436735},"dice_5":{"start":4.728163,"duration":1.123265},"dice_6":{"start":5.851428,"duration":1.854694},"correct":{"start":7.706122,"duration":1.828571},"wrong":{"start":9.534693,"duration":1.227755},"wrong_try_again":{"start":10.762448,"duration":2.925714},"your_turn":{"start":13.688162,"duration":1.645714},"next_player":{"start":15.333876,"duration":3.030204},"airport_gate":{"start":18.36408,"duration":2.847347},"choose_route":{"start":21.211427,"duration":2.142041},"safe_route":{"start":23.353468,"duration":1.515102},"fast_route":{"start":24.86857,"duration":1.462857},"passport_challenge":{"start":26.331427,"duration":2.168163},"detective_challenge":{"start":28.49959,"duration":1.933061},"customs_check":{"start":30.432651,"duration":1.462857},"finish":{"start":31.895508,"duration":2.220408},"you_win":{"start":34.115916,"duration":1.750204},"q_taiwan":{"start":35.86612,"duration":2.873469},"q_japan":{"start":38.739589,"duration":3.108571},"q_korea":{"start":41.84816,"duration":3.448163},"q_usa":{"start":45.296323,"duration":4.519184},"q_uk":{"start":49.815507,"duration":3.552653},"q_spain":{"start":53.36816,"duration":3.395918},"q_south_africa":{"start":56.764078,"duration":3.918367},"q_argentina":{"start":60.682445,"duration":4.466939},"q_mystery_country":{"start":65.149384,"duration":3.813878},"q_mystery_food":{"start":68.963262,"duration":4.04898},"q_right_or_wrong":{"start":73.012242,"duration":2.76898},"q_missing_food":{"start":75.781222,"duration":2.612245},"q_missing_country":{"start":78.393467,"duration":2.298776},"say_full_sentence":{"start":80.692243,"duration":3.892245},"a_taiwan":{"start":84.584488,"duration":4.022857},"a_japan":{"start":88.607345,"duration":3.422041},"a_korea":{"start":92.029386,"duration":3.761633},"a_usa":{"start":95.791019,"duration":4.649796},"a_uk":{"start":100.440815,"duration":4.963265},"a_spain":{"start":105.40408,"duration":3.709388},"a_south_africa":{"start":109.113468,"duration":4.153469},"a_argentina":{"start":113.266937,"duration":4.702041}};
const JIA_AUDIO_SPRITE='audio/jiajia/jiajia-voice-sprite.mp3';

const JiaVoice=(()=>{
 let ctx=null,buffer=null,source=null,warmPromise=null,currentEndTimer=null;

 function ensureCtx(){
   if(!ctx){
     const C=window.AudioContext||window.webkitAudioContext;
     if(C)ctx=new C();
   }
   if(ctx?.state==='suspended')ctx.resume().catch(()=>{});
   return ctx;
 }

 function stop(){
   if(currentEndTimer){clearTimeout(currentEndTimer);currentEndTimer=null;}
   if(source){
     try{source.stop();}catch(e){}
     try{source.disconnect();}catch(e){}
     source=null;
   }
 }

 function warm(){
   if(warmPromise)return warmPromise;
   const c=ensureCtx();
   if(!c)return Promise.resolve(false);

   warmPromise=fetch(JIA_AUDIO_SPRITE,{cache:'force-cache'})
     .then(r=>{if(!r.ok)throw new Error('Voice file could not be loaded.');return r.arrayBuffer();})
     .then(b=>c.decodeAudioData(b.slice(0)))
     .then(decoded=>{buffer=decoded;return true;})
     .catch(err=>{console.warn('Jia-Jia voice preload failed:',err);return false;});
   return warmPromise;
 }

 function play(key,onEnd){
   if(!state.tts){if(onEnd)onEnd();return false;}
   const cue=JIA_AUDIO_CUES[key];
   if(!cue){if(onEnd)onEnd();return false;}

   stop();
   const c=ensureCtx();
   if(!c){if(onEnd)onEnd();return false;}

   const startPlayback=()=>{
     if(!buffer){if(onEnd)onEnd();return false;}
     source=c.createBufferSource();
     source.buffer=buffer;
     source.connect(c.destination);
     source.onended=()=>{
       source=null;
       if(currentEndTimer){clearTimeout(currentEndTimer);currentEndTimer=null;}
       if(onEnd)onEnd();
     };
     try{
       source.start(0,cue.start,cue.duration);
       currentEndTimer=setTimeout(()=>{
         if(source){try{source.stop();}catch(e){}}
       },Math.ceil(cue.duration*1000)+120);
       return true;
     }catch(e){
       source=null;
       if(onEnd)onEnd();
       return false;
     }
   };

   if(buffer)return startPlayback();
   warm().then(ok=>{if(ok)startPlayback();else if(onEnd)onEnd();});
   return true;
 }

 function sequence(keys){
   const q=[...keys];
   const next=()=>{
     const k=q.shift();
     if(k)play(k,next);
   };
   next();
 }

 return {warm,play,stop};
})();


const PTP_LOCAL_TTS=(()=>{
 let chosen=null;
 let ready=false;

 function choose(){
   if(!('speechSynthesis' in window))return null;
   const voices=window.speechSynthesis.getVoices()||[];

   // Never deliberately choose a cloud/network voice.
   const local=voices.filter(v=>v.localService===true);
   const english=local.filter(v=>/^en(?:-|$)/i.test(v.lang||''));
   const us=english.filter(v=>/^en-US$/i.test(v.lang||''));

   // Preserve the browser's default voice when it is already local.
   chosen=
     us.find(v=>v.default) ||
     english.find(v=>v.default) ||
     local.find(v=>v.default) ||
     us[0] ||
     english[0] ||
     local[0] ||
     null;

   ready=true;
   return chosen;
 }

 function warm(){
   const v=choose();
   if(v)return v;

   // Chrome/Safari can populate voices asynchronously.
   if('speechSynthesis' in window){
     window.speechSynthesis.addEventListener('voiceschanged',choose,{once:true});
     window.speechSynthesis.getVoices();
   }
   return null;
 }

 function speak(text,{rate=.84,pitch=1,onEnd=null}={}){
   if(!text||!('speechSynthesis' in window))return false;

   const voice=chosen||choose();

   // Important for online reliability:
   // if there is no confirmed LOCAL voice, do not fall back to a
   // network/cloud voice. Visual instructions still remain available.
   if(!voice||voice.localService!==true)return false;

   window.PTP_LOCAL_TTS.stop();
   const u=new SpeechSynthesisUtterance(text);
   u.voice=voice;
   u.lang=voice.lang||'en-US';
   u.rate=rate;
   u.pitch=pitch;
   if(onEnd)u.onend=onEnd;
   window.speechSynthesis.speak(u);
   return true;
 }

 function stop(){
   if('speechSynthesis' in window)window.PTP_LOCAL_TTS.stop();
 }

 return {warm,speak,stop,get voice(){return chosen;}};
})();

function voiceKey(text){const t=(text||'').trim().toLowerCase().replace(/[.!]+$/,'');const m={'correct':'correct','wrong':'wrong','wrong. try again':'wrong_try_again','wrong, try again':'wrong_try_again','your turn':'your_turn','next player':'next_player','airport gate':'airport_gate','choose your route':'choose_route','safe route':'safe_route','fast route':'fast_route','passport challenge':'passport_challenge','detective challenge':'detective_challenge','customs check':'customs_check','finish':'finish','you win':'you_win','what is taiwan famous for?':'q_taiwan','what is japan famous for?':'q_japan','what is korea famous for?':'q_korea','what is the usa famous for?':'q_usa','what is the uk famous for?':'q_uk','what is spain famous for?':'q_spain','what is south africa famous for?':'q_south_africa','what is argentina famous for?':'q_argentina','what is this country famous for?':'q_mystery_country','which country is famous for this food?':'q_mystery_food','is this correct?':'q_right_or_wrong','which food is missing?':'q_missing_food','which country is missing?':'q_missing_country','say the full sentence aloud':'say_full_sentence','taiwan is famous for xiao long bao':'a_taiwan','japan is famous for sushi':'a_japan','korea is famous for kimchi':'a_korea','the usa is famous for burgers':'a_usa','the uk is famous for fish and chips':'a_uk','spain is famous for paella':'a_spain','south africa is famous for bunny chow':'a_south_africa','argentina is famous for empanadas':'a_argentina'};if(m[t])return m[t];if(/^is this correct\?/.test(t))return 'q_right_or_wrong';if(/ is famous for _+/.test(t))return 'q_missing_food';if(/^_+ is famous for /.test(t))return 'q_missing_country';return null}
function speak(text){
 if(!state.tts||!text)return;

 // Recorded Jia-Jia cue always has priority.
 const k=voiceKey(text);
 if(k&&JiaVoice.play(k))return;

 // Dynamic/non-recorded text uses only a LOCAL installed voice.
 // This avoids cloud/network TTS delay when the site is online.
 JiaVoice.stop();
 PTP_LOCAL_TTS.stop();
 PTP_LOCAL_TTS.speak(text,{rate:.82,pitch:1});
}
function warmSpeech(){
 PTP_LOCAL_TTS.warm();
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)}

function buildPairStrip(){ $('#pairStrip').innerHTML=PAIRS.map(p=>`<span class="pair-pill">${p.country} · ${p.food}</span>`).join('') }
function buildSelectors(){
 const n=+$('#teamCount').value;state.teams=Array.from({length:n},(_,i)=>state.teams[i]||{name:`Team ${i+1}`,flag:FLAGS[i].code,flagImg:FLAGS[i].img,pos:0,stamps:new Set(),speaker:1,correct:0});
 state.teams=state.teams.slice(0,n);const wrap=$('#teamSelectors');wrap.innerHTML='';
 state.teams.forEach((team,i)=>{
  const used=new Set(state.teams.map((t,j)=>j===i?null:t.flag).filter(Boolean));
  const div=document.createElement('div');div.className='team-selector';
  div.innerHTML=`<div class="team-selector-head"><span>Team ${i+1}</span><span>${FLAGS.find(f=>f.code===team.flag)?.name||''}</span></div><div class="flag-grid">${FLAGS.map(f=>`<button class="flag-pick ${f.code===team.flag?'selected':''}" data-team="${i}" data-flag="${f.code}" ${used.has(f.code)?'disabled':''}><img src="${f.img}" alt="${f.name}"></button>`).join('')}</div>`;
  wrap.appendChild(div);
 });
}

async function preload(){
 // Voice gets priority: one cached audio sprite instead of 42 separate MP3 requests.
 JiaVoice.warm();

 // Preload only board + the core country/food visuals needed on normal turns.
 // Detective clue images are lazy-loaded only if/when that challenge appears.
 const urls=[...new Set([
   'assets/board.webp',
   ...PAIRS.flatMap(p=>[p.countryImg,p.foodImg]).filter(Boolean)
 ])];
 let done=0;

 // Limit concurrent image downloads so audio is not starved on school Wi-Fi.
 const queue=[...urls];
 const workers=Array.from({length:4},async()=>{
   while(queue.length){
     const src=queue.shift();
     await new Promise(resolve=>{
       const im=new Image();
       im.decoding='async';
       im.onload=im.onerror=()=>{
         done++;
         $('#preloadStatus').textContent=`Prepared ${done}/${urls.length} core visual resources.`;
         resolve();
       };
       im.src=src;
     });
   }
 });
 await Promise.all(workers);

 $('#startBtn').disabled=false;
 $('#startBtn').textContent='Start the Race';
 $('#preloadStatus').textContent='Ready. Core images and Jia-Jia voice are prepared for smoother online play.';
}

function levelName(){return state.level===4?'Passport Rookie':state.level===5?'Secret Route':'Detective Race'}
function resetRace(){state.teams.forEach(t=>{t.pos=0;t.stamps=new Set();t.correct=0;t.speaker=1});state.current=0;state.busy=false;state.customsPassed=new Set();render()}
function startGame(){state.sound=$('#soundToggle').checked;state.tts=$('#ttsToggle').checked;state.rotate=$('#rotateToggle').checked;audio.init();if(state.tts){warmSpeech();JiaVoice.warm();}$('#levelTitle').textContent=`Week ${state.level} · ${levelName()}`;resetRace();showScreen('game');showRules(true)}
function showScreen(id){$$('.screen').forEach(s=>s.classList.remove('active'));$('#'+id).classList.add('active')}

function render(){
 const layer=$('#tokenLayer');layer.innerHTML='';
 state.teams.forEach((t,i)=>{const [x,y]=PATH[t.pos];const el=document.createElement('div');el.className='board-token'+(i===state.current?' active':'');el.style.left=x+'%';el.style.top=y+'%';el.innerHTML=`<img src="${t.flagImg}" alt="${t.name} flag"><span class="team-num">${i+1}</span>`;layer.appendChild(el)});
 const t=state.teams[state.current];$('#currentFlag').innerHTML=`<img src="${t.flagImg}" alt="${t.name} flag">`;$('#currentTeam').textContent=t.name;$('#turnHint').textContent=state.rotate?`Speaker ${t.speaker} answers this turn.`:`Position ${t.pos+1} of ${PATH.length}`;
 $('#scoreList').innerHTML=state.teams.map((x,i)=>`<div class="score-row ${i===state.current?'current':''}"><img src="${x.flagImg}"><div><strong>${x.name}</strong><small>${x.stamps.size} stamp${x.stamps.size===1?'':'s'} · ${x.correct} correct</small></div><span class="score-value">${x.pos+1}/${PATH.length}</span></div>`).join('');
 $('#passportGrid').innerHTML=state.teams.map(t=>`<div class="passport-team"><div class="passport-team-head"><img src="${t.flagImg}" style="width:30px;height:20px;border-radius:4px"> ${t.name}</div><div class="stamp-row">${PAIRS.map(p=>`<span class="stamp ${t.stamps.has(p.id)?'earned':''}" title="${p.country}">${t.stamps.has(p.id)?'✓':'·'}</span>`).join('')}</div></div>`).join('');
 $('#rollBtn').disabled=state.busy;
}

function modal(html){$('#modalCard').innerHTML=html;$('#modal').classList.add('show');$('#modal').setAttribute('aria-hidden','false')}
function closeModal(){ $('#modal').classList.remove('show');$('#modal').setAttribute('aria-hidden','true') }
function modalHead(title){return `<div class="modal-head"><h2>${title}</h2><button class="ghost close" onclick="closeModal()">Close</button></div>`}

function showRules(initial=false){
 const week4=`<div class="rule-box"><strong>Passport Rookie:</strong> answer supported country-food questions and collect passport stamps. Reach the finish with at least <b>3 different stamps</b>.</div>`;
 const week5=`<div class="rule-box"><strong>Secret Route:</strong> at Airport Gates choose a <b>Safe Route</b> or <b>Fast Route</b>. Fast Route questions have less help and can move you farther. Reach the finish with <b>5 stamps</b> and at least one Fast Route success.</div>`;
 const week6=`<div class="rule-box"><strong>Detective Race:</strong> solve mystery-country, mystery-food, wrong-pair and missing-word challenges. You must pass <b>Customs</b> before finishing.</div>`;
 modal(`${modalHead(`Week ${state.level} · ${levelName()}`)}<div class="rules-list">${state.level===4?week4:state.level===5?week5:week6}<div class="rule-box">The same student should not answer twice in a row. Teacher decides CORRECT or WRONG after the spoken answer.</div><div class="rule-box">Wrong answers never move a team backward.</div></div>${initial?'<div class="teacher-row"><button class="correct-btn" onclick="closeModal()">Begin</button></div>':''}`)
}

function getPair(exclude=[]){const candidates=PAIRS.filter(p=>!exclude.includes(p.id));return sample(candidates.length?candidates:PAIRS)}
function modelSentence(p){return `${p.country} is famous for ${p.food}.`}
function askSentence(p){return `What is ${p.country} famous for?`}
function optionVisual(label){
 const pair=PAIRS.find(x=>x.food===label||x.country===label);
 if(!pair)return null;
 return pair.food===label?pair.foodImg:pair.countryImg;
}
function qKey(type,p){return type+'-'+p.id}
function avoidRepeat(type,p){const key=qKey(type,p);if(state.lastQuestionIds.includes(key)){p=getPair([p.id]);}state.lastQuestionIds.push(qKey(type,p));if(state.lastQuestionIds.length>8)state.lastQuestionIds.shift();return p}

function buildQuestion(kind='normal',hard=false){
 let p=avoidRepeat(kind,getPair());
 if(kind==='wrongPair'){const wrong=sample(PAIRS.filter(x=>x.id!==p.id));return{kind,p,title:'Wrong Pair Detective',prompt:`Is this correct? ${p.country} + ${wrong.food}`,image:p.countryImg,answer:modelSentence(p),options:null}}
 if(kind==='missingFood')return{kind,p,title:'Missing Food',prompt:`${p.country} is famous for ______.`,image:p.countryImg,answer:modelSentence(p),options:hard?null:shuffle([p,...PAIRS.filter(x=>x.id!==p.id).slice(0,2)]).map(x=>({label:x.food,correct:x.id===p.id}))};
 if(kind==='missingCountry')return{kind,p,title:'Missing Country',prompt:`______ is famous for ${p.food}.`,image:p.foodImg,answer:modelSentence(p),options:hard?null:shuffle([p,...PAIRS.filter(x=>x.id!==p.id).slice(0,2)]).map(x=>({label:x.country,correct:x.id===p.id}))};
 if(kind==='mysteryFood')return{kind,p,title:'Mystery Food',prompt:'Which country is famous for this food?',image:p.foodImg,answer:modelSentence(p),options:hard?null:shuffle([p,...PAIRS.filter(x=>x.id!==p.id).slice(0,2)]).map(x=>({label:x.country,correct:x.id===p.id}))};
 if(kind==='mysteryCountry')return{kind,p,title:'Mystery Country',prompt:`What is this country famous for?`,image:p.countryImg,answer:modelSentence(p),options:hard?null:shuffle([p,...PAIRS.filter(x=>x.id!==p.id).slice(0,2)]).map(x=>({label:x.food,correct:x.id===p.id}))};
 // normal scaffolded Week 4
 return{kind:'normal',p,title:'Passport Challenge',prompt:askSentence(p),image:p.countryImg,answer:modelSentence(p),options:shuffle([p,...PAIRS.filter(x=>x.id!==p.id).slice(0,2)]).map(x=>({label:x.food,correct:x.id===p.id}))};
}


function showAnswerFeedback(type,message,buttonText,onClose){
 const overlay=document.getElementById('answerFeedbackModal');
 const card=document.getElementById('answerFeedbackCard');
 const icon=document.getElementById('answerFeedbackIcon');
 const title=document.getElementById('answerFeedbackTitle');
 const text=document.getElementById('answerFeedbackText');
 const button=document.getElementById('answerFeedbackButton');
 const correct=type==='correct';

 card.classList.toggle('wrong',!correct);
 icon.textContent=correct?'✓':'✕';
 title.textContent=correct?'Correct!':'Wrong!';
 text.textContent=message || (correct?'Great answer!':'That answer is not correct.');
 button.textContent=buttonText || 'Continue';
 overlay.classList.remove('hidden');
 overlay.setAttribute('aria-hidden','false');

 button.onclick=()=>{
   overlay.classList.add('hidden');
   overlay.setAttribute('aria-hidden','true');
   button.onclick=null;
   if(typeof onClose==='function')onClose();
 };
}

function showQuestion(q,{move=0,onCorrect=null,onWrong=null,teacher=true}={}){
 const hasChoices=Array.isArray(q.options)&&q.options.length>0;
 const options=hasChoices?`<div class="choice-grid">${q.options.map((o,i)=>{const img=optionVisual(o.label);return `<button class="choice choice-with-thumb" data-opt="${i}" data-correct="${o.correct}">${img?`<img class="choice-thumb" src="${img}" alt="${o.label}">`:''}<span class="choice-label">${o.label}</span></button>`}).join('')}</div>`:'';
 const needsTeacher=teacher&&!hasChoices;
 modal(`${modalHead(q.title)}<div class="question-grid"><img class="question-image" src="${q.image}" alt="question clue"><div class="question-copy"><h3>${q.prompt}</h3><div class="question-tools"><button class="repeat-btn" id="repeatQuestion">🔊 Repeat Question</button></div><p>${hasChoices?'Click an answer. Say the full sentence aloud.':'Say the full sentence aloud.'}</p>${options}<div class="feedback">Model answer: <b>${q.answer}</b></div><div class="teacher-row">${needsTeacher?'<button class="correct-btn" id="teacherCorrect">CORRECT</button><button class="wrong-btn" id="teacherWrong">WRONG</button>':''}</div></div></div>`);
 speak(q.prompt);
 $('#repeatQuestion')?.addEventListener('click',()=>speak(q.prompt));

 let resolved=false, mistakes=0;
 const finishCorrect=()=>{
  if(resolved)return;resolved=true;audio.correct();speak('Correct.');
  const feedback=$('.feedback');if(feedback)feedback.style.display='block';
  $$('.choice').forEach(b=>b.disabled=true);
  showAnswerFeedback('correct','Great! Your answer is correct.','Continue',()=>{
   closeModal();
   const t=state.teams[state.current];t.correct++;
   if(move>0)animateMove(t,move).then(()=>afterMove(onCorrect)).catch(()=>endTurn());
   else afterMove(onCorrect);
  });
 };
 const finishWrong=()=>{
  if(resolved)return;resolved=true;audio.wrong();speak('Wrong.');
  const feedback=$('.feedback');if(feedback)feedback.style.display='block';
  $$('.choice').forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct')});
  showAnswerFeedback('wrong','That answer is not correct.','Continue',()=>{
   closeModal();
   if(onWrong)onWrong();else endTurn();
  });
 };

 if(hasChoices){
  $$('.choice').forEach(btn=>btn.onclick=()=>{
   if(resolved||btn.disabled)return;
   const yes=btn.dataset.correct==='true';
   if(yes){btn.classList.add('correct');finishCorrect();return}
   btn.classList.add('wrong');btn.disabled=true;audio.wrong();mistakes++;
   if(mistakes<2){
    toast('Try again!');
    speak('Wrong. Try again.');
    showAnswerFeedback('wrong','Wrong. Try again!','Try Again');
   } else finishWrong();
  });
 }
 $('#teacherCorrect')?.addEventListener('click',finishCorrect);
 $('#teacherWrong')?.addEventListener('click',finishWrong);
}

function announceDiceNumber(n){const words=['ONE','TWO','THREE','FOUR','FIVE','SIX'];const box=$('#diceResult');box.innerHTML=`<span class="number">YOU ROLLED ${n}</span><span class="word">${words[n-1]}</span>`;box.classList.add('show');JiaVoice.play(`dice_${n}`);}
function roll(){
 if(state.busy)return;
 state.busy=true;render();audio.roll();
 const result=$('#diceResult');result.classList.remove('show');result.innerHTML='';
 let ticks=0;const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];
 // Slow, readable roll for EFL learners: a little over 2 seconds.
 const iv=setInterval(()=>{
   const n=Math.floor(Math.random()*6);$('#diceFace').textContent=faces[n];
   if(++ticks>=16){
     clearInterval(iv);
     const roll=1+Math.floor(Math.random()*6);
     $('#diceFace').textContent=faces[roll-1];
     announceDiceNumber(roll);
     // Keep the final number visible for 3 seconds, then give a short quiet pause
     // before the question appears. Total processing time is about 3.6 seconds.
     setTimeout(()=>{
       result.classList.remove('show');
       setTimeout(()=>turnChallenge(roll),650);
     },3000);
   }
 },130);
}

function turnChallenge(roll){
 if(state.level===4){showQuestion(buildQuestion('normal',false),{move:roll,onCorrect:()=>maybeStampThenEnd(),onWrong:()=>endTurn()});return}
 if(state.level===5){
  const pos=state.teams[state.current].pos;const isAirport=SPECIAL[pos]==='airport'||Math.random()<.25;
  if(isAirport){showRouteChoice(roll)} else {showQuestion(buildQuestion(sample(['normal','mysteryFood']),false),{move:roll,onCorrect:()=>maybeStampThenEnd(),onWrong:()=>endTurn()})}
  return;
 }
 // Week 6 detective every turn; customs is handled near finish
 const kinds=['mysteryCountry','mysteryFood','wrongPair','missingFood','missingCountry'];const kind=sample(kinds);
 showQuestion(buildQuestion(kind,true),{move:roll,onCorrect:()=>maybeStampThenEnd(),onWrong:()=>endTurn()});
}

function showRouteChoice(roll){
 modal(`${modalHead('Airport Gate')}<p><b>Choose your route.</b> Safe Route gives visual choices. Fast Route removes the choices but adds +2 spaces if correct.</p><div class="route-choice"><button class="route-btn safe" id="safeRoute">SAFE ROUTE<br><small>normal move</small></button><button class="route-btn fast" id="fastRoute">FAST ROUTE<br><small>+2 spaces</small></button></div>`);
 JiaVoice.sequence(['airport_gate','choose_route']);
 $('#safeRoute').onclick=()=>{JiaVoice.play('safe_route');closeModal();showQuestion(buildQuestion(sample(['normal','mysteryFood']),false),{move:roll,onCorrect:()=>maybeStampThenEnd(),onWrong:()=>endTurn()})};
 $('#fastRoute').onclick=()=>{JiaVoice.play('fast_route');closeModal();showQuestion(buildQuestion(sample(['mysteryCountry','mysteryFood','missingCountry','missingFood']),true),{move:roll+2,onCorrect:()=>{state.teams[state.current].fastSuccess=true;maybeStampThenEnd()},onWrong:()=>endTurn()})};
}

async function animateMove(team,steps){const target=Math.min(FINISH,team.pos+steps);while(team.pos<target){team.pos++;render();await new Promise(r=>setTimeout(r,430));}}

// Central completion hook for a correct answer. This was missing in the earlier build,
// which could leave the game locked after movement.
function afterMove(callback){
 try{
  if(typeof callback==='function') callback();
  else endTurn();
 }catch(err){
  console.error('Turn completion error:',err);
  endTurn();
 }
}

function maybeStampThenEnd(){
 const team=state.teams[state.current];
 if(team.pos>=FINISH){checkFinish();return}
 const special=SPECIAL[team.pos];
 if(special==='stamp'||Math.random()<.22){awardStamp()} else if(state.level===6&&special==='customs'){customsCheck()} else endTurn();
}

function awardStamp(){
 const team=state.teams[state.current];const available=PAIRS.filter(p=>!team.stamps.has(p.id));const p=sample(available.length?available:PAIRS);team.stamps.add(p.id);audio.stamp();render();
 modal(`${modalHead('Passport Stamp!')}<div class="question-grid"><img class="question-image" src="${p.countryImg}"><div class="question-copy"><h3>${p.country}</h3><p>You earned the ${p.country} stamp.</p><div class="teacher-row"><button class="correct-btn" id="stampContinue">Continue</button></div></div></div>`);$('#stampContinue').onclick=()=>{closeModal();endTurn()};
}

function customsCheck(){
 JiaVoice.play('customs_check');
 const team=state.teams[state.current];let score=0,round=0;
 const next=()=>{if(round>=3){closeModal();if(score>=2){state.customsPassed.add(state.current);audio.correct();toast('Customs passed!');endTurn()}else{audio.wrong();modal(`${modalHead('Customs Check')}<p>You need 2 correct answers out of 3. Try Customs again next turn.</p><div class="teacher-row"><button class="secondary" id="customsDone">Continue</button></div>`);$('#customsDone').onclick=()=>{closeModal();endTurn()}}return}const q=buildQuestion(sample(['mysteryCountry','mysteryFood','missingCountry','missingFood']),true);round++;showQuestion(q,{move:0,onCorrect:()=>{score++;next()},onWrong:()=>next()});};next();
}

function checkFinish(){
 const t=state.teams[state.current];let ok=false,why='';
 if(state.level===4){ok=t.stamps.size>=3;why='You need at least 3 different passport stamps.'}
 else if(state.level===5){ok=t.stamps.size>=5&&t.fastSuccess;why='You need 5 stamps and one successful Fast Route.'}
 else {ok=state.customsPassed.has(state.current);why='You must pass Customs before winning.'}
 if(ok){winner()}else{t.pos=Math.max(0,FINISH-2);render();modal(`${modalHead('Almost there!')}<p>${why}</p><p>Your team stays near the finish and can try again.</p><div class="teacher-row"><button class="secondary" id="finishContinue">Continue</button></div>`);$('#finishContinue').onclick=()=>{closeModal();endTurn()}}
}

function winner(){const t=state.teams[state.current];audio.stamp();JiaVoice.sequence(['finish','you_win']);modal(`${modalHead('Race Complete!')}<div style="text-align:center"><div style="font-size:6rem">🏆</div><h2>${t.name} wins!</h2><p><b>${t.stamps.size} passport stamps</b> · ${t.correct} correct answers</p><div class="teacher-row"><button class="correct-btn" id="againBtn">Play again</button><button class="secondary" id="changeBtn">Change setup</button></div></div>`);$('#againBtn').onclick=()=>{closeModal();resetRace()};$('#changeBtn').onclick=()=>{closeModal();showScreen('setup')}}

function endTurn(){
 const dr=$('#diceResult');if(dr){dr.classList.remove('show');dr.innerHTML=''}
 const outgoing=state.teams[state.current];if(state.rotate)outgoing.speaker=outgoing.speaker%4+1;
 state.current=(state.current+1)%state.teams.length;
 state.busy=true;render();
 const incoming=state.teams[state.current];
 toast(`${incoming.name}'s turn`);JiaVoice.play('next_player');
 setTimeout(()=>{state.busy=false;render()},1500);
}

function showReview(){
 modal(`${modalHead('Flashcard Review')}<div class="gallery">${PAIRS.flatMap(p=>[[p.country,p.countryImg],[p.food,p.foodImg]]).map(([label,img])=>`<figure><img src="${img}"><figcaption>${label}</figcaption></figure>`).join('')}</div>`)
}

// Setup events
buildPairStrip();buildSelectors();
$('#teamCount').onchange=buildSelectors;
$('#teamSelectors').onclick=e=>{const b=e.target.closest('.flag-pick');if(!b||b.disabled)return;const i=+b.dataset.team,code=b.dataset.flag;const f=FLAGS.find(x=>x.code===code);state.teams[i].flag=code;state.teams[i].flagImg=f.img;buildSelectors()};
$$('.level-card').forEach(b=>b.onclick=()=>{$$('.level-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.level=+b.dataset.level});
$('#startBtn').onclick=startGame;$('#rollBtn').onclick=roll;$('#rulesBtn').onclick=()=>showRules(false);$('#reviewBtn').onclick=showReview;$('#setupBtn').onclick=()=>showScreen('setup');
window.closeModal=closeModal;
JiaVoice.warm();
preload();
