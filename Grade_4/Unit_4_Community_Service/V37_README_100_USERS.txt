GRADE 4 UNIT 4 — WHERE IS IT? — V37 FOR UP TO 100 USERS
=======================================================
INPUT: V36 complete lesson with Spatial Match and 55-slide presentation.
RESULT: Same content, same layout, optimized image and runtime delivery.

WHAT CHANGED
1. Converted 23 large PNG lesson/game backgrounds to quality-88 WebP.
   59.0 MiB background images are now 6.7 MiB.
2. Added 169 reduced-size WebP images for the flashcard organizer.
   Full-quality original cards remain accessible when enlarged.
3. Kept the 55 presentation slides as independently loaded WebP images.
   Only the next slide is prefetched. Save-Data/slow-2g skips prefetch.
4. Spatial Match is initialized only when the GAME section is opened, and
   unloaded when leaving it, to reduce active resources in other lessons.
   Local/offline index.html opening remains supported through embedded srcdoc.
5. Existing English speech synthesis, speech pauses, bicycle/scooter sounds,
   first-person dialogue, and game rules were preserved from V36.
6. Added vercel.json cache headers for repeat static asset visits. IMPORTANT:
   it applies ONLY if this folder is the selected Vercel project root.
   If deployed in a subfolder of a larger repository, place and adapt the
   headers at the actual Vercel project root. Keep HTML uncached.
7. Added decoding=async and lazy loading to organizer thumbnails and static
   images, reducing initial network use and decoding pressure.

SIZE
V36 unpacked: 117.4 MiB
V37 unpacked: 69.6 MiB
Change: 40.7% smaller (includes the new preview assets and reports)

AUDIT
Browser checks: 231/231 passed,
viewports: 1440x900, 1280x720, 820x1180.
Verified decoded WebP images: 404.
Local 100-client static-delivery test: 300/300 successful
(2.7 seconds for 300 HTTP requests across 100 clients).
No missing images in metadata or broken static asset references found.

IMPORTANT LIMITATION
The local test does NOT guarantee that 100 people can use your actual
Vercel account simultaneously. CDN/cache deployment settings, the user's
network, Vercel transfer quotas, and Supabase login/saved-card usage must
be checked separately under your real deployment. The packaged game
itself requires no database calls for normal play/presentation/audio.

HOW TO INSTALL
1. Unzip all files, keeping index.html, spatial-match.html, the assets/
   folder, and ptp-flashcard-storage.js together.
2. Replace ONLY your Grade 4 Unit 4 game folder in your repository.
3. On Vercel, deploy as a static HTML website (no Node server required).
4. Verify HOME, Weeks 1/2/3, PLAY, PRESENTATION (55 slides), GAME,
   FLASHCARDS, spoken clues, and the audio sound controls on Safari.
5. For subdirectory GitHub projects, the vercel.json file inside this ZIP
   must be integrated into your repository's root-level vercel.json to
   apply caching. Don't overwrite root configuration without reviewing it.

TECHNICAL RESULTS
See V37_100_USERS_ASSET_AUDIT.json,
    V37_BROWSER_3_VIEWPORT_SUMMARY.json, and
    V37_100_USERS_LOAD_TEST.json.
