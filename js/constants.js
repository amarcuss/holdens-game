// Tile size in pixels (sprites are 16x16, drawn at 2x)
const TILE = 32;
const SPRITE_SIZE = 16;
const SCALE = 2;

// Canvas
const CANVAS_W = 640;
const CANVAS_H = 480;

// Room dimensions in tiles
const ROOM_W = 20;
const ROOM_H = 15;

// Tile types
const T = {
  FLOOR: 0,
  WALL: 1,
  DOOR: 2,
  SHOP_FLOOR: 3,
};

// Colors
const COLORS = {
  // Walls
  WALL_DARK: '#3a3a5c',
  WALL_LIGHT: '#4a4a6a',
  WALL_TOP: '#2a2a4c',

  // Floor
  FLOOR1: '#5c5c4a',
  FLOOR2: '#54544a',
  FLOOR3: '#585848',

  // Door
  DOOR_FRAME: '#8b6914',
  DOOR_DARK: '#6b4c12',
  DOOR_BLACK: '#1a1a1a',

  // Player
  SKIN: '#f5c6a0',
  HAIR: '#8b4513',
  SHIRT: '#4a90d9',
  PANTS: '#3a5a8a',
  SHOE: '#5a3a1a',
  EYE: '#222',

  // Slime
  SLIME_BODY: '#4ecdc4',
  SLIME_DARK: '#2ea89f',
  SLIME_LIGHT: '#7eddd6',
  SLIME_EYE: '#222',

  // Skeleton
  BONE: '#e0d8c8',
  BONE_DARK: '#b8b0a0',
  BONE_LIGHT: '#f0ece4',
  SKEL_EYE: '#c0392b',

  // Archer
  ARCHER_CLOAK: '#2d5a1e',
  ARCHER_HOOD: '#1e3d14',
  ARCHER_BOW: '#8b6914',
  ARCHER_EYE: '#c8e6c9',

  // Brute
  BRUTE_BODY: '#2d8a4e',
  BRUTE_DARK: '#1a6b3a',
  BRUTE_LIGHT: '#4ebd6e',
  BRUTE_SPIKE: '#8b6914',
  BRUTE_EYE: '#e74c3c',
  BRUTE_BELLY: '#3aad5e',

  // UI
  BG: '#1a1a2e',
  TEXT: '#eee',
  HEART: '#e74c3c',
  COIN: '#f1c40f',
};

// Game states
const STATE = {
  TITLE: 'TITLE',
  PLAYING: 'PLAYING',
  SHOP: 'SHOP',
  GAME_OVER: 'GAME_OVER',
  TRANSITION: 'TRANSITION',
  BESTIARY: 'BESTIARY',
  STORY: 'STORY',
};

// Story scenes — each scene is an array of pages, each page is an array of lines
const STORY_SCENES = {
  intro: [
    [
      'You wake on cold stone.',
      'Head throbbing, hands scraped.',
      'No memory of how you got here.',
    ],
    [
      'Damp air, something shifting',
      'in the dark. A rusty sword',
      'at your hip — it\'ll have to do.',
    ],
    [
      'Only one way out:',
      'forward, into the dungeon.',
    ],
  ],
  great_hall: [
    [
      'The ceiling stretches upward',
      'into darkness. Pillars cast',
      'long, crooked shadows.',
    ],
    [
      'Something rattles deeper in.',
      'Bones. Walking bones.',
      'They don\'t seem friendly.',
    ],
  ],
  treasury: [
    [
      'A weathered figure hunches',
      'beside a makeshift stall,',
      'torchlight catching worn coins.',
    ],
    [
      '"Coins for gear, gear for',
      'survival." He doesn\'t look up.',
    ],
    [
      'At least someone else',
      'is alive down here.',
    ],
  ],
  depths: [
    [
      'The air grows thick and warm.',
      'Passages branch in every',
      'direction — a crossroads.',
    ],
    [
      'Scratching echoes from all',
      'sides. The dungeon is waking up.',
    ],
  ],
  crypt: [
    [
      'Rows of stone coffins line',
      'the walls. Some lids have',
      'been pushed aside.',
    ],
    [
      'The dead don\'t rest easy here.',
    ],
  ],
  armory: [
    [
      'Rusted weapon racks cling',
      'to the walls. Whoever built',
      'this place was ready for war.',
    ],
    [
      'Arrows whistle from the dark.',
      'Something in here can aim.',
    ],
  ],
  antechamber: [
    [
      'Grand stonework. Carved pillars.',
      'This was important once.',
    ],
    [
      'A low rumble echoes',
      'from beyond the far door.',
      'Something is waiting.',
    ],
  ],
  throne: [
    [
      'A vast chamber. Cracked',
      'throne at the far end,',
      'draped in cobwebs.',
    ],
    [
      'The ground trembles.',
      'A hulking shape rises',
      'from the shadows.',
    ],
    [
      'No turning back now.',
    ],
  ],
};

// Map room indices to story scene keys (played on first entry)
const ROOM_STORIES = {
  2: 'great_hall',
  3: 'treasury',
  4: 'depths',
  6: 'crypt',
  8: 'armory',
  13: 'antechamber',
  14: 'throne',
};

// Directions
const DIR = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

// Direction vectors
const DIR_DX = [0, 0, -1, 1];
const DIR_DY = [-1, 1, 0, 0];

// Player
const PLAYER_SPEED = 4; // tiles per second
const PLAYER_MAX_HP = 6;
const PLAYER_BASE_ATK = 1;
const PLAYER_BASE_DEF = 0;
const PLAYER_ATTACK_COOLDOWN = 0.35; // seconds between attacks
