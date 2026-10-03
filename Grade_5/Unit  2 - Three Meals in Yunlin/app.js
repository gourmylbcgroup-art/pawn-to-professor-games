
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let currentWeek=4, slideIndex=0, quizIndex=0, speakIndex=0, soundOn=true;
const weekSlides={4:[1,2,3,4,5,6,7,8,9,10,11],5:[12,13,14,15,16,17,18,19,20,21,22],6:[23,24,25,26,27,28,29,30,31,32,33,34,35]};
const weekMeta={
 4:{name:'Passport Rookie',focus:'Recognize, match, and build the complete sentence.',visual:'assets/slides/slide_10.webp',goals:['Review the five core countries and famous foods.','Use “What is _____ famous for?”','Answer with “_____ is famous for _____.”','Match country + food and speak before earning progress.'],flow:['Warm-up','Countries + food','Presentation','Match & say','Oral check']},
 5:{name:'Secret Route',focus:'Recall with less support, ask and answer, then add three new destinations.',visual:'assets/cards/newdest.webp',goals:['Recall the original five from pictures.','Correct wrong matches and reverse clues.','Add Spain-paella, South Africa-bunny chow, Argentina-empanadas.','Complete the Secret Match Mission with a partner.'],flow:['Food flash','Q&A review','Picture challenge','New countries','Secret Match']},
 6:{name:'Detective Race',focus:'Solve visual clues and produce full sentences independently.',visual:'assets/cards/detective.webp',goals:['Identify mystery country or food clues.','Correct wrong pairs.','Complete missing country / missing food tasks.','Use all eight pairs before the Amazing Food Race.'],flow:['Detective warm-up','Mystery clues','Wrong pair','Fast Eight','Food Race']}
};
const items=[
 {id:'taiwan',country:'Taiwan',food:'xiao long bao',img:'assets/cards/taiwan.webp'},
 {id:'japan',country:'Japan',food:'sushi',img:'assets/cards/japan.webp'},
 {id:'korea',country:'Korea',food:'kimchi',img:'assets/cards/korea.webp'},
 {id:'usa',country:'The USA',food:'burgers',img:'assets/cards/usa.webp'},
 {id:'uk',country:'The UK',food:'Fish and Chips',img:'assets/cards/uk.webp'},
 {id:'spain',country:'Spain',food:'paella',img:'assets/cards/spain.webp'},
 {id:'southafrica',country:'South Africa',food:'bunny chow',img:'assets/cards/southafrica.webp'},
 {id:'argentina',country:'Argentina',food:'empanadas',img:'assets/cards/argentina.webp'}
];
const slideCues={1:'Famous Food Around the World.',2:'What food do you know? I see...',3:'Meet the countries. Point and say the country.',4:'What is Taiwan famous for?',5:'Taiwan is famous for xiao long bao.',6:'What is Japan famous for? Japan is famous for sushi.',7:'What is the USA famous for? The USA is famous for burgers.',8:'What is Korea famous for? Korea is famous for kimchi.',9:'What is the UK famous for? The UK is famous for Fish and Chips.',10:'Connect the five. Match and say the sentence.',11:'Mission one. Match and say.',12:'Food flash review. Look and say the food.',13:'Country review. Point and say the country.',14:'Ask the question. What is blank famous for?',15:'Say the answer. Blank is famous for blank.',16:'Wrong match. Right or wrong?',17:'Picture only challenge. Say the full sentence.',18:'Reverse challenge. Which country?',19:'New destinations: Spain, South Africa, Argentina.',20:'Secret Match Mission. Find your partner.',21:'New famous foods: paella, bunny chow, empanadas.',22:'Eight-country challenge. Ask and answer with a partner.',23:'Famous Food Detectives. Can you solve the mystery?',24:'Detective mission rules. Look. Think. Match. Say.',25:'Mystery country. Which country? What is it famous for?',26:'Mystery food. Which country is famous for this?',27:'Partial picture. Guess the country and the food.',28:'Wrong pair detective. Right or wrong?',29:'Wrong pair detective. Correct the pair.',30:'Missing food. Choose the correct food.',31:'Missing country. Choose the correct country.',32:'Ready? Start the race.',33:'Fast Eight. Point fast and say the food.',34:'Ask your team. Change speaker each turn.',35:'The Amazing Food Race. Get ready to race around the world.'};

const AudioFX={ctx:null,init(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume()},tone(freq=440,dur=.09,type='sine',gain=.045){if(!soundOn)return;this.init();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+dur);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+dur)},click(){this.tone(520,.055,'triangle')},good(){this.tone(620,.09);setTimeout(()=>this.tone(820,.11),90)},bad(){this.tone(190,.16,'sawtooth',.025)}};

const MY_VOICE_TEXTS=["Famous Food Around the World.", "What food do you know? I see...", "Meet the countries. Point and say the country.", "What is Taiwan famous for?", "Taiwan is famous for xiao long bao.", "What is Japan famous for? Japan is famous for sushi.", "What is the USA famous for? The USA is famous for burgers.", "What is Korea famous for? Korea is famous for kimchi.", "What is the UK famous for? The UK is famous for Fish and Chips.", "Connect the five. Match and say the sentence.", "Mission one. Match and say.", "Food flash review. Look and say the food.", "Country review. Point and say the country.", "Ask the question. What is blank famous for?", "Say the answer. Blank is famous for blank.", "Wrong match. Right or wrong?", "Picture only challenge. Say the full sentence.", "Reverse challenge. Which country?", "New destinations: Spain, South Africa, Argentina.", "Secret Match Mission. Find your partner.", "New famous foods: paella, bunny chow, empanadas.", "Eight-country challenge. Ask and answer with a partner.", "Famous Food Detectives. Can you solve the mystery?", "Detective mission rules. Look. Think. Match. Say.", "Mystery country. Which country? What is it famous for?", "Mystery food. Which country is famous for this?", "Partial picture. Guess the country and the food.", "Wrong pair detective. Right or wrong?", "Wrong pair detective. Correct the pair.", "Missing food. Choose the correct food.", "Missing country. Choose the correct country.", "Ready? Start the race.", "Fast Eight. Point fast and say the food.", "Ask your team. Change speaker each turn.", "The Amazing Food Race. Get ready to race around the world.", "What is Japan famous for?", "What is Korea famous for?", "What is the USA famous for?", "What is the UK famous for?", "What is Spain famous for?", "What is South Africa famous for?", "What is Argentina famous for?", "Which country is famous for xiao long bao?", "Which country is famous for sushi?", "Which country is famous for kimchi?", "Which country is famous for burgers?", "Which country is famous for Fish and Chips?", "Which country is famous for paella?", "Which country is famous for bunny chow?", "Which country is famous for empanadas?", "What is this country famous for?", "Which country is famous for this food?", "Is this correct?", "Which food is missing?", "Which country is missing?", "Say the full sentence aloud.", "Japan is famous for sushi.", "Korea is famous for kimchi.", "The USA is famous for burgers.", "The UK is famous for Fish and Chips.", "Spain is famous for paella.", "South Africa is famous for bunny chow.", "Argentina is famous for empanadas.", "Taiwan is famous for blank.", "Japan is famous for blank.", "Korea is famous for blank.", "The USA is famous for blank.", "The UK is famous for blank.", "Spain is famous for blank.", "South Africa is famous for blank.", "Argentina is famous for blank.", "Blank is famous for xiao long bao.", "Blank is famous for sushi.", "Blank is famous for kimchi.", "Blank is famous for burgers.", "Blank is famous for Fish and Chips.", "Blank is famous for paella.", "Blank is famous for bunny chow.", "Blank is famous for empanadas.", "Is this correct? Taiwan plus sushi.", "Is this correct? Taiwan plus kimchi.", "Is this correct? Taiwan plus burgers.", "Is this correct? Taiwan plus Fish and Chips.", "Is this correct? Taiwan plus paella.", "Is this correct? Taiwan plus bunny chow.", "Is this correct? Taiwan plus empanadas.", "Is this correct? Japan plus xiao long bao.", "Is this correct? Japan plus kimchi.", "Is this correct? Japan plus burgers.", "Is this correct? Japan plus Fish and Chips.", "Is this correct? Japan plus paella.", "Is this correct? Japan plus bunny chow.", "Is this correct? Japan plus empanadas.", "Is this correct? Korea plus xiao long bao.", "Is this correct? Korea plus sushi.", "Is this correct? Korea plus burgers.", "Is this correct? Korea plus Fish and Chips.", "Is this correct? Korea plus paella.", "Is this correct? Korea plus bunny chow.", "Is this correct? Korea plus empanadas.", "Is this correct? The USA plus xiao long bao.", "Is this correct? The USA plus sushi.", "Is this correct? The USA plus kimchi.", "Is this correct? The USA plus Fish and Chips.", "Is this correct? The USA plus paella.", "Is this correct? The USA plus bunny chow.", "Is this correct? The USA plus empanadas.", "Is this correct? The UK plus xiao long bao.", "Is this correct? The UK plus sushi.", "Is this correct? The UK plus kimchi.", "Is this correct? The UK plus burgers.", "Is this correct? The UK plus paella.", "Is this correct? The UK plus bunny chow.", "Is this correct? The UK plus empanadas.", "Is this correct? Spain plus xiao long bao.", "Is this correct? Spain plus sushi.", "Is this correct? Spain plus kimchi.", "Is this correct? Spain plus burgers.", "Is this correct? Spain plus Fish and Chips.", "Is this correct? Spain plus bunny chow.", "Is this correct? Spain plus empanadas.", "Is this correct? South Africa plus xiao long bao.", "Is this correct? South Africa plus sushi.", "Is this correct? South Africa plus kimchi.", "Is this correct? South Africa plus burgers.", "Is this correct? South Africa plus Fish and Chips.", "Is this correct? South Africa plus paella.", "Is this correct? South Africa plus empanadas.", "Is this correct? Argentina plus xiao long bao.", "Is this correct? Argentina plus sushi.", "Is this correct? Argentina plus kimchi.", "Is this correct? Argentina plus burgers.", "Is this correct? Argentina plus Fish and Chips.", "Is this correct? Argentina plus paella.", "Is this correct? Argentina plus bunny chow.", "One.", "Two.", "Three.", "Four.", "Five.", "Six.", "Correct.", "Wrong.", "Wrong. Try again.", "Your turn.", "Next player.", "Airport gate.", "Choose your route.", "Safe route.", "Fast route.", "Passport challenge.", "Detective challenge.", "Customs check.", "Finish.", "You win."];
const MY_VOICE_CUES={"1":{"start":0.0,"duration":1.256},"2":{"start":1.256,"duration":1.817},"3":{"start":3.073,"duration":2.685},"4":{"start":5.758,"duration":1.424},"5":{"start":7.182,"duration":1.725},"6":{"start":8.907,"duration":3.501},"7":{"start":12.408,"duration":3.838},"8":{"start":16.246,"duration":3.458},"9":{"start":19.704,"duration":3.857},"10":{"start":23.561,"duration":2.547},"11":{"start":26.108,"duration":1.916},"12":{"start":28.024,"duration":2.391},"13":{"start":30.415,"duration":2.508},"14":{"start":32.923,"duration":2.773},"15":{"start":35.696,"duration":2.572},"16":{"start":38.268,"duration":1.804},"17":{"start":40.072,"duration":2.687},"18":{"start":42.759,"duration":2.11},"19":{"start":44.869,"duration":3.829},"20":{"start":48.698,"duration":2.568},"21":{"start":51.266,"duration":3.215},"22":{"start":54.481,"duration":3.125},"23":{"start":57.606,"duration":2.883},"24":{"start":60.489,"duration":4.835},"25":{"start":65.324,"duration":3.858},"26":{"start":69.182,"duration":2.991},"27":{"start":72.173,"duration":2.642},"28":{"start":74.815,"duration":2.32},"29":{"start":77.135,"duration":2.352},"30":{"start":79.487,"duration":2.187},"31":{"start":81.674,"duration":2.549},"32":{"start":84.223,"duration":1.634},"33":{"start":85.857,"duration":2.628},"34":{"start":88.485,"duration":2.508},"35":{"start":90.993,"duration":3.278},"36":{"start":94.271,"duration":1.364},"37":{"start":95.635,"duration":1.349},"38":{"start":96.984,"duration":1.546},"39":{"start":98.53,"duration":1.423},"40":{"start":99.953,"duration":1.248},"41":{"start":101.201,"duration":1.725},"42":{"start":102.926,"duration":1.607},"43":{"start":104.533,"duration":2.121},"44":{"start":106.654,"duration":1.76},"45":{"start":108.414,"duration":1.875},"46":{"start":110.289,"duration":1.712},"47":{"start":112.001,"duration":2.086},"48":{"start":114.087,"duration":1.654},"49":{"start":115.741,"duration":2.026},"50":{"start":117.767,"duration":2.012},"51":{"start":119.779,"duration":1.563},"52":{"start":121.342,"duration":1.8},"53":{"start":123.142,"duration":0.632},"54":{"start":123.774,"duration":0.926},"55":{"start":124.7,"duration":1.195},"56":{"start":125.895,"duration":1.261},"57":{"start":127.156,"duration":1.498},"58":{"start":128.654,"duration":1.465},"59":{"start":130.119,"duration":1.633},"60":{"start":131.752,"duration":1.848},"61":{"start":133.6,"duration":1.245},"62":{"start":134.845,"duration":2.102},"63":{"start":136.947,"duration":2.044},"64":{"start":138.991,"duration":1.332},"65":{"start":140.323,"duration":1.364},"66":{"start":141.687,"duration":1.364},"67":{"start":143.051,"duration":1.549},"68":{"start":144.6,"duration":1.388},"69":{"start":145.988,"duration":1.181},"70":{"start":147.169,"duration":1.766},"71":{"start":148.935,"duration":1.704},"72":{"start":150.639,"duration":1.709},"73":{"start":152.348,"duration":1.478},"74":{"start":153.826,"duration":1.495},"75":{"start":155.321,"duration":1.436},"76":{"start":156.757,"duration":1.735},"77":{"start":158.492,"duration":1.379},"78":{"start":159.871,"duration":1.669},"79":{"start":161.54,"duration":1.695},"80":{"start":163.235,"duration":2.409},"81":{"start":165.644,"duration":2.444},"82":{"start":168.088,"duration":2.396},"83":{"start":170.484,"duration":2.694},"84":{"start":173.178,"duration":2.354},"85":{"start":175.532,"duration":2.615},"86":{"start":178.147,"duration":2.624},"87":{"start":180.771,"duration":2.718},"88":{"start":183.489,"duration":2.457},"89":{"start":185.946,"duration":2.476},"90":{"start":188.422,"duration":2.712},"91":{"start":191.134,"duration":2.355},"92":{"start":193.489,"duration":2.637},"93":{"start":196.126,"duration":2.673},"94":{"start":198.799,"duration":2.594},"95":{"start":201.393,"duration":2.395},"96":{"start":203.788,"duration":2.273},"97":{"start":206.061,"duration":2.628},"98":{"start":208.689,"duration":2.273},"99":{"start":210.962,"duration":2.58},"100":{"start":213.542,"duration":2.597},"101":{"start":216.139,"duration":2.865},"102":{"start":219.004,"duration":2.58},"103":{"start":221.584,"duration":2.617},"104":{"start":224.201,"duration":2.891},"105":{"start":227.092,"duration":2.477},"106":{"start":229.569,"duration":2.778},"107":{"start":232.347,"duration":2.819},"108":{"start":235.166,"duration":2.753},"109":{"start":237.919,"duration":2.455},"110":{"start":240.374,"duration":2.432},"111":{"start":242.806,"duration":2.417},"112":{"start":245.223,"duration":2.436},"113":{"start":247.659,"duration":2.706},"114":{"start":250.365,"duration":2.757},"115":{"start":253.122,"duration":2.588},"116":{"start":255.71,"duration":2.344},"117":{"start":258.054,"duration":2.395},"118":{"start":260.449,"duration":2.319},"119":{"start":262.768,"duration":2.626},"120":{"start":265.394,"duration":2.547},"121":{"start":267.941,"duration":2.564},"122":{"start":270.505,"duration":3.019},"123":{"start":273.524,"duration":2.808},"124":{"start":276.332,"duration":2.871},"125":{"start":279.203,"duration":2.745},"126":{"start":281.948,"duration":3.049},"127":{"start":284.997,"duration":2.73},"128":{"start":287.727,"duration":3.098},"129":{"start":290.825,"duration":2.934},"130":{"start":293.759,"duration":2.63},"131":{"start":296.389,"duration":2.696},"132":{"start":299.085,"duration":2.627},"133":{"start":301.712,"duration":2.949},"134":{"start":304.661,"duration":2.6},"135":{"start":307.261,"duration":2.995},"136":{"start":310.256,"duration":0.253},"137":{"start":310.509,"duration":0.224},"138":{"start":310.733,"duration":0.252},"139":{"start":310.985,"duration":0.262},"140":{"start":311.247,"duration":0.258},"141":{"start":311.505,"duration":0.189},"142":{"start":311.694,"duration":0.2},"143":{"start":311.894,"duration":0.279},"144":{"start":312.173,"duration":1.462},"145":{"start":313.635,"duration":0.5},"146":{"start":314.135,"duration":0.679},"147":{"start":314.814,"duration":0.713},"148":{"start":315.527,"duration":0.612},"149":{"start":316.139,"duration":0.469},"150":{"start":316.608,"duration":0.515},"151":{"start":317.123,"duration":0.852},"152":{"start":317.975,"duration":0.933},"153":{"start":318.908,"duration":0.664},"154":{"start":319.572,"duration":0.484},"155":{"start":320.056,"duration":0.483}};
const MY_VOICE_SPRITE='audio/my-voice-sprite.mp3';

const MyVoice=(()=>{
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

function speak(text){if(!soundOn||!text)return;MyVoice.speak(text);}
function warmAudio(){AudioFX.init();MyVoice.warm();}

MyVoice.warm();
document.addEventListener('pointerdown',()=>warmAudio(),{once:true});
function show(id){
 $$('.screen').forEach(x=>x.classList.remove('active'));
 $('#'+id).classList.add('active');
 window.scrollTo({top:0,behavior:'smooth'});
 AudioFX.click();

 if(id==='start'){tabs();renderStart();}
 if(id==='learn'){tabs();renderSlide();}
 if(id==='play'){tabs();makeQuiz();}
 if(id==='practice'){tabs();renderFlash();}
 if(id==='speak'){tabs();renderSpeak();}
 if(id==='finish'){tabs();renderFinish();}

 if(id==='game'){
   const f=$('#gameFrame');
   if(f && f.dataset.src && (f.getAttribute('src')==='about:blank' || !f.getAttribute('src'))){
     f.src=f.dataset.src;
   }
 }
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.go)));
$('#homeBtn').onclick=()=>show('home');$('#fullBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇';if(!soundOn)MyVoice.stop();};$('#reloadGame').onclick=()=>{const f=$('#gameFrame');f.src='game/index.html?'+Date.now()};

function tabs(){['start','learn','play','practice','speak','finish'].forEach(sec=>{const box=document.querySelector(`[data-tabs="${sec}"]`);if(!box)return;box.innerHTML=[4,5,6].map(w=>`<button class="tab ${w===currentWeek?'active':''}" data-week="${w}">Week ${w} · ${weekMeta[w].name}</button>`).join('');box.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{currentWeek=+t.dataset.week;slideIndex=0;quizIndex=0;speakIndex=0;tabs();AudioFX.click();});});}
function renderStart(){const m=weekMeta[currentWeek];$('#startContent').innerHTML=`<div class="overview-card"><div class="quiz-kicker">WEEK ${currentWeek}</div><h2>${m.name}</h2><p><b>${m.focus}</b></p><ul>${m.goals.map(g=>`<li>${g}</li>`).join('')}</ul><div class="flow-row">${m.flow.map((f,i)=>`<div class="flow-step"><b>${i+1}</b>${f}</div>`).join('')}</div></div><div class="overview-visual"><img src="${m.visual}" alt="Week ${currentWeek}"></div>`;}
function renderSlide(){const arr=weekSlides[currentWeek];slideIndex=Math.max(0,Math.min(slideIndex,arr.length-1));const n=arr[slideIndex];$('#slideImg').src=`assets/slides/slide_${String(n).padStart(2,'0')}.webp`;$('#slideWeek').textContent=`Week ${currentWeek} · ${weekMeta[currentWeek].name}`;$('#slideCount').textContent=`Slide ${n} · ${slideIndex+1} of ${arr.length}`;$('#slideCue').textContent=slideCues[n]||'Look, listen, and respond.';}
$('#prevSlide').onclick=()=>{slideIndex--;renderSlide();AudioFX.click()};$('#nextSlide').onclick=()=>{slideIndex++;renderSlide();AudioFX.click()};$('#readSlideBtn').onclick=()=>speak($('#slideCue').textContent);

function weekPool(){return currentWeek===4?items.slice(0,5):items;}
function makeQuiz(){const pool=weekPool();const target=pool[quizIndex%pool.length];let mode=currentWeek===6?(quizIndex%2?'food':'country'):'country';let q,correct,visual;
 if(mode==='country'){q=`What is ${target.country} famous for?`;correct=target.food;visual=target.img;} else {q=`Which country is famous for ${target.food}?`;correct=target.country;visual=target.img;}
 const wrong=pool.filter(x=>x.id!==target.id).sort(()=>.5-Math.random()).slice(0,2).map(x=>mode==='country'?x.food:x.country);const opts=[correct,...wrong].sort(()=>.5-Math.random());
 $('#quizKicker').textContent=`Week ${currentWeek} · ${weekMeta[currentWeek].name}`;$('#quizQuestion').textContent=q;$('#quizImage').src=visual;$('#quizFeedback').textContent='';$('#quizAnswers').innerHTML=opts.map(o=>{const obj=items.find(x=>(mode==='country'?x.food:x.country)===o);return `<button class="answer" data-answer="${o.replaceAll('"','&quot;')}"><img src="${obj?obj.img:visual}" alt=""><span>${o}</span></button>`}).join('');
 $$('#quizAnswers .answer').forEach(b=>b.onclick=()=>{if(b.dataset.answer===correct){b.classList.add('correct');$('#quizFeedback').textContent='✓ Correct!';AudioFX.good();speak('Correct.')}else{b.classList.add('wrong');$('#quizFeedback').textContent='✕ Wrong. Try again.';AudioFX.bad();speak('Wrong. Try again.');b.disabled=true}});$('#repeatQuiz').onclick=()=>speak(q);
}
$('#nextQuiz').onclick=()=>{quizIndex++;makeQuiz();AudioFX.click()};
function renderFlash(){const pool=weekPool();$('#flashGrid').innerHTML=pool.map(x=>`<button class="flash" data-id="${x.id}"><img src="${x.img}" alt="${x.country} ${x.food}"><strong>${x.country}</strong><small>${x.food}</small></button>`).join('');$$('#flashGrid .flash').forEach(b=>b.onclick=()=>{const x=items.find(i=>i.id===b.dataset.id);AudioFX.click();speak(`${x.country} is famous for ${x.food}.`)})}
function renderSpeak(){const pool=weekPool();const x=pool[speakIndex%pool.length];$('#speakImage').src=x.img;$('#speakQuestion').textContent=`What is ${x.country} famous for?`;$('#speakFrame').textContent=`${x.country} is famous for _____.`;$('#speakAnswer').textContent=`${x.country} is famous for ${x.food}.`;$('#speakAnswer').classList.add('hidden');$('#hearSpeak').onclick=()=>speak(`What is ${x.country} famous for?`);$('#revealSpeak').onclick=()=>{$('#speakAnswer').classList.remove('hidden');speak(`${x.country} is famous for ${x.food}.`)};}
$('#nextSpeak').onclick=()=>{speakIndex++;renderSpeak();AudioFX.click()};
function renderFinish(){const cards=currentWeek===4?[['🧭','Recognize','Match the five core countries and foods.'],['💬','Speak','Use the full sentence pattern.'],['✅','Ready','Collect at least three passport stamps in the race.']]:currentWeek===5?[['🕵️','Recall','Use pictures with less written support.'],['🗣️','Partner','Ask and answer before choosing a route.'],['✈️','Challenge','Try at least one Fast Route in the race.']]:[['🔎','Detect','Solve mystery and missing-word clues.'],['🔁','Correct','Fix wrong country-food pairs.'],['🛂','Customs','Pass the final Customs Check before the finish.']];$('#finishGrid').innerHTML=cards.map(c=>`<div class="final-card"><div class="big">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></div>`).join('')}
function renderAllForWeek(){tabs();renderStart();renderSlide();makeQuiz();renderFlash();renderSpeak();renderFinish();}
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1600)}
tabs();
// 100-user optimization: do not preload all 35 slides on Home.
window.addEventListener('load',()=>{
  [...document.images].forEach(i=>{if(i.src)i.decoding='async'});
});