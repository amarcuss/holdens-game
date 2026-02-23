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
  WOOD_WALL: 4,
  GRASS: 5,
  TREE: 6,
  ICE: 7,
  ICE_WALL: 8,
  LAVA: 9,
  LAVA_WALL: 10,
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

  // Ice tiles
  ICE_FLOOR1: '#8a9aaa',
  ICE_FLOOR2: '#7a8a9a',
  ICE_WALL_DARK: '#3a4a6c',
  ICE_WALL_LIGHT: '#4a5a7a',
  ICE_WALL_TOP: '#2a3a5c',

  // Frost Sprite
  FROST_BODY: '#6ac8e8',
  FROST_DARK: '#4aa0c8',
  FROST_LIGHT: '#9ae0f8',
  FROST_CORE: '#e0f4ff',
  FROST_EYE: '#1a3050',

  // Ice Golem
  GOLEM_BODY: '#5a7a8a',
  GOLEM_DARK: '#3a5a6a',
  GOLEM_LIGHT: '#8aaaba',
  GOLEM_CORE: '#b0d8f0',
  GOLEM_EYE: '#4af0ff',

  // Frost Wraith
  WRAITH_CLOAK: '#2a3a5a',
  WRAITH_BODY: '#3a4a6a',
  WRAITH_GLOW: '#6ac8e8',
  WRAITH_EYE: '#80ffff',

  // Cryomancer
  CRYO_ROBE: '#2a4a7a',
  CRYO_HOOD: '#1a3060',
  CRYO_SKIN: '#c0d8e8',
  CRYO_EYE: '#4af0ff',
  CRYO_STAFF: '#6ac8e8',

  // Lava tiles
  LAVA_FLOOR1: '#8a3a2a',
  LAVA_FLOOR2: '#7a3020',
  LAVA_WALL_DARK: '#4a2020',
  LAVA_WALL_LIGHT: '#5a2a2a',
  LAVA_WALL_TOP: '#3a1818',

  // Magma Imp
  IMP_BODY: '#cc4422',
  IMP_DARK: '#993311',
  IMP_LIGHT: '#ee6633',
  IMP_HORN: '#ffaa22',
  IMP_EYE: '#ffff00',

  // Obsidian Guardian
  OBSIDIAN_BODY: '#3a3a3a',
  OBSIDIAN_DARK: '#2a2a2a',
  OBSIDIAN_LIGHT: '#5a5a5a',
  OBSIDIAN_CORE: '#ee6622',
  OBSIDIAN_EYE: '#ff4400',

  // Flame Caster
  FLAME_ROBE: '#8a2200',
  FLAME_HOOD: '#661800',
  FLAME_SKIN: '#e8a880',
  FLAME_EYE: '#ff6600',
  FLAME_STAFF: '#ee6622',

  // Volcano Lord
  VLORD_BODY: '#882200',
  VLORD_DARK: '#661800',
  VLORD_LIGHT: '#aa3300',
  VLORD_CORE: '#ff6600',
  VLORD_EYE: '#ffcc00',
  VLORD_HORN: '#ffaa22',

  // The Architect
  ARCHITECT_ROBE: '#2a1a3a',
  ARCHITECT_ROBE_LIGHT: '#3a2a5a',
  ARCHITECT_HOOD: '#1a0a2a',
  ARCHITECT_EYE: '#bf5fff',
  ARCHITECT_SKIN: '#c8b8a8',

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
  VICTORY: 'VICTORY',
  CLIFF: 'CLIFF',
  DUNGEON_SELECT: 'DUNGEON_SELECT',
  REWARD_CHOICE: 'REWARD_CHOICE',
  MAP: 'MAP',
};

// Available dungeons
const DUNGEONS = [
  { key: 'holdens', name: "Holden's Dungeon", desc: 'The dungeon where it all began.', startRoom: 0, bossRoom: 14, introScene: 'intro', endingScene: 'ending' },
  { key: 'frozen', name: 'The Frozen Depths', desc: 'An ancient dungeon sealed in ice.', startRoom: 16, bossRoom: 35, introScene: 'frozen_intro', endingScene: 'frozen_ending' },
  { key: 'volcano', name: 'The Volcano', desc: 'A blazing hell beneath the mountain.', startRoom: 36, bossRoom: 45, introScene: 'volcano_intro', endingScene: 'volcano_ending' },
];

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
    [
      'Somewhere deep, a low hum.',
      'Like a heartbeat.',
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
    [
      'Words carved in the stone:',
      '\'YOU WERE NEVER MEANT',
      'TO WAKE.\'',
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
      'A whisper from the walls:',
      '\'My jailer wakes for you.',
      'How flattering.\'',
    ],
  ],
  ending: [
    [
      'The last creature falls.',
      'Silence fills the chamber.',
      'A draft — fresh air.',
    ],
    [
      'You climb through crumbling',
      'stone, upward, until light',
      'stings your eyes.',
    ],
    [
      'A sunlit forest. Birds.',
      'Wind through the leaves.',
      'A small house between the trees.',
    ],
    [
      'A voice, faint, from below:',
      '\'Unexpected. But there',
      'are deeper cages.\'',
    ],
  ],

  // --- Frozen Depths stories ---
  frozen_intro: [
    [
      'The house door opens onto',
      'a staircase carved in ice.',
      'Cold air rushes upward.',
    ],
    [
      'Each step cracks with frost.',
      'Something ancient stirs below,',
      'frozen but not dead.',
    ],
    [
      'Your breath hangs white.',
      'Sword ready. Descend.',
    ],
    [
      'Carved in the ice at the',
      'stair\'s base: \'THE COLD WILL',
      'FINISH WHAT STONE COULD NOT.\'',
    ],
  ],
  frozen_crossroads: [
    [
      'Passages branch in every',
      'direction, each one coated',
      'in a thicker layer of ice.',
    ],
    [
      'Crystalline shapes drift',
      'through the corridors —',
      'frost sprites. They see you.',
    ],
  ],
  glacial_hall: [
    [
      'A frozen merchant crouches',
      'by a fire that gives no heat.',
      '"Even the cold needs coin."',
    ],
  ],
  crystal_cavern: [
    [
      'The walls pulse with pale',
      'blue light. Crystals hum',
      'a low, resonant note.',
    ],
    [
      'A voice: \'You were dangerous',
      'once. I made sure',
      'you forgot.\'',
    ],
  ],
  frozen_falls: [
    [
      'A frozen waterfall hangs',
      'suspended mid-cascade.',
      'The silence is deafening.',
    ],
  ],
  frost_maze: [
    [
      'The corridors twist and',
      'double back. Ice mirrors',
      'your reflection from every wall.',
    ],
    [
      'Arrows whistle from unseen',
      'alcoves. The maze fights back.',
    ],
  ],
  glacial_depths: [
    [
      'The temperature drops again.',
      'Frost crackles across your',
      'armor with every step.',
    ],
    [
      'The walls narrow. Ahead,',
      'a gauntlet of frost and bone.',
    ],
  ],
  frostbound_antechamber: [
    [
      'Grand pillars of solid ice.',
      'Carvings of a frozen king',
      'line the frozen walls.',
    ],
    [
      'A deep rumble shakes loose',
      'icicles from the ceiling.',
      'The throne room awaits.',
    ],
  ],
  frozen_throne: [
    [
      'A vast frozen hall. At its',
      'center, a figure in dark robes.',
      'Waiting.',
    ],
    [
      '\'You made it this far.',
      'Impressive. Pointless,',
      'but impressive.\'',
    ],
    [
      'The staff glows violet.',
      'The air crackles with ice.',
    ],
  ],
  frozen_ending: [
    [
      'The Architect stumbles.',
      'The staff flickers.',
    ],
    [
      '\'This... is not over.',
      'You remember nothing.',
      'You ARE nothing.\'',
    ],
    [
      'A flash of violet light.',
      'The robed figure vanishes.',
    ],
    [
      'The frozen walls begin',
      'to thaw. You climb back',
      'to daylight.',
    ],
  ],

  // --- Volcano stories ---
  volcano_intro: [
    [
      'A crack in the mountainside',
      'breathes scorching heat.',
      'The air shimmers red.',
    ],
    [
      'The stone throbs underfoot.',
      'A heartbeat. Something down',
      'here is still alive.',
    ],
    [
      'Sweat beads on the blade.',
      'Down. Into the heat.',
    ],
    [
      'Burned into the entrance:',
      '\'HE WAS HERE. HE IS GONE.\'',
      'The Architect fled this place.',
    ],
  ],
  volcanic_crossroads: [
    [
      'Lava channels carve the',
      'stone in every direction.',
      'The rock glows beneath you.',
    ],
    [
      'Small shapes dart through',
      'the flames — imps, giggling',
      'as they burn.',
    ],
  ],
  magma_hall: [
    [
      'A merchant perches on',
      'cooled obsidian, sweat-',
      'soaked and grinning.',
    ],
    [
      '"Everything melts down',
      'here. Might as well spend',
      'it before you do."',
    ],
  ],
  ember_cavern: [
    [
      'The ceiling drips with',
      'molten stone. Pools of lava',
      'bubble and hiss.',
    ],
    [
      'Dark shapes stand still',
      'among the pillars — guardians',
      'of living obsidian.',
    ],
  ],
  caldera: [
    [
      'A vast lake of magma',
      'stretches before you.',
      'The far shore ripples.',
    ],
    [
      'Robed figures raise staffs',
      'across the lava. Fire rains',
      'from their hands.',
    ],
  ],
  inferno_depths: [
    [
      'The tunnels narrow and',
      'twist. Lava veins pulse',
      'through the walls.',
    ],
    [
      'Every step brings more.',
      'Imps. Obsidian. Flame.',
      'The mountain tests you.',
    ],
  ],
  volcano_antechamber: [
    [
      'The tunnel opens into',
      'a hall of carved basalt.',
      'Runes glow in the stone.',
    ],
    [
      'The mountain groans.',
      'Beyond the far arch,',
      'something breathes.',
    ],
  ],
  volcano_throne: [
    [
      'A throne of slag and ember',
      'glows at the chamber\'s core.',
      'The air itself burns.',
    ],
    [
      'No dark robes. No violet light.',
      'Just fire and fury.',
    ],
    [
      'The ground splits open.',
      'A massive figure rises',
      'from the lava.',
    ],
    [
      'It sees you.',
      'Finish it.',
    ],
  ],
  volcano_ending: [
    [
      'The last ember dies.',
      'The mountain shudders and',
      'the lava begins to cool.',
    ],
    [
      'Obsidian hardens beneath',
      'your feet. A path opens',
      'through cooling stone.',
    ],
    [
      'You emerge into cool air.',
      'The cliff house waits.',
      'The mountain sleeps.',
    ],
    [
      'But somewhere, a violet',
      'light still burns.',
    ],
  ],

  // --- Architect storyline scenes ---
  secret_passage: [
    [
      'The walls narrow. Old scratches',
      'in the stone — fingernails.',
    ],
    [
      'Above the doorframe, carved deep:',
      '\'NO ONE LEAVES.\'',
    ],
  ],
  the_pit: [
    [
      'A chasm yawns beneath a narrow',
      'bridge. Bones at the bottom.',
    ],
    [
      'Carved into the bridge rail:',
      '\'I BUILT THIS FOR YOU.\'',
    ],
  ],
  frozen_passage: [
    [
      'Ice so thick the walls glow blue.',
      'A figure is preserved inside —',
      'armor you almost recognize.',
    ],
    [
      'A voice from the walls:',
      '\'That was the last one',
      'who tried.\'',
    ],
  ],
  ice_tomb: [
    [
      'A single coffin of black ice.',
      'The inscription is in a language',
      'you almost remember.',
    ],
    [
      'The voice, closer now:',
      '\'Your grave. I carved it',
      'years ago. You just won\'t',
      'lie down in it.\'',
    ],
  ],
  lava_corridor: [
    [
      'The heat is a physical wall.',
      'Each breath scorches.',
    ],
    [
      'Burned into the rock:',
      '\'I WILL RETURN.\'',
      'The letters still glow.',
    ],
  ],
};

// Map room indices to story scene keys (played on first entry)
const ROOM_STORIES = {
  2: 'great_hall',
  3: 'treasury',
  4: 'depths',
  5: 'secret_passage',
  6: 'crypt',
  8: 'armory',
  11: 'the_pit',
  13: 'antechamber',
  14: 'throne',
  // Frozen Depths
  18: 'frozen_crossroads',
  19: 'glacial_hall',
  20: 'crystal_cavern',
  21: 'frozen_passage',
  24: 'frozen_falls',
  26: 'frost_maze',
  29: 'ice_tomb',
  31: 'glacial_depths',
  34: 'frostbound_antechamber',
  35: 'frozen_throne',
  // Volcano
  37: 'lava_corridor',
  38: 'volcanic_crossroads',
  39: 'magma_hall',
  40: 'ember_cavern',
  42: 'caldera',
  43: 'inferno_depths',
  44: 'volcano_antechamber',
  45: 'volcano_throne',
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
