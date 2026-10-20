/* Pawn to Professor storage compatibility loader.
   On the deployed site, an existing shared PTPFlashcardStorage implementation can replace this file.
   This fallback keeps offline/local testing functional without any backend or Vercel function. */
(function(){
  if(window.PTPFlashcardStorage) return;
  const cfg=()=>window.PTP_FLASHCARD_CONFIG||{unitKey:'unknown',lessonKey:'main'};
  const key=()=>`ptp_fc_${cfg().unitKey}_${cfg().lessonKey}`;
  const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'[]')}catch(e){return[]}};
  const write=a=>localStorage.setItem(key(),JSON.stringify(a));
  window.PTPFlashcardStorage={
    async listSets(){return read()},
    async saveSet(set){const a=read(),i=a.findIndex(x=>x.id===set.id);if(i>=0)a[i]=set;else a.push(set);write(a);return set},
    async deleteSet(id){write(read().filter(x=>x.id!==id));return true}
  };
})();
