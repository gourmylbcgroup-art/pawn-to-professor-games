window.GAME_CONFIG = {
  sounds: {
    dice: "sounds/Dice.mp3",
    ladder: "sounds/ladder_climb.wav",
    snake: "sounds/snake_slide.wav",
    step: "sounds/piece_step.wav",
    win: "sounds/celebration.wav"
  },

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

  // Timing tuned for classroom readability.
  stepDelay: 430,
  diceAnimationMs: 900,
  rollReadMs: 1800,
  specialMoveMs: 1250,
  landingPauseMs: 3000
};
