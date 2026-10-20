GRADE 4 UNIT 4 – COMPLETE LESSON & PRESENTATION INTEGRATION V36
================================================================

SOURCE:
- Original uploaded lesson: Quick_Pick_Where_Is_It_V17_Scaffolding_Card_Roles 2.zip (contains V35 audit and application assets).
- Presentation supplied as "Copy of Grade 5 Unit 2.pdf", which actually contains Grade 4 Unit 4 "WHERE IS IT?" illustrations.
- Source PDF has 62 pages. Seven alternate/duplicate drafts were excluded; 55 selected image pages were integrated individually.
- 55 separate 1505 x 847 WebP images are included in assets/presentation_slide_01.webp ... presentation_slide_55.webp.
- PDF source-page mapping: PRESENTATION_SLIDE_MAP_V36.json

CHANGES:
1. Rebuilt full-screen PRESENTATION inside the original lesson, with week jumps (slides 1, 15, 29), NEXT, BACK, HOME, FULLSCREEN, separate WORD and SENTENCE read-aloud, and clickable character speech.
2. Teacher-controlled slide changes. One picture file per slide, no automatic reveal. Slides 35/38 have on-screen Week 3 label corrections, and all counters display /55 without changing source artwork.
3. English speech slowed to 0.70; WORD and SENTENCE controls use distinct prompts. Multi-part narration has a 900 ms pause; PLAY's spoken question and location clue have a 1000 ms pause.
4. PLAY clue displayed on two clearly separated lines: "Where is Grandma?" and "(tent)".
5. Clicking the PLAY flashcard for Grandpa/Grandma speaks first person "I am ...", with bicycle bell and scooter rolling sound effects where appropriate. Character speech also works by tapping the picture or CHARACTER in the presentation and on appropriate PRACTICE/SPEAK/LEARN cards.
6. Spatial Match, original flashcards, practice, learn, finish and other lesson assets retained.

AUDIT:
- Browser layout and controls: see PRESENTATION_V36_BROWSER_AUDIT.json.
- Simulated speech and sounds: see PRESENTATION_V36_AUDIO_AUDIT.json.
- File integrity and mapping: 160/160 file checks passed.
- Voice tests use mock speechSynth events to check script, rate and pause, not the actual macOS Safari voice. Verify actual voice quality and volume on the teacher's Mac.
- Browser UI tests use inline HTML with known slideshow images because this test environment prevents navigation directly to file:// or localhost URLs; production assets and all slide files were separately verified.

IMPORTANT SOURCE LIMITATIONS:
- The uploaded PDF includes inconsistent printed slide counters and a few older Week labels; the HTML viewer visually corrects the counters and two clearly wrong labels without regenerating the artwork.
- The sequence follows the 55 available numbered teaching images in the supplied PDF. Some of the original Batch 4 picture choices differ from the earlier planning outline; these have been preserved rather than replaced with invented pictures.
- Speech synthesis voices and autoplay behaviour vary by browser. PLAY audio starts when supported, and all teacher controls work on user interaction.
- Open index.html to run the complete lesson. When deploying to Vercel, upload the complete folder contents unchanged, keeping assets/ alongside index.html.

INDEX / ASSETS
- index.html            Full Grade 4 interactive lesson (open this file)
- spatial-match.html    Standalone Spatial Match retained
- assets/               Existing lesson and game assets + 55 new slides + 2 effect sounds
- PRESENTATION_SLIDE_MAP_V36.json   Slide page mapping and audio scripts
- PRESENTATION_V36_BROWSER_AUDIT.json / PRESENTATION_V36_AUDIO_AUDIT.json   Reproducible audit results
