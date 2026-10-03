THE AMAZING FOOD RACE — GRADE 6 UNIT 2

Open index.html in Chrome, Edge, or Safari.

FILES
- index.html: page structure
- styles.css: visual design
- app.js: all game logic and JavaScript
- assets/: board and flashcards

GAME MODES
Week 4 — Passport Rookie
- Visual matching and full-sentence speaking
- Collect passport stamps
- Need 3 different stamps to win

Week 5 — Secret Route
- Safe Route: visual support
- Fast Route: no choices, +2 spaces when correct
- Need 5 stamps + one successful Fast Route to win

Week 6 — Detective Race
- Mystery Country, Mystery Food, Wrong Pair, Missing Food, Missing Country
- Customs Check before winning

AUDIO PERFORMANCE
The game does not fetch MP3 files during play. Correct, wrong, dice and stamp sounds are generated locally with the Web Audio API. Images are preloaded before the Start button is enabled. This is intended to reduce online lag on GitHub Pages/Vercel compared with on-demand sound loading.

Optional browser voice uses SpeechSynthesis and can be turned off.

TOKENS
2–4 teams choose country flags as tokens.


Update: clickable multiple-choice flashcards are now graded automatically. Students get one retry after a wrong click. Open spoken questions still use teacher CORRECT/WRONG controls. Dice timing is slowed: ~2.1 s roll, 3.0 s final number display, then ~0.65 s pause before the question.
