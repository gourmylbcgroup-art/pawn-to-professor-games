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

const MY_VOICE_TEXTS=["Famous Food Around the World.", "What food do you know? I see...", "Meet the countries. Point and say the country.", "What is Taiwan famous for?", "Taiwan is famous for xiao long bao.", "What is Japan famous for? Japan is famous for sushi.", "What is the USA famous for? The USA is famous for burgers.", "What is Korea famous for? Korea is famous for kimchi.", "What is the UK famous for? The UK is famous for Fish and Chips.", "Connect the five. Match and say the sentence.", "Mission one. Match and say.", "Food flash review. Look and say the food.", "Country review. Point and say the country.", "Ask the question. What is blank famous for?", "Say the answer. Blank is famous for blank.", "Wrong match. Right or wrong?", "Picture only challenge. Say the full sentence.", "Reverse challenge. Which country?", "New destinations: Spain, South Africa, Argentina.", "Secret Match Mission. Find your partner.", "New famous foods: paella, bunny chow, empanadas.", "Eight-country challenge. Ask and answer with a partner.", "Famous Food Detectives. Can you solve the mystery?", "Detective mission rules. Look. Think. Match. Say.", "Mystery country. Which country? What is it famous for?", "Mystery food. Which country is famous for this?", "Partial picture. Guess the country and the food.", "Wrong pair detective. Right or wrong?", "Wrong pair detective. Correct the pair.", "Missing food. Choose the correct food.", "Missing country. Choose the correct country.", "Ready? Start the race.", "Fast Eight. Point fast and say the food.", "Ask your team. Change speaker each turn.", "The Amazing Food Race. Get ready to race around the world.", "What is Japan famous for?", "What is Korea famous for?", "What is the USA famous for?", "What is the UK famous for?", "What is Spain famous for?", "What is South Africa famous for?", "What is Argentina famous for?", "Which country is famous for xiao long bao?", "Which country is famous for sushi?", "Which country is famous for kimchi?", "Which country is famous for burgers?", "Which country is famous for Fish and Chips?", "Which country is famous for paella?", "Which country is famous for bunny chow?", "Which country is famous for empanadas?", "What is this country famous for?", "Which country is famous for this food?", "Is this correct?", "Which food is missing?", "Which country is missing?", "Say the full sentence aloud.", "Japan is famous for sushi.", "Korea is famous for kimchi.", "The USA is famous for burgers.", "The UK is famous for Fish and Chips.", "Spain is famous for paella.", "South Africa is famous for bunny chow.", "Argentina is famous for empanadas.", "Taiwan is famous for blank.", "Japan is famous for blank.", "Korea is famous for blank.", "The USA is famous for blank.", "The UK is famous for blank.", "Spain is famous for blank.", "South Africa is famous for blank.", "Argentina is famous for blank.", "Blank is famous for xiao long bao.", "Blank is famous for sushi.", "Blank is famous for kimchi.", "Blank is famous for burgers.", "Blank is famous for Fish and Chips.", "Blank is famous for paella.", "Blank is famous for bunny chow.", "Blank is famous for empanadas.", "Is this correct? Taiwan plus sushi.", "Is this correct? Taiwan plus kimchi.", "Is this correct? Taiwan plus burgers.", "Is this correct? Taiwan plus Fish and Chips.", "Is this correct? Taiwan plus paella.", "Is this correct? Taiwan plus bunny chow.", "Is this correct? Taiwan plus empanadas.", "Is this correct? Japan plus xiao long bao.", "Is this correct? Japan plus kimchi.", "Is this correct? Japan plus burgers.", "Is this correct? Japan plus Fish and Chips.", "Is this correct? Japan plus paella.", "Is this correct? Japan plus bunny chow.", "Is this correct? Japan plus empanadas.", "Is this correct? Korea plus xiao long bao.", "Is this correct? Korea plus sushi.", "Is this correct? Korea plus burgers.", "Is this correct? Korea plus Fish and Chips.", "Is this correct? Korea plus paella.", "Is this correct? Korea plus bunny chow.", "Is this correct? Korea plus empanadas.", "Is this correct? The USA plus xiao long bao.", "Is this correct? The USA plus sushi.", "Is this correct? The USA plus kimchi.", "Is this correct? The USA plus Fish and Chips.", "Is this correct? The USA plus paella.", "Is this correct? The USA plus bunny chow.", "Is this correct? The USA plus empanadas.", "Is this correct? The UK plus xiao long bao.", "Is this correct? The UK plus sushi.", "Is this correct? The UK plus kimchi.", "Is this correct? The UK plus burgers.", "Is this correct? The UK plus paella.", "Is this correct? The UK plus bunny chow.", "Is this correct? The UK plus empanadas.", "Is this correct? Spain plus xiao long bao.", "Is this correct? Spain plus sushi.", "Is this correct? Spain plus kimchi.", "Is this correct? Spain plus burgers.", "Is this correct? Spain plus Fish and Chips.", "Is this correct? Spain plus bunny chow.", "Is this correct? Spain plus empanadas.", "Is this correct? South Africa plus xiao long bao.", "Is this correct? South Africa plus sushi.", "Is this correct? South Africa plus kimchi.", "Is this correct? South Africa plus burgers.", "Is this correct? South Africa plus Fish and Chips.", "Is this correct? South Africa plus paella.", "Is this correct? South Africa plus empanadas.", "Is this correct? Argentina plus xiao long bao.", "Is this correct? Argentina plus sushi.", "Is this correct? Argentina plus kimchi.", "Is this correct? Argentina plus burgers.", "Is this correct? Argentina plus Fish and Chips.", "Is this correct? Argentina plus paella.", "Is this correct? Argentina plus bunny chow.", "One.", "Two.", "Three.", "Four.", "Five.", "Six.", "Correct.", "Wrong.", "Wrong. Try again.", "Your turn.", "Next player.", "Airport gate.", "Choose your route.", "Safe route.", "Fast route.", "Passport challenge.", "Detective challenge.", "Customs check.", "Finish.", "You win."];
const MY_VOICE_CUES={"1":{"start":0.0,"duration":1.256},"2":{"start":1.256,"duration":1.817},"3":{"start":3.073,"duration":2.685},"4":{"start":5.758,"duration":1.424},"5":{"start":7.182,"duration":1.725},"6":{"start":8.907,"duration":3.501},"7":{"start":12.408,"duration":3.838},"8":{"start":16.246,"duration":3.458},"9":{"start":19.704,"duration":3.857},"10":{"start":23.561,"duration":2.547},"11":{"start":26.108,"duration":1.916},"12":{"start":28.024,"duration":2.391},"13":{"start":30.415,"duration":2.508},"14":{"start":32.923,"duration":2.773},"15":{"start":35.696,"duration":2.572},"16":{"start":38.268,"duration":1.804},"17":{"start":40.072,"duration":2.687},"18":{"start":42.759,"duration":2.11},"19":{"start":44.869,"duration":3.829},"20":{"start":48.698,"duration":2.568},"21":{"start":51.266,"duration":3.215},"22":{"start":54.481,"duration":3.125},"23":{"start":57.606,"duration":2.883},"24":{"start":60.489,"duration":4.835},"25":{"start":65.324,"duration":3.858},"26":{"start":69.182,"duration":2.991},"27":{"start":72.173,"duration":2.642},"28":{"start":74.815,"duration":2.32},"29":{"start":77.135,"duration":2.352},"30":{"start":79.487,"duration":2.187},"31":{"start":81.674,"duration":2.549},"32":{"start":84.223,"duration":1.634},"33":{"start":85.857,"duration":2.628},"34":{"start":88.485,"duration":2.508},"35":{"start":90.993,"duration":3.278},"36":{"start":94.271,"duration":1.364},"37":{"start":95.635,"duration":1.349},"38":{"start":96.984,"duration":1.546},"39":{"start":98.53,"duration":1.423},"40":{"start":99.953,"duration":1.248},"41":{"start":101.201,"duration":1.725},"42":{"start":102.926,"duration":1.607},"43":{"start":104.533,"duration":2.121},"44":{"start":106.654,"duration":1.76},"45":{"start":108.414,"duration":1.875},"46":{"start":110.289,"duration":1.712},"47":{"start":112.001,"duration":2.086},"48":{"start":114.087,"duration":1.654},"49":{"start":115.741,"duration":2.026},"50":{"start":117.767,"duration":2.012},"51":{"start":119.779,"duration":1.563},"52":{"start":121.342,"duration":1.8},"53":{"start":123.142,"duration":0.632},"54":{"start":123.774,"duration":0.926},"55":{"start":124.7,"duration":1.195},"56":{"start":125.895,"duration":1.261},"57":{"start":127.156,"duration":1.498},"58":{"start":128.654,"duration":1.465},"59":{"start":130.119,"duration":1.633},"60":{"start":131.752,"duration":1.848},"61":{"start":133.6,"duration":1.245},"62":{"start":134.845,"duration":2.102},"63":{"start":136.947,"duration":2.044},"64":{"start":138.991,"duration":1.332},"65":{"start":140.323,"duration":1.364},"66":{"start":141.687,"duration":1.364},"67":{"start":143.051,"duration":1.549},"68":{"start":144.6,"duration":1.388},"69":{"start":145.988,"duration":1.181},"70":{"start":147.169,"duration":1.766},"71":{"start":148.935,"duration":1.704},"72":{"start":150.639,"duration":1.709},"73":{"start":152.348,"duration":1.478},"74":{"start":153.826,"duration":1.495},"75":{"start":155.321,"duration":1.436},"76":{"start":156.757,"duration":1.735},"77":{"start":158.492,"duration":1.379},"78":{"start":159.871,"duration":1.669},"79":{"start":161.54,"duration":1.695},"80":{"start":163.235,"duration":2.409},"81":{"start":165.644,"duration":2.444},"82":{"start":168.088,"duration":2.396},"83":{"start":170.484,"duration":2.694},"84":{"start":173.178,"duration":2.354},"85":{"start":175.532,"duration":2.615},"86":{"start":178.147,"duration":2.624},"87":{"start":180.771,"duration":2.718},"88":{"start":183.489,"duration":2.457},"89":{"start":185.946,"duration":2.476},"90":{"start":188.422,"duration":2.712},"91":{"start":191.134,"duration":2.355},"92":{"start":193.489,"duration":2.637},"93":{"start":196.126,"duration":2.673},"94":{"start":198.799,"duration":2.594},"95":{"start":201.393,"duration":2.395},"96":{"start":203.788,"duration":2.273},"97":{"start":206.061,"duration":2.628},"98":{"start":208.689,"duration":2.273},"99":{"start":210.962,"duration":2.58},"100":{"start":213.542,"duration":2.597},"101":{"start":216.139,"duration":2.865},"102":{"start":219.004,"duration":2.58},"103":{"start":221.584,"duration":2.617},"104":{"start":224.201,"duration":2.891},"105":{"start":227.092,"duration":2.477},"106":{"start":229.569,"duration":2.778},"107":{"start":232.347,"duration":2.819},"108":{"start":235.166,"duration":2.753},"109":{"start":237.919,"duration":2.455},"110":{"start":240.374,"duration":2.432},"111":{"start":242.806,"duration":2.417},"112":{"start":245.223,"duration":2.436},"113":{"start":247.659,"duration":2.706},"114":{"start":250.365,"duration":2.757},"115":{"start":253.122,"duration":2.588},"116":{"start":255.71,"duration":2.344},"117":{"start":258.054,"duration":2.395},"118":{"start":260.449,"duration":2.319},"119":{"start":262.768,"duration":2.626},"120":{"start":265.394,"duration":2.547},"121":{"start":267.941,"duration":2.564},"122":{"start":270.505,"duration":3.019},"123":{"start":273.524,"duration":2.808},"124":{"start":276.332,"duration":2.871},"125":{"start":279.203,"duration":2.745},"126":{"start":281.948,"duration":3.049},"127":{"start":284.997,"duration":2.73},"128":{"start":287.727,"duration":3.098},"129":{"start":290.825,"duration":2.934},"130":{"start":293.759,"duration":2.63},"131":{"start":296.389,"duration":2.696},"132":{"start":299.085,"duration":2.627},"133":{"start":301.712,"duration":2.949},"134":{"start":304.661,"duration":2.6},"135":{"start":307.261,"duration":2.995},"136":{"start":310.256,"duration":0.253},"137":{"start":310.509,"duration":0.224},"138":{"start":310.733,"duration":0.252},"139":{"start":310.985,"duration":0.262},"140":{"start":311.247,"duration":0.258},"141":{"start":311.505,"duration":0.189},"142":{"start":311.694,"duration":0.2},"143":{"start":311.894,"duration":0.279},"144":{"start":312.173,"duration":1.462},"145":{"start":313.635,"duration":0.5},"146":{"start":314.135,"duration":0.679},"147":{"start":314.814,"duration":0.713},"148":{"start":315.527,"duration":0.612},"149":{"start":316.139,"duration":0.469},"150":{"start":316.608,"duration":0.515},"151":{"start":317.123,"duration":0.852},"152":{"start":317.975,"duration":0.933},"153":{"start":318.908,"duration":0.664},"154":{"start":319.572,"duration":0.484},"155":{"start":320.056,"duration":0.483}};
const MY_VOICE_SPRITE='../audio/my-voice-sprite.mp3';
const MY_VOICE_ALIASES={"dice_1":136,"dice_2":137,"dice_3":138,"dice_4":139,"dice_5":140,"dice_6":141,"correct":142,"wrong":143,"wrong_try_again":144,"your_turn":145,"next_player":146,"airport_gate":147,"choose_route":148,"safe_route":149,"fast_route":150,"passport_challenge":151,"detective_challenge":152,"customs_check":153,"finish":154,"you_win":155};

const JiaVoice=(()=>{
 let audio=null, stopTimer=null, warmPromise=null;
 let ctx=null, buffer=null, source=null;
 const norm=s=>(s||'').toLowerCase().replace(/\+/g,' plus ').replace(/_+/g,'blank').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
 const map=new Map(MY_VOICE_TEXTS.map((t,i)=>[norm(t),i+1]));
 function ensureAudio(){
   if(audio)return audio;
   audio=new Audio(); audio.preload='auto'; audio.playsInline=true; audio.src=MY_VOICE_SPRITE;
   try{audio.load();}catch(e){}
   return audio;
 }
 function warm(){
   if(warmPromise)return warmPromise;
   if(location.protocol==='file:'){ensureAudio(); warmPromise=Promise.resolve(false); return warmPromise;}
   warmPromise=fetch(MY_VOICE_SPRITE,{cache:'force-cache'})
     .then(r=>{if(!r.ok)throw new Error('Voice sprite load failed');return r.arrayBuffer();})
     .then(ab=>{
       const C=window.AudioContext||window.webkitAudioContext;
       if(!C)throw new Error('Web Audio unavailable');
       ctx=ctx||new C();
       return ctx.decodeAudioData(ab.slice(0));
     })
     .then(b=>{buffer=b;return true;})
     .catch(e=>{console.warn('WebAudio preload fallback:',e);ensureAudio();return false;});
   return warmPromise;
 }
 function stop(){
   if(stopTimer){clearTimeout(stopTimer);stopTimer=null;}
   if(source){try{source.stop();}catch(e){} source=null;}
   if(audio){try{audio.pause();}catch(e){}}
 }
 function playBuffer(cue,onEnd){
   stop();
   if(ctx&&ctx.state==='suspended')ctx.resume();
   source=ctx.createBufferSource(); source.buffer=buffer; source.connect(ctx.destination);
   let finished=false;
   const done=()=>{if(finished)return;finished=true;source=null;if(onEnd)onEnd();};
   source.onended=done;
   source.start(0,Math.max(0,cue.start),Math.max(.05,cue.duration));
   return true;
 }
 function playHtml(cue,onEnd){
   const a=ensureAudio(); stop();
   try{a.currentTime=Math.max(0,cue.start);}catch(e){}
   const p=a.play(); if(p&&p.catch)p.catch(err=>console.warn('Voice play blocked:',err));
   stopTimer=setTimeout(()=>{try{a.pause();}catch(e){}stopTimer=null;if(onEnd)onEnd();},Math.max(80,(cue.duration+0.04)*1000));
   return true;
 }
 function playIndex(key,onEnd){
   const cue=MY_VOICE_CUES[String(key)]; if(!cue){if(onEnd)onEnd();return false;}
   if(buffer&&ctx)return playBuffer(cue,onEnd);
   if(location.protocol==='file:')return playHtml(cue,onEnd);
   warm().then(ok=>{if(ok&&buffer&&ctx)playBuffer(cue,onEnd);else playHtml(cue,onEnd);});
   return true;
 }
 function play(key,onEnd){return playIndex((typeof MY_VOICE_ALIASES!=='undefined'&&MY_VOICE_ALIASES[key])||key,onEnd);}
 function speak(text,onEnd){const key=map.get(norm(text));if(!key){console.warn('Missing prerecorded voice:',text);if(onEnd)onEnd();return false;}return playIndex(key,onEnd);}
 function sequence(keys){const q=[...keys];const next=()=>{const k=q.shift();if(k)play(k,next);};next();}
 return {warm,play,speak,stop,sequence,playIndex};
})();

function speak(text){
 if(!state.tts||!text)return;
 JiaVoice.speak(text);
}
function warmSpeech(){JiaVoice.warm();}
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
