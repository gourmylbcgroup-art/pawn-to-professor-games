window.GAME_CONFIG = {
  // Replace these WAV files with your own sounds if you want.
  sounds: {
    dice: "sounds/Dice.mp3",
    ladder: "sounds/ladder_climb.wav",
    snake: "sounds/snake_slide.wav",
    step: "sounds/piece_step.wav",
    win: "sounds/celebration.wav"
  },

  // Optional recorded voice files.
  // Leave useRecordedVoices false to use the computer/browser English voice.
  // If you set it to true, add the files listed below in the /sounds folder.
  useRecordedVoices: true,
  voices: {
    whereAreYou: "sounds/where_are_you.mp3",
    slideDown: "sounds/slide_down.mp3",
    moveUp: "sounds/move_up.mp3",
    answers: {
      "hospital": "sounds/hospital.mp3",
      "school": "sounds/school.mp3",
      "supermarket": "sounds/supermarket.mp3",
      "bank": "sounds/bank.mp3",
      "park": "sounds/park.mp3",
      "store": "sounds/store.mp3",
      "night market": "sounds/night_market.mp3",
      "tea shop": "sounds/tea_shop.mp3",
      "cafe": "sounds/cafe.mp3",
      "library": "sounds/library.mp3"
    }
  },

  // Special moves use path square numbers (START = 0, FINISH = 49).
  // These match the snakes/ladders approximately on the supplied artwork.
  ladders: {
    2: 17,
    16: 23,
    13: 34,
    27: 31
  },
  snakes: {
    20: 1,
    46: 15,
    33: 26,
    28: 8,
    14: 5
  },

  // Speed in milliseconds.
  stepDelay: 430,
  diceAnimationMs: 900,
  specialMoveMs: 1250,
  landingPauseMs: 6000
};
