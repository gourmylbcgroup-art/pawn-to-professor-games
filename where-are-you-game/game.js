(() => {
  "use strict";
  const C = window.GAME_CONFIG;

  // Coordinates match the 10 x 5 artwork grid.
  const X = [9.2, 17.6, 26.6, 35.8, 44.9, 54.3, 63.9, 73.2, 82.5, 91.2];
  const Y = [21.9, 37.1, 52.4, 67.8, 83.0];

  // New board labels: top-left is CAFE and top-right is FINISH.
  const LABELS = [
    ["cafe","hospital","school","supermarket","bank","park","store","night market","tea shop","finish"],
    ["library","cafe","tea shop","night market","store","park","bank","supermarket","school","hospital"],
    ["hospital","school","supermarket","bank","park","store","night market","tea shop","cafe","library"],
    ["library","cafe","tea shop","night market","store","park","bank","supermarket","school","hospital"],
    ["start","hospital","school","supermarket","bank","park","store","night market","tea shop","library"]
  ];

  // Start bottom-left and finish top-right.
  const PATH = [];
  for (let c=0;c<10;c++) PATH.push({r:4,c});
  for (let c=9;c>=0;c--) PATH.push({r:3,c});
  for (let c=0;c<10;c++) PATH.push({r:2,c});
  for (let c=9;c>=0;c--) PATH.push({r:1,c});
  for (let c=0;c<10;c++) PATH.push({r:0,c});

  const FLASHCARDS = {
    "hospital": "assets/flashcards/hospital.png",
    "school": "assets/flashcards/school.png",
    "supermarket": "assets/flashcards/supermarket.png",
    "bank": "assets/flashcards/bank.png",
    "park": "assets/flashcards/park.png",
    "store": "assets/flashcards/store.png",
    "night market": "assets/flashcards/night_market.png",
    "tea shop": "assets/flashcards/tea_shop.png",
    "cafe": "assets/flashcards/cafe.png",
    "library": "assets/flashcards/library.png"
  };

  const $ = s => document.querySelector(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const diceChars = ["","⚀","⚁","⚂","⚃","⚄","⚅"];

  let playerCount = 2;
  let players = [];
  let current = 0;
  let busy = false;
  let soundOn = true;
  let gameOver = false;
  let selectedCount = 2;
  let lastDiceRoll = null;
  let diceBag = [];
  let goldenBag = [];
  let extraTurnPending = false;

  const audio = {};
  for (const [key, src] of Object.entries(C.sounds)) {
    audio[key] = new Audio(src);
    audio[key].preload = "auto";
  }

  function playSound(name, restart=true) {
    if (!soundOn || !audio[name]) return;
    try {
      if (restart) audio[name].currentTime = 0;
      audio[name].play().catch(()=>{});
    } catch (_) {}
  }

  function speak(text, filePath=null) {
    if (!soundOn) return;
    if (C.useRecordedVoices && filePath) {
      const a = new Audio(filePath);
      a.play().catch(() => browserSpeak(text));
    } else {
      browserSpeak(text);
    }
  }
  function browserSpeak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.82;
      u.pitch = 1.08;
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  function getSquareLabel(pos) {
    const p = PATH[Math.max(0, Math.min(PATH.length-1, pos))];
    return LABELS[p.r][p.c];
  }

  function createPlayers(n) {
    $("#tokensLayer").innerHTML = "";
    players = [];
    for (let i=0;i<n;i++) {
      const el = document.createElement("div");
      el.className = `token p${i+1}`;
      el.textContent = `P${i+1}`;
      $("#tokensLayer").appendChild(el);
      players.push({pos:0, el});
    }
    current = 0;
    gameOver = false;
    lastDiceRoll = null;
    diceBag = [];
    goldenBag = [];
    extraTurnPending = false;
    resetDiceDisplay();
    renderAll();
    updateTurn();
  }

  function offsetFor(index, n) {
    const sets = {
      1: [[0, 3.7]],
      2: [[-1.55, 3.7], [1.55, 3.7]],
      3: [[-2.15, 3.7], [0, 3.7], [2.15, 3.7]],
      4: [[-2.25, 3.15], [-0.75, 4.25], [0.75, 4.25], [2.25, 3.15]]
    };
    return (sets[n] || sets[4])[index] || [0, 3.7];
  }

  function renderAll() {
    const groups = new Map();
    players.forEach((p,i) => {
      const k = p.pos;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(i);
    });
    groups.forEach((ids, pos) => {
      ids.forEach((id, j) => positionToken(id, pos, j, ids.length));
    });
  }

  function positionToken(playerIndex, pos, stackIndex=0, stackCount=1) {
    const p = PATH[pos];
    if (!p) return;
    const el = players[playerIndex].el;
    const [ox,oy] = offsetFor(stackIndex, stackCount);
    el.style.left = `${X[p.c] + ox}%`;
    el.style.top = `${Y[p.r] + oy}%`;
  }

  function updateTurn() {
    $("#turnBadge").textContent = `PLAYER ${current+1}`;
  }

  function randomInt(min, max) {
    const range = max - min + 1;
    if (window.crypto && window.crypto.getRandomValues) {
      const limit = Math.floor(0x100000000 / range) * range;
      const a = new Uint32Array(1);
      do { window.crypto.getRandomValues(a); } while (a[0] >= limit);
      return min + (a[0] % range);
    }
    return min + Math.floor(Math.random() * range);
  }

  function shuffle(values) {
    const a = values.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function refillDiceBag() {
    diceBag = shuffle([1, 2, 3, 4, 5, 6]);
    if (lastDiceRoll !== null && diceBag[0] === lastDiceRoll) {
      const swapIndex = diceBag.findIndex((v, i) => i > 0 && v !== lastDiceRoll);
      if (swapIndex > 0) [diceBag[0], diceBag[swapIndex]] = [diceBag[swapIndex], diceBag[0]];
    }
  }

  function nextDiceRoll() {
    if (!diceBag.length) refillDiceBag();
    const roll = diceBag.shift();
    lastDiceRoll = roll;
    return roll;
  }

  function nextGoldenRoll() {
    if (!goldenBag.length) goldenBag = shuffle([true, false, false, false, false, false, false, false]);
    return goldenBag.shift();
  }

  function resetDiceDisplay() {
    const die = $("#diceFace");
    const result = $("#rollResult");
    const golden = $("#goldenStatus");
    if (die) die.classList.remove("golden");
    if (result) {
      result.textContent = "ROLL THE DICE";
      result.classList.remove("golden");
    }
    if (golden) golden.classList.add("hidden");
  }

  function showRollResult(roll, isGolden) {
    const die = $("#diceFace");
    const result = $("#rollResult");
    const golden = $("#goldenStatus");
    die.classList.toggle("golden", isGolden);
    result.textContent = `ROLLED: ${roll}`;
    result.classList.toggle("golden", isGolden);
    golden.classList.toggle("hidden", !isGolden);
  }

  async function animateDice() {
    const die = $("#diceFace");
    die.classList.remove("golden");
    $("#rollResult").classList.remove("golden");
    $("#goldenStatus").classList.add("hidden");
    $("#rollResult").textContent = "ROLLING…";
    die.classList.add("rolling");
    playSound("dice");
    const start = performance.now();
    while (performance.now() - start < C.diceAnimationMs) {
      const v = randomInt(1, 6);
      die.textContent = diceChars[v];
      await sleep(70 + randomInt(0, 45));
    }
    const roll = nextDiceRoll();
    const isGolden = nextGoldenRoll();
    extraTurnPending = isGolden;
    die.textContent = diceChars[roll];
    die.classList.remove("rolling");
    showRollResult(roll, isGolden);
    showToast(isGolden ? `✨ GOLDEN DICE! ${roll} — EXTRA TURN! ✨` : `🎲 YOU ROLLED ${roll}!`);
    await sleep(C.rollReadMs || 1800);
    hideToast();
    return roll;
  }

  async function moveBy(steps) {
    const player = players[current];
    player.el.classList.add("moving");
    const end = Math.min(PATH.length-1, player.pos + steps);
    while (player.pos < end) {
      player.pos++;
      renderAll();
      playSound("step");
      await sleep(C.stepDelay);
    }
    player.el.classList.remove("moving");
  }

  async function specialMoveIfNeeded() {
    const player = players[current];
    if (C.ladders[player.pos] !== undefined) {
      const destination = C.ladders[player.pos];
      showToast("🪜 MOVE UP!");
      playSound("ladder");
      speak("Move up!", C.voices.moveUp);
      await sleep(350);
      player.pos = destination;
      renderAll();
      await sleep(C.specialMoveMs);
      hideToast();
      return "ladder";
    }
    if (C.snakes[player.pos] !== undefined) {
      const destination = C.snakes[player.pos];
      showToast("🐍 SLIDE DOWN!");
      playSound("snake");
      speak("Slide down!", C.voices.slideDown);
      await sleep(350);
      player.pos = destination;
      renderAll();
      await sleep(C.specialMoveMs);
      hideToast();
      return "snake";
    }
    return null;
  }

  function showToast(t) {
    const el = $("#specialToast");
    el.textContent = t;
    el.classList.add("show");
  }
  function hideToast() { $("#specialToast").classList.remove("show"); }

  function showLandingFocus() {
    const player = players[current];
    const p = PATH[player.pos];
    if (!p) return;
    const h = $("#landingHighlight");
    h.style.left = `${X[p.c]}%`;
    h.style.top = `${Y[p.r]}%`;
    h.classList.add("show");
    player.el.classList.add("landed");
    player.el.classList.remove("corner-bounce");
    void player.el.offsetWidth;
    player.el.classList.add("corner-bounce");
  }

  function clearLandingFocus() {
    $("#landingHighlight").classList.remove("show");
    players.forEach(p => p.el.classList.remove("landed", "corner-bounce"));
  }

  async function landingPause() {
    showLandingFocus();
    await sleep(C.landingPauseMs || 3000);
  }

  async function takeTurn() {
    if (busy || gameOver) return;
    busy = true;
    $("#rollButton").disabled = true;
    $("#hud").classList.add("busy");
    const roll = await animateDice();
    await sleep(180);
    await moveBy(roll);

    if (players[current].pos >= PATH.length-1) {
      $("#hud").classList.remove("busy");
      await win(current);
      busy = false;
      return;
    }

    await specialMoveIfNeeded();

    if (players[current].pos >= PATH.length-1) {
      await win(current);
      busy = false;
      return;
    }

    await landingPause();

    $("#hud").classList.remove("busy");
    showQuestion();
    busy = false;
  }

  function updateQuestionFlashcard(label) {
    const img = $("#flashcardImage");
    const src = FLASHCARDS[label];
    if (src) {
      img.src = src;
      img.alt = `${label} flashcard`;
      img.classList.remove("hidden");
    } else {
      img.src = "";
      img.alt = "";
      img.classList.add("hidden");
    }
  }

  function showQuestion() {
    const label = getSquareLabel(players[current].pos);
    updateQuestionFlashcard(label);
    $("#questionOverlay").classList.remove("hidden");
    $("#answerReveal").textContent = `I'm at the ${label}.`;
    $("#answerReveal").classList.add("hiddenText");
    $("#checkAnswer").classList.remove("hidden");
    $("#nextPlayer").classList.add("hidden");
    $("#sentenceFrame").textContent = "I'm at the ______.";
    setTimeout(() => speak("Where are you?", C.voices.whereAreYou), 180);
  }

  function revealAnswer() {
    const label = getSquareLabel(players[current].pos);
    $("#answerReveal").classList.remove("hiddenText");
    $("#checkAnswer").classList.add("hidden");
    $("#nextPlayer").classList.remove("hidden");
    const file = C.voices.answers[label] || null;
    speak(`I'm at the ${label}.`, file);
  }

  function nextPlayer() {
    $("#questionOverlay").classList.add("hidden");
    clearLandingFocus();

    if (extraTurnPending) {
      extraTurnPending = false;
      updateTurn();
      showToast(`✨ GOLDEN DICE! PLAYER ${current + 1} ROLLS AGAIN!`);
      setTimeout(hideToast, 1400);
    } else {
      current = (current + 1) % playerCount;
      updateTurn();
    }

    $("#hud").classList.remove("busy");
    $("#rollButton").disabled = false;
  }

  async function win(winnerIndex) {
    clearLandingFocus();
    gameOver = true;
    playSound("win");
    speak("Great job!");
    $("#winnerText").textContent = `PLAYER ${winnerIndex+1} WINS!`;
    $("#winOverlay").classList.remove("hidden");
    makeConfetti();
  }

  function makeConfetti() {
    const host = $("#confetti");
    host.innerHTML = "";
    const colors = ["#ffcc00","#ff5b5b","#37b9ff","#69d14f","#a657ff","#ff8bd1"];
    for (let i=0;i<85;i++) {
      const d = document.createElement("div");
      d.className = "confettiPiece";
      d.style.left = `${Math.random()*100}%`;
      d.style.background = colors[i % colors.length];
      d.style.animationDelay = `${Math.random()*.75}s`;
      d.style.animationDuration = `${2.1+Math.random()*1.6}s`;
      host.appendChild(d);
    }
  }

  function startGame() {
    playerCount = selectedCount;
    createPlayers(playerCount);
    $("#setupOverlay").classList.add("hidden");
    $("#rollButton").disabled = false;
  }

  function resetToSetup() {
    clearLandingFocus();
    gameOver = false; busy = false;
    $("#winOverlay").classList.add("hidden");
    $("#questionOverlay").classList.add("hidden");
    $("#confetti").innerHTML = "";
    $("#setupOverlay").classList.remove("hidden");
    lastDiceRoll = null;
    diceBag = [];
    goldenBag = [];
    extraTurnPending = false;
    $("#diceFace").textContent = diceChars[randomInt(1, 6)];
    resetDiceDisplay();
    $("#hud").classList.remove("busy");
    $("#rollButton").disabled = true;
  }

  function restartCurrent() {
    if (!confirm("Restart the current game?")) return;
    clearLandingFocus();
    createPlayers(playerCount);
    $("#questionOverlay").classList.add("hidden");
    $("#winOverlay").classList.add("hidden");
    $("#confetti").innerHTML = "";
    $("#rollButton").disabled = false;
  }

  function toggleSound() {
    soundOn = !soundOn;
    $("#soundButton").textContent = soundOn ? "🔊" : "🔇";
    if (!soundOn && "speechSynthesis" in window) speechSynthesis.cancel();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  }

  document.querySelectorAll(".playerChoice").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCount = Number(btn.dataset.players);
      document.querySelectorAll(".playerChoice").forEach(b => b.classList.toggle("selected", b===btn));
    });
  });

  $("#startButton").addEventListener("click", startGame);
  $("#rollButton").addEventListener("click", takeTurn);
  $("#checkAnswer").addEventListener("click", revealAnswer);
  $("#nextPlayer").addEventListener("click", nextPlayer);
  $("#questionSpeaker").addEventListener("click", () => speak("Where are you?", C.voices.whereAreYou));
  $("#soundButton").addEventListener("click", toggleSound);
  $("#fullButton").addEventListener("click", toggleFullscreen);
  $("#restartButton").addEventListener("click", restartCurrent);
  $("#playAgainButton").addEventListener("click", () => {
    $("#winOverlay").classList.add("hidden");
    $("#confetti").innerHTML="";
    createPlayers(playerCount);
    $("#rollButton").disabled = false;
  });
  $("#newGameButton").addEventListener("click", resetToSetup);

  document.addEventListener("contextmenu", e => e.preventDefault());
  let lastTouchEnd = 0;
  document.addEventListener("touchend", e => {
    const now = Date.now();
    if (now-lastTouchEnd <= 280) e.preventDefault();
    lastTouchEnd = now;
  }, {passive:false});

  $("#rollButton").disabled = true;
})();
