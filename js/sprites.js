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

    // --- Floor tile ---
    this.floor = this._makeFloor();

    // --- Wall tile ---
    this.wall = this._makeWall();

    // --- Door tile ---
    this.door = this._makeDoor();
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
