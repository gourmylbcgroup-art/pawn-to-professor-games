PAWN TO PROFESSOR — GRADE 4 UNIT 4
V38 VOICE INTEGRATION + CDN-READY STATIC MEDIA
===============================================

WHAT WAS ACTUALLY PROVIDED
--------------------------
- voice.rar contained 11 MP3 files, but 7 were exact duplicates of the same recording.
- Five distinct TTSMaker recordings cover 77 of the 127 lines in the original voice script:
  Block 1 (24 lines), Block 2 (10 lines), Block 5 (17 lines),
  Block 6 (24 lines), Block 7 (2 lines).
- Block 3 (22 lines: Week 3 sentence patterns) and Block 4 (28 lines:
  Week 1 flashcards/play) were NOT in voice.rar.
- All available 77 lines were extracted, assigned individual MP3 files and linked
  by text, including available vocabulary, answers, question prompts, and feedback.
- Missing and dynamically generated sentences use the lesson's synthesized English
  voice. This is intentional, rather than playing an incorrect recorded phrase.
- Complete 100% recorded-voice coverage needs the missing 50 lines. See
  V38_MISSING_VOICE_RECORDINGS.txt.

PLAYING AND CANCELING VOICE
---------------------------
- All section audio uses a shared playback engine (voice-player.js).
- Individual MP3s are fetched ONLY when the user plays them. Cache lasts across clicks.
- One reused HTML audio element avoids overlapping playback or piling up downloads.
- Rapid navigation/clicks stop the previous voice; question and clue are separate
  with a full 2-second pause; sentence-question and answer in presentation also have
  2-second teaching pause.
- Audio playback errors fall back to browser speech synthesis.
- Bicycle and scooter effects remain the original supplied short WAV sounds.
- The Spatial Match game now loads separately only on GAME launch; its speech
  requests are routed to the same audio player in the main lesson. The standalone
  spatial-match.html can also play its voice clips itself.
- 55 slides, flashcards, original learning sections, and game assets are preserved.

WEB PERFORMANCE AND 100 USERS
-----------------------------
- The 77 new MP3 voice clips total about 0.64 MiB compressed.
- No individual user downloads all MP3s at startup.
- Static MP3 URLs can be served by a CDN (Vercel or Cloudflare), with long-lived
  cache headers intended for V38 version-specific filenames.
- Image assets stay in the already optimized WebP form from V37.
- Embedded full-game HTML removed from the landing page; it loads on demand.
- Browser prefetches at most 2 relevant voice clips on each presentation slide on
  reasonably fast connections and respects Data Saver when exposed by the browser.
- On the local static server, all 100 parallel-request test operations returned
  HTTP 200. THIS IS NOT PROOF OF 100 SIMULTANEOUS LIVE STUDENTS.
- If this folder is nested in a larger Vercel repository, MERGE the included
  vercel.json cache rules into the actual deployment root vercel.json; do not copy
  it on top of an existing root config without checking the other rules.
- For actual 100-user assurance, test the published URL with representative
  browsers, user locations, Vercel/CDN data-transfer limits, and any Supabase usage.

AUDIO VERIFICATION RESULTS
--------------------------
- 77/77 individual MP3 files decoded and validated by ffprobe.
- 77/77 recorded text keys resolve to existing MP3s.
- JS syntax checked for index.html, spatial-match.html and voice-player.js.
- 55/55 presentation assets exist.
- Local 100-request static file test 100/100 succeeded.
- Voice-engine unit test: recorded playback, fallback, question/clue sequencing,
  canceled rapid-click sequence, single reusable media player all passed.
- The testing container's Chromium is blocked by administrator policy from opening
  local and routed web URLs, therefore a final interactive end-to-end browser
  visual/audio test could not be completed. DO NOT treat this as a browser pass.
- Segment matching uses the original TTSMaker block order, phrase count and
  2-second silence detection. Automatic word-level speech recognition was not
  available; listen-check your recordings after installation for any TTS mistakes.

HOW TO OPEN
-----------
1. Extract the entire ZIP, keeping index.html, spatial-match.html,
   voice-manifest.js, voice-player.js, and assets/voice next to the other assets.
2. Open index.html in a local browser, or upload the whole folder to the correct
   Grade 4 Unit 4 path on your site. Don't upload only index.html.
3. Click LEARN / PLAY / PRESENTATION. Test IN, Grandma question, a Week 3 sentence,
   the bicycle and scooter clicks, and Spatial Match's LISTEN button.
4. Test again using the actual published URL and a slow network/tablet before
   exposing the lesson to a class.

For exact audio clip mapping, see VOICE_V38_MAPPING_AUDIT.json and
VOICE_V38_CLIP_INDEX.csv; for all test outcomes, see
V38_FULL_AUDIO_PERFORMANCE_AUDIT.json.
