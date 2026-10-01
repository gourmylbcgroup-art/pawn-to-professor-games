(() => {
  'use strict';

  const AS = '../../assets/';
  const CARD = AS + 'cards/';
  const TOKEN = AS + 'tokens/';

  const tokenDefs = [
    {src:TOKEN+'token-red.webp', color:'#e55343'},
    {src:TOKEN+'token-blue.webp', color:'#267acb'},
    {src:TOKEN+'token-pink.webp', color:'#d96aa7'},
    {src:TOKEN+'token-green.webp', color:'#39a25d'},
  ];

  // Coordinates are percentages of the supplied board artwork.
  // Special locations occupy the missing board numbers (3, 11, 12, etc.).
  const route = [
    {id:'start', label:'START', type:'start', x:14.5, y:28.0},
    {id:'1', label:'1', type:'normal', x:23.0, y:25.0},
    {id:'2', label:'2', type:'normal', x:34.6, y:25.0},
    {id:'breakfast', label:'Breakfast', type:'meal', meal:'breakfast', x:50.4, y:20.8},
    {id:'4', label:'4', type:'normal', x:67.7, y:26.1},
    {id:'rest1', label:'REST', type:'rest', x:83.3, y:26.1},
    {id:'5', label:'5', type:'normal', x:92.0, y:37.5},
    {id:'6', label:'6', type:'normal', x:83.2, y:49.0},
    {id:'7', label:'7', type:'normal', x:70.0, y:49.2},
    {id:'lunch', label:'Lunch', type:'meal', meal:'lunch', x:51.6, y:45.8},
    {id:'rest2', label:'REST', type:'rest', x:33.0, y:48.7},
    {id:'8', label:'8', type:'normal', x:20.6, y:47.3},
    {id:'9', label:'9', type:'normal', x:9.8, y:45.8},
    {id:'10', label:'10', type:'normal', x:5.4, y:55.0},
    {id:'dinner', label:'Dinner', type:'meal', meal:'dinner', x:15.8, y:63.5},
    {id:'rest3', label:'REST', type:'rest', x:33.8, y:68.1},
    {id:'13', label:'13', type:'normal', x:46.4, y:70.5},
    {id:'14', label:'14', type:'normal', x:57.2, y:70.4},
    {id:'nightmarket', label:'Night Market', type:'nightmarket', x:70.7, y:65.0},
    {id:'15', label:'15', type:'normal', x:87.2, y:67.4},
    {id:'finish', label:'FINISH', type:'finish', x:87.8, y:85.8},
  ];

  const cards = {
    breakfastPicture: {src:CARD+'breakfast-picture.webp', label:'Breakfast sentence'},
    breakfastNoPic: {src:CARD+'breakfast-no-picture.webp', label:'Breakfast support'},
    breakfastHelp: {src:CARD+'breakfast-help.webp', label:'Breakfast example'},
    lunchPicture: {src:CARD+'lunch-picture.webp', label:'Lunch sentence'},
    lunchNoPic: {src:CARD+'lunch-no-picture.webp', label:'Lunch support'},
    dinnerPicture: {src:CARD+'dinner-picture.webp', label:'Dinner sentence'},
    dinnerNoPic: {src:CARD+'dinner-no-picture.webp', label:'Dinner support'},
    dinnerCard: {src:CARD+'dinner-card.webp', label:'Dinner example'},
    yunlinPicture: {src:CARD+'yunlin-picture.webp', label:'Yunlin sentence'},
    yunlinNoPic: {src:CARD+'yunlin-no-picture.webp', label:'Yunlin support'},
    nightPicture: {src:CARD+'nightmarket-picture.webp', label:'Night Market sentence'},
    nightNoPic: {src:CARD+'nightmarket-no-picture.webp', label:'Night Market support'},
    mealCard: {src:CARD+'meal-card.webp', label:'Meal card'},
    noodles: {src:CARD+'food-noodles.webp', label:'Noodles food card'},
    questionBreakfast: {src:CARD+'question-breakfast.webp', label:'Breakfast question'},
    answerWouldLike: {src:CARD+'answer-would-like.webp', label:'Answer frame'},
    answerBreakfast: {src:CARD+'answer-breakfast.webp', label:'Breakfast answer'},
  };

  const funnyChallenges = [
    ['🤖','ROBOT VOICE','Say the English like a friendly robot.'],
    ['🤫','WHISPER MODE','Whisper the whole sentence clearly.'],
    ['📺','TV PRESENTER','Say it like you are presenting the news.'],
    ['🐢','SUPER SLOW','Say every word very slowly.'],
    ['👨‍🍳','CHEF VOICE','Say it like a famous chef describing food.'],
    ['🎭','DRAMA MODE','Say it with a very surprised face.'],
  ];

  const state = {
    level:1,
    players:[],
    turn:0,
    roundTurn:1,
    phase:'setup',
    currentChallenge:null,
    settings:{surprises:true, funny:true, sound:true},
    selectedLevel:1,
    selectedPlayerCount:4,
    pendingEvent:null,
    extraTurn:false,
    bonusRollActive:false,
  };

  const el = id => document.getElementById(id);
  const qsa = sel => [...document.querySelectorAll(sel)];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = arr => arr[Math.floor(Math.random()*arr.length)];
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));


  // Lightweight procedural sound engine.
  // All effects are synthesized with Web Audio: no MP3 downloads, no network requests,
  // and no background music. This keeps the classroom game responsive online/offline.
  const sound = (()=>{
    let ctx=null, master=null, noiseBuffer=null;
    const AudioCtx=window.AudioContext||window.webkitAudioContext;

    function ready(){
      if(!state.settings.sound || !AudioCtx) return null;
      if(!ctx){
        ctx=new AudioCtx();
        master=ctx.createGain();
        master.gain.value=.17;
        master.connect(ctx.destination);
        const len=Math.max(1,Math.floor(ctx.sampleRate*.16));
        noiseBuffer=ctx.createBuffer(1,len,ctx.sampleRate);
        const d=noiseBuffer.getChannelData(0);
        for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len);
      }
      if(ctx.state==='suspended') ctx.resume().catch(()=>{});
      return ctx;
    }

    function tone(freq,dur=.08,type='sine',gain=.22,delay=0,endFreq=null){
      const c=ready(); if(!c) return;
      const t=c.currentTime+delay;
      const o=c.createOscillator(), g=c.createGain();
      o.type=type; o.frequency.setValueAtTime(freq,t);
      if(endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+dur);
      g.gain.setValueAtTime(.0001,t);
      g.gain.exponentialRampToValueAtTime(Math.max(.001,gain),t+.008);
      g.gain.exponentialRampToValueAtTime(.0001,t+dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.02);
    }

    function noise(dur=.08,gain=.08,delay=0){
      const c=ready(); if(!c || !noiseBuffer) return;
      const t=c.currentTime+delay;
      const s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
      s.buffer=noiseBuffer; f.type='highpass'; f.frequency.value=700;
      g.gain.setValueAtTime(gain,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
      s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t+dur+.01);
    }

    const fx={
      unlock(){ready()},
      click(){tone(520,.035,'sine',.06)},
      dice(){noise(.11,.075); tone(150,.10,'triangle',.11,0,90)},
      diceTick(){tone(260+Math.random()*100,.035,'square',.035)},
      step(){tone(310,.045,'triangle',.07)},
      correct(){tone(523,.10,'sine',.12);tone(659,.11,'sine',.12,.08);tone(784,.16,'sine',.13,.16)},
      wrong(){tone(330,.10,'sine',.09);tone(247,.16,'sine',.08,.10);},
      help(){tone(330,.10,'sine',.08);tone(294,.15,'sine',.07,.09)},
      meal(){tone(523,.09,'triangle',.11);tone(659,.09,'triangle',.11,.07);tone(784,.15,'triangle',.12,.14)},
      power(){tone(440,.07,'square',.07);tone(660,.08,'square',.07,.07);tone(880,.16,'square',.08,.14)},
      rest(){tone(330,.12,'sine',.07);tone(262,.17,'sine',.06,.11);tone(196,.22,'sine',.055,.25)},
      night(){tone(392,.11,'sine',.07);tone(330,.11,'sine',.06,.12);tone(262,.20,'sine',.055,.24)},
      winner(){[523,659,784,1047].forEach((f,i)=>tone(f,.20,'triangle',.13,i*.11))},
      finish(){tone(392,.10,'sine',.09);tone(523,.15,'sine',.11,.09)},
    };
    return fx;
  })();

  // Jia-Jia voice audio sprite.
  const VOICE_CUES = {"yourTurn":{"start":0.12,"end":1.22},"rollDie":{"start":1.31,"end":2.21},"one":{"start":2.3,"end":2.83},"two":{"start":2.92,"end":3.51},"three":{"start":3.6,"end":4.08},"four":{"start":4.17,"end":4.74},"five":{"start":4.83,"end":5.46},"six":{"start":5.55,"end":6.27},"correct":{"start":6.36,"end":7.42},"playAgain":{"start":7.51,"end":9.2},"wrong":{"start":9.29,"end":10.43},"missNextTurn":{"start":10.52,"end":12.54},"tryAgain":{"start":12.63,"end":13.53},"repeatSentence":{"start":13.62,"end":15.5},"greatJob":{"start":15.59,"end":16.71},"breakfastCard":{"start":16.8,"end":18.19},"lookPicture":{"start":18.28,"end":19.66},"completeSentence":{"start":19.75,"end":21.87},"eatBreakfast":{"start":21.96,"end":25.26},"breakfastExample":{"start":25.35,"end":29.27},"questionBreakfast":{"start":29.36,"end":31.47},"wouldLikeSome":{"start":31.56,"end":32.97},"lunchCard":{"start":33.06,"end":33.96},"eatLunch":{"start":34.05,"end":37.23},"questionLunch":{"start":37.32,"end":39.33},"dinnerCard":{"start":39.42,"end":40.39},"eatDinner":{"start":40.48,"end":43.6},"dinnerExample":{"start":43.69,"end":46.75},"questionDinner":{"start":46.84,"end":48.74},"yunlinCard":{"start":48.83,"end":50.05},"completeYunlin":{"start":50.14,"end":53.15},"eatYunlin":{"start":53.24,"end":57.35},"nightMarketCard":{"start":57.44,"end":59.65},"readSentence":{"start":59.74,"end":61.78},"nightMarketSentence":{"start":61.87,"end":65.06},"threeMealsCard":{"start":65.15,"end":66.74},"nameThreeMeals":{"start":66.83,"end":69.43},"threeMealsAnswer":{"start":69.52,"end":73.03},"foodCard":{"start":73.12,"end":73.95},"noodles":{"start":74.04,"end":75.27},"dialogueCard":{"start":75.36,"end":76.68},"askPartnerQuestion":{"start":76.77,"end":79.25},"answerQuestion":{"start":79.34,"end":81.39},"robotVoice":{"start":81.48,"end":84.47},"robotInstruction":{"start":84.56,"end":87.67},"whisperMode":{"start":87.76,"end":89.58},"whisperInstruction":{"start":89.67,"end":92.06},"tvPresenter":{"start":92.15,"end":94.28},"tvInstruction":{"start":94.37,"end":97.26},"superSlow":{"start":97.35,"end":102.36},"superSlowInstruction":{"start":102.45,"end":106.26},"chefVoice":{"start":106.35,"end":107.19},"chefInstruction":{"start":107.28,"end":110.13},"dramaMode":{"start":110.22,"end":112.35},"dramaInstruction":{"start":112.44,"end":115.24},"rest":{"start":115.33,"end":116.02},"missOneTurn":{"start":116.11,"end":117.85},"yunlinStarBoost":{"start":117.94,"end":120.8},"moveExtra":{"start":120.89,"end":122.98},"snackBoost":{"start":123.07,"end":124.76},"moveExtra2":{"start":124.85,"end":127.36},"luckyDice":{"start":127.45,"end":129.59},"rollTwice":{"start":129.68,"end":132.92},"restShield":{"start":133.01,"end":134.02},"doNotMissTurn":{"start":134.11,"end":136.06},"luckyMealPass":{"start":136.15,"end":137.97},"extraTurn":{"start":138.06,"end":140.11},"mealBonus":{"start":140.2,"end":141.75},"mealChallenge":{"start":141.84,"end":144.42},"correct2":{"start":144.51,"end":145.35},"playAgain2":{"start":145.44,"end":146.28},"surprise":{"start":146.37,"end":147.65},"finish":{"start":147.74,"end":148.73},"youWin":{"start":148.82,"end":150.13},"fantasticEnglish":{"start":150.22,"end":152.92},"playAgain3":{"start":153.01,"end":153.85}};
  // Jia-Jia voice audio sprite — original MP3 quality preserved.
  // 100-user online optimization:
  // - download the 770 KB voice file once when the game opens
  // - keep it in a local Blob URL
  // - all later cue seeking happens locally, avoiding network seek lag
  const voice = (()=>{
    const sourceUrl = AS + 'audio/jiajia-voice.mp3';
    const audio = new Audio();
    audio.preload = 'auto';

    let runId = 0;
    let timer = null;
    let activeResolve = null;
    let blobUrl = null;
    let warmPromise = null;

    const wait = ms => new Promise(r=>setTimeout(r,ms));

    function enabled(){ return state.settings.sound !== false; }

    function finishActive(){
      if(timer){ clearTimeout(timer); timer=null; }
      if(activeResolve){
        const r=activeResolve;
        activeResolve=null;
        r();
      }
    }

    function stop(){
      runId++;
      if(timer){ clearTimeout(timer); timer=null; }
      try{ audio.pause(); }catch{}
      finishActive();
    }

    function warm(){
      if(warmPromise) return warmPromise;

      warmPromise = fetch(sourceUrl, {cache:'force-cache'})
        .then(res=>{
          if(!res.ok) throw new Error('Voice file could not be loaded.');
          return res.blob();
        })
        .then(blob=>{
          blobUrl = URL.createObjectURL(blob);
          audio.src = blobUrl;
          audio.preload = 'auto';
          try{ audio.load(); }catch{}
          return new Promise(resolve=>{
            if(audio.readyState >= 1) return resolve();
            const done=()=>{
              audio.removeEventListener('loadedmetadata', done);
              resolve();
            };
            audio.addEventListener('loadedmetadata', done, {once:true});
            setTimeout(done, 1800);
          });
        })
        .catch(()=>{
          // Safe fallback: same original MP3 URL, same quality.
          audio.src = sourceUrl;
          audio.preload = 'auto';
          try{ audio.load(); }catch{}
        });

      return warmPromise;
    }

    async function ensureReady(){
      await warm();
      if(audio.readyState >= 1) return;
      await new Promise(resolve=>{
        const done=()=>{
          audio.removeEventListener('loadedmetadata', done);
          resolve();
        };
        audio.addEventListener('loadedmetadata', done, {once:true});
        try{ audio.load(); }catch{ resolve(); }
        setTimeout(done, 1800);
      });
    }

    async function playOne(name,myRun){
      const c=VOICE_CUES[name];
      if(!c || !enabled() || myRun!==runId) return;

      await ensureReady();
      if(myRun!==runId || !enabled()) return;

      return new Promise(resolve=>{
        activeResolve=resolve;
        try{
          audio.pause();

          // Seeking is now against the locally downloaded Blob in normal use.
          audio.currentTime=Math.max(0,c.start);
          audio.volume=1;

          const ms=Math.max(120,(c.end-c.start)*1000+55);
          timer=setTimeout(()=>{
            try{audio.pause();}catch{}
            finishActive();
          },ms);

          const p=audio.play();
          if(p?.catch) p.catch(()=>finishActive());
        }catch{
          finishActive();
        }
      });
    }

    async function play(names){
      stop();
      if(!enabled()) return;

      const myRun=runId;
      const list=(Array.isArray(names)?names:[names]).filter(Boolean);

      for(const name of list){
        if(myRun!==runId || !enabled()) return;
        await playOne(name,myRun);
        if(myRun!==runId) return;
        await wait(45);
      }
    }

    function unlock(){
      // Trigger/continue the one-time voice download on a user gesture.
      warm();
    }

    // Begin warming the unchanged MP3 as soon as the game page is opened.
    // The lesson home page does NOT load this game until the GAME section is chosen.
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', warm, {once:true});
    }else{
      warm();
    }

    return {play,stop,unlock,warm};
  })();


  function playerTemplate(name, i){
    return {
      name: name || `Player ${i+1}`,
      pos:0,
      skip:0,
      streak:0,
      power:null,
      token:tokenDefs[i].src,
      color:tokenDefs[i].color,
    };
  }

  function saveGame(){
    if(state.phase==='setup') return;
    const safe = {
      level:state.level, players:state.players, turn:state.turn,
      roundTurn:state.roundTurn, phase:'roll', settings:state.settings, bonusRollActive:state.bonusRollActive
    };
    localStorage.setItem('yunlinFoodAdventureSave', JSON.stringify(safe));
  }

  function savedGame(){
    try{return JSON.parse(localStorage.getItem('yunlinFoodAdventureSave')||'null')}catch{return null}
  }

  function clearSave(){localStorage.removeItem('yunlinFoodAdventureSave')}

  function openModal(id){el(id).classList.add('open')}
  function closeModal(id){el(id).classList.remove('open')}

  function toast(msg){
    const t=el('toast'); t.textContent=msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2100);
  }

  function setBoardStatus(text){el('boardStatus').textContent=text}

  function renderTokens(){
    const layer=el('tokenLayer');
    layer.innerHTML='';
    const offsets=[[-1.9,-1.8],[1.9,-1.8],[-1.9,1.8],[1.9,1.8]];
    state.players.forEach((p,i)=>{
      const loc=route[p.pos];
      const d=document.createElement('div');
      d.className='board-token'+(i===state.turn?' active':'');
      d.dataset.player=i;
      d.style.setProperty('--tokenColor',p.color);
      d.style.left=(loc.x+offsets[i][0])+'%';
      d.style.top=(loc.y+offsets[i][1])+'%';
      d.innerHTML=`<img src="${p.token}" alt="${escapeHtml(p.name)} token">`;
      layer.appendChild(d);
    });
  }

  function renderPlayers(){
    el('playersList').innerHTML=state.players.map((p,i)=>{
      const loc=route[p.pos];
      const power=powerLabel(p.power);
      return `<div class="player-row ${i===state.turn?'active':''} ${p.skip?'resting':''}" style="--playerColor:${p.color}">
        <img src="${p.token}" alt="">
        <div><strong>${escapeHtml(p.name)}</strong><div class="player-meta">⭐ ${p.streak}/3${p.skip?' • 💤 resting':''}${p.power?' • '+power:''}</div></div>
        <span class="position-pill">${loc.label}</span>
      </div>`
    }).join('');
  }

  function renderTurn(){
    if(!state.players.length) return;
    const p=state.players[state.turn];
    el('currentToken').src=p.token;
    el('currentToken').style.boxShadow=`0 0 0 4px ${p.color},0 5px 12px rgba(0,0,0,.15)`;
    el('currentPlayerName').textContent=p.name;
    el('streakValue').textContent=`${p.streak} / 3`;
    el('powerValue').textContent=powerLabel(p.power);
    el('turnCounter').textContent=`Turn ${state.roundTurn}`;
    el('levelBadge').textContent=state.level===1?'Level 1 • Week 4':'Level 2 • Week 5';
    const resting=p.skip>0;
    el('rollBtn').disabled=state.phase!=='roll' || resting;
    if(resting){
      el('turnInstruction').textContent='This team must rest for one turn.';
    } else if(state.phase==='roll'){
      el('turnInstruction').textContent=p.power==='luckyDice'?'Lucky Dice ready — roll twice, keep the highest!':'Roll the die to move.';
    }
  }

  function renderAll(){renderTokens();renderPlayers();renderTurn();saveGame()}

  function powerLabel(power){
    return ({restShield:'🛡️ Rest Shield',luckyDice:'🎲 Lucky Dice'}[power]||'None');
  }

  async function beginTurn(){
    state.phase='roll';
    renderAll();
    const p=state.players[state.turn];
    if(p.skip>0){
      sound.rest();
      await showEvent('💤','Resting turn',`${p.name} rests this turn. After eating, the stomach needs a little rest!`,'Skip turn',['missOneTurn']);
      p.skip--;
      endTurn();
    }else if(p.pos===route.length-1){
      // A player who already reached FINISH must pass the final meal challenge.
      state.bonusRollActive=false;
      openFinalMealChallenge();
    }else{
      setBoardStatus(`${p.name}: roll the die!`);
      voice.play(['yourTurn','rollDie']);
    }
  }

  async function rollDice(){
    if(state.phase!=='roll') return;
    const p=state.players[state.turn];
    sound.dice();
    state.phase='moving'; renderTurn();
    const die=el('dice'); die.classList.add('rolling');
    let a=1+Math.floor(Math.random()*6), b=null;
    if(p.power==='luckyDice'){
      b=1+Math.floor(Math.random()*6);
      p.power=null;
    }
    for(let i=0;i<7;i++){
      die.querySelector('span').textContent=1+Math.floor(Math.random()*6);
      sound.diceTick();
      await sleep(65);
    }
    const roll=b===null?a:Math.max(a,b);
    die.querySelector('span').textContent=roll;
    die.classList.remove('rolling');
    die.classList.add('result-pop');
    if(b!==null) toast(`🎲 Lucky Dice: ${a} and ${b} → move ${roll}`);
    setBoardStatus(`${p.name} rolled ${roll}.`);
    voice.play(({1:'one',2:'two',3:'three',4:'four',5:'five',6:'six'})[roll]);
    await sleep(2000);
    die.classList.remove('result-pop');

    const finishIndex=route.length-1;
    const spacesNeeded=finishIndex-p.pos;
    if(roll>spacesNeeded){
      sound.help();
      await showEvent('🎯','Exact roll needed!',`${p.name} needs ${spacesNeeded} to reach FINISH, but rolled ${roll}. Stay here and try again next turn.`,'Next player',['tryAgain']);
      endTurn();
      return;
    }

    await movePlayerBy(roll,true);
    await resolveLanding();
  }

  async function movePlayerBy(steps, triggerLanding=false){
    const p=state.players[state.turn];
    const target=clamp(p.pos+steps,0,route.length-1);
    while(p.pos<target){
      p.pos++;
      renderTokens(); renderPlayers();
      const token=document.querySelector(`.board-token[data-player="${state.turn}"]`);
      token?.classList.add('moving');
      sound.step();
      await sleep(355);
    }
    saveGame();
    if(triggerLanding && p.pos===route.length-1) return;
  }

  async function resolveLanding(){
    const p=state.players[state.turn], space=route[p.pos];
    if(space.type==='finish'){
      sound.finish();
      await showEvent('🏁','FINISH reached!',`${p.name} reached FINISH with the exact roll. One last challenge before winning!`,'Final challenge',['finish']);
      openFinalMealChallenge();
      return;
    }
    if(space.type==='rest'){
      if(p.power==='restShield'){
        p.power=null;
        sound.power();
        await showEvent('🛡️','Rest Shield!',`${p.name} uses the Rest Shield and does NOT miss a turn.`,'Great!',['restShield','doNotMissTurn']);
      }else{
        p.skip=1;
        p.streak=0;
        sound.rest();
        await showEvent('🪑','REST',`Your stomach is full. Rest! ${p.name} will miss 1 turn.`,'OK',['rest','missOneTurn']);
      }
      endTurn(); return;
    }
    openChallenge(buildChallenge(space));
  }

  function buildFinalMealChallenge(){
    return {
      kind:'finalMeal',
      title:'Final Meal Challenge',
      kicker:'🏁 FINAL CHALLENGE',
      prompt:'Answer all 3 questions correctly: What would you like for breakfast? What would you like for lunch? What would you like for dinner?',
      main:[cards.mealCard],
      support:[cards.answerWouldLike],
      extraTurn:false,
      nightPenalty:false,
      finalChallenge:true,
    };
  }

  function openFinalMealChallenge(){
    setBoardStatus(`${state.players[state.turn].name}: complete the Final Meal Challenge to win!`);
    openChallenge(buildFinalMealChallenge());
  }

  function buildChallenge(space){
    if(state.level===1) return buildLevel1(space);
    return buildLevel2(space);
  }

  function buildLevel1(space){
    if(space.type==='nightmarket') return {
      kind:'nightmarket', title:'Night Market Challenge', kicker:'SPECIAL SPACE',
      prompt:'Say the Night Market sentence clearly.',
      main:[cards.nightPicture], support:[cards.nightNoPic],
      extraTurn:false, nightPenalty:true
    };
    if(space.type==='meal'){
      const map={
        breakfast:{main:cards.breakfastPicture,support:[cards.breakfastNoPic,cards.breakfastHelp],title:'Breakfast Challenge'},
        lunch:{main:cards.lunchPicture,support:[cards.lunchNoPic],title:'Lunch Challenge'},
        dinner:{main:cards.dinnerPicture,support:[cards.dinnerNoPic,cards.dinnerCard],title:'Dinner Challenge'}
      }[space.meal];
      return {kind:space.meal,title:map.title,kicker:'MEAL BONUS',prompt:`Complete the ${space.meal} sentence aloud.`,main:[map.main],support:map.support,extraTurn:true};
    }
    const pool=[
      {kind:'breakfast',title:'Breakfast Sentence',prompt:'Look at the picture. Complete the sentence aloud.',main:[cards.breakfastPicture],support:[cards.breakfastNoPic,cards.breakfastHelp]},
      {kind:'lunch',title:'Lunch Sentence',prompt:'Look at the picture. Complete the sentence aloud.',main:[cards.lunchPicture],support:[cards.lunchNoPic]},
      {kind:'dinner',title:'Dinner Sentence',prompt:'Look at the picture. Complete the sentence aloud.',main:[cards.dinnerPicture],support:[cards.dinnerNoPic,cards.dinnerCard]},
      {kind:'yunlin',title:'Yunlin Sentence',prompt:'Complete the Yunlin sentence aloud.',main:[cards.yunlinPicture],support:[cards.yunlinNoPic,cards.noodles]},
      {kind:'nightmarketReview',title:'Night Market Review',prompt:'Read the Night Market sentence aloud.',main:[cards.nightPicture],support:[cards.nightNoPic]},
      {kind:'meals',title:'Three Meals',prompt:'Name the three main meals.',main:[cards.mealCard],support:[]},
    ];
    return {...rand(pool),kicker:'DRAW A FLASHCARD',extraTurn:false,nightPenalty:false};
  }

  function buildLevel2(space){
    if(space.type==='nightmarket') return {
      kind:'nightmarket',title:'Night Market Review',kicker:'SPECIAL SPACE',
      prompt:'Say the Night Market sentence. Then the team misses 1 turn because it is late.',
      main:[cards.nightPicture],support:[cards.nightNoPic],nightPenalty:true,extraTurn:false
    };
    if(space.type==='meal') return dialogueChallenge(space.meal,true);
    const pool=[
      dialogueChallenge('breakfast',false), dialogueChallenge('lunch',false), dialogueChallenge('dinner',false),
      {kind:'yunlin',title:'Yunlin Recommendation',kicker:'REVIEW CARD',prompt:'Complete the Yunlin sentence aloud.',main:[cards.yunlinPicture],support:[cards.yunlinNoPic,cards.noodles],extraTurn:false},
      {kind:'reviewLunch',title:'Week 4 Review',kicker:'REVIEW CARD',prompt:'Complete the food sentence aloud.',main:[cards.lunchPicture],support:[cards.lunchNoPic],extraTurn:false},
      {kind:'reviewDinner',title:'Week 4 Review',kicker:'REVIEW CARD',prompt:'Complete the food sentence aloud.',main:[cards.dinnerPicture],support:[cards.dinnerNoPic,cards.dinnerCard],extraTurn:false},
    ];
    return rand(pool);
  }

  function dialogueChallenge(meal,isBonus){
    const title=meal[0].toUpperCase()+meal.slice(1)+' Dialogue';
    const foodCard=meal==='breakfast'?cards.breakfastPicture:meal==='lunch'?cards.noodles:cards.dinnerPicture;
    const questionCard=meal==='breakfast'?cards.questionBreakfast:null;
    return {
      kind:'dialogue',meal,title,kicker:isBonus?'MEAL BONUS • DIALOGUE':'DIALOGUE CARD',
      prompt:`Partner asks: “What would you like for ${meal}?” Current player answers: “I would like some ___.”${isBonus?' Then say one “I eat ___ for '+meal+'.” review sentence.':''}`,
      main:questionCard?[questionCard,foodCard]:[foodCard],
      support:[cards.answerWouldLike, ...(meal==='breakfast'?[cards.answerBreakfast]:[])],
      extraTurn:isBonus,nightPenalty:false
    };
  }


  function challengeVoiceCues(ch){
    const cues=[];
    if((ch.kicker||'').includes('MEAL BONUS')) cues.push('mealBonus','mealChallenge');
    switch(ch.kind){
      case 'breakfast':
        cues.push('breakfastCard','lookPicture','completeSentence','eatBreakfast'); break;
      case 'lunch':
      case 'reviewLunch':
        cues.push('lunchCard','lookPicture','completeSentence','eatLunch'); break;
      case 'dinner':
      case 'reviewDinner':
        cues.push('dinnerCard','lookPicture','completeSentence','eatDinner'); break;
      case 'yunlin':
        cues.push('yunlinCard','completeYunlin','eatYunlin'); break;
      case 'nightmarket':
      case 'nightmarketReview':
        cues.push('nightMarketCard','readSentence','nightMarketSentence'); break;
      case 'meals':
        // Do NOT play the answer here. The answer audio is reserved for teacher help.
        cues.push('threeMealsCard','nameThreeMeals'); break;
      case 'finalMeal':
        cues.push('mealChallenge','questionBreakfast','questionLunch','questionDinner'); break;
      case 'dialogue':
        cues.push('dialogueCard','askPartnerQuestion');
        cues.push(ch.meal==='breakfast'?'questionBreakfast':ch.meal==='lunch'?'questionLunch':'questionDinner');
        if(ch.meal==='lunch') cues.push('foodCard','noodles');
        cues.push('answerQuestion','wouldLikeSome');
        if(ch.extraTurn){
          cues.push('repeatSentence',ch.meal==='breakfast'?'eatBreakfast':ch.meal==='lunch'?'eatLunch':'eatDinner');
        }
        break;
    }
    return cues;
  }

  function supportVoiceCues(ch){
    if(!ch) return ['tryAgain','repeatSentence'];
    switch(ch.kind){
      case 'finalMeal': return ['tryAgain','wouldLikeSome','repeatSentence'];
      case 'meals': return ['tryAgain','threeMealsAnswer','repeatSentence'];
      case 'breakfast': return ['tryAgain','breakfastExample','repeatSentence'];
      case 'dinner':
      case 'reviewDinner': return ['tryAgain','dinnerExample','repeatSentence'];
      case 'yunlin': return ['tryAgain','foodCard','noodles','repeatSentence'];
      case 'dialogue': return ['tryAgain','wouldLikeSome','repeatSentence'];
      default: return ['tryAgain','repeatSentence'];
    }
  }

  const funnyVoiceMap = {
    'ROBOT VOICE':['robotVoice','robotInstruction'],
    'WHISPER MODE':['whisperMode','whisperInstruction'],
    'TV PRESENTER':['tvPresenter','tvInstruction'],
    'SUPER SLOW':['superSlow','superSlowInstruction'],
    'CHEF VOICE':['chefVoice','chefInstruction'],
    'DRAMA MODE':['dramaMode','dramaInstruction'],
  };

  function openChallenge(challenge){
    state.currentChallenge=challenge;
    state.phase='challenge';
    el('challengeKicker').textContent=challenge.kicker||'DRAW A CARD';
    el('challengeTitle').textContent=challenge.title;
    el('challengePrompt').textContent=challenge.prompt;
    const stage=el('cardStage');
    stage.innerHTML=challenge.main.map((c,i)=>`<img class="flash-card ${challenge.main.length===1?'single':''}" src="${c.src}" alt="${escapeHtml(c.label)}">`).join('');
    el('supportStage').classList.add('hidden'); el('supportStage').innerHTML='';
    el('supportBtn').classList.toggle('hidden',!challenge.support?.length);
    el('helpAnswerBtn').textContent='Need help';
    el('helpAnswerBtn').dataset.mode='help';
    el('correctBtn').classList.remove('hidden');
    el('wrongBtn').classList.remove('hidden');

    const funny=state.settings.funny && Math.random()<0.30 && challenge.kind!=='nightmarket' && challenge.kind!=='finalMeal' ? rand(funnyChallenges):null;
    const badge=el('funnyBadge');
    if(funny){badge.innerHTML=`<div style="font-size:1.55rem">${funny[0]}</div>${funny[1]}<br><small>${funny[2]}</small>`;badge.classList.remove('hidden')}
    else badge.classList.add('hidden');

    sound.click();
    openModal('challengeModal');
    setBoardStatus(`${state.players[state.turn].name}: complete the flashcard challenge.`);
    renderTurn();
    const voiceCues=challengeVoiceCues(challenge);
    if(funny) voiceCues.push(...(funnyVoiceMap[funny[1]]||[]));
    voice.play(voiceCues);
  }

  function showSupport(){
    const ch=state.currentChallenge;
    if(!ch?.support?.length) return;
    const s=el('supportStage');
    s.innerHTML=`<div class="eyebrow">SUPPORT CARDS</div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:7px">${ch.support.map(c=>`<img class="flash-card" src="${c.src}" alt="${escapeHtml(c.label)}">`).join('')}</div>`;
    s.classList.remove('hidden');
    el('supportBtn').classList.add('hidden');
  }

  async function markCorrect(){
    if(state.phase!=='challenge') return;
    const ch=state.currentChallenge, p=state.players[state.turn];
    sound.correct();
    closeModal('challengeModal');
    state.phase='resolving';

    // FINISH is not an automatic win: all three final meal questions must be correct.
    if(ch?.finalChallenge){
      clearSave();
      sound.winner();
      await showEvent('🏆',`${p.name} wins!`,`Fantastic English! ${p.name} completed the Final Meal Challenge.`,'Play again',['correct','finish','youWin','fantasticEnglish','playAgain3']);
      resetGame(true);
      return;
    }

    const wasBonusRoll=state.bonusRollActive;
    p.streak++;
    if(ch.nightPenalty) p.skip=Math.max(p.skip,1);

    const hitStreak=p.streak>=3;
    if(hitStreak){
      p.streak=0;
      sound.power();
      await showEvent('⭐','Yunlin Star Boost!',`Three correct answers in a row! ${p.name} moves +1 space.`,'Boost!',['yunlinStarBoost','moveExtra']);
      await bonusMoveOne();
    }

    if(state.settings.surprises && Math.random()<0.30){
      await awardSurprise();
      if(state.phase==='setup') return;
    }

    if(ch.nightPenalty){
      sound.night();
      await showEvent('🌙','It is late!',`${p.name} answered correctly. The Night Market penalty still marks the next scheduled turn to be missed.`,'OK');
    }

    if(!wasBonusRoll){
      // A correct answer earns exactly ONE immediate bonus roll.
      state.bonusRollActive=true;
      sound.meal();
      await showEvent('✅','Correct!',`${p.name} answered correctly and gets one bonus roll.`,'Roll again',['correct','greatJob','playAgain']);
      state.phase='roll';
      renderAll();
      setBoardStatus(`${p.name}: bonus roll — this extra turn cannot create another bonus roll.`);
    }else{
      // Correct during the bonus roll ends the chain.
      state.bonusRollActive=false;
      await showEvent('✅','Correct!',`${p.name} answered correctly. Bonus turn complete — next player.`,'Next player',['correct','greatJob']);
      endTurn();
    }
  }

  async function markWrong(){
    if(state.phase!=='challenge') return;
    const ch=state.currentChallenge, p=state.players[state.turn];
    sound.wrong();
    closeModal('challengeModal');
    state.phase='resolving';
    p.streak=0;

    if(ch?.finalChallenge){
      // At FINISH, a wrong final challenge does not send the token backward.
      // The player stays on FINISH and retries on the next eligible turn.
      await showEvent('🏁','Final challenge not completed',`${p.name} stays on FINISH and can try the Final Meal Challenge again next turn.`,'Next player',['wrong','tryAgain']);
      endTurn();
      return;
    }

    // Core rule: wrong answer = miss the player's next scheduled turn.
    p.skip=Math.max(p.skip,1);
    await showEvent('❌','Wrong answer',`${p.name} misses the next turn.`,'Next player',['wrong','missNextTurn']);
    endTurn();
  }

  function markNeedHelp(){
    if(state.phase!=='challenge') return;
    sound.help();
    showSupport();
    voice.play(supportVoiceCues(state.currentChallenge));
    const p=state.players[state.turn]; p.streak=0;
    el('helpAnswerBtn').textContent='Repeat it → End turn';
    el('helpAnswerBtn').dataset.mode='finish';
    el('correctBtn').classList.add('hidden');
    el('wrongBtn').classList.add('hidden');
    toast('Teacher helps. Student repeats the sentence.');
  }

  async function finishHelpTurn(){
    const ch=state.currentChallenge, p=state.players[state.turn];
    closeModal('challengeModal');
    if(ch?.nightPenalty) p.skip=1;
    el('helpAnswerBtn').dataset.mode='help';
    el('correctBtn').classList.remove('hidden');
    el('wrongBtn').classList.remove('hidden');
    if(ch?.nightPenalty){ sound.night(); await showEvent('🌙','Night Market',`${p.name} will miss 1 turn because it is late.`,'OK'); }
    endTurn();
  }

  async function awardSurprise(){
    const p=state.players[state.turn];
    sound.power();
    const item=rand(['boost','shield','lucky','again']);
    if(item==='boost'){
      await showEvent('🍜','Snack Boost!',`Surprise! ${p.name} moves +1 space.`,'Go!',['surprise','snackBoost','moveExtra2']);
      await bonusMoveOne();
      return;
    }
    if(item==='again'){
      // Do not stack extra turns: the correct-answer bonus already supplies the one allowed bonus roll.
      await showEvent('🎟️','Lucky Meal Pass!',`${p.name} keeps the one bonus roll earned for the correct answer. Extra turns do not stack.`,'Nice!',['surprise','luckyMealPass','extraTurn']);
      return;
    }
    const desired=item==='shield'?'restShield':'luckyDice';
    if(p.power){
      await showEvent('🎁','Power-up converted!',`${p.name} already has a power-up, so the new item becomes +1 space.`,'Move +1',['surprise','moveExtra']);
      await bonusMoveOne();
    }else{
      p.power=desired;
      await showEvent(item==='shield'?'🛡️':'🎲',item==='shield'?'Rest Shield!':'Lucky Dice!',item==='shield'?`${p.name} can cancel the next REST penalty.`:`On the next roll, ${p.name} rolls twice and keeps the higher number.`,'Save it',item==='shield'?['surprise','restShield','doNotMissTurn']:['surprise','luckyDice','rollTwice']);
    }
  }

  async function bonusMoveOne(){
    const p=state.players[state.turn];
    const finishIndex=route.length-1;
    if(p.pos>=finishIndex-1){
      await showEvent('🎯','Exact roll needed!',`A boost cannot move ${p.name} onto FINISH. FINISH must be reached with an exact dice roll.`,'OK',['tryAgain']);
      return false;
    }
    p.pos++;
    renderTokens();renderPlayers();sound.step();await sleep(380);saveGame();
    return true;
  }

  function endTurn(){
    state.currentChallenge=null;
    state.bonusRollActive=false;
    state.extraTurn=false;
    state.turn=(state.turn+1)%state.players.length;
    state.roundTurn++;
    beginTurn();
  }

  function showEvent(icon,title,text,button='Continue',voiceCues=null){
    return new Promise(resolve=>{
      el('eventIcon').textContent=icon;
      el('eventTitle').textContent=title;
      el('eventText').textContent=text;
      el('eventBtn').textContent=button;
      el('eventBtn').onclick=()=>{voice.stop();closeModal('eventModal');resolve()};
      openModal('eventModal');
      if(voiceCues) voice.play(voiceCues);
    });
  }

  function startGame(level,names){
    sound.unlock();
    voice.unlock();
    clearSave();
    state.level=Number(level)||1;
    state.players=names.map((n,i)=>playerTemplate(n,i));
    state.turn=0;state.roundTurn=1;state.phase='roll';state.currentChallenge=null;state.bonusRollActive=false;
    closeModal('setupModal');
    el('dice').querySelector('span').textContent='?';
    renderAll();
    setBoardStatus(`${state.players[0].name}: roll the die!`);
    voice.play(['yourTurn','rollDie']);
  }

  function resumeGame(){
    sound.unlock();
    voice.unlock();
    const s=savedGame(); if(!s) return;
    state.level=s.level||1; state.players=s.players||[]; state.turn=s.turn||0; state.roundTurn=s.roundTurn||1; state.settings=s.settings||state.settings; state.bonusRollActive=!!s.bonusRollActive; state.phase='roll';
    el('surpriseToggle').checked=state.settings.surprises;
    el('funnyToggle').checked=state.settings.funny;
    el('soundToggle').checked=state.settings.sound!==false;
    closeModal('setupModal'); renderAll(); beginTurn();
  }

  function resetGame(openSetup=false){
    voice.stop();
    clearSave();
    state.players=[]; state.turn=0; state.roundTurn=1; state.phase='setup'; state.currentChallenge=null; state.extraTurn=false; state.bonusRollActive=false;
    el('tokenLayer').innerHTML='';
    el('dice').querySelector('span').textContent='?';
    if(openSetup){
      el('setupModal').classList.add('open');
      el('resumeBtn').classList.add('hidden');
    }
  }

  function populateDeck(){
    const unique=[cards.noodles,cards.mealCard,cards.breakfastPicture,cards.breakfastNoPic,cards.breakfastHelp,cards.lunchPicture,cards.lunchNoPic,cards.dinnerPicture,cards.dinnerNoPic,cards.dinnerCard,cards.yunlinPicture,cards.yunlinNoPic,cards.nightPicture,cards.nightNoPic,cards.questionBreakfast,cards.answerWouldLike,cards.answerBreakfast];
    el('deckGrid').innerHTML=unique.map(c=>`<div class="deck-item"><img loading="lazy" src="${c.src}" alt="${escapeHtml(c.label)}"><span>${escapeHtml(c.label)}</span></div>`).join('');
  }

  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  // Setup interactions
  qsa('.level-option').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('.level-option').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected'); state.selectedLevel=Number(btn.dataset.level);
  }));

  qsa('.player-count-option').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('.player-count-option').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    state.selectedPlayerCount=Number(btn.dataset.count)||4;
    qsa('.player-name-label').forEach((label,idx)=>label.classList.toggle('player-disabled',idx>=state.selectedPlayerCount));
  }));

  el('startBtn').addEventListener('click',()=>{
    const names=qsa('.player-name-input').slice(0,state.selectedPlayerCount).map((i,idx)=>i.value.trim()||`Player ${idx+1}`);
    startGame(state.selectedLevel,names);
  });
  el('resumeBtn').addEventListener('click',resumeGame);
  el('rollBtn').addEventListener('click',rollDice);
  el('supportBtn').addEventListener('click',showSupport);
  el('correctBtn').addEventListener('click',markCorrect);
  el('wrongBtn').addEventListener('click',markWrong);
  el('helpAnswerBtn').addEventListener('click',()=>{
    if(el('helpAnswerBtn').dataset.mode==='finish') finishHelpTurn();
    else markNeedHelp();
  });
  el('helpBtn').addEventListener('click',()=>openModal('rulesModal'));
  qsa('.close-modal').forEach(x=>x.addEventListener('click',()=>closeModal('rulesModal')));
  el('cardsBtn').addEventListener('click',()=>{populateDeck();openModal('deckModal')});
  qsa('.close-deck').forEach(x=>x.addEventListener('click',()=>closeModal('deckModal')));
  el('surpriseToggle').addEventListener('change',e=>{state.settings.surprises=e.target.checked;saveGame()});
  el('funnyToggle').addEventListener('change',e=>{state.settings.funny=e.target.checked;saveGame()});
  el('soundToggle').addEventListener('change',e=>{state.settings.sound=e.target.checked;if(e.target.checked){sound.unlock();voice.unlock();sound.correct();voice.play('greatJob')}else{voice.stop()}saveGame()});
  el('fullscreenBtn').addEventListener('click',async()=>{
    try{if(!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen()}catch{}
  });
  el('resetBtn').addEventListener('click',()=>{if(confirm('Reset the Food Adventure Race and return all puppets to START?')) resetGame(true)});

  // Keyboard shortcuts for a teacher at the projector/computer.
  document.addEventListener('keydown',e=>{
    if(e.key===' ' && state.phase==='roll' && !document.querySelector('.modal.open')){e.preventDefault();rollDice()}
    if((e.key==='c'||e.key==='C') && state.phase==='challenge'){markCorrect()}
    if((e.key==='w'||e.key==='W') && state.phase==='challenge'){markWrong()}
    if((e.key==='h'||e.key==='H') && state.phase==='challenge'){markNeedHelp()}
    if((e.key==='f'||e.key==='F') && !document.querySelector('input:focus')) el('fullscreenBtn').click();
  });

  // Initial saved-game option
  if(savedGame()) el('resumeBtn').classList.remove('hidden');
})();
