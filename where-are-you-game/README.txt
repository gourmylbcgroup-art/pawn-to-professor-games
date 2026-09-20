WHERE ARE YOU? — TOUCH-SCREEN ESL GAME

HOW TO RUN
1. Unzip this folder.
2. Open index.html in Google Chrome or Microsoft Edge.
3. Tap the ⛶ button for full-screen.
4. Choose 2, 3 or 4 players.
5. Tap START GAME.
6. Tap ROLL DICE.

GAME FEATURES
- 2–4 players
- touch-screen buttons
- animated dice
- dice sound on every roll
- token moves one square at a time
- ladder sound + upward move
- snake slide sound + "Slide down!"
- "Where are you?" after every completed move
- CHECK ANSWER reveals "I'm at the ..."
- NEXT PLAYER control
- winner celebration
- sound on/off
- full-screen
- restart confirmation
- works without Flash
- designed to run offline after files are downloaded

IMAGE QUALITY
- The supplied board has been prepared as a 3840 x 2160 (4K) game background.
- The original source image is also included at assets/board_original.png.
- Buttons, tokens and interface text are rendered by the browser and stay sharp at large sizes.
- Because the original artwork supplied was 992 x 558, the 4K background is a high-quality upscale, not a true redraw of the artwork.

SOUND
See sounds/README_SOUND_FILES.txt.
The three main sound files are:
- dice_roll.wav
- ladder_climb.wav
- snake_slide.wav

CUSTOMIZING SNAKES / LADDERS
Open config.js.
The "ladders" and "snakes" sections contain the square mappings.
START = square 0 and FINISH = square 49.

TIP FOR CLASSROOM TV
Use Chrome/Edge at 100% zoom and use the in-game full-screen button.

NEW LANDING FOCUS
- After the player reaches the FINAL square, the game pauses for 6 seconds.
- The final building square gets a bright pulsing highlight.
- The player's token grows slightly so students can see exactly where it landed.
- Only after the 6-second viewing time does "Where are you?" appear.
- The question panel stays at the bottom so the board and highlighted building remain visible.
- The highlight stays on while the student answers, and disappears only when NEXT PLAYER is pressed.

SMALLER PLAYER TOKENS
- Player tokens are now about 30% smaller.
- Tokens only grow very slightly during the 6-second landing highlight.
- This keeps the building picture much easier to see.


VERSION 4 - CORNER TOKENS
New classroom sequence:
ROLL DICE → token moves → token stops at a corner of the square →
whole building remains visible → square glows for 6 seconds →
"Where are you?" appears.

Changes:
- Tokens no longer sit in the center of the building image.
- 1 player: top-left corner.
- 2 players: top-left and top-right.
- 3 players: adds bottom-left.
- 4 players: uses all four corners.
- Tokens do NOT enlarge when the player lands.
- A small one-time bounce shows which token just arrived.
- The strong square glow remains for the full 6-second viewing period.


VERSION 5 - SMALLER BOTTOM-LEFT TOKENS
Sequence:
ROLL DICE → token moves → token stops at the BOTTOM-LEFT corner →
building remains visible → whole square glows for 6 seconds →
"Where are you?" appears.

Changes:
- Tokens are 25% smaller than Version 4.
- Tokens now always sit in the bottom-left corner area.
- When several players share the same square, they are slightly staggered
  within the bottom-left area so they do not hide the building.
- No token enlargement on landing.
- The 6-second square glow remains unchanged.


VERSION 6 - FLOATING DICE CONTROL
- Removed the large bottom dice bar.
- The whole bottom row of the board is now visible.
- Dice control is a small floating panel in the upper-right sky area.
- Player number appears above the dice.
- ROLL button is compact but still touch-friendly.
- The floating panel fades while the dice/token is moving.
- All Version 5 behavior remains:
  smaller tokens, bottom-left token position, 6-second glow, then "Where are you?"


VERSION 7 - SOFTER LANDING HIGHLIGHT
- Yellow landing frame is now much thinner.
- Soft glow replaces the previous heavy outline.
- Glow pulses gently during the 6-second viewing period.
- The frame no longer visually dominates the building picture.


VERSION 8 - YOUR VOICE + YOUR DICE
- Replaced the generated dice sound with your Dice.mp3.
- Added your recorded "Where are you?"
- Added your Store, Supermarket, and Tea Shop answer recordings.
- Ladder now also says "Move up!"
- Missing custom voice files automatically fall back to the browser voice.


VERSION 9 - COMPLETE CUSTOM VOICE SET
- Newest Dice recording replaces the previous dice sound.
- Your "Where are you?" recording is active.
- Your "Slide down!" recording is active.
- Your "Move up!" recording is active.
- Your recordings are active for all 10 building/location answers:
  Hospital, School, Supermarket, Bank, Park, Store,
  Night Market, Tea Shop, Cafe, Library.
- Browser voice is no longer needed during normal gameplay because
  all requested custom recordings are present.
