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
