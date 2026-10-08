const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const weeks=[['Monday','Tuesday'],['Wednesday','Thursday'],['Friday','Saturday','Sunday'],[...days]];
const labels=['Week 1 · Monday & Tuesday','Week 2 · Wednesday & Thursday','Week 3 · Friday, Saturday & Sunday','Week 4 · It’s + all seven days'];
const sections=['start','learn','practice','speak','soup','challenge'];const icons=['🌟','📖','👂','🎤','🍲','🏆'];
const $=id=>document.getElementById(id);const pick=a=>a[Math.floor(Math.random()*a.length)];const shuffle=a=>[...a].sort(()=>Math.random()-.5);
let week=Number(localStorage.getItem('magic_week')||0);if(week<0||week>3)week=0;
let section='start',index=0,round=0,score=0,answer='',locked=false,slide=0,voiceOn=true,subOn=true,musicOn=true,hideWords=false,mode='listen';
const song=$('song');const active=()=>weeks[week];const phrase=d=>week===3?`It's ${d}!`:d;const img=d=>`assets/${week===3?'sentences':'words'}/${d}.webp`;
function persist(){try{localStorage.setItem('magic_week',String(week));localStorage.setItem('magic_progress',JSON.stringify({week,section,round,score,updated:new Date().toISOString()}))}catch(e){}}
function setWeek(n){week=n;index=0;round=0;score=0;persist();drawWeeks();if(!$('lessonView').hidden)go('start')}
function drawWeeks(){$('weekbuttons').innerHTML=labels.map((l,i)=>`<button class="${i===week?'selected':''}" onclick="setWeek(${i})">Week ${i+1}</button>`).join('');$('weekdesc').textContent=labels[week]+(week===3?' · Full sentences':' · Day names only')}
function changeWeek(){home();$('weekbar').scrollIntoView({behavior:'smooth'})}
const VOICE_KEYS=["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "it-s-monday", "it-s-tuesday", "it-s-wednesday", "it-s-thursday", "it-s-friday", "it-s-saturday", "it-s-sunday", "correct", "try-again", "good-try", "well-done", "listen-carefully-which-day", "listen-again", "your-turn", "say-it-aloud", "let-s-practice", "listen-and-choose", "find-monday", "find-tuesday", "find-wednesday", "find-thursday", "find-friday", "find-saturday", "find-sunday", "which-day-is-it", "touch-the-correct-picture", "excellent", "now-it-s-your-turn", "look-at-the-picture", "say-the-day", "speak-loudly", "what-day-is-it", "can-you-say-it", "look-at-the-screen", "let-s-learn-together", "listen-to-the-day", "repeat-after-me", "monday-and-tuesday", "wednesday-and-thursday", "friday-saturday-sunday", "seven-days-of-the-week", "let-s-say-them-together", "monday-tuesday", "wednesday-thursday", "fantastic"];
const recordedVoice=new Audio();recordedVoice.preload='none';
function speak(t){
 if(subOn){const e=$('subtitle');if(e)e.textContent=t}
 recordedVoice.pause();recordedVoice.currentTime=0;
 if(!voiceOn)return;
 const key=t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const clip='assets/voice/'+key+'.mp3';
 if(VOICE_CLIPS.has(key)){recordedVoice.src=clip;recordedVoice.play().catch(()=>{});}
 else { // Avoid network-based speech services; local browser voice for missing recordings only.
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.78;speechSynthesis.speak(u)}catch(e){}
 }
}
const VOICE_CLIPS=new Set(VOICE_KEYS);

function toggleSong(){if(!musicOn)return;if(song.paused){song.play().then(()=>{$('songlabel').textContent='Pause Song'}).catch(()=>{})}else{song.pause();$('songlabel').textContent='Play Song'}}
function nav(){$('nav').innerHTML=sections.map((s,i)=>`<button class="${s===section?'active':''}" onclick="go('${s}')"><span>${icons[i]}</span>${['START','LEARN','PRACTICE','SPEAK','SOUP GAME','CHALLENGE'][i]}</button>`).join('')}
function wrap(title,obj,inner){$('content').innerHTML=`<div class="weeklabel">${labels[week]}</div><h2>${title}</h2><div class="objective">🎯 ${obj}</div>${inner}<p id="subtitle" class="caption center" aria-live="polite"></p><p class="center savehint">💾 Progress is saved automatically on this browser.</p>`}
function go(s){if(section==='soup'&&s!=='soup'){const frame=$('embeddedSoup');if(frame)frame.src='about:blank'}section=s;round=0;score=0;index=0;locked=false;nav();persist();render()}
function render(){if(section==='start')wrap('Start · Bubble Bubble!','Get ready to hear this week’s days.',`<div class="center"><div style="font-size:85px">🫧🍲🫧</div><p class="question">${week===3?'Let’s say full sentences!':'Meet '+active().join(' and ')+'!'}</p><p>Listen to the song, then learn only this week’s targets.</p><button class="primary" onclick="toggleSong()">🎵 Play / Pause Song</button><button class="primary" onclick="go('learn')">Learn →</button></div>`);else if(section==='learn')learn();else if(section==='practice')quiz(false);else if(section==='speak')speaking();else if(section==='soup')soup();else quiz(true)}
function learn(){let d=active()[index];wrap('Learn · Meet the Day','Look, listen and say '+(week===3?'the full sentence.':'the day name.'),`<p class="progress center">Card ${index+1} / ${active().length}</p><img class="bigcard" decoding="async" src="${img(d)}" alt="${phrase(d)}"><div class="center"><p class="question">${phrase(d)}</p><button class="secondary" onclick="speak(phrase('${d}'))">🔊 Listen</button><button class="secondary" onclick="index=(index+active().length-1)%active().length;learn()">← Previous</button><button class="primary" onclick="index=(index+1)%active().length;learn()">Next →</button></div>`)}
function options(d){let pool=active().filter(x=>x!==d);return shuffle([d,...shuffle(pool).slice(0,Math.min(2,pool.length))])}
function challengeImage(d){return 'assets/challenge-'+d.toLowerCase()+(d==='Saturday'?'.png':'.jpg')}
function quiz(final){
 const total=Math.max(3,active().length);
 if(round>=total){finish(final?'challenge':'practice',total);return}
 answer=active()[round%active().length];locked=false;
 if(final){
  wrap('Final Challenge','Listen and find the correct picture.',`<p class="progress center">Question ${round+1} / ${total} · Score ${score}</p><p class="question">👂 Listen carefully. Which day?</p><div class="center"><button class="secondary" onclick="challengePrompt()">🔊 Listen Again</button></div><div class="answers picture-answers">${options(answer).map(d=>`<button class="picture-choice" aria-label="Choose picture" onclick="check('${d}',true)"><img decoding="async" src="${challengeImage(d)}" alt="Day character picture" draggable="false"></button>`).join('')}</div><div class="feedback" id="feedback"></div><div class="center"><button class="primary hide" id="next" onclick="round++;persist();quiz(true)">Next →</button></div>`);
  $('content').classList.add('final-picture-only');challengePrompt();return;
 }
 $('content').classList.remove('final-picture-only');
 wrap('Practice · Listen and Find','Listen and choose the correct day.',`<p class="progress center">Question ${round+1} / ${total} · Score ${score}</p><p class="question">Listen carefully. Which day?</p><div class="center"><button class="secondary" onclick="speak(phrase('${answer}'))">🔊 Listen Again</button></div><div class="answers">${options(answer).map(d=>`<button onclick="check('${d}',false)">${phrase(d)}</button>`).join('')}</div><div class="feedback" id="feedback"></div><div class="center"><button class="primary hide" id="next" onclick="round++;persist();quiz(false)">Next →</button></div>`);speak(phrase(answer));
}
function challengePrompt(){speak(phrase(answer));const subtitle=$('subtitle');if(subtitle)subtitle.textContent=''}

function check(d,final){if(locked)return;locked=true;let ok=d===answer;if(ok)score++;$('feedback').textContent=ok?'⭐ Correct! '+phrase(answer):'Good try! '+phrase(answer);speak(ok?'Correct! '+phrase(answer):phrase(answer));$('next').classList.remove('hide');persist()}
function finish(type,total){persist();wrap(type==='soup'?'Soup Is Ready!':'Well Done!','You completed this week’s activity.',`<div class="center" style="font-size:80px">🏆🍲</div><p class="question">${score} / ${total} correct!</p><div class="center"><button class="primary" onclick="go('${type}')">Play Again</button><button class="secondary" onclick="go('${type==='practice'?'speak':type==='soup'?'challenge':'start'}')">Continue →</button></div>`)}
function speaking(){let d=active()[index];wrap('Speak · Your Turn','Say '+(week===3?'the complete sentence.':'the day name.')+ ' Teacher checks orally.',`<p class="progress center">Card ${index+1} / ${active().length}</p><img class="bigcard" decoding="async" src="${img(d)}"><p class="question">${hideWords?'Say it aloud!':phrase(d)}</p><div class="center"><button class="secondary" onclick="speak(phrase('${d}'))">🔊 Model</button><button class="secondary" onclick="hideWords=!hideWords;speaking()">${hideWords?'Show':'Hide'} Prompt</button><button class="primary" onclick="index=(index+1)%active().length;speaking()">Next →</button></div><p class="center small">No microphone required.</p>`)}
function soup(){
  song.pause();
  wrap('🍲 Magic Days Soup · Original Game','Play the attached Soup Game with the days from this week.',`<div class="center"><p><strong>${labels[week]}</strong></p><p>The original moving characters, continuous music, timer and endless mode are included.</p><button class="secondary" onclick="reloadSoup()">🔄 Restart Game</button><button class="primary" onclick="fullscreenSoup()">⛶ Full Screen Game</button><button class="secondary" onclick="openOriginalSoup()">↗ Open Game in New Tab</button></div><iframe id="embeddedSoup" title="Original Magic Days Soup Game" src="original-soup/index.html?week=${week}" style="display:block;width:100%;height:820px;border:4px solid #ffc65a;border-radius:22px;background:#f5ba70" allow="autoplay; fullscreen" allowfullscreen></iframe>`);
}
function fullscreenSoup(){const f=$('embeddedSoup');if(!f)return;const req=f.requestFullscreen||f.webkitRequestFullscreen;if(req){Promise.resolve(req.call(f)).catch(()=>openOriginalSoup())}else openOriginalSoup()}
function reloadSoup(){const f=$('embeddedSoup');if(f)f.src='original-soup/index.html?week='+week+'&restart='+Date.now()}
function catchDay(d){if(locked)return;if(d!==answer){$('feedback').textContent='🫧 Try again!';speak('Try again');return}locked=true;score++;$('feedback').textContent='🎉 Caught! '+phrase(answer);speak('Correct! '+phrase(answer));$('next').classList.remove('hide');persist()}
function openOriginalSoup(){window.open('original-soup/index.html?week='+week,'_blank','noopener')}
function openModal(kind){$('modal').hidden=false;document.body.style.overflow='hidden';if(kind==='flash'){$('modalbody').innerHTML=`<h2>🖼️ Teacher Flashcards · Week ${week+1}</h2><div class="cards">${active().map((d,i)=>`<button class="card" onclick="slide=${i};showSlide(false)"><img decoding="async" src="${img(d)}"><strong>${phrase(d)}</strong></button>`).join('')}</div>`}else if(kind==='present'){slide=0;showPresentation()}else settings()}
function showSlide(presentation){let d=active()[slide];$('modalbody').innerHTML=`<h2>${presentation?'📽️ Presentation':'🖼️ Flashcard Viewer'} · Week ${week+1}</h2><div class="slides"><img decoding="async" src="${img(d)}" alt="${phrase(d)}"><div><p>${slide+1} / ${active().length}</p><h2>${phrase(d)}</h2><button class="primary" onclick="speak(phrase('${d}'))">🔊 Listen</button><button class="secondary" onclick="slide=(slide+active().length-1)%active().length;showSlide(${presentation})">← Previous</button><button class="primary" onclick="slide=(slide+1)%active().length;showSlide(${presentation})">Next →</button></div></div>`}

const presentationSlides=50;
function showPresentation(){
 slide=Math.max(0,Math.min(presentationSlides-1,slide));
 const n=String(slide+1).padStart(2,'0');
 $('modalbody').innerHTML=`<div class="presentation-controls"><h2>📽️ Original Presentation · Slide ${slide+1} / ${presentationSlides}</h2><button class="secondary" onclick="slide=Math.max(0,slide-1);showPresentation()">← Previous</button><button class="primary" onclick="slide=Math.min(presentationSlides-1,slide+1);showPresentation()">Next →</button><button class="secondary" onclick="fullscreenPresentation()">⛶ Full Screen</button><label>Slide <input type="number" min="1" max="50" value="${slide+1}" style="width:65px" onchange="slide=Number(this.value)-1;showPresentation()"></label></div><img id="presentationImage" class="presentation-image" decoding="async" src="assets/presentation/slide-${n}.webp" alt="Original presentation slide ${slide+1}">`;
}
function fullscreenPresentation(){const img=$('presentationImage');if(!img)return;const req=img.requestFullscreen||img.webkitRequestFullscreen;if(req)req.call(img)}

function settings(){$('modalbody').innerHTML=`<h2>⚙️ Teacher Menu</h2><p>${labels[week]}</p><div class="settings"><label><input type="checkbox" ${voiceOn?'checked':''} onchange="voiceOn=this.checked;refreshHomeToggles()"> Voice</label><label><input type="checkbox" ${subOn?'checked':''} onchange="subOn=this.checked;refreshHomeToggles()"> Subtitles</label><label><input type="checkbox" ${musicOn?'checked':''} onchange="musicOn=this.checked;if(!musicOn)song.pause()"> Song enabled</label></div><p><button class="primary" onclick="if(musicOn)toggleSong()">🎵 Play / Pause Song</button> <button class="secondary" onclick="openOriginalSoup()">🎮 Original Soup Game</button></p><p class="savehint">Your week, activity and game score are saved in this browser. For syncing across devices, website login/database integration is needed.</p>`}
function closeModal(){$('modal').hidden=true;document.body.style.overflow=''}
function enterLesson(which){$('landing').hidden=true;$('lessonView').hidden=false;go(which);window.scrollTo(0,0)}
function home(){const frame=$('embeddedSoup');if(frame)frame.src='about:blank';$('lessonView').hidden=true;$('landing').hidden=false;window.scrollTo(0,0)}
function refreshHomeToggles(){$('soundState').textContent=voiceOn?'ON':'OFF';$('subState').textContent=subOn?'ON':'OFF';$('homeSound').setAttribute('aria-pressed',String(voiceOn));$('homeSub').setAttribute('aria-pressed',String(subOn))}
function toggleHomeSound(){voiceOn=!voiceOn;if(!voiceOn){recordedVoice.pause();speechSynthesis.cancel();song.pause()}refreshHomeToggles()}
function toggleHomeSub(){subOn=!subOn;refreshHomeToggles()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.fullscreenElement)closeModal();if(!$('modal').hidden&&$('presentationImage')){if(e.key==='ArrowRight'){slide=Math.min(49,slide+1);showPresentation()}if(e.key==='ArrowLeft'){slide=Math.max(0,slide-1);showPresentation()}}});song.addEventListener('ended',()=>{$('songlabel').textContent='Play Song'});drawWeeks();refreshHomeToggles();go('start');
