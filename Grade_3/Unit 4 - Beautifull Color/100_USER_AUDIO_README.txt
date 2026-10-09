ONLINE 100-USER VERSION

This build is static and has no per-user server state, so 100 simultaneous students do not create application-server load.

Audio changes:
- All browser SpeechSynthesis was replaced with the 3 attached TTSMaker voice recordings.
- The 89 recorded phrases are played from 3 compact audio sprites, not 89 separate network files.
- The three voice files preload once and are cached.
- On HTTP/HTTPS the lesson also decodes the sprites with Web Audio for immediate playback after the first interaction.
- file:// opening falls back to normal HTML audio, so the ZIP still works offline.
- Song volume automatically ducks while the recorded voice plays.
- Game voice uses the same root audio cache instead of duplicating the files.

Bandwidth changes:
- Monster Sort iframe is not loaded until OPEN MONSTER SORT is pressed.
- Six 1.2 MB PNG color cards were converted to ~small WebP cards.
- The duplicate game song was removed; game and lesson share the same Monster Colors.mp3.
- The unused old Monster Mission.mp3 was removed.
- Presentation slides remain lazy-loaded.

Hosting:
- Keep the folder structure unchanged.
- For Vercel, vercel.json contains long-cache headers for versioned static assets.
- sw.js adds cache-first reuse for MP3 and image assets on repeat visits.
