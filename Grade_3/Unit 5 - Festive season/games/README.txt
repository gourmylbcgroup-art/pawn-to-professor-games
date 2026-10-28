Grade 3 Unit 5 — New Year Compare Touch Game

Files:
- index.html
- styles.css
- game.js
- assets/scene1_food.png
- assets/scene2_objects.png
- assets/scene3_celebration.png

Game structure:
1. FOOD — 8 hotspots
2. OBJECTS — 8 hotspots
3. CELEBRATION — 8 hotspots

Touch behavior:
- Correct hotspot: gold ring + check, full-sentence audio, progress +1.
- Found items cannot score twice.
- Background taps do not score.
- 8/8 completes the scene.
- Next Scene unlocks on completion.
- Scene 3 completion returns to the menu.

Audio:
Uses browser SpeechSynthesis for now so the game works immediately and offline where supported.
The sentences are centralized in game.js and can later be mapped to recorded MP3 files without changing hotspot logic.

Integration hook:
window.PTPNewYearGame.start(sceneIndex)
window.PTPNewYearGame.menu()
window.PTPNewYearGame.loadScene(sceneIndex)
window.PTPNewYearGame.setSound(true|false)

Menu button also posts:
{ type: 'ptp-game-menu', source: 'grade3-unit5-newyear' }

to window.parent for later integration into the interactive lesson shell.

V5: local background images compressed to WebP, serialized TTS, delayed-speech cancellation, save deterrents.
