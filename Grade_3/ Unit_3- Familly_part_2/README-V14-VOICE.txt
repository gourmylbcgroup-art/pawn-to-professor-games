GRADE 3 — UNIT 3 FAMILY ADVENTURE V14
UNIFIED RECORDED VOICE / ONLINE AUDIO FIX

SOURCE
Based on the user's attached Grade3_Unit3_Family_Adventure_V13_THIS_THAT_10_Cards_Audited(2).zip.
This update is for Family Adventure (START, LEARN, PLAY, PRACTICE, SPEAK, FINISH and SLIDES), not the separate Mystery House Battle game.

FIXES
* Removed in-game browser text-to-speech, which previously changed voice and could start slowly depending on the device/browser.
* Uses only the original Stephane prerecorded voice sprite for speech.
* Embeds the recorded audio bank in index.html. Once the page is loaded and the bank decoded, each click plays sound from memory instead of making a new online MP3 request.
* Speaks supported questions and answers using a single speaker, with separate phrases stitched together without long pauses; pet THIS/THAT sentence patterns are assembled from existing same-speaker recordings.
* Extracts the isolated question prompts (Who is he? / Who is she? / What is that?) from prerecorded longer phrases.
* Cancels outdated speech when navigating or tapping rapidly to prevent overlap and delayed responses.
* Removes unused alternate voice-sprite assets; preserves a standalone copy of the Stephane sprite as decoder fallback.
* Bumps the service-worker version, and keeps HTML freshness/cache headers for website updates.

LIMITS OF THE SOURCE AUDIO
Some full START monologues and explanations never existed in the supplied recorded voice. The text remains visible on screen, but the corresponding Hear control uses the closest same-speaker family/pet sentence or vocabulary rather than a second synthetic/computer voice. Reconstructed pet patterns may sound slightly segmented. For complete, exact personalized greeting recordings, new recordings in the SAME voice would be needed.
There is no guarantee of zero latency before the initial HTML and audio bank arrive over a slow network, or on a device with limited audio decoding support. After decode, ordinary playback requires no per-click audio network requests.

TESTS
52/52 headless Chromium browser checks passed. Verified voice bank decodes, all tested level/audio controls play, changing levels, rapid-click cancellation, and no audio HTTP requests during the test. No JavaScript exceptions. These are local automated tests, not measured 100-user live-hosting load or real speaker sound-quality verification.

HOW TO USE
Unzip. Open index.html for offline teaching. For web hosting upload the CONTENTS of the ZIP with index.html at the site root and assets next to it. Update the live page and force-refresh browsers or redeploy to ensure service-worker caches update. Students using the same file on 100 devices have independent sessions, not online multiplayer.
