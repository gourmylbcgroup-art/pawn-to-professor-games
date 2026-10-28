(() => {
  'use strict';

  const scenes = [
    {
      id: 'food',
      title: 'FOOD',
      image: 'assets/scene1_food.webp',
      prompt: 'Find a food. Touch one.',
      introAudio: 'Find a food. Touch one.',
      completeAudio: 'Great job! Food scene complete.',
      hotspots: [
        { id:'S1-01', pair:1, label:'Dumplings', audio:'We eat dumplings at Chinese New Year.', x:10, y:70, w:17, h:13 },
        { id:'S1-02', pair:2, label:'Fish', audio:'We eat fish at Chinese New Year.', x:22, y:84, w:25, h:14 },
        { id:'S1-03', pair:3, label:'Hot pot', audio:'We eat hot pot at Chinese New Year.', x:29, y:64, w:14, h:14 },
        { id:'S1-04', pair:4, label:'Rice cake', audio:'We eat rice cake at Chinese New Year.', x:44, y:77, w:12, h:7 },
        { id:'S1-05', pair:1, label:'Pizza', audio:"We eat pizza on New Year's Day.", x:58, y:76, w:21, h:18 },
        { id:'S1-06', pair:2, label:'Cake', audio:"We eat cake on New Year's Day.", x:80, y:62, w:17, h:21 },
        { id:'S1-07', pair:3, label:'Fruit', audio:"We eat fruit on New Year's Day.", x:82, y:84, w:18, h:16 },
        { id:'S1-08', pair:4, label:'Juice', audio:"We drink juice on New Year's Day.", x:57, y:57, w:10, h:18 }
      ]
    },
    {
      id: 'objects',
      title: 'OBJECTS',
      image: 'assets/scene2_objects.webp',
      prompt: 'Find an object. Touch one.',
      introAudio: 'Find an object. Touch one.',
      completeAudio: 'Great job! Object scene complete.',
      hotspots: [
        { id:'S2-01', pair:1, label:'Red envelope', audio:'We see red envelopes at Chinese New Year.', x:16, y:66, w:10, h:22 },
        { id:'S2-02', pair:2, label:'Lantern', audio:'We see lanterns at Chinese New Year.', x:10, y:0, w:14, h:29 },
        { id:'S2-03', pair:3, label:'Fu decoration', audio:'We see a Fu decoration at Chinese New Year.', x:24, y:15, w:14, h:39 },
        { id:'S2-04', pair:4, label:'Firecrackers', audio:'We see firecrackers at Chinese New Year.', x:44, y:31, w:8, h:28 },
        { id:'S2-05', pair:1, label:'Party hat', audio:"We see party hats on New Year's Day.", x:84, y:57, w:11, h:20 },
        { id:'S2-06', pair:2, label:'Balloon', audio:"We see balloons on New Year's Day.", x:84, y:0, w:16, h:43 },
        { id:'S2-07', pair:3, label:'January 1 sign', audio:"We see January first on New Year's Day.", x:74, y:40, w:9, h:28 },
        { id:'S2-08', pair:4, label:'Countdown clock', audio:"We see a countdown clock on New Year's Day.", x:60, y:23, w:14, h:25 }
      ]
    },
    {
      id: 'celebration',
      title: 'CELEBRATION',
      image: 'assets/scene3_celebration.webp',
      prompt: 'Find a celebration clue. Touch one.',
      introAudio: 'Find a celebration clue. Touch one.',
      completeAudio: 'Excellent! You compared Chinese New Year and New Year\'s Day.',
      hotspots: [
        { id:'S3-01', pair:1, label:'Lion dance', audio:'We see a lion dance at Chinese New Year.', x:4, y:21, w:23, h:46 },
        { id:'S3-02', pair:2, label:'Family dinner', audio:'Families eat together at Chinese New Year.', x:7, y:73, w:50, h:26 },
        { id:'S3-03', pair:3, label:'Traditional red clothes', audio:'We see traditional red clothes at Chinese New Year.', x:34, y:54, w:15, h:19 },
        { id:'S3-04', pair:4, label:'Red banner', audio:'We see a red banner at Chinese New Year.', x:31, y:15, w:15, h:37 },
        { id:'S3-05', pair:1, label:'Fireworks', audio:"We see fireworks on New Year's Day.", x:49, y:0, w:15, h:23 },
        { id:'S3-06', pair:2, label:'Countdown clock', audio:"We see a countdown clock on New Year's Day.", x:66, y:10, w:14, h:29 },
        { id:'S3-07', pair:3, label:'Party people', audio:"People celebrate together on New Year's Day.", x:75, y:39, w:23, h:19 },
        { id:'S3-08', pair:4, label:'Party clothes', audio:"We see party clothes on New Year's Day.", x:88, y:59, w:12, h:32 }
      ]
    }
  ];

  const state = {
    sceneIndex: 0,
    found: new Set(),
    soundOn: true,
    started: false
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const startScreen = $('#startScreen');
  const gameScreen = $('#gameScreen');
  const sceneImage = $('#sceneImage');
  const sceneCanvas = $('#sceneCanvas');
  const sceneFrame = $('#sceneFrame');
  const hotspotLayer = $('#hotspotLayer');
  const prompt = $('#prompt');
  const feedback = $('#feedback');
  const progressText = $('#progressText');
  const progressFill = $('#progressFill');
  const sceneComplete = $('#sceneComplete');
  const completeTitle = $('#completeTitle');
  const completeMessage = $('#completeMessage');
  const nextSceneBtn = $('#nextSceneBtn');
  const nextBtn = $('#nextBtn');
  const soundBtn = $('#soundBtn');

  // A single owner for all voice playback. No overlapping browser voices or stale timers.
  const speech = {token:0, timer:null, active:null, pending:[], voice:null};
  function stopSpeech(){
    speech.token++;
    clearTimeout(speech.timer);
    speech.timer=null;
    speech.pending=[];
    speech.active=null;
    if('speechSynthesis' in window){try{window.speechSynthesis.cancel();}catch(e){}}
  }
  function selectVoice(){
    if(!('speechSynthesis' in window)) return;
    const all=window.speechSynthesis.getVoices();
    speech.voice=all.find(v=>v.lang==='en-US' && v.localService) ||
      all.find(v=>v.lang?.startsWith('en') && v.localService) ||
      all.find(v=>v.lang==='en-US') || all.find(v=>v.lang?.startsWith('en')) || null;
  }
  if('speechSynthesis' in window){
    selectVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged',selectVoice);
  }
  function playSpeech(text, token){
    if(!state.soundOn || token!==speech.token || !('speechSynthesis' in window)) return;
    const u=new SpeechSynthesisUtterance(text);
    u.lang='en-US'; u.rate=.78; u.pitch=1;
    if(speech.voice) u.voice=speech.voice;
    speech.active=u;
    const finish=()=>{
      if(token!==speech.token || speech.active!==u) return;
      speech.active=null;
      const next=speech.pending.shift();
      if(next) playSpeech(next,token);
    };
    u.onend=finish;u.onerror=finish;
    try{window.speechSynthesis.speak(u);}catch(e){finish();}
  }
  function speak(text, options={}){
    if(!state.soundOn || !('speechSynthesis' in window) || !text) return;
    const append=!!options.append;
    if(!append){
      stopSpeech();
    } else if(speech.active){
      speech.pending.push(text);
      return;
    }
    const token=speech.token;
    const delay=options.delay || 0;
    if(delay){
      speech.timer=setTimeout(()=>{speech.timer=null;playSpeech(text,token);},delay);
    }else playSpeech(text,token);
  }


  function fitSceneCanvas(){
    const r = sceneFrame.getBoundingClientRect();
    if(!r.width || !r.height) return;
    const targetRatio = 16/9;
    let w = r.width;
    let h = w / targetRatio;
    if(h > r.height){
      h = r.height;
      w = h * targetRatio;
    }
    sceneCanvas.style.width = `${Math.floor(w)}px`;
    sceneCanvas.style.height = `${Math.floor(h)}px`;
  }

  function showStart(){
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    $$('.scene-select').forEach((b,i)=>b.classList.toggle('selected',i===state.sceneIndex));
  }

  function startGame(){
    state.started = true;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    requestAnimationFrame(fitSceneCanvas);
    loadScene(state.sceneIndex, true);
  }

  function loadScene(index, autoSpeak=true){
    state.sceneIndex = Math.max(0, Math.min(index, scenes.length-1));
    state.found = new Set();
    const scene = scenes[state.sceneIndex];

    sceneImage.src = scene.image;
    sceneImage.onload = fitSceneCanvas;
    sceneImage.alt = `${scene.title} comparison scene`;
    prompt.textContent = scene.prompt;
    feedback.textContent = '';
    sceneComplete.classList.add('hidden');
    nextBtn.disabled = true;

    $$('.tab').forEach((b,i)=>{
      b.classList.toggle('active', i === state.sceneIndex);
      b.setAttribute('aria-selected', i === state.sceneIndex ? 'true':'false');
    });

    renderHotspots(scene);
    updateProgress();
    stopSpeech();
    if(autoSpeak) speak(scene.introAudio, {delay:250});
  }

  const pairTickColors = {
    1: '#35b96f', // green
    2: '#2f80ed', // blue
    3: '#8b5cf6', // purple
    4: '#f39a32'  // orange
  };

  function renderHotspots(scene){
    hotspotLayer.innerHTML = '';
    scene.hotspots.forEach(h => {
      const btn = document.createElement('button');
      btn.className = 'hotspot';
      btn.dataset.id = h.id;
      btn.setAttribute('aria-label', h.label);
      btn.style.left = `${h.x}%`;
      btn.style.top = `${h.y}%`;
      btn.style.width = `${h.w}%`;
      btn.style.height = `${h.h}%`;
      btn.style.setProperty('--tick-color', pairTickColors[h.pair] || '#35b96f');
      btn.addEventListener('pointerup', (e) => handleHotspot(e, h, btn));
      hotspotLayer.appendChild(btn);
    });
  }

  function handleHotspot(event, hotspot, el){
    event.preventDefault();
    if(state.found.has(hotspot.id)) return;

    state.found.add(hotspot.id);
    el.classList.add('found');
    feedback.textContent = `Correct! ${hotspot.audio}`;
    updateProgress();
    speak(hotspot.audio, {delay:120});

    if(state.found.size === scenes[state.sceneIndex].hotspots.length){
      const completedScene=state.sceneIndex;
      setTimeout(()=>{if(state.sceneIndex===completedScene && state.found.size===8) showComplete();},900);
    }
  }

  function updateProgress(){
    const total = scenes[state.sceneIndex].hotspots.length;
    const n = state.found.size;
    progressText.textContent = `${n} / ${total}`;
    progressFill.style.width = `${(n/total)*100}%`;
  }

  function showComplete(){
    const finalScene = state.sceneIndex === scenes.length-1;
    const scene = scenes[state.sceneIndex];
    completeTitle.textContent = finalScene ? 'Excellent!' : 'Scene complete!';
    completeMessage.textContent = finalScene
      ? 'You compared Chinese New Year and New Year\'s Day.'
      : `Great job! ${scene.title} is complete.`;
    nextSceneBtn.textContent = finalScene ? 'BACK TO MENU' : 'NEXT SCENE';
    nextBtn.disabled = finalScene;
    sceneComplete.classList.remove('hidden');
    speak(scene.completeAudio, {append:true});
  }

  function goNext(){
    if(state.sceneIndex < scenes.length-1){
      loadScene(state.sceneIndex+1, true);
    } else {
      showStart();
    }
  }

  function replay(){
    loadScene(state.sceneIndex, true);
  }

  function toggleSound(){
    state.soundOn = !state.soundOn;
    soundBtn.textContent = `SOUND: ${state.soundOn ? 'ON':'OFF'}`;
    soundBtn.setAttribute('aria-pressed', state.soundOn ? 'true':'false');
    if(!state.soundOn) stopSpeech();
  }

  function toggleFullscreen(){
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function menu(){
    stopSpeech();
    window.parent?.postMessage?.({type:'ptp-game-menu', source:'grade3-unit5-newyear'}, '*');
    showStart();
  }

  function back(){
    if(state.sceneIndex > 0){
      loadScene(state.sceneIndex-1, true);
      return;
    }
    showStart();
  }

  function wrongTap(){
    feedback.textContent = 'Try again.';
    speak('Try again.');
  }

  // Background taps do not score. If a learner taps inside the scene but not on a hotspot,
  // provide gentle feedback only when the tap is clearly inside the image area.
  $('#sceneFrame').addEventListener('pointerup', (e) => {
    if(e.target === sceneImage || e.target === hotspotLayer || e.target.id === 'sceneFrame'){
      // Per spec: background tap = no score. Keep it quiet to avoid accidental-touch noise.
    }
  });

  $$('.scene-select').forEach((b,i)=>b.addEventListener('click',()=>{
    state.sceneIndex = i;
    $$('.scene-select').forEach((x,j)=>x.classList.toggle('selected',j===i));
  }));
  $$('.tab').forEach((b,i)=>b.addEventListener('click',()=>loadScene(i,true)));
  $('#startBtn').addEventListener('click', startGame);
  $('#repeatBtn').addEventListener('click', ()=>speak(scenes[state.sceneIndex].introAudio));
  $('#replayBtn').addEventListener('click', replay);
  nextSceneBtn.addEventListener('click', goNext);
  nextBtn.addEventListener('click', goNext);
  $('#backBtn').addEventListener('click', back);
  $('#menuBtn').addEventListener('click', menu);
  soundBtn.addEventListener('click', toggleSound);
  $('#fullscreenBtn').addEventListener('click', toggleFullscreen);

  window.addEventListener('resize', fitSceneCanvas);
  document.addEventListener('fullscreenchange', ()=>setTimeout(fitSceneCanvas, 80));

  // Protection for classroom use.
  document.addEventListener('contextmenu', e => {e.preventDefault();}, true);
  document.addEventListener('selectstart', e => {if(e.target.closest?.('.scene-frame, img')) e.preventDefault();}, true);
  document.addEventListener('keydown', e => {
    const key=e.key.toLowerCase();
    if((e.ctrlKey || e.metaKey) && ['s','p','u'].includes(key)){
      e.preventDefault();e.stopImmediatePropagation();
    }
  }, true);
  document.querySelectorAll('img').forEach(img=>img.draggable=false);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech();});
  window.addEventListener('pagehide',stopSpeech);
  document.addEventListener('dragstart', e => {
    if(e.target.tagName === 'IMG') e.preventDefault();
  });

  // Expose a tiny API for later lesson integration.
  window.PTPNewYearGame = {
    start: (sceneIndex=0) => { state.sceneIndex=sceneIndex; startGame(); },
    menu,
    loadScene,
    setSound: (value) => { state.soundOn=!!value; if(!state.soundOn)stopSpeech(); soundBtn.textContent=`SOUND: ${state.soundOn?'ON':'OFF'}`; }
  };

  showStart();
})();
