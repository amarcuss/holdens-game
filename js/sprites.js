// Sprites are 16x16 2D arrays of color strings (null = transparent)
const Sprites = {
  // Generate a sprite from a compact string map
  _parse(lines, palette) {
    return lines.map(row =>
      row.split('').map(ch => palette[ch] || null)
    );
  },

  init() {
    const _ = null;

    // --- Player facing down ---
    this.playerDown = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSHH.....',
      '.....HSESHH.....',
      '.....HSSSHH.....',
      '......SSSS......',
      '.....BBBBBB.....',
      '....BBBBBBBB....',
      '....BBBBBBBB....',
      '....BB.BB.BB....',
      '....BB.BB.BB....',
      '.......PP.......',
      '......PPPP......',
      '......PP.PP.....',
      '......PP.PP.....',
      '......OO.OO.....',
    ], {
      'H': COLORS.HAIR, 'S': COLORS.SKIN, 'E': COLORS.EYE,
      'B': COLORS.SHIRT, 'P': COLORS.PANTS, 'O': COLORS.SHOE, '.': null,
    });

    // --- Player facing up ---
    this.playerUp = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '......HHHH......',
      '.....BBBBBB.....',
      '....BBBBBBBB....',
      '....BBBBBBBB....',
      '....BB.BB.BB....',
      '....BB.BB.BB....',
      '.......PP.......',
      '......PPPP......',
      '......PP.PP.....',
      '......PP.PP.....',
      '......OO.OO.....',
    ], {
      'H': COLORS.HAIR, 'S': COLORS.SKIN, 'E': COLORS.EYE,
      'B': COLORS.SHIRT, 'P': COLORS.PANTS, 'O': COLORS.SHOE, '.': null,
    });

    // --- Player facing left ---
    this.playerLeft = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '....SSSHHH......',
      '....SESHHH......',
      '....SSSHHH......',
      '.....SSSH.......',
      '....BBBBBB......',
      '....BBBBBBB.....',
      '....BBBBBBB.....',
      '....BB.BB.B.....',
      '....BB.BB.......',
      '......PPP.......',
      '.....PPPP.......',
      '.....PP.PP......',
      '.....PP.PP......',
      '.....OO.OO......',
    ], {
      'H': COLORS.HAIR, 'S': COLORS.SKIN, 'E': COLORS.EYE,
      'B': COLORS.SHIRT, 'P': COLORS.PANTS, 'O': COLORS.SHOE, '.': null,
    });

    // --- Player facing right ---
    this.playerRight = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '......HHHSSS....',
      '......HHHSES....',
      '......HHHSSS....',
      '.......HSSS.....',
      '......BBBBBB....',
      '.....BBBBBBB....',
      '.....BBBBBBB....',
      '.....B.BB.BB....',
      '.......BB.BB....',
      '.......PPP......',
      '.......PPPP.....',
      '......PP.PP.....',
      '......PP.PP.....',
      '......OO.OO.....',
    ], {
      'H': COLORS.HAIR, 'S': COLORS.SKIN, 'E': COLORS.EYE,
      'B': COLORS.SHIRT, 'P': COLORS.PANTS, 'O': COLORS.SHOE, '.': null,
    });

    this.playerSprites = [this.playerUp, this.playerDown, this.playerLeft, this.playerRight];

    // --- Enemy sprites ---
    this._initSlime();
    this._initSkeleton();
    this._initArcher();
    this._initBrute();
    this._initFrostSprite();

    // --- Shopkeeper sprite ---
    this.shopkeeper = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSHH.....',
      '.....HSESHH.....',
      '.....HSSSHH.....',
      '......SSSS......',
      '.....RRRRRR.....',
      '....RRRRRRRR....',
      '....RRRRRRRR....',
      '....RR.RR.RR....',
      '....RR.RR.RR....',
      '.......PP.......',
      '......PPPP......',
      '......PP.PP.....',
      '......PP.PP.....',
      '......OO.OO.....',
    ], {
      'H': '#d4a017', 'S': COLORS.SKIN, 'E': COLORS.EYE,
      'R': '#8e44ad', 'P': '#5b2c6f', 'O': COLORS.SHOE, '.': null,
    });

    // --- Weapon sprites ---
    this._initWeaponSprites();

    // --- Book icon ---
    this._initBook();

    // --- Floor tile ---
    this.floor = this._makeFloor();

    // --- Wall tile ---
    this.wall = this._makeWall();

    // --- Door tile ---
    this.door = this._makeDoor();

    // --- Ice tiles ---
    this.iceFloor = this._makeIceFloor();
    this.iceWall = this._makeIceWall();
  },

  _initSlime() {
    const pal = {
      'B': COLORS.SLIME_BODY, 'D': COLORS.SLIME_DARK,
      'L': COLORS.SLIME_LIGHT, 'E': COLORS.SLIME_EYE, '.': null,
    };

    // Slime: same sprite all directions (blob doesn't really face)
    this.slimeDown = this._parse([
      '................',
      '................',
      '................',
      '................',
      '......BBBB......',
      '.....LLBBBB.....',
      '....LLBBBBBB....',
      '....LBBEBBEB....',
      '....BBBBBBBB....',
      '....BBBBBBBB....',
      '...DBBBBBBBBD...',
      '...DBBBBBBBBDD..',
      '...DDBBBBBBDD...',
      '....DDDDDDDD....',
      '................',
      '................',
    ], pal);

    this.slimeUp = this.slimeDown;
    this.slimeLeft = this.slimeDown;
    this.slimeRight = this.slimeDown;
    this.slimeSprites = [this.slimeUp, this.slimeDown, this.slimeLeft, this.slimeRight];
  },

  _initSkeleton() {
    const pal = {
      'B': COLORS.BONE, 'D': COLORS.BONE_DARK,
      'L': COLORS.BONE_LIGHT, 'E': COLORS.SKEL_EYE, '.': null,
    };

    // Front view: skull with eye sockets, jaw/teeth, ribcage with spine
    this.skeletonDown = this._parse([
      '.....LLBBLL.....',
      '.....BBBBBB.....',
      '.....BE..EB.....',
      '.....BD..DB.....',
      '......BLLB......',
      '.......BB.......',
      '.....BBBBBB.....',
      '....DB.BB.BD....',
      '....DB.BB.BD....',
      '.....DBBBBD.....',
      '......BBBB......',
      '......B..B......',
      '.....DB..BD.....',
      '.....B....B.....',
      '.....DD..DD.....',
      '................',
    ], pal);

    // Back view: solid skull back, spine detail
    this.skeletonUp = this._parse([
      '.....LLBBLL.....',
      '.....BBBBBB.....',
      '.....BBBBBB.....',
      '.....BBDDBB.....',
      '......DBBD......',
      '.......BB.......',
      '.....BBBBBB.....',
      '....DB.BB.BD....',
      '....DB.BB.BD....',
      '.....DBBBBD.....',
      '......BBBB......',
      '......B..B......',
      '.....DB..BD.....',
      '.....B....B.....',
      '.....DD..DD.....',
      '................',
    ], pal);

    // Left profile: one eye visible, jaw profile
    this.skeletonLeft = this._parse([
      '......BBBB......',
      '.....BBBBBL.....',
      '.....E.BBBL.....',
      '.....DDDBB......',
      '......LBB.......',
      '.......BB.......',
      '.....BBBBBB.....',
      '....DB.BBB.D....',
      '....DB.BBB.D....',
      '.....DBBBD......',
      '......BBB.......',
      '......B.B.......',
      '.....DB.BD......',
      '.....B..B.......',
      '.....DD.DD......',
      '................',
    ], pal);

    // Right profile: mirrored left
    this.skeletonRight = this._parse([
      '......BBBB......',
      '.....LBBBBB.....',
      '.....LBBB.E.....',
      '......BBDDD.....',
      '.......BBL......',
      '.......BB.......',
      '.....BBBBBB.....',
      '....D.BBB.BD....',
      '....D.BBB.BD....',
      '......DBBBD.....',
      '.......BBB......',
      '.......B.B......',
      '......DB.BD.....',
      '.......B..B.....',
      '......DD.DD.....',
      '................',
    ], pal);

    this.skeletonSprites = [this.skeletonUp, this.skeletonDown, this.skeletonLeft, this.skeletonRight];
  },

  _initArcher() {
    const pal = {
      'C': COLORS.ARCHER_CLOAK, 'H': COLORS.ARCHER_HOOD,
      'B': COLORS.ARCHER_BOW, 'E': COLORS.ARCHER_EYE,
      'S': COLORS.SKIN, 'D': '#1a3010', '.': null,
    };

    // Facing down: hooded figure with bow held vertically
    this.archerDown = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHSSHH.....',
      '.....HSESHH.....',
      '.....HHSSHH.....',
      '......HHHH......',
      '.....CCCCCC.....',
      '....CCCCCCCC....',
      '....CCB.CCCC....',
      '....CCB.CCCC....',
      '....CCB..CCC....',
      '.......DD.......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing up: back of hood, bow visible on back
    this.archerUp = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '......HHHH......',
      '.....CCCCCC.....',
      '....CCCCCCCC....',
      '....CCCC.BCC....',
      '....CCCC.BCC....',
      '....CCC..BCC....',
      '.......DD.......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing left: bow drawn to the left
    this.archerLeft = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '....SSHHHH......',
      '....SEHHHH......',
      '....SSHHHH......',
      '.....HHH........',
      '...BCCCCCC......',
      '...BCCCCCCCC....',
      '...BCCCCCCCC....',
      '....CCCCCCCC....',
      '....CCC..CCC....',
      '.......DDD......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing right: bow drawn to the right
    this.archerRight = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '......HHHHSS....',
      '......HHHHES....',
      '......HHHHSS....',
      '........HHH.....',
      '......CCCCCCB...',
      '....CCCCCCCCB...',
      '....CCCCCCCCB...',
      '....CCCCCCCC....',
      '....CCC..CCC....',
      '......DDD.......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    this.archerSprites = [this.archerUp, this.archerDown, this.archerLeft, this.archerRight];
  },

  _initBrute() {
    // Scale the slime sprite 2x to make a 32x32 big slime
    const slime16 = this.slimeDown;
    const brute32 = [];
    for (let y = 0; y < 16; y++) {
      const row1 = [];
      const row2 = [];
      for (let x = 0; x < 16; x++) {
        const c = slime16[y][x];
        row1.push(c, c);
        row2.push(c, c);
      }
      brute32.push(row1, row2);
    }
    this.bruteDown = brute32;

    this.bruteUp = this.bruteDown;
    this.bruteLeft = this.bruteDown;
    this.bruteRight = this.bruteDown;
    this.bruteSprites = [this.bruteUp, this.bruteDown, this.bruteLeft, this.bruteRight];
  },

  _initFrostSprite() {
    const pal = {
      'B': COLORS.FROST_BODY, 'D': COLORS.FROST_DARK,
      'L': COLORS.FROST_LIGHT, 'C': COLORS.FROST_CORE,
      'E': COLORS.FROST_EYE, '.': null,
    };

    // Crystal rock creature (same all directions)
    this.frostSpriteDown = this._parse([
      '.......CC.......',
      '......CBBC......',
      '.....CLBBLD.....',
      '.....LBBBBD.....',
      '....CLBBBBLD....',
      '...DDBBBBBBDD...',
      '..DDBBBBBBBBDD..',
      '..DBBBBCCBBBBD..',
      '..DDBBBBBBBBDD..',
      '...DDBBBBBBDD...',
      '..DD..DBBD..DD..',
      '.DD...DBBD...DD.',
      '.D....D..D....D.',
      '................',
      '................',
      '................',
    ], pal);

    this.frostSpriteUp = this.frostSpriteDown;
    this.frostSpriteLeft = this.frostSpriteDown;
    this.frostSpriteRight = this.frostSpriteDown;
    this.frostSpriteSprites = [this.frostSpriteUp, this.frostSpriteDown, this.frostSpriteLeft, this.frostSpriteRight];
  },

  _initWeaponSprites() {
    // Wizard's Staff: ornate purple gem orb atop a brown shaft
    this.staffIcon = this._parse([
      '................',
      '.....GKKLG......',
      '....GLPWPLG.....',
      '....GPWWWPG.....',
      '....GLPWPLG.....',
      '.....GLPLG......',
      '......MMM.......',
      '......SSS.......',
      '......SDS.......',
      '......SSS.......',
      '......SDS.......',
      '......SSS.......',
      '......SDS.......',
      '......SSS.......',
      '......DDD.......',
      '................',
    ], {
      'G': '#6a2d8e', 'K': '#e0d0ff', 'L': '#bb6bd9', 'P': '#8e44ad',
      'W': '#d4bfff', 'M': '#d4a017', 'S': '#9a7030', 'D': '#6b4c12', '.': null,
    });

    // Bow: smooth D-curve limbs, leather grip, taut string
    this.bowIcon = this._parse([
      '................',
      '.......BTL......',
      '.....BB..L......',
      '....BB...L......',
      '....BB...L......',
      '....BB...L......',
      '...BBG...L......',
      '...BGG...L......',
      '...BBG...L......',
      '....BB...L......',
      '....BB...L......',
      '....BB...L......',
      '.....BB..L......',
      '.......BTL......',
      '................',
      '................',
    ], {
      'B': '#a07828', 'T': '#c8a050', 'G': '#5a3a1a', 'L': '#c0b8a8', '.': null,
    });

    // Frostbolt: pointed ice crystal with scattered white sparkles
    this.frostboltIcon = this._parse([
      '.......WW.......',
      '......WLLW......',
      '......LBBL......',
      '.....LBWBL......',
      '.....LBBBL......',
      '....LBBWBBL.....',
      '....LBBBWBL.....',
      '....DBBBBBL.....',
      '....DBBBWBD.....',
      '.....DBBBD......',
      '.....DBBBD......',
      '......DBBD......',
      '......DDDD......',
      '.......DD.......',
      '................',
      '................',
    ], {
      'B': '#6ac8e8', 'L': '#9ae0f8', 'D': '#4aa0c8', 'W': '#e0f4ff', '.': null,
    });

    // Lightning: zigzag bolt with highlight edge and shadow edge
    this.lightningIcon = this._parse([
      '................',
      '.........WO.....',
      '........WYO.....',
      '.......WYO......',
      '......WYO.......',
      '.....WYYYYO.....',
      '.........YO.....',
      '........WYO.....',
      '.......WYO......',
      '......WYO.......',
      '.....WYYYYO.....',
      '........YO......',
      '.......YO.......',
      '.......O........',
      '................',
      '................',
    ], {
      'Y': '#f1c40f', 'W': '#fff8dc', 'O': '#e67e22', '.': null,
    });

    // Longbow: thick D-curve, dark hardwood, gold-tipped, silver string
    this.longbowIcon = this._parse([
      '................',
      '......MMTL......',
      '.....BBB.L......',
      '....BBB..L......',
      '...BBB...L......',
      '...BBB...L......',
      '...BBG...L......',
      '..BGGG...L......',
      '...BBG...L......',
      '...BBB...L......',
      '...BBB...L......',
      '....BBB..L......',
      '.....BBB.L......',
      '......MMTL......',
      '................',
      '................',
    ], {
      'B': '#5a3a1a', 'M': '#d4a017', 'T': '#b89030', 'G': '#3a2208', 'L': '#aaa', '.': null,
    });

    // Fire Arrows: vertical arrow with billowing flame tip
    this.fireArrowsIcon = this._parse([
      '................',
      '.......OY.......',
      '......OYYO......',
      '.....ROYYOR.....',
      '......ROYR......',
      '.......AA.......',
      '.......AA.......',
      '.......SS.......',
      '.......SS.......',
      '.......SS.......',
      '.......SS.......',
      '......LSSL......',
      '.....L.SS.L.....',
      '....L..SS..L....',
      '................',
      '................',
    ], {
      'Y': '#f1c40f', 'O': '#e67e22', 'R': '#e74c3c',
      'A': '#bbb', 'S': '#8b6914', 'L': '#c0392b', '.': null,
    });
  },

  _initBook() {
    this.book = this._parse([
      '................',
      '..BBBBBBBBBB....',
      '..BCCCCCCCCCB...',
      '..BCCCCCCCCCCB..',
      '..BCCCCCCCCCGB..',
      '..BCCCCCCCCCCB..',
      '..BCCCCCCCCCGB..',
      '..BCCCCCCCCCCB..',
      '..BCCCCCCCCCGB..',
      '..BCCCCCCCCCCB..',
      '..BCCCCCCCCCGB..',
      '..BCCCCCCCCCCB..',
      '..BDDDDDDDDDB..',
      '..BBBBBBBBBBBB..',
      '................',
      '................',
    ], {
      'B': '#6b3a1a', 'C': '#f5e6c8', 'D': '#8b5a2a',
      'G': '#d4a017', '.': null,
    });
  },

  _makeFloor() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        // Stone floor with subtle grid lines
        if (x === 0 || y === 0) {
          row.push('#4a4a3e');
        } else {
          row.push(COLORS.FLOOR1);
        }
      }
      s.push(row);
    }
    return s;
  },

  _makeWall() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (y < 4) {
          // Top face (lighter)
          row.push(COLORS.WALL_TOP);
        } else if (x === 0 || x === 15 || y === 4) {
          // Mortar lines
          row.push('#2e2e48');
        } else if (y === 9 || y === 10) {
          // Middle mortar
          row.push('#2e2e48');
        } else {
          row.push(COLORS.WALL_DARK);
        }
      }
      s.push(row);
    }
    return s;
  },

  _makeDoor() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (x <= 1 || x >= 14) {
          // Frame pillars
          row.push(COLORS.DOOR_FRAME);
        } else if (y <= 1) {
          // Top frame
          row.push(COLORS.DOOR_FRAME);
        } else if (y === 2 && (x === 2 || x === 13)) {
          // Arch corners
          row.push(COLORS.DOOR_DARK);
        } else if (y >= 14) {
          // Threshold
          row.push(COLORS.DOOR_DARK);
        } else if (y === 2) {
          // Arch highlight
          row.push('#9a7a24');
        } else {
          // Interior with subtle depth gradient
          const depth = y < 6 ? '#2a2a3a' : '#222233';
          row.push(depth);
        }
      }
      s.push(row);
    }
    return s;
  },

  _makeIceFloor() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (x === 0 || y === 0) {
          row.push('#6a7a8a');
        } else {
          row.push(COLORS.ICE_FLOOR1);
        }
      }
      s.push(row);
    }
    return s;
  },

  _makeIceWall() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (y < 4) {
          row.push(COLORS.ICE_WALL_TOP);
        } else if (x === 0 || x === 15 || y === 4) {
          row.push('#2e3e58');
        } else if (y === 9 || y === 10) {
          row.push('#2e3e58');
        } else {
          row.push(COLORS.ICE_WALL_DARK);
        }
      }
      s.push(row);
    }
    return s;
  },

  // Draw a sprite at pixel position (px, py) onto context
  draw(ctx, sprite, px, py) {
    for (let y = 0; y < sprite.length; y++) {
      for (let x = 0; x < sprite[y].length; x++) {
        const c = sprite[y][x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(px + x * SCALE, py + y * SCALE, SCALE, SCALE);
        }
      }
    }
  },
};
