GRADE 4 UNIT 4 — V48 LITE & FAST + GRANDMA VS GRANDPA TUG OF WAR

OPEN THE LESSON:
  1. Extract the entire ZIP to one folder.
  2. Open index.html in Safari, Chrome, or Edge.
  3. Choose your level and click GAME.
  4. Choose SPATIAL MATCH or GRANDMA vs GRANDPA — TUG OF WAR.
  5. The Tug of War game is also independently playable at tug-of-war/index.html.

CONTENT RETAINED:
  Original LEARN, LISTEN, PLAY, PRACTICE, SPEAK, FINISH, FLASHCARDS,
  PRESENTATION and SPATIAL MATCH features retained from the supplied lesson.
  Tug of War copied from the user-supplied V47 spoken-countdown game.

PERFORMANCE CHANGES:
  - Removed exact duplicate *_v15.webp image aliases and updated the references.
  - Re-encoded oversized WebP/JPEG files at moderate quality WITHOUT resizing
    their dimensions. Any image not at least 8% smaller was kept unchanged.
  - Removed legacy development/audit reports from the deployed app folder;
    teaching materials and audio remain.
  - Shortened stalled-audio voice fallback delay from 6.5s to 3.5s.
  - Continued on-demand audio loading, with caching/prefetch present in V39.
  - Game chooser loads its game iframe ONLY when selected.
  - CDN static asset caching extended to OGG, M4A and WAV in vercel.json.

KNOWN ISSUES AND LIMITATIONS:
  - 14 requested voice recordings were not in the source package, and 6
    previously supplied fill-in-the-blank voice recordings were invalid.
    Those prompts still use browser TTS, which can sound different.
  - External/local URL opening was blocked in the test browser environment;
    browser logic tested using inline static document and standalone game DOM,
    but a full live Safari or online load test of 100 users was NOT performed.
  - Tug of War uses 45 pedagogically screened flashcards, not all 50 originals.
  - Two participants play per device. The game does not synchronize competitors
    from separate devices.

DEPLOYMENT:
  Upload the CONTENTS of this ZIP to a static host (keeping asset paths).
  For Vercel ensure the project root contains index.html and vercel.json.
  The new game remains at /tug-of-war/index.html.
