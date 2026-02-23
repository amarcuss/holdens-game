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
    this._initIceGolem();
    this._initFrostWraith();
    this._initCryomancer();
    this._initMagmaImp();
    this._initObsidianGuardian();
    this._initFlameCaster();
    this._initVolcanoLord();
    this._initArchitect();

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

    // --- Lava tiles ---
    this.lavaFloor = this._makeLavaFloor();
    this.lavaWall = this._makeLavaWall();
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

  _initIceGolem() {
    const pal = {
      'B': COLORS.GOLEM_BODY, 'D': COLORS.GOLEM_DARK,
      'L': COLORS.GOLEM_LIGHT, 'C': COLORS.GOLEM_CORE,
      'E': COLORS.GOLEM_EYE, '.': null,
    };

    // Bulky crystalline humanoid (same all directions)
    this.iceGolemDown = this._parse([
      '......LLLL......',
      '.....LBBBBL.....',
      '....LBBCCBBL....',
      '....LBCEECBL....',
      '....DBBCCBBD....',
      '.....DBBBD......',
      '...DDBBBBBBDD...',
      '..DBBBBBBBBBBDD.',
      '..DBBBBBBBBBBD..',
      '..DDBBBBBBBDDD..',
      '...DDDBBBBDD....',
      '....DDBBBBDD....',
      '....DB.DD.BD....',
      '...DB..DD..BD...',
      '...DD..DD..DD...',
      '................',
    ], pal);

    this.iceGolemUp = this.iceGolemDown;
    this.iceGolemLeft = this.iceGolemDown;
    this.iceGolemRight = this.iceGolemDown;
    this.iceGolemSprites = [this.iceGolemUp, this.iceGolemDown, this.iceGolemLeft, this.iceGolemRight];
  },

  _initFrostWraith() {
    const pal = {
      'C': COLORS.WRAITH_CLOAK, 'B': COLORS.WRAITH_BODY,
      'G': COLORS.WRAITH_GLOW, 'E': COLORS.WRAITH_EYE, '.': null,
    };

    // Ghostly hooded figure with wispy bottom
    this.frostWraithDown = this._parse([
      '......CCCC......',
      '.....CCCCCC.....',
      '....CCCCCCCC....',
      '....CCECCECCC...',
      '....CCCCCCCC....',
      '.....CCCCCC.....',
      '....BBBBBBBB....',
      '...BBBBBGBBBB...',
      '...BBBBBBBBBB...',
      '...BBBGBBBBBB...',
      '....BBBBBBBB....',
      '....BGBBGBBB....',
      '.....BGBGBB.....',
      '......G..G......',
      '.......G........',
      '................',
    ], pal);

    this.frostWraithUp = this.frostWraithDown;
    this.frostWraithLeft = this.frostWraithDown;
    this.frostWraithRight = this.frostWraithDown;
    this.frostWraithSprites = [this.frostWraithUp, this.frostWraithDown, this.frostWraithLeft, this.frostWraithRight];
  },

  _initCryomancer() {
    const pal = {
      'R': COLORS.CRYO_ROBE, 'H': COLORS.CRYO_HOOD,
      'S': COLORS.CRYO_SKIN, 'E': COLORS.CRYO_EYE,
      'T': COLORS.CRYO_STAFF, 'D': '#1a2040', '.': null,
    };

    // Robed ice mage with staff (facing down)
    this.cryomancerDown = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHSSHH.....',
      '.....HSESHH.....',
      '.....HHSSHH.....',
      '......HHHH......',
      '.....RRRRRR.....',
      '....RRRRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RR.RR.RR.T..',
      '....RR.RR.RR.T..',
      '.......DD....T..',
      '......DDDD...T..',
      '......DD.DD.TT..',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing up
    this.cryomancerUp = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '......HHHH......',
      '.....RRRRRR.....',
      '..T.RRRRRRRR....',
      '..T.RRRRRRRR....',
      '..T.RR.RR.RR....',
      '..T.RR.RR.RR....',
      '..T....DD.......',
      '..T...DDDD......',
      '..TT.DD.DD......',
      '.....DD.DD......',
      '.....DD.DD......',
    ], pal);

    // Facing left
    this.cryomancerLeft = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '....SSHHHH......',
      '....SEHHHH......',
      '....SSHHHH......',
      '.....HHH........',
      '..T.RRRRRR......',
      '..T.RRRRRRRR....',
      '..T.RRRRRRRR....',
      '..T.RRRRRRRR....',
      '..TT.RRR.RRR....',
      '.......DDD......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing right
    this.cryomancerRight = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '......HHHHSS....',
      '......HHHHES....',
      '......HHHHSS....',
      '........HHH.....',
      '......RRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RRR.RRR.TT..',
      '......DDD.......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    this.cryomancerSprites = [this.cryomancerUp, this.cryomancerDown, this.cryomancerLeft, this.cryomancerRight];
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

    // Meteor Strike: fiery orb atop a dark staff
    this.meteorIcon = this._parse([
      '......RRYY......',
      '.....ROYYYO.....',
      '....ROYYYOOR....',
      '....OYYYYYOR....',
      '.....ROYYYO.....',
      '......ROOR......',
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
      'R': '#e74c3c', 'O': '#e67e22', 'Y': '#f1c40f',
      'M': '#d4a017', 'S': '#5a3a1a', 'D': '#3a2208', '.': null,
    });

    // Chain Lightning: branching bolt
    this.chainLightningIcon = this._parse([
      '................',
      '.........WO.....',
      '........WYO.....',
      '.......WYO......',
      '......WYO..WO...',
      '.....WYYYYWYO...',
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

    // Dragonbow: ornate red bow with gold tips
    this.dragonbowIcon = this._parse([
      '................',
      '......GGRL......',
      '.....RRR.L......',
      '....RRR..L......',
      '...RRR...L......',
      '...RRR...L......',
      '...RRB...L......',
      '..RBBB...L......',
      '...RRB...L......',
      '...RRR...L......',
      '...RRR...L......',
      '....RRR..L......',
      '.....RRR.L......',
      '......GGRL......',
      '................',
      '................',
    ], {
      'R': '#8a2200', 'G': '#d4a017', 'B': '#3a1008', 'L': '#c0b8a8', '.': null,
    });

    // Explosive Arrows: arrow with fiery blast tip
    this.explosiveArrowsIcon = this._parse([
      '................',
      '......RYR.......',
      '.....RYYYR......',
      '....ROYYYRO.....',
      '.....ROYRO......',
      '......ROO.......',
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
      'A': '#bbb', 'S': '#8b6914', 'L': '#e74c3c', '.': null,
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

  _initMagmaImp() {
    const pal = {
      'B': COLORS.IMP_BODY, 'D': COLORS.IMP_DARK,
      'L': COLORS.IMP_LIGHT, 'H': COLORS.IMP_HORN,
      'E': COLORS.IMP_EYE, '.': null,
    };

    // Small horned demon (same all directions)
    this.magmaImpDown = this._parse([
      '.......HH.......',
      '......H..H......',
      '.....H....H.....',
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
      '....D......D....',
      '...DD......DD...',
      '................',
    ], pal);

    this.magmaImpUp = this.magmaImpDown;
    this.magmaImpLeft = this.magmaImpDown;
    this.magmaImpRight = this.magmaImpDown;
    this.magmaImpSprites = [this.magmaImpUp, this.magmaImpDown, this.magmaImpLeft, this.magmaImpRight];
  },

  _initObsidianGuardian() {
    const pal = {
      'B': COLORS.OBSIDIAN_BODY, 'D': COLORS.OBSIDIAN_DARK,
      'L': COLORS.OBSIDIAN_LIGHT, 'C': COLORS.OBSIDIAN_CORE,
      'E': COLORS.OBSIDIAN_EYE, '.': null,
    };

    // Bulky dark stone humanoid with orange core (same all directions)
    this.obsidianGuardianDown = this._parse([
      '......LLLL......',
      '.....LBBBBL.....',
      '....LBBCCBBL....',
      '....LBCEECBL....',
      '....DBBCCBBD....',
      '.....DBBBD......',
      '...DDBBBBBBDD...',
      '..DBBBBCBBBBBDD.',
      '..DBBBBBBBBBBD..',
      '..DDBBBBBBBDDD..',
      '...DDDBBBBDD....',
      '....DDBBBBDD....',
      '....DB.DD.BD....',
      '...DB..DD..BD...',
      '...DD..DD..DD...',
      '................',
    ], pal);

    this.obsidianGuardianUp = this.obsidianGuardianDown;
    this.obsidianGuardianLeft = this.obsidianGuardianDown;
    this.obsidianGuardianRight = this.obsidianGuardianDown;
    this.obsidianGuardianSprites = [this.obsidianGuardianUp, this.obsidianGuardianDown, this.obsidianGuardianLeft, this.obsidianGuardianRight];
  },

  _initFlameCaster() {
    const pal = {
      'R': COLORS.FLAME_ROBE, 'H': COLORS.FLAME_HOOD,
      'S': COLORS.FLAME_SKIN, 'E': COLORS.FLAME_EYE,
      'T': COLORS.FLAME_STAFF, 'D': '#3a1008', '.': null,
    };

    // Robed fire mage with staff (facing down)
    this.flameCasterDown = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHSSHH.....',
      '.....HSESHH.....',
      '.....HHSSHH.....',
      '......HHHH......',
      '.....RRRRRR.....',
      '....RRRRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RR.RR.RR.T..',
      '....RR.RR.RR.T..',
      '.......DD....T..',
      '......DDDD...T..',
      '......DD.DD.TT..',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing up
    this.flameCasterUp = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '......HHHH......',
      '.....RRRRRR.....',
      '..T.RRRRRRRR....',
      '..T.RRRRRRRR....',
      '..T.RR.RR.RR....',
      '..T.RR.RR.RR....',
      '..T....DD.......',
      '..T...DDDD......',
      '..TT.DD.DD......',
      '.....DD.DD......',
      '.....DD.DD......',
    ], pal);

    // Facing left
    this.flameCasterLeft = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '....SSHHHH......',
      '....SEHHHH......',
      '....SSHHHH......',
      '.....HHH........',
      '..T.RRRRRR......',
      '..T.RRRRRRRR....',
      '..T.RRRRRRRR....',
      '..T.RRRRRRRR....',
      '..TT.RRR.RRR....',
      '.......DDD......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing right
    this.flameCasterRight = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '......HHHHSS....',
      '......HHHHES....',
      '......HHHHSS....',
      '........HHH.....',
      '......RRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RRRRRRRR.T..',
      '....RRR.RRR.TT..',
      '......DDD.......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    this.flameCasterSprites = [this.flameCasterUp, this.flameCasterDown, this.flameCasterLeft, this.flameCasterRight];
  },

  _initVolcanoLord() {
    // Scale the magma imp sprite 2x to make a 32x32 boss
    const imp16 = this.magmaImpDown;
    const lord32 = [];
    for (let y = 0; y < 16; y++) {
      const row1 = [];
      const row2 = [];
      for (let x = 0; x < 16; x++) {
        const c = imp16[y][x];
        row1.push(c, c);
        row2.push(c, c);
      }
      lord32.push(row1, row2);
    }
    this.volcanoLordDown = lord32;

    this.volcanoLordUp = this.volcanoLordDown;
    this.volcanoLordLeft = this.volcanoLordDown;
    this.volcanoLordRight = this.volcanoLordDown;
    this.volcanoLordSprites = [this.volcanoLordUp, this.volcanoLordDown, this.volcanoLordLeft, this.volcanoLordRight];
  },

  _initArchitect() {
    const pal = {
      'R': COLORS.ARCHITECT_ROBE, 'L': COLORS.ARCHITECT_ROBE_LIGHT,
      'H': COLORS.ARCHITECT_HOOD, 'S': COLORS.ARCHITECT_SKIN,
      'E': COLORS.ARCHITECT_EYE, 'T': '#8b6914', 'D': '#1a0a2a', '.': null,
    };

    // Facing down: hooded dark sorcerer with staff
    this.architectDown = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHSSHH.....',
      '.....HSESHH.....',
      '.....HHSSHH.....',
      '......HHHH......',
      '.....RRLRRR.....',
      '....RRLRRRRR.T..',
      '....RRLRRRRR.T..',
      '....RR.RR.RR.T..',
      '....RR.RR.RR.T..',
      '.......DD....T..',
      '......DDDD...T..',
      '......DD.DD.TT..',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing up
    this.architectUp = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '......HHHH......',
      '.....RRRLRR.....',
      '..T.RRRLRRRR....',
      '..T.RRRLRRRR....',
      '..T.RR.RR.RR....',
      '..T.RR.RR.RR....',
      '..T....DD.......',
      '..T...DDDD......',
      '..TT.DD.DD......',
      '.....DD.DD......',
      '.....DD.DD......',
    ], pal);

    // Facing left
    this.architectLeft = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '....SSHHHH......',
      '....SEHHHH......',
      '....SSHHHH......',
      '.....HHH........',
      '..T.RRLRRR......',
      '..T.RRLRRRRR....',
      '..T.RRLRRRRR....',
      '..T.RRRRRRRR....',
      '..TT.RRR.RRR....',
      '.......DDD......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    // Facing right
    this.architectRight = this._parse([
      '......HHHH......',
      '.....HHHHHH.....',
      '......HHHHSS....',
      '......HHHHES....',
      '......HHHHSS....',
      '........HHH.....',
      '......RRRLRR.T..',
      '....RRRRRLRR.T..',
      '....RRRRRLRR.T..',
      '....RRRRRRRR.T..',
      '....RRR.RRR.TT..',
      '......DDD.......',
      '......DDDD......',
      '......DD.DD.....',
      '......DD.DD.....',
      '......DD.DD.....',
    ], pal);

    this.architectSprites = [this.architectUp, this.architectDown, this.architectLeft, this.architectRight];
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

  _makeLavaFloor() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (x === 0 || y === 0) {
          row.push('#6a2a1a');
        } else {
          row.push(COLORS.LAVA_FLOOR1);
        }
      }
      s.push(row);
    }
    return s;
  },

  _makeLavaWall() {
    const s = [];
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = [];
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (y < 4) {
          row.push(COLORS.LAVA_WALL_TOP);
        } else if (x === 0 || x === 15 || y === 4) {
          row.push('#2e1810');
        } else if (y === 9 || y === 10) {
          row.push('#2e1810');
        } else {
          row.push(COLORS.LAVA_WALL_DARK);
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
