const A='../assets/';
const asset=n=>tokenAssets.includes(n)?'assets/'+n+'.webp':A+n+'.webp';
const tokenAssets=['token_red','token_blue','token_green','token_yellow'];
const teamDefaults=['Red Team','Blue Team','Green Team','Yellow Team'];
const flashcards=[{"src":"../assets/flashcards/a_brighter_yunlin_classroom.webp","label":"A Brighter Yunlin Classroom","category":"vocabulary"},{"src":"../assets/flashcards/answer_card_complete_the_sentence.webp","label":"Answer Card Complete The Sentence","category":"answer"},{"src":"../assets/flashcards/answer_card_he_works_in_an.webp","label":"Answer Card He Works In An","category":"answer"},{"src":"../assets/flashcards/bedtime_mini_dialogue_card.webp","label":"Bedtime Mini Dialogue Card","category":"dialogue"},{"src":"../assets/flashcards/bedtime_question_card_in_moonlit_room.webp","label":"Bedtime Question Card In Moonlit Room","category":"question"},{"src":"../assets/flashcards/cartoon_answer_card_she_is_a_blank.webp","label":"Cartoon Answer Card She Is A Blank","category":"answer"},{"src":"../assets/flashcards/cheerful_brother_countryside_card.webp","label":"Cheerful Brother Countryside Card","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_dinner_time_answer_card.webp","label":"Cheerful Dinner Time Answer Card","category":"answer"},{"src":"../assets/flashcards/cheerful_family_countryside_card.webp","label":"Cheerful Family Countryside Card","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_farmer_job_card.webp","label":"Cheerful Farmer Job Card","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_father_and_child_farm_question_card.webp","label":"Cheerful Father And Child Farm Question Card","category":"question"},{"src":"../assets/flashcards/cheerful_father_in_yunlin_countryside.webp","label":"Cheerful Father In Yunlin Countryside","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_grandfather_answer_card.webp","label":"Cheerful Grandfather Answer Card","category":"answer"},{"src":"../assets/flashcards/cheerful_mini_dialogue_classroom_card.webp","label":"Cheerful Mini Dialogue Classroom Card","category":"dialogue"},{"src":"../assets/flashcards/cheerful_morning_wake_up_answer_card.webp","label":"Cheerful Morning Wake Up Answer Card","category":"answer"},{"src":"../assets/flashcards/cheerful_mother_in_yunlin_countryside.webp","label":"Cheerful Mother In Yunlin Countryside","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_sentence_card_flashcard.webp","label":"Cheerful Sentence Card Flashcard","category":"answer"},{"src":"../assets/flashcards/cheerful_sister_family_card.webp","label":"Cheerful Sister Family Card","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_teacher_classroom_flashcard.webp","label":"Cheerful Teacher Classroom Flashcard","category":"vocabulary"},{"src":"../assets/flashcards/cheerful_yunlin_grandmother_answer_card.webp","label":"Cheerful Yunlin Grandmother Answer Card","category":"answer"},{"src":"../assets/flashcards/colourful_3d_office_flashcard.webp","label":"Colourful 3d Office Flashcard","category":"vocabulary"},{"src":"../assets/flashcards/colourful_answer_card_bedtime_sentence.webp","label":"Colourful Answer Card Bedtime Sentence","category":"answer"},{"src":"../assets/flashcards/colourful_answer_card_daily_routine_fill_in.webp","label":"Colourful Answer Card Daily Routine Fill In","category":"answer"},{"src":"../assets/flashcards/colourful_answer_card_my_family.webp","label":"Colourful Answer Card My Family","category":"answer"},{"src":"../assets/flashcards/colourful_office_place_card.webp","label":"Colourful Office Place Card","category":"vocabulary"},{"src":"../assets/flashcards/colourful_question_card_where_does_your_father_wo.webp","label":"Colourful Question Card Where Does Your Father Wo","category":"question"},{"src":"../assets/flashcards/colourful_yunlin_sentence_card.webp","label":"Colourful Yunlin Sentence Card","category":"answer"},{"src":"../assets/flashcards/cosy_bedtime_answer_card.webp","label":"Cosy Bedtime Answer Card","category":"answer"},{"src":"../assets/flashcards/cosy_family_dinner_routine_card.webp","label":"Cosy Family Dinner Routine Card","category":"routine"},{"src":"../assets/flashcards/cosy_go_to_bed_routine_card.webp","label":"Cosy Go To Bed Routine Card","category":"routine"},{"src":"../assets/flashcards/cosy_grandmother_nap_routine_card.webp","label":"Cosy Grandmother Nap Routine Card","category":"routine"},{"src":"../assets/flashcards/cosy_naptime_routine_card.webp","label":"Cosy Naptime Routine Card","category":"routine"},{"src":"../assets/flashcards/countryside_grandfather_dialogue_card.webp","label":"Countryside Grandfather Dialogue Card","category":"dialogue"},{"src":"../assets/flashcards/cozy_family_dinner_mini_dialogue_card.webp","label":"Cozy Family Dinner Mini Dialogue Card","category":"dialogue"},{"src":"../assets/flashcards/family_dinner_at_six_o_clock.webp","label":"Family Dinner At Six O Clock","category":"routine"},{"src":"../assets/flashcards/father_s_farming_question_card.webp","label":"Father S Farming Question Card","category":"question"},{"src":"../assets/flashcards/goodnight_routine_card_go_to_bed.webp","label":"Goodnight Routine Card Go To Bed","category":"routine"},{"src":"../assets/flashcards/grandfather_family_card_in_the_countryside.webp","label":"Grandfather Family Card In The Countryside","category":"vocabulary"},{"src":"../assets/flashcards/grandmother_and_granddaughter_s_countryside_chat.webp","label":"Grandmother And Granddaughter S Countryside Chat","category":"dialogue"},{"src":"../assets/flashcards/home_in_the_countryside.webp","label":"Home In The Countryside","category":"vocabulary"},{"src":"../assets/flashcards/joyful_breakfast_answer_card.webp","label":"Joyful Breakfast Answer Card","category":"answer"},{"src":"../assets/flashcards/joyful_countryside_breakfast_routine.webp","label":"Joyful Countryside Breakfast Routine","category":"routine"},{"src":"../assets/flashcards/mini_dialogue_card_the_joyful_rice_farmer.webp","label":"Mini Dialogue Card The Joyful Rice Farmer","category":"dialogue"},{"src":"../assets/flashcards/mini_dialogue_card_working_on_a_farm.webp","label":"Mini Dialogue Card Working On A Farm","category":"dialogue"},{"src":"../assets/flashcards/mini_dialogue_mother_works_at_school.webp","label":"Mini Dialogue Mother Works At School","category":"dialogue"},{"src":"../assets/flashcards/morning_routine_get_up.webp","label":"Morning Routine Get Up","category":"routine"},{"src":"../assets/flashcards/morning_routine_mini_dialogue_card.webp","label":"Morning Routine Mini Dialogue Card","category":"dialogue"},{"src":"../assets/flashcards/morning_wake_up_question_card.webp","label":"Morning Wake Up Question Card","category":"question"},{"src":"../assets/flashcards/mother_and_daughter_at_school.webp","label":"Mother And Daughter At School","category":"vocabulary"},{"src":"../assets/flashcards/mother_s_workday_question_card.webp","label":"Mother S Workday Question Card","category":"question"},{"src":"../assets/flashcards/my_brother_gets_up_sentence_card.webp","label":"My Brother Gets Up Sentence Card","category":"answer"},{"src":"../assets/flashcards/my_family_eats_dinner_card.webp","label":"My Family Eats Dinner Card","category":"routine"},{"src":"../assets/flashcards/my_grandmother_takes_a_nap.webp","label":"My Grandmother Takes A Nap","category":"routine"},{"src":"../assets/flashcards/my_sister_has_breakfast_flashcard.webp","label":"My Sister Has Breakfast Flashcard","category":"routine"},{"src":"../assets/flashcards/playful_bedtime_question_card.webp","label":"Playful Bedtime Question Card","category":"question"},{"src":"../assets/flashcards/question_card_dinner_time.webp","label":"Question Card Dinner Time","category":"question"},{"src":"../assets/flashcards/question_card_father_s_farm_adventure.webp","label":"Question Card Father S Farm Adventure","category":"question"},{"src":"../assets/flashcards/question_card_meet_grandma.webp","label":"Question Card Meet Grandma","category":"question"},{"src":"../assets/flashcards/question_card_what_is_your_grandfather.webp","label":"Question Card WHAT Is Your Grandfather","category":"question"},{"src":"../assets/flashcards/routine_card_heading_to_work.webp","label":"Routine Card Heading To Work","category":"routine"},{"src":"../assets/flashcards/routine_card_take_a_shower.webp","label":"Routine Card Take A Shower","category":"routine"},{"src":"../assets/flashcards/sunny_breakfast_mini_dialogue_card.webp","label":"Sunny Breakfast Mini Dialogue Card","category":"dialogue"},{"src":"../assets/flashcards/sunny_grandmother_family_card.webp","label":"Sunny Grandmother Family Card","category":"vocabulary"},{"src":"../assets/flashcards/teacher_s_brighter_tomorrow.webp","label":"Teacher S Brighter Tomorrow","category":"vocabulary"},{"src":"../assets/flashcards/what_does_your_mother_do.webp","label":"WHAT Does Your Mother Do","category":"question"},{"src":"../assets/flashcards/what_is_your_mother_card.webp","label":"WHAT Is Your Mother Card","category":"question"},{"src":"../assets/flashcards/what_time_do_you_get_up.webp","label":"WHAT Time Do You Get Up","category":"question"},{"src":"../assets/flashcards/who_is_he_countryside_learning_card.webp","label":"WHO Is He Countryside Learning Card","category":"question"},{"src":"../assets/flashcards/whose_family_question_card.webp","label":"Whose Family Question Card","category":"question"},{"src":"../assets/flashcards/yunlin_family_dinner_answer_card.webp","label":"Yunlin Family Dinner Answer Card","category":"answer"},{"src":"../assets/flashcards/yunlin_farmer_answer_card.webp","label":"Yunlin Farmer Answer Card","category":"answer"},{"src":"../assets/flashcards/yunlin_rice_farm_answer_card.webp","label":"Yunlin Rice Farm Answer Card","category":"answer"}];
let flashViewList=[...flashcards], flashViewIndex=0;

const level1=[
 {title:'Grandfather + Farmer',cards:[['grandfather','GRANDFATHER'],['farmer','FARMER']],q:'What does your grandfather do?',a:'He is a farmer.',help:'He is a ______.'},
 {title:'Mother + Teacher',cards:[['mother','MOTHER'],['teacher','TEACHER']],q:'What does your mother do?',a:'She is a teacher.',help:'She is a ______.'},
 {title:'Father + Office',cards:[['father','FATHER'],['office','OFFICE']],q:'Where does your father work?',a:'He works in an office.',help:'He works in an ______.'},
 {title:'Grandmother + Home',cards:[['grandmother','GRANDMOTHER'],['home','HOME']],q:'Where is your grandmother?',a:'She is at home.',help:'She is at ______.'},
 {title:'Brother + Get Up',cards:[['brother','BROTHER'],['get_up','GET UP']],q:'What does your brother do in the morning?',a:'He gets up.',help:'He ______ up.'},
 {title:'Sister + Breakfast',cards:[['sister','SISTER'],['breakfast','HAVE BREAKFAST']],q:'What does your sister do in the morning?',a:'She has breakfast.',help:'She ______ breakfast.'},
 {title:'Father + Shower',cards:[['father','FATHER'],['shower','TAKE A SHOWER']],q:'What does your father do?',a:'He takes a shower.',help:'He takes a ______.'},
 {title:'Family + Dinner',cards:[['dinner','FAMILY'],['dinner','EAT DINNER']],q:'What does your family do in the evening?',a:'My family eats dinner.',help:'My family ______ dinner.'},
 {title:'Brother + Bed',cards:[['brother','BROTHER'],['bed','GO TO BED']],q:'What does your brother do at night?',a:'He goes to bed.',help:'He goes to ______.'},
 {title:'Yunlin Farmer',cards:[['grandfather','GRANDFATHER'],['farmer','FARMER IN YUNLIN']],q:'Who is a farmer in Yunlin?',a:'My grandfather is a farmer in Yunlin.',help:'My ______ is a farmer in Yunlin.'}
];

const level2=[
 {title:'Morning Routine',cards:[['brother','BROTHER'],['get_up','GET UP'],[null,'7:00','🕖']],q:'What time does your brother get up?',a:'My brother gets up at seven.',help:'My brother gets up at ______.'},
 {title:'Breakfast at Home',cards:[['sister','SISTER'],['breakfast','HAVE BREAKFAST'],['home','HOME']],q:'Where does your sister have breakfast?',a:'My sister has breakfast at home.',help:'My sister has breakfast at ______.'},
 {title:'Mother Goes to Work',cards:[['mother','MOTHER'],['work','GO TO WORK'],['office','OFFICE']],q:'Where does your mother go to work?',a:'My mother goes to the office.',help:'My mother goes to the ______.'},
 {title:'Grandmother Rests',cards:[['grandmother','GRANDMOTHER'],['nap','TAKE A NAP'],['home','HOME']],q:'Where does your grandmother take a nap?',a:'My grandmother takes a nap at home.',help:'My grandmother takes a nap at ______.'},
 {title:'Father Takes a Shower',cards:[['father','FATHER'],['shower','TAKE A SHOWER'],[null,'6:30','🕡']],q:'What time does your father take a shower?',a:'My father takes a shower at six thirty.',help:'My father takes a shower at ______.'},
 {title:'Family Dinner',cards:[['dinner','FAMILY'],['dinner','EAT DINNER'],['home','HOME']],q:'Where does your family eat dinner?',a:'My family eats dinner at home.',help:'My family eats dinner at ______.'},
 {title:'Brother Bedtime',cards:[['brother','BROTHER'],['bed','GO TO BED'],[null,'9:00','🕘']],q:'What time does your brother go to bed?',a:'My brother goes to bed at nine.',help:'My brother goes to bed at ______.'},
 {title:'Yunlin Farmer',cards:[['grandfather','GRANDFATHER'],['farmer','FARMER'],[null,'YUNLIN','🌾']],q:'Who is a farmer in Yunlin?',a:'My grandfather is a farmer in Yunlin.',help:'My ______ is a farmer in Yunlin.'},
 {title:'Mother Daily Life',cards:[['mother','MOTHER'],['work','GO TO WORK'],[null,'8:00','🕗']],q:'What time does your mother go to work?',a:'My mother goes to work at eight.',help:'My mother goes to work at ______.'},
 {title:'Grandmother Afternoon',cards:[['grandmother','GRANDMOTHER'],['nap','TAKE A NAP'],[null,'AFTERNOON','☀️']],q:'What does your grandmother do in the afternoon?',a:'My grandmother takes a nap.',help:'My grandmother takes a ______.'}
];

/* Connected WHO AM I? challenges.
   Stage 1: identify the family member from the picture with the printed label covered.
   Stage 2: reveal the full card + job/action/time/place and answer the lesson question. */
const whoLevel1=[
 {type:'who',person:'grandfather',personLabel:'GRANDFATHER',choices:['GRANDFATHER','FATHER','BROTHER'],identity:'He is my grandfather.',cards:[['grandfather','GRANDFATHER'],['farmer','FARMER']],q:'What does your grandfather do?',a:'He is a farmer.',help:'He is a ______.'},
 {type:'who',person:'mother',personLabel:'MOTHER',choices:['MOTHER','GRANDMOTHER','SISTER'],identity:'She is my mother.',cards:[['mother','MOTHER'],['teacher','TEACHER']],q:'What does your mother do?',a:'She is a teacher.',help:'She is a ______.'},
 {type:'who',person:'father',personLabel:'FATHER',choices:['FATHER','GRANDFATHER','BROTHER'],identity:'He is my father.',cards:[['father','FATHER'],['office','OFFICE']],q:'Where does your father work?',a:'He works in an office.',help:'He works in an ______.'},
 {type:'who',person:'grandmother',personLabel:'GRANDMOTHER',choices:['GRANDMOTHER','MOTHER','SISTER'],identity:'She is my grandmother.',cards:[['grandmother','GRANDMOTHER'],['home','HOME']],q:'Where is your grandmother?',a:'She is at home.',help:'She is at ______.'},
 {type:'who',person:'brother',personLabel:'BROTHER',choices:['BROTHER','FATHER','GRANDFATHER'],identity:'He is my brother.',cards:[['brother','BROTHER'],['get_up','GET UP']],q:'What does your brother do in the morning?',a:'He gets up.',help:'He ______ up.'},
 {type:'who',person:'sister',personLabel:'SISTER',choices:['SISTER','MOTHER','GRANDMOTHER'],identity:'She is my sister.',cards:[['sister','SISTER'],['breakfast','HAVE BREAKFAST']],q:'What does your sister do in the morning?',a:'She has breakfast.',help:'She ______ breakfast.'}
];

const whoLevel2=[
 {type:'who',person:'brother',personLabel:'BROTHER',choices:['BROTHER','FATHER','GRANDFATHER'],identity:'He is my brother.',cards:[['brother','BROTHER'],['get_up','GET UP'],[null,'7:00','🕖']],q:'What time does your brother get up?',a:'My brother gets up at seven.',help:'My brother gets up at ______.'},
 {type:'who',person:'grandmother',personLabel:'GRANDMOTHER',choices:['GRANDMOTHER','MOTHER','SISTER'],identity:'She is my grandmother.',cards:[['grandmother','GRANDMOTHER'],['nap','TAKE A NAP'],['home','HOME']],q:'Where does your grandmother take a nap?',a:'My grandmother takes a nap at home.',help:'My grandmother takes a nap at ______.'},
 {type:'who',person:'mother',personLabel:'MOTHER',choices:['MOTHER','GRANDMOTHER','SISTER'],identity:'She is my mother.',cards:[['mother','MOTHER'],['work','GO TO WORK'],['office','OFFICE']],q:'Where does your mother go to work?',a:'My mother goes to the office.',help:'My mother goes to the ______.'},
 {type:'who',person:'father',personLabel:'FATHER',choices:['FATHER','BROTHER','GRANDFATHER'],identity:'He is my father.',cards:[['father','FATHER'],['shower','TAKE A SHOWER'],[null,'6:30','🕡']],q:'What time does your father take a shower?',a:'My father takes a shower at six thirty.',help:'My father takes a shower at ______.'},
 {type:'who',person:'sister',personLabel:'SISTER',choices:['SISTER','MOTHER','GRANDMOTHER'],identity:'She is my sister.',cards:[['sister','SISTER'],['breakfast','HAVE BREAKFAST'],['home','HOME']],q:'Where does your sister have breakfast?',a:'My sister has breakfast at home.',help:'My sister has breakfast at ______.'},
 {type:'who',person:'brother',personLabel:'BROTHER',choices:['BROTHER','FATHER','GRANDFATHER'],identity:'He is my brother.',cards:[['brother','BROTHER'],['bed','GO TO BED'],[null,'9:00','🕘']],q:'What time does your brother go to bed?',a:'My brother goes to bed at nine.',help:'My brother goes to bed at ______.'}
];

const funny=[
 ['🤖 ROBOT VOICE','Say the model answer like a robot.'],
 ['😴 SLEEPY ACT','Mime “go to bed.”'],
 ['🦸 SUPERHERO','Say the model answer like a superhero.'],
 ['🚿 MIME TIME','Mime “take a shower.”'],
 ['⏰ WAKE UP!','Mime “get up.”']
];

let state={level:1,gameMode:'mission',teamCount:4,teams:[],current:0,round:1,totalRounds:16,deck:[],whoDeck:[],challenge:null,whoStage:0,rewardSpeak:'',sound:true,voice:true,voiceObj:null};
const $=id=>document.getElementById(id);
const screens=['startScreen','gameScreen','rewardScreen','finalScreen','winnerScreen'];
function showScreen(id){screens.forEach(s=>$(s).classList.toggle('active',s===id))}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function beep(type='ok'){
 if(!state.sound)return;
 try{
  const c=new (window.AudioContext||window.webkitAudioContext)();
  const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);
  let f=520,d=.12;if(type==='bad'){f=190;d=.16}else if(type==='win'){f=760;d=.32}else if(type==='click'){f=360;d=.06}
  o.frequency.setValueAtTime(f,c.currentTime);if(type==='win')o.frequency.exponentialRampToValueAtTime(1180,c.currentTime+d);
  g.gain.setValueAtTime(.07,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);
 }catch(e){}
}
let speechTimer=null,voicesReady=false;
function chooseVoice(){
 if(!('speechSynthesis' in window))return;
 const voices=speechSynthesis.getVoices();
 if(!voices.length)return;
 state.voiceObj=voices.find(v=>/^en-(US|GB|AU)/i.test(v.lang)&&/female|samantha|zira|aria|jenny|google/i.test(v.name)) || voices.find(v=>/^en/i.test(v.lang)) || null;
 voicesReady=true;
}
if('speechSynthesis' in window){
 chooseVoice();
 speechSynthesis.addEventListener?.('voiceschanged',chooseVoice);
}
function speak(text){
 if(!state.voice||!('speechSynthesis' in window)||!text)return;
 clearTimeout(speechTimer);
 try{speechSynthesis.cancel()}catch(e){}
 speechTimer=setTimeout(()=>{
  try{
   if(!voicesReady)chooseVoice();
   const u=new SpeechSynthesisUtterance(text);
   u.lang='en-US';u.rate=.86;u.pitch=1.02;u.volume=1;
   if(state.voiceObj)u.voice=state.voiceObj;
   speechSynthesis.speak(u);
  }catch(e){}
 },35);
}
function toast(t){const x=$('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1400)}
function confetti(){const box=$('confetti');box.innerHTML='';for(let i=0;i<50;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.animationDelay=Math.random()*.7+'s';box.appendChild(p)}setTimeout(()=>box.innerHTML='',3000)}
function stopSpeech(){try{if('speechSynthesis' in window)speechSynthesis.cancel()}catch(e){}}
function renderFlashcardGrid(filter='all'){
 const list=filter==='all'?flashcards:flashcards.filter(c=>c.category===filter);
 flashViewList=list;
 const grid=$('flashcardGrid');
 grid.innerHTML=list.map((c,i)=>`<button class="flash-thumb" data-findex="${i}"><div class="thumb-frame"><img loading="lazy" src="${c.src}" alt="${c.label}"></div><b>${c.label}</b></button>`).join('');
 grid.querySelectorAll('.flash-thumb').forEach(b=>b.onclick=()=>openFlashcard(+b.dataset.findex));
}
function openFlashcards(){stopSpeech();$('flashcardLibrary').classList.remove('hidden');$('flashcardLibrary').setAttribute('aria-hidden','false');renderFlashcardGrid(document.querySelector('.flash-filter.selected')?.dataset.filter||'all');}
function closeFlashcards(){$('flashcardLibrary').classList.add('hidden');$('flashcardLibrary').setAttribute('aria-hidden','true');}
function openFlashcard(index){stopSpeech();flashViewIndex=(index+flashViewList.length)%flashViewList.length;const c=flashViewList[flashViewIndex];$('viewerImage').src=c.src;$('viewerImage').alt=c.label;$('viewerLabel').textContent=c.label;$('flashcardViewer').classList.remove('hidden');$('flashcardViewer').setAttribute('aria-hidden','false');}
function closeFlashcardViewer(){$('flashcardViewer').classList.add('hidden');$('flashcardViewer').setAttribute('aria-hidden','true');}
function stepFlashcard(delta){if(!flashViewList.length)return;openFlashcard(flashViewIndex+delta)}
function setupTeams(){state.teams=Array.from({length:state.teamCount},(_,i)=>({name:teamDefaults[i],token:tokenAssets[i],stars:0,streak:0}));state.totalRounds=state.gameMode==='who'?state.teamCount*3:state.teamCount*4;}
function renderScores(){const s=$('scoreboard');s.style.gridTemplateColumns=`repeat(${state.teamCount},1fr)`;s.innerHTML=state.teams.map((t,i)=>`<div class="team-score ${i===state.current?'current':''}"><img src="${asset(t.token)}"><div class="meta"><b>${t.name}</b><div class="stats"><span>⭐ ${t.stars}</span><span>🔥 ${t.streak}/3</span></div></div></div>`).join('');}
function renderTurn(){const t=state.teams[state.current];$('turnName').textContent=t.name;$('turnAvatar').style.backgroundImage=`url('${asset(t.token)}')`;$('roundNow').textContent=state.round;$('roundTotal').textContent=state.totalRounds;$('streakNow').textContent=t.streak;renderScores();}
function renderVisualCards(cards,target='visualCards'){
 const el=$(target);el.style.gridTemplateColumns=`repeat(${cards.length},minmax(0,1fr))`;el.innerHTML=cards.map(c=>{
   const [img,label,emoji]=c;
   if(!img)return `<div class="visual-card text-only"><div class="emoji">${emoji||'⭐'}</div><div class="label">${label}</div></div>`;
   return `<div class="visual-card"><img src="${asset(img)}" alt="${label}"><div class="label">${label}</div></div>`;
 }).join('');
}
function clearWhoUI(){
 $('whoChoices').classList.add('hidden');$('whoChoices').innerHTML='';
 $('identityBand').classList.add('hidden');$('identitySentence').textContent='';
 $('teacherControls').classList.remove('hidden');$('helpBtn').classList.remove('hidden');$('speakLabel').textContent='SAY THE ANSWER';
}
function getWhoDeck(){return state.level===1?whoLevel1:whoLevel2}
function renderWhoStage1(ch){
 state.whoStage=1;
 $('missionTitle').innerHTML='<span class="mystery-badge">SPECIAL MISSION</span><br>WHO AM I?';
 $('visualCards').style.gridTemplateColumns='1fr';
 $('visualCards').innerHTML=`<div class="mystery-wrap"><div class="mystery-card"><img src="${asset(ch.person)}" alt="Mystery family member"><div class="mystery-cover">🕵️ WHO AM I?</div></div></div>`;
 $('questionText').textContent='Who am I?';
 $('helpBox').classList.add('hidden');$('helpBtn').classList.add('hidden');$('teacherControls').classList.add('hidden');$('speakLabel').textContent='CHOOSE THE FAMILY MEMBER';
 $('identityBand').classList.add('hidden');
 const choices=shuffle(ch.choices);
 const box=$('whoChoices');box.classList.remove('hidden');box.innerHTML=choices.map(x=>`<button class="who-choice" data-choice="${x}">${x}</button>`).join('');
 box.querySelectorAll('.who-choice').forEach(btn=>btn.onclick=()=>chooseWho(btn,ch));
 setTimeout(()=>speak('Who am I?'),250);
}
function chooseWho(btn,ch){
 const chosen=btn.dataset.choice;
 if(chosen!==ch.personLabel){
  btn.classList.add('wrong');beep('bad');toast('Try again! Look carefully.');speak('Try again.');setTimeout(()=>btn.classList.remove('wrong'),650);return;
 }
 btn.classList.add('correct');beep('win');
 setTimeout(()=>renderWhoStage2(ch),350);
}
function renderWhoStage2(ch){
 state.whoStage=2;
 $('whoChoices').classList.add('hidden');
 renderVisualCards(ch.cards);
 $('identitySentence').textContent=ch.identity;$('identityBand').classList.remove('hidden');
 $('missionTitle').textContent='WHO AM I? → SPEAK';
 $('questionText').textContent=ch.q;$('helpBox').textContent=ch.help;$('helpBox').classList.add('hidden');
 $('helpBtn').classList.remove('hidden');$('teacherControls').classList.remove('hidden');$('speakLabel').textContent='SAY THE ANSWER';
 setTimeout(()=>speak(`${ch.identity} ${ch.q}`),250);
}
function pickNormal(){if(!state.deck.length)state.deck=shuffle(state.level===1?level1:level2);return state.deck.pop()}
function pickWho(){if(!state.whoDeck.length)state.whoDeck=shuffle(getWhoDeck());return state.whoDeck.pop()}
function nextChallenge(){
 clearWhoUI();
 const useWho=state.gameMode==='who' || state.round%4===0;
 state.challenge=useWho?pickWho():pickNormal();
 showScreen('gameScreen');renderTurn();
 $('levelLabel').textContent=state.gameMode==='who'
   ? (state.level===1?'WHO AM I? • WEEK 6':'WHO AM I? • WEEK 7')
   : (state.level===1?'LEVEL 1 • WEEK 6':'LEVEL 2 • WEEK 7');
 if(state.challenge.type==='who'){renderWhoStage1(state.challenge);return;}
 state.whoStage=0;
 $('missionTitle').textContent=state.challenge.title;renderVisualCards(state.challenge.cards);
 $('questionText').textContent=state.challenge.q;$('helpBox').textContent=state.challenge.help;$('helpBox').classList.add('hidden');
 setTimeout(()=>speak(state.challenge.q),250);
}
function currentQuestion(){return state.challenge?.type==='who'&&state.whoStage===1?'Who am I?':(state.challenge?.q||'')}
function awardTry(){
 beep('bad');$('helpBox').classList.remove('hidden');state.teams[state.current].streak=0;$('streakNow').textContent=0;renderScores();toast('Use the sentence frame and try again.');setTimeout(()=>speak(state.challenge.q),300);
}
function awardCorrect(){
 const t=state.teams[state.current];const special=state.challenge.type==='who';const base=special?2:1;
 t.stars+=base;t.streak+=1;let bonus='';
 if(t.streak>=3){t.streak=0;t.stars+=1;bonus=' • Super Speaker bonus +1 ⭐';}
 renderScores();beep('win');
 state.rewardSpeak=special?`${state.challenge.identity} ${state.challenge.a}`:state.challenge.a;
 $('modelAnswer').textContent=state.rewardSpeak;$('rewardIcon').textContent=special?'🕵️':'⭐';$('rewardTitle').textContent=special?'Mystery solved!':'Great speaking!';$('rewardText').textContent=`+${base} star${base>1?'s':''}${bonus}`;
 if(Math.random()<.14){const f=shuffle(funny)[0];$('rewardIcon').textContent='😂';$('rewardTitle').textContent=f[0];$('rewardText').textContent=f[1]+'  Bonus fun challenge!';}
 showScreen('rewardScreen');confetti();setTimeout(()=>speak(state.rewardSpeak),350);
}
function nextTurn(){if(state.round>=state.totalRounds){if(state.gameMode==='who'){finishGame();return}startFinal();return}state.round++;state.current=(state.current+1)%state.teamCount;nextChallenge();}
function startFinal(){
 const max=Math.max(...state.teams.map(t=>t.stars));const idx=state.teams.findIndex(t=>t.stars===max);state.current=idx;
 const final=state.level===1?{cards:[['grandfather','GRANDFATHER'],['farmer','FARMER']],q:'What does your grandfather do?',a:'He is a farmer.',h:'He is a ______.'}:{cards:[['brother','BROTHER'],['get_up','GET UP'],[null,'7:00','🕖']],q:'What time does your brother get up?',a:'My brother gets up at seven.',h:'My brother gets up at ______.'};
 state.final=final;showScreen('finalScreen');renderVisualCards(final.cards,'finalVisuals');$('finalPrompt').textContent=final.q;$('finalHelp').textContent=final.h;$('finalHelp').classList.add('hidden');setTimeout(()=>speak(final.q),300);
}
function finishGame(){showScreen('winnerScreen');const sorted=[...state.teams].sort((a,b)=>b.stars-a.stars);$('winnerText').textContent=`${sorted[0].name} wins with ${sorted[0].stars} stars!`;$('finalScores').innerHTML=sorted.map((t,i)=>`<div class="final-score-row"><span>${i===0?'🏆':'⭐'} ${t.name}</span><span>${t.stars} stars</span></div>`).join('');confetti();beep('win');setTimeout(()=>speak('Yunlin Super Speakers! Great job!'),350)}
function reset(mode='mission'){
 state.gameMode=mode;state.round=1;state.current=0;state.whoStage=0;setupTeams();state.deck=shuffle(state.level===1?level1:level2);state.whoDeck=shuffle(getWhoDeck());
 if('speechSynthesis' in window){chooseVoice();const u=new SpeechSynthesisUtterance('');speechSynthesis.speak(u)}
 if(mode==='who') toast('WHO AM I? game started!');
 nextChallenge();
}

const qp=new URLSearchParams(location.search);const ql=+(qp.get('level')||0);if(ql===1||ql===2){state.level=ql;state.teamCount=ql===1?4:3;document.querySelectorAll('.mode-card').forEach(x=>x.classList.toggle('selected',+x.dataset.level===ql));document.querySelectorAll('[data-teams]').forEach(x=>x.classList.toggle('selected',+x.dataset.teams===state.teamCount));}
document.querySelectorAll('.mode-card').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.level=+b.dataset.level;state.teamCount=state.level===1?4:3;document.querySelectorAll('[data-teams]').forEach(x=>x.classList.toggle('selected',+x.dataset.teams===state.teamCount));});
document.querySelectorAll('[data-teams]').forEach(b=>b.onclick=()=>{state.teamCount=+b.dataset.teams;document.querySelectorAll('[data-teams]').forEach(x=>x.classList.toggle('selected',x===b));});
$('startBtn').onclick=()=>reset('mission');
$('whoGameBtn').onclick=()=>reset('who');
$('questionVoiceBtn').onclick=()=>speak(currentQuestion());
$('answerVoiceBtn').onclick=()=>speak(state.rewardSpeak||state.challenge.a);
$('identityVoiceBtn').onclick=()=>speak(state.challenge?.identity||'');
$('helpBtn').onclick=()=>{$('helpBox').classList.remove('hidden');beep('click')};
$('tryBtn').onclick=awardTry;$('correctBtn').onclick=awardCorrect;$('nextBtn').onclick=nextTurn;
$('finalHelpBtn').onclick=()=>{$('finalHelp').classList.remove('hidden');beep('click')};
$('finalTryBtn').onclick=()=>{beep('bad');$('finalHelp').classList.remove('hidden');speak(state.final.q)};
$('finalCorrectBtn').onclick=()=>{speak(state.final.a);setTimeout(finishGame,900)};
$('finalQuestionVoiceBtn').onclick=()=>speak(state.final.q);
$('playAgainBtn').onclick=()=>showScreen('startScreen');$('homeBtn').onclick=()=>showScreen('startScreen');
$('soundBtn').onclick=()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'🔊':'🔇'};
$('voiceBtn').onclick=()=>{state.voice=!state.voice;if(!state.voice&&'speechSynthesis' in window)speechSynthesis.cancel();$('voiceBtn').textContent=state.voice?'🗣️':'🤐'};

$('flashcardsBtn').onclick=openFlashcards;
$('closeFlashcardsBtn').onclick=closeFlashcards;
$('viewerCloseBtn').onclick=closeFlashcardViewer;
$('viewerPrevBtn').onclick=()=>stepFlashcard(-1);
$('viewerNextBtn').onclick=()=>stepFlashcard(1);
document.querySelectorAll('.flash-filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.flash-filter').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');renderFlashcardGrid(b.dataset.filter)});
$('flashcardLibrary').addEventListener('click',e=>{if(e.target===$('flashcardLibrary'))closeFlashcards()});
$('flashcardViewer').addEventListener('click',e=>{if(e.target===$('flashcardViewer'))closeFlashcardViewer()});
document.addEventListener('keydown',e=>{if(!$('flashcardViewer').classList.contains('hidden')){if(e.key==='Escape')closeFlashcardViewer();if(e.key==='ArrowLeft')stepFlashcard(-1);if(e.key==='ArrowRight')stepFlashcard(1);return;}if(!$('flashcardLibrary').classList.contains('hidden')&&e.key==='Escape')closeFlashcards();});
renderFlashcardGrid('all');

(()=>{const list=['background','grandfather','grandmother','father','mother',...tokenAssets];let i=0;const step=()=>{if(i>=list.length)return;const img=new Image();img.decoding='async';img.src=asset(list[i++]);setTimeout(step,90)};if('requestIdleCallback'in window)requestIdleCallback(step,{timeout:900});else setTimeout(step,250)})();
