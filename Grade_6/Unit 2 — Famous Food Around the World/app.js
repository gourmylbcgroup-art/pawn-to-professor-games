
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

   window.speechSynthesis.cancel();
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
   if('speechSynthesis' in window)window.speechSynthesis.cancel();
 }

 return {warm,speak,stop,get voice(){return chosen;}};
})();

function speak(text){
 if(!soundOn||!text)return;
 PTP_LOCAL_TTS.stop();
 PTP_LOCAL_TTS.speak(text,{rate:.84,pitch:1});
}
function warmAudio(){
 AudioFX.init();
 PTP_LOCAL_TTS.warm();
}

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
$('#homeBtn').onclick=()=>show('home');$('#fullBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇';if(!soundOn)PTP_LOCAL_TTS.stop();};$('#reloadGame').onclick=()=>{const f=$('#gameFrame');f.src='game/index.html?'+Date.now()};

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