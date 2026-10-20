PAWN TO PROFESSOR — GRADE 4 UNIT 4 V39
VOICE INTEGRATION + STATIC/CDN PERFORMANCE IMPROVEMENTS
=====================================================

WHAT WAS IN THE NEW FIVE MP3 UPLOADS
- Five uploaded MP3s contained 3 different source recordings (2 repeated exports).
- Extracted 36 short sentence/word segments.
- Activated 30 correct new voice clips and retained all 77 V38 clips.
- Six TTSMaker recordings skipped the grammatical blank ('Grandma is the slide')
  and are NOT deployed as voiced lesson prompts. They are deliberately replaced
  with 'Which preposition?' using the device's browser English voice.
- The other 14 missing recording lines are identified in V39_MISSING_AUDIO.txt.
- Active recorded MP3 clips after integration: 107 total (0.95 MiB).

ONLINE AUDIO PERFORMANCE
- Every tap loads only its own short MP3 rather than the full TTSMaker exports.
- Teaching pauses of 2 seconds remain separate in code; no 2s silence inside clips.
- A single reusable audio player prevents recordings overlapping when students
  press several buttons; navigation cancels obsolete sound.
- Nonexistent/broken voice URLs fall back to synthesized English from the browser.
- The player has a 6.5s error timeout to recover from stalled downloads.
- At most 8 extra audio files are prefetched on good connections; slow networks
  and browser Data Saver skip prefetch.
- Voice MP3s have unique V38/V39 filenames and one-year immutable CDN-cache headers
  in this folder's vercel.json. MP3 fetches may be served from the edge cache.
- The original bicycle/scooter effects, all 55 slideshow pages, LEARN/PRACTICE/
  PLAY/SPEAK/FINISH, Flashcard Viewer, and Spatial Match have been retained.
- Large Spatial Match content loads only when opened.

AUDIT COMPLETED
- Full FFmpeg decode: 107/107 active MP3s pass.
- New upload parsing: 3 unique MP3 files, 36 speech segments, 30 active.
- Every voice manifest URL exists.
- 55/55 presentation pictures exist.
- JS syntax checks: index, Spatial Match and audio scripts passed.
- Shared audio-engine simulated playback/sequence/cancel/fallback passed.
- Bicycle bell and scooter-roll effects exist.
- 100/100 concurrent-style LOCAL static file requests succeeded with 20 workers.
- Chromium browser headless test did not complete in this environment.

IMPORTANT LIMITS
- These tests do not prove no lag for 100 actual users on Vercel or Cloudflare;
  real browser autoplay policy, internet quality, CDN origin and hosting quota matter.
- Browser speech fallback has inconsistent voice quality and can have OS startup lag.
- 14 unprovided script lines and 6 invalid blank sentences still lack correct MP3.
- For live readiness test 100 unique clients on the published URL and verify
  audio under actual classroom Wi-Fi and touch screen conditions.

HOW TO INSTALL
- Extract ZIP and deploy its complete contents as ONE Grade 4 Unit 4 folder.
- Do NOT replace other games or lessons in your repository.
- If your Vercel project root is above the lesson subfolder, merge the cache
  rules from this vercel.json into the PROJECT ROOT vercel.json and adjust paths;
  don't replace an unrelated project-root config.
- First test with a desktop and a tablet. Try Week 3 slide 36, a PLAY question,
  a bicycle/scooter card, rapid taps, and Spatial Match before switching everyone.

V39_ADDED_AUDIO_INDEX.csv lists the new clips, including six deliberately omitted
bad source recordings. V39_MISSING_AUDIO.txt lists what still needs rerecording.
V39_FULL_AUDIO_AND_100_USERS_AUDIT.json is the test result.
