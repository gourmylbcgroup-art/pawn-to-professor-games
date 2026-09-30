(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const gameRoot = 'games/where-are-you-game/';
  const places = [
    {id:'hospital', label:'hospital', display:'Hospital'},
    {id:'park', label:'park', display:'Park'},
    {id:'library', label:'library', display:'Library'},
    {id:'bank', label:'bank', display:'Bank'},
    {id:'school', label:'school', display:'School'},
    {id:'supermarket', label:'supermarket', display:'Supermarket'},
    {id:'store', label:'store', display:'Store'},
    {id:'night_market', label:'night market', display:'Night Market'},
    {id:'tea_shop', label:'tea shop', display:'Tea Shop'},
    {id:'cafe', label:'café', display:'Café'}
  ];
  const byId = Object.fromEntries(places.map(p => [p.id,p]));
  const cardSrc = p => `${gameRoot}assets/flashcards/${p.id}.webp`;
  const soundSrc = p => `${gameRoot}sounds/${p.id}.mp3`;
  let soundOn = true;
  let pictureOnly = false;

  function go(id){
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    window.scrollTo({top:0,behavior:document.body.classList.contains('calm')?'auto':'smooth'});
    if(id==='start') renderWarm();
    if(id==='learn') renderSlide();
    if(id==='play') renderQuiz();
    if(id==='practice') renderMission();
    if(id==='speak') renderSpeak();
    if(id==='finish') renderExit();

    // 100-user optimization: load the embedded game only when GAMES is opened.
    if(id==='games'){
      const frame = $('#gameFrame');
      if(frame && frame.dataset.src && frame.src === 'about:blank'){
        frame.src = frame.dataset.src;
      }
    }
  }
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

  function browserSpeak(text){
    if(!soundOn || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.82; u.pitch = 1.05;
    speechSynthesis.speak(u);
  }
  function playAudio(src, fallback=''){
    if(!soundOn) return;
    try{ const a = new Audio(src); a.play().catch(() => fallback && browserSpeak(fallback)); }
    catch(_){ if(fallback) browserSpeak(fallback); }
  }
  function speakPlace(p){ playAudio(soundSrc(p), p.label); }
  function speakQuestion(){ playAudio(`${gameRoot}sounds/where_are_you.mp3`, 'Where are you?'); }
  function speakSentence(p){ browserSpeak(`I am at the ${p.label}.`); }
  $('#soundBtn').addEventListener('click', () => {soundOn=!soundOn; $('#soundBtn').textContent=soundOn?'🔊':'🔇'; if(!soundOn && 'speechSynthesis' in window) speechSynthesis.cancel();});
  $('#motionBtn').addEventListener('click', () => {document.body.classList.toggle('calm'); $('#motionBtn').textContent=document.body.classList.contains('calm')?'🍃':'🌿';});

  // Modal / guides
  const modal = $('#modal');
  function openModal(src){ $('#modalImage').src=src; modal.classList.remove('hidden'); }
  function closeModal(){ modal.classList.add('hidden'); $('#modalImage').src=''; }
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  $('#showHowTo').addEventListener('click',()=>openModal('assets/how-to-play.webp'));
  $('#showTeacherGuide').addEventListener('click',()=>openModal('assets/teacher-guide.webp'));
  $('#homePresentationMap').addEventListener('click',()=>openModal('assets/presentation-map.webp'));
  $('#learnMapBtn').addEventListener('click',()=>openModal('assets/presentation-map.webp'));

  // START
  let warmOrder = [...places];
  let warmIndex = 0, warmHidden = false;
  function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function renderWarm(){
    const p=warmOrder[warmIndex]; if(!p) return;
    $('#warmCard').src=cardSrc(p); $('#warmCard').alt=p.display;
    $('#warmWord').textContent=warmHidden?'What place?':p.display;
    $('#warmMask').classList.toggle('hidden',!warmHidden);
    $('#warmToggle').textContent=warmHidden?'Show word':'Hide word';
    $('#warmProgress').style.width=`${((warmIndex+1)/warmOrder.length)*100}%`;
    $('#warmFeedback').textContent=`Place ${warmIndex+1} of ${warmOrder.length} · Look. Point. Say.`;
  }
  $('#warmHear').addEventListener('click',()=>speakPlace(warmOrder[warmIndex]));
  $('#warmToggle').addEventListener('click',()=>{warmHidden=!warmHidden;renderWarm()});
  $('#warmNext').addEventListener('click',()=>{warmIndex=(warmIndex+1)%warmOrder.length;renderWarm()});
  $('#warmReset').addEventListener('click',()=>{warmOrder=shuffle(places);warmIndex=0;warmHidden=false;renderWarm()});

  // LEARN SLIDES
  let slideIndex=0;
  const vocabSlides = places.map(p=>({type:'vocab',p}));
  const slides = [
    {type:'welcome'},
    {type:'goals'},
    {type:'question'},
    ...vocabSlides,
    {type:'review',group:places.slice(0,5),title:'Look & Say — Group A'},
    {type:'review',group:places.slice(5),title:'Look & Say — Group B'},
    {type:'review',group:places,title:'All 10 Places'},
    {type:'questionOnly'},
    {type:'answerFrame'},
    {type:'model'},
    {type:'choice',prompt:'I am sick.',answer:'hospital',choices:['park','hospital','cafe']},
    {type:'choice',prompt:'I want to read a book.',answer:'library',choices:['library','bank','store']},
    {type:'choice',prompt:'I want bubble tea.',answer:'tea_shop',choices:['tea_shop','school','bank']},
    {type:'choice',prompt:'I want coffee.',answer:'cafe',choices:['cafe','school','store']},
    {type:'yourTurn'}
  ];
  let modelPlaceIndex=0, yourTurnIndex=0;
  function miniGrid(group){
    return `<div class="mini-grid">${group.map(p=>`<button class="mini-place" data-mini="${p.id}"><img src="${cardSrc(p)}" alt="${p.display}"><span>${pictureOnly?'?':p.display}</span></button>`).join('')}</div>`;
  }
  function renderSlide(){
    const s=slides[slideIndex], stage=$('#slideStage');
    $('#slideCounter').textContent=`Slide ${slideIndex+1} / ${slides.length}`;
    $('#slideProgress').style.width=`${((slideIndex+1)/slides.length)*100}%`;
    $('#prevSlide').disabled=slideIndex===0; $('#nextSlide').textContent=slideIndex===slides.length-1?'Finish ✓':'Next ➜';
    let html='';
    if(s.type==='welcome') html=`<div class="slide-title">Welcome to My Community</div><div class="slide-sub">Look around. What places can you see?</div>${miniGrid([byId.hospital,byId.school,byId.park,byId.store,byId.library])}`;
    if(s.type==='goals') html=`<div class="slide-title">Today’s Goal</div><div class="goal-row"><div class="goal-chip">👀 LOOK</div><div class="goal-chip">🗣️ SAY</div><div class="goal-chip">💬 ASK & ANSWER</div></div><div class="slide-sub" style="margin-top:25px">We will identify 10 community places and use one complete sentence.</div>`;
    if(s.type==='question') html=`<div class="slide-title">Main Question</div><div class="conversation"><div class="speech q">Where are you?</div><div class="speech a">I am at the park.</div></div><img class="slide-img" src="${cardSrc(byId.park)}" alt="Park" style="margin-top:18px">`;
    if(s.type==='vocab') html=`<div class="slide-title">${pictureOnly?'What place?':s.p.display}</div><div class="slide-img-wrap"><img class="slide-img" src="${cardSrc(s.p)}" alt="${s.p.display}">${pictureOnly?'<div class="slide-word-mask">?</div>':''}</div><div class="slide-sub">${pictureOnly?'Say the word before revealing it.':'Look · point · repeat twice'}</div>`;
    if(s.type==='review') html=`<div class="slide-title">${s.title}</div><div class="slide-sub">Tap a card to hear the word.</div>${miniGrid(s.group)}`;
    if(s.type==='questionOnly') html=`<div class="slide-title">Question</div><div class="speech q" style="font-size:clamp(34px,5vw,70px)">Where are you?</div><div class="slide-sub">Ask together. Point to a location.</div>`;
    if(s.type==='answerFrame') html=`<div class="slide-title">Answer Frame</div><div class="slide-answer" id="frameAnswer">I am at the ______.</div><div class="answer-pills">${places.map(p=>`<button class="place-pill" data-fill="${p.id}">${p.display}</button>`).join('')}</div>`;
    if(s.type==='model') { const p=places[modelPlaceIndex%places.length]; html=`<div class="slide-title">Model Conversation</div><div class="conversation"><div class="speech q">Where are you?</div><div class="speech a">I am at the ${p.label}.</div></div><img class="slide-img" src="${cardSrc(p)}" alt="${p.display}" style="margin-top:16px"><div class="controls"><button class="btn small green" id="nextModelPlace">Next place ➜</button></div>`; }
    if(s.type==='choice'){ const ans=byId[s.answer]; html=`<div class="slide-title">What Place?</div><div class="clue-pill">${s.prompt}</div><div class="slide-img-wrap"><img class="slide-img" src="${cardSrc(ans)}" alt="Clue picture"><div class="slide-word-mask neutral"></div></div><div class="quiz-choice-row">${s.choices.map(id=>`<button class="quiz-choice" data-slide-choice="${id}">${byId[id].display}</button>`).join('')}</div><div class="feedback" id="slideFeedback"></div>`; }
    if(s.type==='yourTurn'){ const p=places[yourTurnIndex%places.length]; html=`<div class="slide-title">Your Turn!</div><img class="slide-img" src="${cardSrc(p)}" alt="${p.display}"><div class="conversation" style="margin-top:16px"><div class="speech q">Where are you?</div><div class="speech a" id="yourAnswer">I am at the ______.</div></div><div class="controls"><button class="btn small orange" id="showYourAnswer">Show answer</button><button class="btn small green" id="nextYourPlace">Next place ➜</button></div>`; }
    stage.innerHTML=html;
    stage.querySelectorAll('[data-mini]').forEach(b=>b.addEventListener('click',()=>speakPlace(byId[b.dataset.mini])));
    stage.querySelectorAll('[data-fill]').forEach(b=>b.addEventListener('click',()=>{const p=byId[b.dataset.fill];$('#frameAnswer').textContent=`I am at the ${p.label}.`;speakSentence(p)}));
    const modelBtn=$('#nextModelPlace'); if(modelBtn) modelBtn.addEventListener('click',()=>{modelPlaceIndex=(modelPlaceIndex+1)%places.length;renderSlide()});
    stage.querySelectorAll('[data-slide-choice]').forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.slideChoice===s.answer){b.classList.add('correct');$('#slideFeedback').innerHTML='<span class="ok">✓ Correct! Say the word.</span>';speakPlace(byId[s.answer]);}
      else {b.classList.add('wrong');$('#slideFeedback').innerHTML='<span class="try">Try again.</span>';setTimeout(()=>b.classList.remove('wrong'),600)}
    }));
    const showYour=$('#showYourAnswer'); if(showYour) showYour.addEventListener('click',()=>{const p=places[yourTurnIndex%places.length];$('#yourAnswer').textContent=`I am at the ${p.label}.`;speakSentence(p)});
    const nextYour=$('#nextYourPlace'); if(nextYour) nextYour.addEventListener('click',()=>{yourTurnIndex=(yourTurnIndex+1)%places.length;renderSlide()});
  }
  $('#prevSlide').addEventListener('click',()=>{if(slideIndex>0){slideIndex--;renderSlide()}});
  $('#nextSlide').addEventListener('click',()=>{if(slideIndex<slides.length-1){slideIndex++;renderSlide()}else go('practice')});
  $('#pictureOnlyBtn').addEventListener('click',()=>{pictureOnly=!pictureOnly;$('#pictureOnlyBtn').textContent=pictureOnly?'Picture Only':'Picture + Word';renderSlide()});
  $('#hearSlide').addEventListener('click',()=>{
    const s=slides[slideIndex];
    if(s.type==='vocab') speakPlace(s.p);
    else if(s.type==='question'||s.type==='questionOnly') speakQuestion();
    else if(s.type==='answerFrame') browserSpeak('I am at the blank.');
    else if(s.type==='model') {const p=places[modelPlaceIndex%places.length];speakQuestion();setTimeout(()=>speakSentence(p),800)}
    else if(s.type==='yourTurn') speakQuestion();
    else if(s.type==='choice') browserSpeak(s.prompt);
    else browserSpeak('Look and say.');
  });

  // PLAY exact six prompts
  const quiz = [
    {clue:'I am sick.', answer:'hospital', choices:['park','hospital','cafe']},
    {clue:'I want to read a book.', answer:'library', choices:['library','bank','store']},
    {clue:'I want to play.', answer:'park', choices:['park','school','supermarket']},
    {clue:'I want to buy food.', answer:'supermarket', choices:['tea_shop','supermarket','hospital']},
    {clue:'I want bubble tea.', answer:'tea_shop', choices:['tea_shop','library','bank']},
    {clue:'I want coffee.', answer:'cafe', choices:['cafe','school','store']}
  ];
  let quizIndex=0, quizStars=0, quizLocked=false;
  function renderQuiz(){
    const q=quiz[quizIndex]; if(!q) return;
    quizLocked=false; $('#quizRound').textContent=`Round ${quizIndex+1} / ${quiz.length}`;$('#quizStars').textContent=`Stars: ${quizStars}`;$('#quizProgress').style.width=`${((quizIndex+1)/quiz.length)*100}%`;$('#quizClue').textContent=q.clue;$('#quizImage').src=cardSrc(byId[q.answer]);$('#quizFeedback').textContent='Choose A, B, or C.';$('#quizNext').classList.add('hidden');
    $('#quizAnswers').innerHTML=q.choices.map((id,i)=>`<button class="answer-btn" data-quiz-choice="${id}">${String.fromCharCode(65+i)}. ${byId[id].display}</button>`).join('');
    $$('#quizAnswers [data-quiz-choice]').forEach(b=>b.addEventListener('click',()=>{
      if(quizLocked) return;
      if(b.dataset.quizChoice===q.answer){quizLocked=true;quizStars++;b.classList.add('correct');$('#quizStars').textContent=`Stars: ${quizStars}`;$('#quizFeedback').innerHTML='<span class="ok">✓ Correct! Say the word.</span>';speakPlace(byId[q.answer]);$('#quizNext').classList.remove('hidden');}
      else {b.classList.add('wrong');$('#quizFeedback').innerHTML='<span class="try">Try again — look at the picture clue.</span>';setTimeout(()=>b.classList.remove('wrong'),600)}
    }));
  }
  $('#quizHear').addEventListener('click',()=>browserSpeak(quiz[quizIndex].clue));
  $('#quizNext').addEventListener('click',()=>{if(quizIndex<quiz.length-1){quizIndex++;renderQuiz()}else{quizIndex=0;quizStars=0;renderQuiz();go('practice')}});

  // PRACTICE mission
  const missionIds=['park','library','hospital','tea_shop','night_market','cafe'];
  let missionIndex=0, missionShown=false;
  function renderMission(){
    $('#missionTrack').innerHTML=missionIds.map((id,i)=>`<span class="mission-dot ${i<missionIndex?'done':''} ${i===missionIndex?'current':''}">${i+1}. ${byId[id].display}</span>`).join('');
    const p=byId[missionIds[missionIndex]];$('#missionImage').src=cardSrc(p);$('#missionAnswer').textContent=missionShown?`I am at the ${p.label}.`:'I am at the ______.';$('#missionFeedback').textContent=`Round ${missionIndex+1}: Ask, answer, then switch roles.`;$('#missionDone').textContent=missionIndex===missionIds.length-1?'✓ Finish mission':'✓ Complete round';
  }
  $('#missionHearQ').addEventListener('click',speakQuestion);
  $('#missionShow').addEventListener('click',()=>{missionShown=true;renderMission();speakSentence(byId[missionIds[missionIndex]])});
  $('#missionHearA').addEventListener('click',()=>speakSentence(byId[missionIds[missionIndex]]));
  $('#missionDone').addEventListener('click',()=>{if(missionIndex<missionIds.length-1){missionIndex++;missionShown=false;renderMission()}else{missionIndex=0;missionShown=false;renderMission();go('speak')}});

  // SPEAK
  let speakOrder=shuffle(places), speakIndex=0, speakStars=0, speakShown=false;
  function renderSpeak(){const p=speakOrder[speakIndex];$('#speakRound').textContent=`Card ${speakIndex+1} / ${speakOrder.length}`;$('#speakStars').textContent=`Spoken: ${speakStars}`;$('#speakProgress').style.width=`${((speakIndex+1)/speakOrder.length)*100}%`;$('#speakImage').src=cardSrc(p);$('#speakModel').textContent=speakShown?`I am at the ${p.label}.`:'I am at the ______.';$('#speakMask').classList.toggle('hidden',speakShown);$('#speakFeedback').textContent=speakShown?'Repeat the complete sentence.':'Try from the picture first. Tap “Show model” only if needed.';}
  $('#speakQuestion').addEventListener('click',speakQuestion);
  $('#speakShow').addEventListener('click',()=>{speakShown=true;renderSpeak()});
  $('#speakHear').addEventListener('click',()=>speakSentence(speakOrder[speakIndex]));
  $('#speakDone').addEventListener('click',()=>{speakStars++;if(speakIndex<speakOrder.length-1){speakIndex++;speakShown=false;renderSpeak()}else{speakOrder=shuffle(places);speakIndex=0;speakStars=0;speakShown=false;renderSpeak();go('finish')}});

  // FINISH
  let exitOrder=shuffle(places), exitIndex=0, exitStars=0, exitDrawn=false, exitShown=false;
  function renderExit(){
    $('#exitRound').textContent=`Card ${Math.min(exitIndex+1,10)} / 10`;$('#exitStars').textContent=`Stars: ${exitStars}`;$('#exitProgress').style.width=`${(exitIndex/10)*100}%`;
    const bag=$('#mysteryBag'),wrap=$('#exitCardWrap'),dialog=$('#exitDialogue');
    if(exitIndex>=10){bag.classList.add('hidden');wrap.classList.add('hidden');dialog.classList.add('hidden');$('#drawCard').classList.add('hidden');$('#exitShow').classList.add('hidden');$('#exitHear').classList.add('hidden');$('#exitGood').classList.add('hidden');$('#exitRetry').classList.remove('hidden');$('#exitFeedback').innerHTML=`<span class="ok">Challenge complete! ${exitStars} / 10 stars.</span>`;$('#exitProgress').style.width='100%';return;}
    const p=exitOrder[exitIndex];
    bag.classList.toggle('hidden',exitDrawn);wrap.classList.toggle('hidden',!exitDrawn);dialog.classList.toggle('hidden',!exitDrawn);$('#exitImage').src=cardSrc(p);$('#exitAnswer').textContent=exitShown?`I am at the ${p.label}.`:'I am at the ______.';$('#drawCard').classList.toggle('hidden',exitDrawn);$('#exitShow').classList.toggle('hidden',!exitDrawn||exitShown);$('#exitHear').classList.toggle('hidden',!exitShown);$('#exitGood').classList.toggle('hidden',!exitDrawn);$('#exitRetry').classList.add('hidden');$('#exitFeedback').textContent=exitDrawn?'Name the place. Then answer: “Where are you?”':'Tap the bag to draw a card.';
  }
  function drawExit(){if(exitIndex>=10)return;exitDrawn=true;exitShown=false;renderExit();speakQuestion()}
  $('#drawCard').addEventListener('click',drawExit);$('#mysteryBag').addEventListener('click',drawExit);
  $('#exitShow').addEventListener('click',()=>{exitShown=true;renderExit();speakSentence(exitOrder[exitIndex])});
  $('#exitHear').addEventListener('click',()=>speakSentence(exitOrder[exitIndex]));
  $('#exitGood').addEventListener('click',()=>{exitStars++;exitIndex++;exitDrawn=false;exitShown=false;renderExit()});
  $('#exitRetry').addEventListener('click',()=>{exitOrder=shuffle(places);exitIndex=0;exitStars=0;exitDrawn=false;exitShown=false;renderExit()});

  // Game fullscreen
  $('#gameFull').addEventListener('click',async()=>{const el=$('#gameFrameWrap');try{if(!document.fullscreenElement)await el.requestFullscreen();else await document.exitFullscreen()}catch(_){}});

  // 100-user optimization:
  // Hidden sections are rendered only when opened via go(id).
  // This avoids downloading flashcards for sections students have not opened yet.
})();
