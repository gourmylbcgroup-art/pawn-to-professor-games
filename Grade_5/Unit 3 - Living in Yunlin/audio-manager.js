
const RECORDED_VOICE_MAP={"grandfather":"audio/b1_01.mp3","grandmother":"audio/b1_02.mp3","father":"audio/b1_03.mp3","mother":"audio/b1_04.mp3","brother":"audio/b1_05.mp3","sister":"audio/b1_06.mp3","get up":"audio/b1_07.mp3","have breakfast":"audio/b1_08.mp3","go to work":"audio/b1_09.mp3","take a nap":"audio/b1_10.mp3","take a shower":"audio/b1_11.mp3","have dinner":"audio/b1_12.mp3","go to bed":"audio/b1_13.mp3","what does your grandfather do":"audio/b1_14.mp3","what does your mother do":"audio/b1_15.mp3","where does your father work":"audio/b1_16.mp3","where is your grandmother":"audio/b1_17.mp3","complete the yunlin sentence":"audio/b1_18.mp3","match grandfather":"audio/b1_19.mp3","match mother":"audio/b1_20.mp3","where does a farmer work":"audio/b1_21.mp3","where does a teacher work":"audio/b1_22.mp3","where does an office worker work":"audio/b1_23.mp3","who can take a nap at home":"audio/b1_24.mp3","who goes to work":"audio/b1_25.mp3","choose the yunlin family pair":"audio/b2_01.mp3","choose the sentence":"audio/b2_02.mp3","what does your grandmother do":"audio/b2_03.mp3","who is in your family":"audio/b2_04.mp3","what does your father do":"audio/b2_05.mp3","what time do you get up":"audio/b2_06.mp3","who am i? i am your father's father":"audio/b2_07.mp3","what time does your brother get up":"audio/b2_08.mp3","what time does your sister have breakfast":"audio/b2_09.mp3","what time does your grandmother take a nap":"audio/b2_10.mp3","what time does your father take a shower":"audio/b2_11.mp3","what time does your mother go to work":"audio/b2_12.mp3","what time does your brother go to bed":"audio/b2_13.mp3","what time do you have breakfast":"audio/b2_14.mp3","what time do you go to work":"audio/b2_15.mp3","what time do you take a nap":"audio/b2_16.mp3","what time do you have dinner":"audio/b2_17.mp3","what time do you go to bed":"audio/b2_18.mp3","where does your grandmother take a nap":"audio/b2_19.mp3","who am i? i am an older woman. i take a nap at home":"audio/b2_20.mp3","he is a farmer":"audio/b3_01.mp3","she is a teacher":"audio/b3_02.mp3","he works in an office":"audio/b3_03.mp3","she is at home":"audio/b3_04.mp3","my grandfather is a farmer":"audio/b3_05.mp3","my mother is a teacher":"audio/b3_06.mp3","my grandfather is a farmer in yunlin":"audio/b3_07.mp3","he is my brother":"audio/b3_08.mp3","he is my grandfather":"audio/b3_09.mp3","she is my mother":"audio/b3_10.mp3","she is my grandmother":"audio/b3_11.mp3","a farmer works on a farm":"audio/b3_12.mp3","a teacher works at a school":"audio/b3_13.mp3","an office worker works in an office":"audio/b3_14.mp3","my grandmother takes a nap at home":"audio/b3_15.mp3","my father goes to work":"audio/b3_16.mp3","i get up":"audio/b3_17.mp3","i have breakfast":"audio/b3_18.mp3","my grandmother takes a nap":"audio/b3_19.mp3","i take a shower":"audio/b3_20.mp3","my family has dinner":"audio/b7_04.mp3","i go to bed":"audio/b3_22.mp3","my father is in my family":"audio/b4_01.mp3","i get up at seven":"audio/b4_02.mp3","my brother gets up at seven":"audio/b7_06.mp3","my sister has breakfast at seven thirty":"audio/b4_04.mp3","my grandmother takes a nap at one":"audio/b4_05.mp3","my father takes a shower at six":"audio/b4_06.mp3","my mother goes to work at eight":"audio/b7_12.mp3","my brother goes to bed at nine thirty":"audio/b4_08.mp3","i have breakfast at seven thirty":"audio/b4_09.mp3","i go to work at eight":"audio/b4_10.mp3","i take a nap at one":"audio/b4_11.mp3","i have dinner at seven":"audio/b4_12.mp3","i go to bed at nine thirty":"audio/b4_13.mp3","he is my father":"audio/b4_14.mp3","she is my sister":"audio/b4_15.mp3","i go to work":"audio/b4_16.mp3","i take a nap":"audio/b4_17.mp3","i have dinner":"audio/b4_18.mp3","six thirty":"audio/b6_01.mp3","eight o'clock":"audio/b6_02.mp3","seven o'clock":"audio/b6_03.mp3","nine thirty":"audio/b6_04.mp3","one o'clock":"audio/b6_05.mp3","seven thirty":"audio/b6_06.mp3","i am a boy":"audio/b6_07.mp3","i am your father's father":"audio/b6_08.mp3","i am a woman":"audio/b6_09.mp3","i am an older woman":"audio/b6_10.mp3","what does your brother do in the morning":"audio/b6_11.mp3","what does your sister do in the morning":"audio/b6_12.mp3","what does your father do in the morning":"audio/b6_13.mp3","what does your family do in the evening":"audio/b6_14.mp3","what does your brother do at night":"audio/b6_15.mp3","who is a farmer in yunlin":"audio/b6_16.mp3","where does your sister have breakfast":"audio/b6_17.mp3","where does your mother go to work":"audio/b6_18.mp3","where does your family eat dinner":"audio/b6_19.mp3","what does your grandmother do in the afternoon":"audio/b6_20.mp3","he gets up":"audio/b7_01.mp3","she has breakfast":"audio/b7_02.mp3","he takes a shower":"audio/b7_03.mp3","my family eats dinner":"audio/b7_04.mp3","he goes to bed":"audio/b7_05.mp3","my sister has breakfast at home":"audio/b7_07.mp3","my mother goes to the office":"audio/b7_08.mp3","my father takes a shower at six thirty":"audio/b7_09.mp3","my family eats dinner at home":"audio/b7_10.mp3","my brother goes to bed at nine":"audio/b7_11.mp3","who am i":"audio/b7_13.mp3","try again":"audio/b7_14.mp3","yunlin super speakers! great job":"audio/b7_15.mp3","my family has dinner at home":"audio/b7_10.mp3","where does your family have dinner":"audio/b6_19.mp3","i am in your family":"audio/b5_01.mp3","i am your father's son":"audio/b5_02.mp3","i am a farmer in yunlin":"audio/b5_03.mp3","i am a teacher":"audio/b5_04.mp3","i take a nap at home":"audio/b5_05.mp3","farmer":"audio/b5_06.mp3","office":"audio/b5_07.mp3","teacher":"audio/b5_08.mp3","home":"audio/b5_09.mp3","farm":"audio/b5_10.mp3","school":"audio/b5_11.mp3","grandfather, farmer":"audio/b5_12.mp3","sister, school":"audio/b5_13.mp3","my father takes a nap":"audio/b5_14.mp3","my grandmother takes a shower":"audio/b5_15.mp3","my grandmother gets up":"audio/b5_16.mp3","my family goes to school":"audio/b5_17.mp3","she takes a nap":"audio/b5_18.mp3","she goes to bed at school":"audio/b5_19.mp3"};
let recordedVoiceCurrent=null;
const recordedVoiceCache={};
function voiceKey(s){
  s=String(s||'').replace(/[’]/g,"'").replace(/[“”]/g,'"');
  const times={'6:30':'six thirty','7:00':'seven','7:30':'seven thirty','8:00':'eight','9:30':'nine thirty','1:00':'one','6:00':'six','9:00':'nine'};
  Object.keys(times).forEach(k=>s=s.split(k).join(times[k]));
  return s.toLowerCase().trim().replace(/\s+/g,' ').replace(/[!?.,;:]+$/g,'');
}
function preloadRecordedVoice(prefix=''){
  const uniq=[...new Set(Object.values(RECORDED_VOICE_MAP))];
  let i=0;
  const batch=()=>{
    for(let n=0;n<12 && i<uniq.length;n++,i++){
      const src=prefix+uniq[i];
      if(!recordedVoiceCache[src]){const a=new Audio();a.preload='auto';a.src=src;a.load();recordedVoiceCache[src]=a;}
    }
    if(i<uniq.length)setTimeout(batch,90);
  };
  if('requestIdleCallback' in window)requestIdleCallback(batch);else setTimeout(batch,250);
}
function stopRecordedVoice(){
  try{if(recordedVoiceCurrent){recordedVoiceCurrent.pause();recordedVoiceCurrent.currentTime=0;}}catch(e){}
  recordedVoiceCurrent=null;
}
function recordedSpeak(text,prefix='',fallback=null){
  if(!text)return false;
  stopRecordedVoice();
  const key=voiceKey(text), rel=RECORDED_VOICE_MAP[key];
  if(rel){
    const src=prefix+rel;
    let a=recordedVoiceCache[src];
    if(!a){a=new Audio();a.preload='auto';a.src=src;recordedVoiceCache[src]=a;}
    recordedVoiceCurrent=a;
    try{a.currentTime=0;const p=a.play();if(p&&p.catch)p.catch(()=>{if(fallback)fallback(text);});return true;}catch(e){if(fallback)fallback(text);return false;}
  }
  const parts=String(text).match(/[^.!?]+[.!?]?/g)?.map(x=>x.trim()).filter(Boolean)||[];
  const rels=parts.map(p=>RECORDED_VOICE_MAP[voiceKey(p)]).filter(Boolean);
  if(parts.length>1 && rels.length===parts.length){
    let j=0;
    const playNext=()=>{
      if(j>=rels.length)return;
      const src=prefix+rels[j++];let a=recordedVoiceCache[src];
      if(!a){a=new Audio();a.preload='auto';a.src=src;recordedVoiceCache[src]=a;}
      recordedVoiceCurrent=a;a.currentTime=0;a.onended=playNext;
      const p=a.play();if(p&&p.catch)p.catch(()=>{if(fallback)fallback(text);});
    };playNext();return true;
  }
  if(fallback)fallback(text);
  return false;
}
