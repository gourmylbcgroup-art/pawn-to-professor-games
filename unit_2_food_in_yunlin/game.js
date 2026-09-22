(() => {
  'use strict';

  const AS = 'assets/';
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
    pendingEvent:null,
    extraTurn:false,
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
      roundTurn:state.roundTurn, phase:'roll', settings:state.settings
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
      await showEvent('💤','Resting turn',`${p.name} rests this turn. After eating, the stomach needs a little rest!`,'Skip turn');
      p.skip--;
      endTurn();
    }else{
      setBoardStatus(`${p.name}: roll the die!`);
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
    if(b!==null) toast(`🎲 Lucky Dice: ${a} and ${b} → move ${roll}`);
    setBoardStatus(`${p.name} rolled ${roll}.`);
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
      clearSave();
      sound.winner();
      await showEvent('🏆',`${p.name} wins!`,`Fantastic English! ${p.name} reached FINISH in the Three Meals in Yunlin Food Adventure Race.`,'Play again');
      resetGame(true); return;
    }
    if(space.type==='rest'){
      if(p.power==='restShield'){
        p.power=null;
        sound.power();
        await showEvent('🛡️','Rest Shield!',`${p.name} uses the Rest Shield and does NOT miss a turn.`,'Great!');
      }else{
        p.skip=1;
        p.streak=0;
        sound.rest();
        await showEvent('🪑','REST',`Your stomach is full. Rest! ${p.name} will miss 1 turn.`,'OK');
      }
      endTurn(); return;
    }
    openChallenge(buildChallenge(space));
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
      return {kind:space.meal,title:map.title,kicker:'MEAL BONUS',prompt:`Complete the ${space.meal} sentence. Correct = play again!`,main:[map.main],support:map.support,extraTurn:true};
    }
    const pool=[
      {kind:'breakfast',title:'Breakfast Sentence',prompt:'Look at the picture. Complete the sentence aloud.',main:[cards.breakfastPicture],support:[cards.breakfastNoPic,cards.breakfastHelp]},
      {kind:'lunch',title:'Lunch Sentence',prompt:'Look at the picture. Complete the sentence aloud.',main:[cards.lunchPicture],support:[cards.lunchNoPic]},
      {kind:'dinner',title:'Dinner Sentence',prompt:'Look at the picture. Complete the sentence aloud.',main:[cards.dinnerPicture],support:[cards.dinnerNoPic,cards.dinnerCard]},
      {kind:'yunlin',title:'Yunlin Sentence',prompt:'Complete the Yunlin sentence aloud.',main:[cards.yunlinPicture],support:[cards.yunlinNoPic,cards.noodles]},
      {kind:'nightmarketReview',title:'Night Market Review',prompt:'Read the Night Market sentence aloud.',main:[cards.nightPicture],support:[cards.nightNoPic]},
      {kind:'meals',title:'Three Meals',prompt:'Name the three main meals: breakfast, lunch and dinner.',main:[cards.mealCard],support:[]},
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

    const funny=state.settings.funny && Math.random()<0.30 && challenge.kind!=='nightmarket' ? rand(funnyChallenges):null;
    const badge=el('funnyBadge');
    if(funny){badge.innerHTML=`<div style="font-size:1.55rem">${funny[0]}</div>${funny[1]}<br><small>${funny[2]}</small>`;badge.classList.remove('hidden')}
    else badge.classList.add('hidden');

    sound.click();
    openModal('challengeModal');
    setBoardStatus(`${state.players[state.turn].name}: complete the flashcard challenge.`);
    renderTurn();
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
    p.streak++;
    state.extraTurn=!!ch.extraTurn;
    if(ch.nightPenalty) p.skip=1;

    const hitStreak=p.streak>=3;
    if(hitStreak){
      p.streak=0;
      sound.power();
      await showEvent('⭐','Yunlin Star Boost!',`Three correct answers in a row! ${p.name} moves +1 space.`,'Boost!');
      await bonusMoveOne();
      if(route[p.pos].type==='finish'){
        clearSave();
        sound.winner();
        await showEvent('🏆',`${p.name} wins!`,`The Star Boost reached FINISH! Fantastic English!`,'Play again');
        resetGame(true); return;
      }
    }

    if(state.settings.surprises && Math.random()<0.30){
      await awardSurprise();
      if(state.phase==='setup') return;
    }

    if(ch.nightPenalty){
      sound.night();
      await showEvent('🌙','It is late!',`${p.name} said the Night Market sentence. Now miss 1 turn because it is late.`,'OK');
    }

    if(state.extraTurn){
      state.extraTurn=false;
      sound.meal();
      await showEvent('🍽️','Meal Bonus!',`Correct meal challenge! ${p.name} plays again.`,'Roll again');
      state.phase='roll'; renderAll(); setBoardStatus(`${p.name}: meal bonus — roll again!`); return;
    }
    endTurn();
  }

  function markNeedHelp(){
    if(state.phase!=='challenge') return;
    sound.help();
    showSupport();
    const p=state.players[state.turn]; p.streak=0;
    el('helpAnswerBtn').textContent='Repeat it → End turn';
    el('helpAnswerBtn').dataset.mode='finish';
    el('correctBtn').classList.add('hidden');
    toast('Teacher helps. Student repeats the sentence.');
  }

  async function finishHelpTurn(){
    const ch=state.currentChallenge, p=state.players[state.turn];
    closeModal('challengeModal');
    if(ch?.nightPenalty) p.skip=1;
    el('helpAnswerBtn').dataset.mode='help';
    el('correctBtn').classList.remove('hidden');
    if(ch?.nightPenalty){ sound.night(); await showEvent('🌙','Night Market',`${p.name} will miss 1 turn because it is late.`,'OK'); }
    endTurn();
  }

  async function awardSurprise(){
    const p=state.players[state.turn];
    sound.power();
    const item=rand(['boost','shield','lucky','again']);
    if(item==='boost'){
      await showEvent('🍜','Snack Boost!',`Surprise! ${p.name} moves +1 space.`,'Go!');
      await bonusMoveOne();
      if(route[p.pos].type==='finish'){
        clearSave();
        sound.winner();
        await showEvent('🏆',`${p.name} wins!`,`The Snack Boost reached FINISH!`,'Play again');
        resetGame(true);
      }
      return;
    }
    if(item==='again'){
      state.extraTurn=true;
      await showEvent('🎟️','Lucky Meal Pass!',`${p.name} earns an extra turn after this challenge.`,'Nice!');
      return;
    }
    const desired=item==='shield'?'restShield':'luckyDice';
    if(p.power){
      await showEvent('🎁','Power-up converted!',`${p.name} already has a power-up, so the new item becomes +1 space.`,'Move +1');
      await bonusMoveOne();
    }else{
      p.power=desired;
      await showEvent(item==='shield'?'🛡️':'🎲',item==='shield'?'Rest Shield!':'Lucky Dice!',item==='shield'?`${p.name} can cancel the next REST penalty.`:`On the next roll, ${p.name} rolls twice and keeps the higher number.`,'Save it');
    }
  }

  async function bonusMoveOne(){
    const p=state.players[state.turn];
    if(p.pos<route.length-1){p.pos++;renderTokens();renderPlayers();sound.step();await sleep(380);saveGame()}
  }

  function endTurn(){
    state.currentChallenge=null;
    state.turn=(state.turn+1)%state.players.length;
    state.roundTurn++;
    beginTurn();
  }

  function showEvent(icon,title,text,button='Continue'){
    return new Promise(resolve=>{
      el('eventIcon').textContent=icon;
      el('eventTitle').textContent=title;
      el('eventText').textContent=text;
      el('eventBtn').textContent=button;
      el('eventBtn').onclick=()=>{closeModal('eventModal');resolve()};
      openModal('eventModal');
    });
  }

  function startGame(level,names){
    sound.unlock();
    clearSave();
    state.level=Number(level)||1;
    state.players=names.map((n,i)=>playerTemplate(n,i));
    state.turn=0;state.roundTurn=1;state.phase='roll';state.currentChallenge=null;
    closeModal('setupModal');
    el('dice').querySelector('span').textContent='?';
    renderAll();
    setBoardStatus(`${state.players[0].name}: roll the die!`);
  }

  function resumeGame(){
    sound.unlock();
    const s=savedGame(); if(!s) return;
    state.level=s.level||1; state.players=s.players||[]; state.turn=s.turn||0; state.roundTurn=s.roundTurn||1; state.settings=s.settings||state.settings; state.phase='roll';
    el('surpriseToggle').checked=state.settings.surprises;
    el('funnyToggle').checked=state.settings.funny;
    el('soundToggle').checked=state.settings.sound!==false;
    closeModal('setupModal'); renderAll(); beginTurn();
  }

  function resetGame(openSetup=false){
    clearSave();
    state.players=[]; state.turn=0; state.roundTurn=1; state.phase='setup'; state.currentChallenge=null; state.extraTurn=false;
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

  el('startBtn').addEventListener('click',()=>{
    const names=qsa('.player-name-input').map((i,idx)=>i.value.trim()||`Player ${idx+1}`);
    startGame(state.selectedLevel,names);
  });
  el('resumeBtn').addEventListener('click',resumeGame);
  el('rollBtn').addEventListener('click',rollDice);
  el('supportBtn').addEventListener('click',showSupport);
  el('correctBtn').addEventListener('click',markCorrect);
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
  el('soundToggle').addEventListener('change',e=>{state.settings.sound=e.target.checked;if(e.target.checked){sound.unlock();sound.correct()}saveGame()});
  el('fullscreenBtn').addEventListener('click',async()=>{
    try{if(!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen()}catch{}
  });
  el('resetBtn').addEventListener('click',()=>{if(confirm('Reset the Food Adventure Race and return all puppets to START?')) resetGame(true)});

  // Keyboard shortcuts for a teacher at the projector/computer.
  document.addEventListener('keydown',e=>{
    if(e.key===' ' && state.phase==='roll' && !document.querySelector('.modal.open')){e.preventDefault();rollDice()}
    if((e.key==='c'||e.key==='C') && state.phase==='challenge'){markCorrect()}
    if((e.key==='h'||e.key==='H') && state.phase==='challenge'){markNeedHelp()}
    if((e.key==='f'||e.key==='F') && !document.querySelector('input:focus')) el('fullscreenBtn').click();
  });

  // Initial saved-game option
  if(savedGame()) el('resumeBtn').classList.remove('hidden');
})();
