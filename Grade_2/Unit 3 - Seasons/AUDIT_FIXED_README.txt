GRADE 2 UNIT 3 — AUDIT / FIX SUMMARY

STATUS AFTER FIX

1. 100-user optimization
   PASS
   - Full-size flashcards are not all preloaded.
   - Grid images use loading="lazy".
   - Audio uses preload="none" or metadata where appropriate.
   - Static WEBP/PNG/JPG/MP3 caching increased to 7 days with 30-day stale-while-revalidate.
   - HTML remains no-cache so lesson updates deploy immediately.
   - No new Vercel Function added.

2. Flashcard/image protection
   PASS for normal browser actions.
   - Right-click is blocked across the whole main lesson, including CSS/background areas.
   - Image dragging is blocked.
   - Ctrl/Cmd+S, Ctrl/Cmd+P, Ctrl/Cmd+U are blocked.
   - Embedded Spinny Seasons iframe has its own protection.
   - A subtle pawntoprofessor.com watermark is shown without covering lesson content.
   LIMITATION: screenshots/devtools cannot be completely prevented by a normal website.

3. SQL / cloud saved flashcards
   IMPORTANT:
   SQL itself SHOULD NOT be embedded in index.html.
   SQL belongs in Supabase and must already be run there.

   The lesson index contains:
   - PTP_FLASHCARD_CONFIG
     unitKey: grade2_unit3_seasons
     lessonKey: main
   - ptp-flashcard-storage.js client
   - Save / Load / Delete UI

   The uploaded ZIP referenced ptp-flashcard-storage.js but did NOT contain the file.
   This fixed package now includes it.

4. Critical cloud-save bug fixed
   The uploaded index was sending:
     set_name / card_ids / hidden_card_ids / card_order
   but the shared API expects:
     setName / cardIds / hiddenCardIds / metadata

   This has been corrected.

   Card order + kind are now saved in metadata:
     metadata.order
     metadata.kind

5. Limits
   - Maximum 3 saved sets per user per lesson.
   - Maximum 40 flashcards per saved set.
   - Frontend enforces both.
   - Supabase SQL should also enforce both.

6. Vercel
   This package adds ZERO Vercel Functions.
   Only static HTML/JS/assets are changed.

CLOUD REQUIREMENT
The Learning Hub play.html must load:
  <script src="./ptp-flashcard-bridge.js" defer></script>

and the Hub root must contain:
  ptp-flashcard-bridge.js

Otherwise the lesson falls back to local-device storage only.
