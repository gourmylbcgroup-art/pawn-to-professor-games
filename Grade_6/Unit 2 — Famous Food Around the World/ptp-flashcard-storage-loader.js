/* PTP host-storage bridge. Reuses the EXISTING website storage implementation.
 * No Supabase keys, fake accounts, localStorage substitution, or new endpoints.
 */
(()=>{'use strict';
 const required=['listSets','saveSet','deleteSet'];
 const ready=()=>!!(window.PTPFlashcardStorage&&required.every(n=>typeof window.PTPFlashcardStorage[n]==='function'));
 const config=window.PTP_FLASHCARD_CONFIG||{};
 if(config.unitKey!=='grade6_unit2_famous_food_around_the_world'||config.lessonKey!=='main')console.warn('PTP flashcard lesson configuration mismatch.');
 let state='checking';
 const candidates=[];
 // Shared code may be shipped alongside the lesson or installed in the parent hub.
 const absolute=new URL('./ptp-flashcard-storage.js',document.baseURI);
 candidates.push(absolute.href);
 const segments=new URL(document.baseURI).pathname.split('/').filter(Boolean);
 if(segments.length&&/\.[a-z0-9]+$/i.test(segments[segments.length-1]))segments.pop();
 for(let n=segments.length-1;n>=0;n--){const path='/'+segments.slice(0,n).join('/')+(n?'/':'')+'ptp-flashcard-storage.js';const url=new URL(path,location.origin).href;if(!candidates.includes(url))candidates.push(url)}
 const load=(url)=>new Promise(resolve=>{
   const tag=document.createElement('script');tag.src=url;tag.async=true;
   tag.onload=()=>resolve(ready());tag.onerror=()=>resolve(false);
   document.head.appendChild(tag);
 });
 window.PTPFlashcardStorageBridge={get status(){return ready()?'connected':state}, get candidates(){return [...candidates]}, ready:null};
 window.PTPFlashcardStorageBridge.ready=(async()=>{
   if(ready()){state='connected';return true}
   for(const url of candidates){if(await load(url)){state='connected';document.dispatchEvent(new Event('ptp-flashcard-storage-ready'));return true}}
   state='unavailable';console.warn('Account flashcard storage is not available. Install the existing shared ptp-flashcard-storage.js in the hub/lesson; no changes were made to the database.');
   return false;
 })();
})();
