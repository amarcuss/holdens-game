// Room definitions: 20x15 tile grids
// W=wall, .=floor, D=door

const DungeonMap = {
  rooms: [],
  currentRoom: 0,

  init() {
    this.rooms = [
      this._makeRoom0(),  // Entrance Hall
      this._makeRoom1(),  // Corridor
      this._makeRoom2(),  // Great Hall
      this._makeRoom3(),  // Treasury
      this._makeRoom4(),  // Dungeon Depths
      this._makeRoom5(),  // Secret Passage
      this._makeRoom6(),  // Crypt
      this._makeRoom7(),  // Narrow Maze
      this._makeRoom8(),  // Armory
      this._makeRoom9(),  // Catacomb
      this._makeRoom10(), // Gauntlet
      this._makeRoom11(), // The Pit
      this._makeRoom12(), // Ossuary
      this._makeRoom13(), // Antechamber
      this._makeRoom14(), // Throne Room
      this._makeRoom15(), // Cliff House
      // --- Frozen Depths (rooms 16-35) ---
      this._makeRoom16(), // Frozen Entrance
      this._makeRoom17(), // Ice Corridor
      this._makeRoom18(), // Frost Crossroads
      this._makeRoom19(), // Glacial Hall (shop)
      this._makeRoom20(), // Crystal Cavern
      this._makeRoom21(), // Frozen Passage
      this._makeRoom22(), // Ice Bridge
      this._makeRoom23(), // Crypt of Ice
      this._makeRoom24(), // Frozen Falls
      this._makeRoom25(), // Icicle Gallery
      this._makeRoom26(), // Frost Maze
      this._makeRoom27(), // Frozen Lake
      this._makeRoom28(), // Snow Drift
      this._makeRoom29(), // Ice Tomb
      this._makeRoom30(), // Frozen Archive
      this._makeRoom31(), // Glacial Depths
      this._makeRoom32(), // Frozen Gauntlet
      this._makeRoom33(), // Permafrost Chamber
      this._makeRoom34(), // Frostbound Antechamber
      this._makeRoom35(), // The Frozen Throne
    ];
  },

  _parseRoom(lines) {
    const tiles = [];
    for (let y = 0; y < lines.length; y++) {
      const row = [];
      for (let x = 0; x < lines[y].length; x++) {
        const ch = lines[y][x];
        if (ch === 'W') row.push(T.WALL);
        else if (ch === 'D') row.push(T.DOOR);
        else if (ch === 'H') row.push(T.WOOD_WALL);
        else if (ch === 'G') row.push(T.GRASS);
        else if (ch === 'R') row.push(T.TREE);
        else if (ch === 'I') row.push(T.ICE);
        else if (ch === 'F') row.push(T.ICE_WALL);
        else row.push(T.FLOOR);
      }
      tiles.push(row);
    }
    return tiles;
  },

  // Room 0: Entrance Hall
  // Doors: D at (18,7) -> Room 1, D at (9,14) -> Room 2
  _makeRoom0() {
    const tiles = this._parseRoom([
      'WWWWWWWWWWWWWWWWWWWW',
      'W..................W',
      'W..................W',
      'W..................W',
      'W..................W',
      'W...WWWW....WWWW...W',
      'W...W..........W...W',
      'W...W..........W..DW',
      'W...W..........W...W',
      'W...WWWW....WWWW...W',
      'W..................W',
      'W..................W',
      'W..................W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Entrance Hall',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 10, y: 3 },
      doors: [
        { x: 18, y: 7, targetRoom: 1, targetX: 1, targetY: 7 },
        { x: 9, y: 14, targetRoom: 2, targetX: 10, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 2, type: 'slime' },
        { x: 14, y: 3, type: 'slime' },
      ],
    };
  },

  // Room 1: Corridor
  // Doors: D at (0,7) -> Room 0, D at (18,7) -> Room 3
  _makeRoom1() {
    const tiles = this._parseRoom([
      'WWWWWWWWWWWWWWWWWWWW',
      'W..................W',
      'W.WWWW........WWWW.W',
      'W.W................W',
      'W.W................W',
      'W.W................W',
      'W.W................W',
      'D.................DW',
      'W.W................W',
      'W.W................W',
      'W.W................W',
      'W.W................W',
      'W.WWWW........WWWW.W',
      'W..................W',
      'WWWWWWWWWWWWWWWWWWWW',
    ]);
    return {
      name: 'Corridor',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 0, targetX: 17, targetY: 7 },
        { x: 18, y: 7, targetRoom: 3, targetX: 1, targetY: 7 },
      ],
      enemies: [
        { x: 10, y: 4, type: 'slime' },
        { x: 8, y: 10, type: 'slime' },
        { x: 15, y: 6, type: 'skeleton' },
      ],
    };
  },

  // Room 2: Great Hall
  // Doors: D at (9,0) -> Room 0, D at (9,14) -> Room 4
  _makeRoom2() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..................W',
      'W..WW..........WW..W',
      'W..WW..........WW..W',
      'W..................W',
      'W..................W',
      'W........WW........W',
      'W........WW........W',
      'W..................W',
      'W..................W',
      'W..WW..........WW..W',
      'W..WW..........WW..W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Great Hall',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 10, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 0, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 4, targetX: 10, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 5, type: 'slime' },
        { x: 14, y: 5, type: 'slime' },
        { x: 5, y: 9, type: 'skeleton' },
        { x: 14, y: 9, type: 'skeleton' },
      ],
    };
  },

  // Room 3: Treasury
  // Door: D at (0,7) -> Room 1
  _makeRoom3() {
    const tiles = this._parseRoom([
      'WWWWWWWWWWWWWWWWWWWW',
      'W..................W',
      'W..................W',
      'W...WWWWWWWWWW.....W',
      'W...W........W.....W',
      'W...W........W.....W',
      'W...W........W.....W',
      'D...W........W.....W',
      'W...W........W.....W',
      'W...W........W.....W',
      'W...W........W.....W',
      'W..................W',
      'W..................W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Treasury',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 1, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 5, targetX: 9, targetY: 1 },
      ],
      enemies: [],
      shopkeeper: { x: 8, y: 12 },
    };
  },

  // Room 4: Dungeon Depths
  // Door: D at (9,0) -> Room 2
  _makeRoom4() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..W...W....W...W..W',
      'W..................W',
      'W......W..W........W',
      'W..................W',
      'W..W............W..W',
      'D.................DW',
      'W......W..W........W',
      'W..................W',
      'W..W............W..W',
      'W..................W',
      'W..W...W....W...W..W',
      'W..................W',
      'WWWWWWWWWWWWWWWWWWWW',
    ]);
    return {
      name: 'Dungeon Depths',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 10, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 2, targetX: 9, targetY: 13 },
        { x: 0, y: 7, targetRoom: 6, targetX: 17, targetY: 7 },
        { x: 18, y: 7, targetRoom: 7, targetX: 1, targetY: 7 },
      ],
      enemies: [
        { x: 4, y: 4, type: 'skeleton' },
        { x: 15, y: 4, type: 'skeleton' },
        { x: 10, y: 7, type: 'slime' },
        { x: 4, y: 10, type: 'skeleton' },
        { x: 15, y: 10, type: 'skeleton' },
        { x: 10, y: 12, type: 'slime' },
      ],
    };
  },

  // Room 5: Secret Passage — winding corridor between Treasury and Armory
  _makeRoom5() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W.WWWWWW...WWWWWW..W',
      'W.W..............W.W',
      'W.W..WWWWWWWWW...W.W',
      'W.W..W.......W...W.W',
      'W....W.......W.....W',
      'W.W..W.......W...W.W',
      'W.W..W.......W...W.W',
      'W.W..WWWW.WWWW...W.W',
      'W.W..............W.W',
      'W.WWWWWW...WWWWWW..W',
      'W..................W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Secret Passage',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 3, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 8, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 9, y: 6, type: 'slime' },
        { x: 3, y: 3, type: 'slime' },
        { x: 15, y: 10, type: 'skeleton' },
      ],
    };
  },

  // Room 6: Crypt — burial chamber with sarcophagus pillars
  _makeRoom6() {
    const tiles = this._parseRoom([
      'WWWWWWWWWWWWWWWWWWWW',
      'W..................W',
      'W..WW....WW....WW..W',
      'W..WW....WW....WW..W',
      'W..................W',
      'W..................W',
      'W..WW....WW....WW..W',
      'W..WW....WW....WW.DW',
      'W..................W',
      'W..................W',
      'W..WW....WW....WW..W',
      'W..WW....WW....WW..W',
      'W..................W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Crypt',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 17, y: 7 },
      doors: [
        { x: 18, y: 7, targetRoom: 4, targetX: 1, targetY: 7 },
        { x: 9, y: 14, targetRoom: 9, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 9, y: 4, type: 'slime' },
        { x: 5, y: 8, type: 'skeleton' },
        { x: 14, y: 8, type: 'skeleton' },
        { x: 9, y: 12, type: 'skeleton' },
      ],
    };
  },

  // Room 7: Narrow Maze — tight corridors with many turns
  _makeRoom7() {
    const tiles = this._parseRoom([
      'WWWWWWWWWWWWWWWWWWWW',
      'W...W..........W...W',
      'W...W..WWWWWW..W...W',
      'W...W..W....W..W...W',
      'W......W....W......W',
      'W..WWWWW....WWWWW..W',
      'W..................W',
      'D..................W',
      'W..................W',
      'W..WWWWW....WWWWW..W',
      'W......W....W......W',
      'W...W..W....W..W...W',
      'W...W..WWWWWW..W...W',
      'W...W..........W...W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Narrow Maze',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 4, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 10, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 2, y: 1, type: 'slime' },
        { x: 17, y: 1, type: 'slime' },
        { x: 9, y: 6, type: 'skeleton' },
        { x: 9, y: 8, type: 'skeleton' },
      ],
    };
  },

  // Room 8: Armory — weapon racks (wall pillars) line the walls
  _makeRoom8() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W.WW..WW....WW..WW.W',
      'W..................W',
      'W..................W',
      'W.WW............WW.W',
      'W..................W',
      'W......WW.WW.......W',
      'W..................W',
      'W.WW............WW.W',
      'W..................W',
      'W..................W',
      'W.WW..WW....WW..WW.W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Armory',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 5, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 11, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 4, type: 'slime' },
        { x: 14, y: 4, type: 'slime' },
        { x: 9, y: 7, type: 'skeleton' },
        { x: 5, y: 10, type: 'skeleton' },
        { x: 14, y: 10, type: 'skeleton' },
        { x: 14, y: 7, type: 'archer' },
      ],
    };
  },

  // Room 9: Catacomb — cramped burial niches
  _makeRoom9() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..WW.WW....WW.WW..W',
      'W..WW.WW....WW.WW..W',
      'W..................W',
      'W..................W',
      'W..WW..........WW..W',
      'W..................W',
      'W..WW..........WW..W',
      'W..................W',
      'W..................W',
      'W..WW.WW....WW.WW..W',
      'W..WW.WW....WW.WW..W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Catacomb',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 6, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 12, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 9, y: 4, type: 'slime' },
        { x: 9, y: 10, type: 'slime' },
        { x: 5, y: 7, type: 'skeleton' },
        { x: 14, y: 7, type: 'skeleton' },
        { x: 3, y: 4, type: 'skeleton' },
        { x: 16, y: 10, type: 'skeleton' },
      ],
    };
  },

  // Room 10: Gauntlet — obstacle course with scattered pillars
  _makeRoom10() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..W....W....W..W..W',
      'W..................W',
      'W....W....W....W...W',
      'W..................W',
      'W..W....W....W.....W',
      'W.................DW',
      'W..W....W....W.....W',
      'W..................W',
      'W....W....W....W...W',
      'W..................W',
      'W..W....W....W..W..W',
      'W..................W',
      'WWWWWWWWWWWWWWWWWWWW',
    ]);
    return {
      name: 'Gauntlet',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 7, targetX: 9, targetY: 13 },
        { x: 18, y: 7, targetRoom: 12, targetX: 1, targetY: 7 },
      ],
      enemies: [
        { x: 5, y: 3, type: 'slime' },
        { x: 14, y: 3, type: 'slime' },
        { x: 9, y: 7, type: 'slime' },
        { x: 5, y: 11, type: 'skeleton' },
        { x: 14, y: 11, type: 'skeleton' },
        { x: 9, y: 5, type: 'skeleton' },
      ],
    };
  },

  // Room 11: The Pit — open arena with central pit walls
  _makeRoom11() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..................W',
      'W....WWWWWWWWW.....W',
      'W....W.......W.....W',
      'W....W.......W.....W',
      'W....W.......W.....W',
      'W....W.......W....DW',
      'W....W.......W.....W',
      'W....W.......W.....W',
      'W....W.......W.....W',
      'W....WWWWWWWWW.....W',
      'W..................W',
      'W..................W',
      'WWWWWWWWWWWWWWWWWWWW',
    ]);
    return {
      name: 'The Pit',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 8, targetX: 9, targetY: 13 },
        { x: 18, y: 7, targetRoom: 13, targetX: 1, targetY: 7 },
      ],
      enemies: [
        { x: 2, y: 2, type: 'slime' },
        { x: 17, y: 2, type: 'slime' },
        { x: 2, y: 12, type: 'skeleton' },
        { x: 17, y: 12, type: 'skeleton' },
        { x: 16, y: 5, type: 'skeleton' },
        { x: 16, y: 9, type: 'skeleton' },
        { x: 2, y: 7, type: 'archer' },
      ],
    };
  },

  // Room 12: Ossuary — bone-lined walls with alcoves
  _makeRoom12() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W.WW..WW....WW..WW.W',
      'W.WW..WW....WW..WW.W',
      'W..................W',
      'W......WWWWWW......W',
      'W......W....W......W',
      'D......W....W......W',
      'W......W....W......W',
      'W......WWWWWW......W',
      'W..................W',
      'W.WW..WW....WW..WW.W',
      'W.WW..WW....WW..WW.W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Ossuary',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 9, targetX: 9, targetY: 13 },
        { x: 0, y: 7, targetRoom: 10, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 13, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 3, y: 4, type: 'slime' },
        { x: 16, y: 4, type: 'slime' },
        { x: 3, y: 10, type: 'slime' },
        { x: 16, y: 10, type: 'skeleton' },
        { x: 9, y: 1, type: 'skeleton' },
        { x: 9, y: 13, type: 'skeleton' },
        { x: 3, y: 7, type: 'skeleton' },
      ],
    };
  },

  // Room 13: Antechamber — grand hall before the throne room
  _makeRoom13() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..WW..........WW..W',
      'W..WW..........WW..W',
      'W..................W',
      'W......WW.WW.......W',
      'W..................W',
      'D..................W',
      'W..................W',
      'W......WW.WW.......W',
      'W..................W',
      'W..WW..........WW..W',
      'W..WW..........WW..W',
      'W..................W',
      'WWWWWWWWWDWWWWWWWWWW',
    ]);
    return {
      name: 'Antechamber',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 0, y: 7, targetRoom: 11, targetX: 17, targetY: 7 },
        { x: 9, y: 0, targetRoom: 12, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 14, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 4, type: 'slime' },
        { x: 14, y: 4, type: 'slime' },
        { x: 5, y: 10, type: 'slime' },
        { x: 14, y: 10, type: 'slime' },
        { x: 3, y: 7, type: 'skeleton' },
        { x: 16, y: 7, type: 'skeleton' },
        { x: 9, y: 4, type: 'skeleton' },
        { x: 9, y: 10, type: 'skeleton' },
      ],
    };
  },

  // Room 14: Throne Room — final boss room, grand symmetric hall
  _makeRoom14() {
    const tiles = this._parseRoom([
      'WWWWWWWWWDWWWWWWWWWW',
      'W..................W',
      'W..WW..........WW..W',
      'W..WW..........WW..W',
      'W..................W',
      'W....WW......WW....W',
      'W....WW......WW....W',
      'W..................W',
      'W....WW......WW....W',
      'W....WW......WW....W',
      'W..................W',
      'W..WW..........WW..W',
      'W..WW..........WW..W',
      'W..................W',
      'WWWWWWWWWWWWWWWWWWWW',
    ]);
    return {
      name: 'Throne Room',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 13, targetX: 9, targetY: 13 },
      ],
      enemies: [
        { x: 5, y: 2, type: 'archer' },
        { x: 14, y: 2, type: 'archer' },
        { x: 5, y: 12, type: 'slime' },
        { x: 14, y: 12, type: 'slime' },
        { x: 3, y: 7, type: 'skeleton' },
        { x: 16, y: 7, type: 'skeleton' },
        { x: 7, y: 5, type: 'skeleton' },
        { x: 12, y: 5, type: 'skeleton' },
        { x: 7, y: 9, type: 'skeleton' },
        { x: 12, y: 9, type: 'skeleton' },
        { x: 9, y: 7, type: 'brute' },
      ],
    };
  },

  // Room 15: Cliff House — hub between dungeons
  // Left: stone cave entrance. Middle: grass with trees. Right: wooden house.
  _makeRoom15() {
    const tiles = this._parseRoom([
      'RRRRRRRRRRRRRRRRRRRR',
      'RWWWWGGGGGGGGGGGGGGR',
      'RW..WGGRGGGGGRGGGGRG',
      'RW..WGGGGGGGGGGGGGGG',
      'RW..WGGGGGGGGHHHHHHR',
      'RW..WGGRGGGGH....HGR',
      'RW..........H....HGG',
      'RD..........D....HGG',
      'RW..........H....HGG',
      'RW..WGGRGGGGH....HGR',
      'RW..WGGGGGGGGHHHHHHR',
      'RW..WGGGGGGGGGGGGGGG',
      'RW..WGGRGGGGGRGGGGRG',
      'RWWWWGGGGGGGGGGGGGGR',
      'RRRRRRRRRRRRRRRRRRRR',
    ]);
    return {
      name: 'Cliff House',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 2, y: 7 },
      doors: [
        { x: 1, y: 7, targetRoom: -1, targetX: 0, targetY: 0 },
        { x: 12, y: 7, targetRoom: -1, targetX: 0, targetY: 0 },
      ],
      enemies: [],
    };
  },

  // =================== FROZEN DEPTHS (Rooms 16-35) ===================

  // Room 16: Frozen Entrance — start of dungeon 2
  // Doors: right→17, down→18
  _makeRoom16() {
    const tiles = this._parseRoom([
      'FFFFFFFFFFFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIFFIIIIIIFFIIIIFF',
      'FIIIFFIIIIIIFFIIIIFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIIIIIIIIIIIIIIIDF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIFFIIIIIIFFIIIIFF',
      'FIIIFFIIIIIIFFIIIIFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FIIIIIIIIIIIIIIIIIFF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frozen Entrance',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 10, y: 3 },
      doors: [
        { x: 18, y: 7, targetRoom: 17, targetX: 1, targetY: 7 },
        { x: 9, y: 14, targetRoom: 18, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 5, type: 'frost_wraith' },
        { x: 14, y: 5, type: 'frost_sprite' },
        { x: 10, y: 10, type: 'frost_wraith' },
      ],
    };
  },

  // Room 17: Ice Corridor
  // Doors: left→16
  _makeRoom17() {
    const tiles = this._parseRoom([
      'FFFFFFFFFFFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIFFFFIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'DIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIFFFFIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFFFFFFFFFFFF',
    ]);
    return {
      name: 'Ice Corridor',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 16, targetX: 17, targetY: 7 },
      ],
      enemies: [
        { x: 10, y: 4, type: 'frost_wraith' },
        { x: 8, y: 10, type: 'frost_sprite' },
        { x: 15, y: 7, type: 'frost_wraith' },
      ],
    };
  },

  // Room 18: Frost Crossroads
  // Doors: up→16, right→19, left→20, down→21
  _makeRoom18() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFFFIIIIIIIF',
      'FIIIIIIIFIIFIIIIIIIF',
      'FIIIIIIIFIIFIIIIIIIF',
      'DIIIIIIIIIIIIIIIIIDF',
      'FIIIIIIIFIIFIIIIIIIF',
      'FIIIIIIIFIIFIIIIIIIF',
      'FIIIIIIIFFFFIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frost Crossroads',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 16, targetX: 9, targetY: 13 },
        { x: 18, y: 7, targetRoom: 19, targetX: 1, targetY: 7 },
        { x: 0, y: 7, targetRoom: 20, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 21, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 4, y: 4, type: 'frost_sprite' },
        { x: 15, y: 4, type: 'frost_sprite' },
        { x: 4, y: 10, type: 'frost_wraith' },
        { x: 15, y: 10, type: 'frost_wraith' },
      ],
    };
  },

  // Room 19: Glacial Hall (shop)
  // Doors: left→18, down→17
  _makeRoom19() {
    const tiles = this._parseRoom([
      'FFFFFFFFFFFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIFFFFFFFFFFIIIIF',
      'FIIIIFIIIIIIIIFIIIIF',
      'FIIIIFIIIIIIIIFIIIIF',
      'FIIIIFIIIIIIIIFIIIIF',
      'DIIIIFIIIIIIIIFIIIIF',
      'FIIIIFIIIIIIIIFIIIIF',
      'FIIIIFIIIIIIIIFIIIIF',
      'FIIIIFIIIIIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Glacial Hall',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 18, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 20, targetX: 9, targetY: 1 },
      ],
      enemies: [],
      shopkeeper: { x: 8, y: 12 },
    };
  },

  // Room 20: Crystal Cavern
  // Doors: up→19, right→18, down→22
  _makeRoom20() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIFFIIFFIIIF',
      'FIIIFFIIIIFFIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIDF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIFFIIFFIIIF',
      'FIIIFFIIIIFFIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Crystal Cavern',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 17, y: 7 },
      doors: [
        { x: 9, y: 0, targetRoom: 19, targetX: 9, targetY: 13 },
        { x: 18, y: 7, targetRoom: 18, targetX: 1, targetY: 7 },
        { x: 9, y: 14, targetRoom: 22, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 5, type: 'frost_sprite' },
        { x: 14, y: 5, type: 'frost_wraith' },
        { x: 5, y: 9, type: 'frost_wraith' },
        { x: 14, y: 9, type: 'frost_sprite' },
        { x: 9, y: 7, type: 'cryomancer' },
      ],
    };
  },

  // Room 21: Frozen Passage
  // Doors: up→18, down→23
  _makeRoom21() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFFFIIIIFFFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFFFIIIIFFFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frozen Passage',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 18, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 23, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 4, type: 'frost_sprite' },
        { x: 14, y: 4, type: 'frost_sprite' },
        { x: 9, y: 7, type: 'frost_wraith' },
        { x: 5, y: 10, type: 'cryomancer' },
      ],
    };
  },

  // Room 22: Ice Bridge
  // Doors: up→20, down→24
  _makeRoom22() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFFFFFFFFIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFFFFFFFFIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Ice Bridge',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 20, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 24, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 9, y: 5, type: 'frost_sprite' },
        { x: 5, y: 7, type: 'frost_wraith' },
        { x: 14, y: 7, type: 'frost_wraith' },
        { x: 9, y: 9, type: 'frost_sprite' },
        { x: 3, y: 3, type: 'cryomancer' },
      ],
    };
  },

  // Room 23: Crypt of Ice
  // Doors: up→21, down→25
  _makeRoom23() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIFFIIIIFFIF',
      'FIIIFFIIIIFFIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIFFIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIFFIIIIFFIF',
      'FIIIFFIIIIFFIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Crypt of Ice',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 21, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 25, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 4, type: 'frost_wraith' },
        { x: 14, y: 4, type: 'frost_wraith' },
        { x: 5, y: 8, type: 'frost_sprite' },
        { x: 14, y: 8, type: 'frost_sprite' },
        { x: 9, y: 12, type: 'cryomancer' },
      ],
    };
  },

  // Room 24: Frozen Falls
  // Doors: up→22, right→25, down→26
  _makeRoom24() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFFFIIIIFFFFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFIIIIIIIIIIFIIDF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFFFFIIIIFFFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frozen Falls',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 22, targetX: 9, targetY: 13 },
        { x: 18, y: 7, targetRoom: 25, targetX: 1, targetY: 7 },
        { x: 9, y: 14, targetRoom: 26, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 9, y: 5, type: 'frost_sprite' },
        { x: 5, y: 7, type: 'ice_golem' },
        { x: 14, y: 7, type: 'frost_wraith' },
        { x: 9, y: 9, type: 'frost_sprite' },
        { x: 9, y: 12, type: 'cryomancer' },
      ],
    };
  },

  // Room 25: Icicle Gallery
  // Doors: up→23, left→24
  _makeRoom25() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFIIIIFIIIIFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'DIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFIIIIFIIIIFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFFFFFFFFFFFF',
    ]);
    return {
      name: 'Icicle Gallery',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 23, targetX: 9, targetY: 13 },
        { x: 0, y: 7, targetRoom: 24, targetX: 17, targetY: 7 },
      ],
      enemies: [
        { x: 5, y: 3, type: 'frost_sprite' },
        { x: 14, y: 3, type: 'frost_sprite' },
        { x: 9, y: 7, type: 'ice_golem' },
        { x: 5, y: 11, type: 'cryomancer' },
        { x: 14, y: 11, type: 'cryomancer' },
      ],
    };
  },

  // Room 26: Frost Maze
  // Doors: up→24, left→27, right→28
  _makeRoom26() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIFFFIIFFFFIIFFFIIF',
      'FIIFIIIIIIIIIIFIIIIF',
      'FIIFIIFFFFIIFIFIIIIF',
      'FIIIIIFIIFIIFIIIIIIF',
      'FIIFFIFIIFIIFFFIIIIF',
      'DIIIIIFIIIIIIIIIIIDF',
      'FIIFFIFIIFIIFFFIIIIF',
      'FIIIIIFIIFIIFIIIIIIF',
      'FIIFIIFFFFIIFIFIIIIF',
      'FIIFIIIIIIIIIIFIIIIF',
      'FIIFFFIIFFFFIIFFFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFFFFFFFFFFFF',
    ]);
    return {
      name: 'Frost Maze',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 24, targetX: 9, targetY: 13 },
        { x: 0, y: 7, targetRoom: 27, targetX: 17, targetY: 7 },
        { x: 18, y: 7, targetRoom: 28, targetX: 1, targetY: 7 },
      ],
      enemies: [
        { x: 8, y: 5, type: 'frost_sprite' },
        { x: 4, y: 3, type: 'frost_wraith' },
        { x: 15, y: 3, type: 'frost_wraith' },
        { x: 4, y: 11, type: 'frost_sprite' },
        { x: 15, y: 11, type: 'cryomancer' },
        { x: 8, y: 9, type: 'cryomancer' },
      ],
    };
  },

  // Room 27: Frozen Lake
  // Doors: right→26, down→29
  _makeRoom27() {
    const tiles = this._parseRoom([
      'FFFFFFFFFFFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFFFFFFIIIIIIIF',
      'FIIIIFIIIIIIFIIIIIIF',
      'FIIIFIIIIIIIIFIIIIIF',
      'FIIIFIIIIIIIIFIIIIIF',
      'FIIIFIIIIIIIIFIIIIDF',
      'FIIIFIIIIIIIIFIIIIIF',
      'FIIIFIIIIIIIIFIIIIIF',
      'FIIIIFIIIIIIFIIIIIIF',
      'FIIIIIFFFFFFIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frozen Lake',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 17, y: 7 },
      doors: [
        { x: 18, y: 7, targetRoom: 26, targetX: 1, targetY: 7 },
        { x: 9, y: 14, targetRoom: 29, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 2, y: 2, type: 'frost_sprite' },
        { x: 16, y: 2, type: 'frost_sprite' },
        { x: 2, y: 12, type: 'ice_golem' },
        { x: 16, y: 12, type: 'frost_wraith' },
        { x: 9, y: 7, type: 'frost_sprite' },
        { x: 14, y: 5, type: 'cryomancer' },
      ],
    };
  },

  // Room 28: Snow Drift
  // Doors: left→26, down→30
  _makeRoom28() {
    const tiles = this._parseRoom([
      'FFFFFFFFFFFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFIIFFIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'DIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFIIFFIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Snow Drift',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 26, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 30, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 3, type: 'frost_sprite' },
        { x: 14, y: 3, type: 'frost_sprite' },
        { x: 9, y: 7, type: 'ice_golem' },
        { x: 5, y: 11, type: 'frost_wraith' },
        { x: 14, y: 11, type: 'cryomancer' },
        { x: 10, y: 5, type: 'cryomancer' },
      ],
    };
  },

  // Room 29: Ice Tomb
  // Doors: up→27, right→30
  _makeRoom29() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIFFIIFFIIFFIF',
      'FIIIFFIIFFIIFFIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIDF',
      'FIIIFFIIIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIFFIIFFIIFFIF',
      'FIIIFFIIFFIIFFIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFFFFFFFFFFFF',
    ]);
    return {
      name: 'Ice Tomb',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 27, targetX: 9, targetY: 13 },
        { x: 18, y: 7, targetRoom: 30, targetX: 1, targetY: 7 },
      ],
      enemies: [
        { x: 5, y: 5, type: 'frost_wraith' },
        { x: 14, y: 5, type: 'frost_wraith' },
        { x: 9, y: 7, type: 'frost_sprite' },
        { x: 5, y: 9, type: 'frost_sprite' },
        { x: 14, y: 9, type: 'cryomancer' },
        { x: 10, y: 12, type: 'ice_golem' },
      ],
    };
  },

  // Room 30: Frozen Archive
  // Doors: up→28, left→29, down→31
  _makeRoom30() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIFFIFFIIIIFFIFFIIF',
      'FIIFFIFFIIIIFFIFFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFFFIIIIIIIF',
      'FIIIIIIIFIIFIIIIIIIF',
      'DIIIIIIIFIIFIIIIIIIF',
      'FIIIIIIIFIIFIIIIIIIF',
      'FIIIIIIIFFFFIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIFFIFFIIIIFFIFFIIF',
      'FIIFFIFFIIIIFFIFFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frozen Archive',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 28, targetX: 9, targetY: 13 },
        { x: 0, y: 7, targetRoom: 29, targetX: 17, targetY: 7 },
        { x: 9, y: 14, targetRoom: 31, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 3, y: 4, type: 'frost_sprite' },
        { x: 16, y: 4, type: 'frost_sprite' },
        { x: 3, y: 10, type: 'ice_golem' },
        { x: 16, y: 10, type: 'frost_wraith' },
        { x: 9, y: 1, type: 'cryomancer' },
        { x: 9, y: 13, type: 'cryomancer' },
        { x: 3, y: 7, type: 'frost_sprite' },
      ],
    };
  },

  // Room 31: Glacial Depths
  // Doors: up→30, down→32
  _makeRoom31() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIFFIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIFFIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Glacial Depths',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 30, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 32, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 6, y: 3, type: 'frost_sprite' },
        { x: 14, y: 3, type: 'frost_sprite' },
        { x: 9, y: 7, type: 'ice_golem' },
        { x: 5, y: 7, type: 'frost_wraith' },
        { x: 14, y: 7, type: 'frost_wraith' },
        { x: 6, y: 11, type: 'cryomancer' },
        { x: 14, y: 11, type: 'cryomancer' },
        { x: 9, y: 11, type: 'frost_sprite' },
      ],
    };
  },

  // Room 32: Frozen Gauntlet
  // Doors: up→31, down→33
  _makeRoom32() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFIIIIFIIIIFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFIIIIFIIIIFIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIFIIIIFIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frozen Gauntlet',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 31, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 33, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 3, y: 3, type: 'frost_sprite' },
        { x: 16, y: 3, type: 'frost_sprite' },
        { x: 9, y: 5, type: 'ice_golem' },
        { x: 3, y: 7, type: 'frost_wraith' },
        { x: 16, y: 7, type: 'frost_wraith' },
        { x: 9, y: 9, type: 'cryomancer' },
        { x: 3, y: 11, type: 'cryomancer' },
        { x: 16, y: 11, type: 'frost_sprite' },
      ],
    };
  },

  // Room 33: Permafrost Chamber
  // Doors: up→32, down→34
  _makeRoom33() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFFFIIIIFFFFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFIIIIIIIIIF',
      'FIIIIIIIFFIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFIIIIIIIIIIFIIIF',
      'FIIIFFFFIIIIFFFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Permafrost Chamber',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 32, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 34, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 4, type: 'frost_sprite' },
        { x: 14, y: 4, type: 'frost_sprite' },
        { x: 10, y: 7, type: 'ice_golem' },
        { x: 5, y: 7, type: 'cryomancer' },
        { x: 14, y: 7, type: 'cryomancer' },
        { x: 5, y: 10, type: 'frost_wraith' },
        { x: 14, y: 10, type: 'frost_wraith' },
        { x: 9, y: 12, type: 'frost_sprite' },
      ],
    };
  },

  // Room 34: Frostbound Antechamber
  // Doors: up→33, down→35
  _makeRoom34() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFIFFIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIIIFFIFFIIIIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFDFFFFFFFFFF',
    ]);
    return {
      name: 'Frostbound Antechamber',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 33, targetX: 9, targetY: 13 },
        { x: 9, y: 14, targetRoom: 35, targetX: 9, targetY: 1 },
      ],
      enemies: [
        { x: 5, y: 4, type: 'frost_sprite' },
        { x: 14, y: 4, type: 'frost_sprite' },
        { x: 5, y: 10, type: 'ice_golem' },
        { x: 14, y: 10, type: 'ice_golem' },
        { x: 3, y: 7, type: 'cryomancer' },
        { x: 16, y: 7, type: 'cryomancer' },
        { x: 9, y: 4, type: 'frost_wraith' },
        { x: 9, y: 10, type: 'frost_sprite' },
      ],
    };
  },

  // Room 35: The Frozen Throne (BOSS)
  // Doors: up→34
  _makeRoom35() {
    const tiles = this._parseRoom([
      'FFFFFFFFFDFFFFFFFFFF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFFIIIIIIFFIIIF',
      'FIIIIIFFIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIIIFFIIIIIIFFIIIF',
      'FIIIIIFFIIIIIIFFIIIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIFFIIIIIIIIIIFFIF',
      'FIIIIIIIIIIIIIIIIIIF',
      'FFFFFFFFFFFFFFFFFFFF',
    ]);
    return {
      name: 'The Frozen Throne',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 9, y: 1 },
      doors: [
        { x: 9, y: 0, targetRoom: 34, targetX: 9, targetY: 13 },
      ],
      enemies: [
        { x: 6, y: 2, type: 'cryomancer' },
        { x: 14, y: 2, type: 'cryomancer' },
        { x: 6, y: 12, type: 'frost_sprite' },
        { x: 14, y: 12, type: 'frost_sprite' },
        { x: 3, y: 7, type: 'ice_golem' },
        { x: 16, y: 7, type: 'ice_golem' },
        { x: 8, y: 5, type: 'frost_wraith' },
        { x: 12, y: 5, type: 'frost_wraith' },
        { x: 8, y: 9, type: 'frost_sprite' },
        { x: 12, y: 9, type: 'frost_sprite' },
        { x: 9, y: 7, type: 'brute' },
      ],
    };
  },

  getRoom() {
    return this.rooms[this.currentRoom];
  },

  getTile(x, y) {
    const room = this.getRoom();
    if (x < 0 || y < 0 || x >= room.width || y >= room.height) return T.WALL;
    return room.tiles[y][x];
  },

  isWalkable(x, y) {
    const tile = this.getTile(x, y);
    if (tile !== T.FLOOR && tile !== T.DOOR && tile !== T.SHOP_FLOOR && tile !== T.GRASS && tile !== T.ICE) return false;
    // Block shopkeeper tile
    const room = this.getRoom();
    if (room.shopkeeper && room.shopkeeper.x === x && room.shopkeeper.y === y) return false;
    return true;
  },

  getDoorAt(x, y) {
    const room = this.getRoom();
    for (const door of room.doors) {
      if (door.x === x && door.y === y) return door;
    }
    return null;
  },

  drawRoom(ctx, camera) {
    const room = this.getRoom();
    const startX = Math.max(0, Math.floor(camera.x / TILE));
    const startY = Math.max(0, Math.floor(camera.y / TILE));
    const endX = Math.min(room.width, Math.ceil((camera.x + CANVAS_W) / TILE) + 1);
    const endY = Math.min(room.height, Math.ceil((camera.y + CANVAS_H) / TILE) + 1);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tile = room.tiles[y][x];
        const px = x * TILE - camera.x;
        const py = y * TILE - camera.y;

        if (tile === T.WALL) {
          Sprites.draw(ctx, Sprites.wall, px, py);
        } else if (tile === T.WOOD_WALL) {
          // Wood plank wall
          ctx.fillStyle = '#6b4c2a';
          ctx.fillRect(px, py, TILE, TILE);
          // Plank lines
          ctx.fillStyle = '#5a3e20';
          ctx.fillRect(px, py + 10, TILE, 2);
          ctx.fillRect(px, py + 22, TILE, 2);
          // Top highlight
          ctx.fillStyle = '#7e5e36';
          ctx.fillRect(px, py, TILE, 2);
          // Bottom shadow
          ctx.fillStyle = '#4a3018';
          ctx.fillRect(px, py + TILE - 2, TILE, 2);
          // Grain variation
          const wh = (x * 11 + y * 7) & 0xFF;
          if (wh < 100) {
            ctx.fillStyle = '#7a5a34';
            ctx.fillRect(px + 4, py + 2, 6, 8);
          } else if (wh > 180) {
            ctx.fillStyle = '#5a3a1a';
            ctx.fillRect(px + 12, py + 14, 8, 6);
          }
        } else if (tile === T.DOOR) {
          Sprites.draw(ctx, Sprites.door, px, py);
        } else if (tile === T.GRASS) {
          // Grass tile — green ground with variation
          const gh = (x * 7 + y * 13 + x * y * 3) & 0xFF;
          ctx.fillStyle = gh < 80 ? '#3a6b2a' : gh > 200 ? '#4a7a38' : '#3f7030';
          ctx.fillRect(px, py, TILE, TILE);
          // Grass blades
          ctx.fillStyle = '#4a8a3a';
          ctx.fillRect(px + (gh % 7) * 4 + 2, py + 4, 2, 4);
          ctx.fillRect(px + (gh % 5) * 5 + 6, py + 18, 2, 4);
          ctx.fillRect(px + (gh % 3) * 8 + 10, py + 10, 2, 4);
          // Dark speckle
          ctx.fillStyle = '#2e5a20';
          ctx.fillRect(px + (gh % 9) * 3 + 1, py + (gh % 11) * 2 + 2, 2, 2);
        } else if (tile === T.TREE) {
          // Tree on grass base
          ctx.fillStyle = '#3f7030';
          ctx.fillRect(px, py, TILE, TILE);
          // Trunk
          ctx.fillStyle = '#5a3a1a';
          ctx.fillRect(px + 12, py + 16, 8, 16);
          // Canopy — layered circles as overlapping rects
          ctx.fillStyle = '#2d5a1e';
          ctx.fillRect(px + 4, py + 2, 24, 18);
          ctx.fillRect(px + 6, py, 20, 22);
          // Canopy highlight
          ctx.fillStyle = '#3a7a28';
          ctx.fillRect(px + 8, py + 2, 10, 8);
          // Canopy shadow
          ctx.fillStyle = '#1e4414';
          ctx.fillRect(px + 6, py + 16, 20, 4);
        } else if (tile === T.ICE) {
          Sprites.draw(ctx, Sprites.iceFloor, px, py);
          // Per-tile frost variation
          const ih = (x * 7 + y * 13 + x * y * 3) & 0xFF;
          if (ih < 80) {
            ctx.fillStyle = 'rgba(150,200,230,0.06)';
            ctx.fillRect(px, py, TILE, TILE);
          } else if (ih > 200) {
            ctx.fillStyle = 'rgba(200,230,255,0.04)';
            ctx.fillRect(px, py, TILE, TILE);
          }
          // Frost sparkle
          if (ih % 13 === 0) {
            ctx.fillStyle = '#b0d8f0';
            ctx.fillRect(px + (ih % 6) * 5 + 2, py + (ih % 5) * 5 + 4, 2, 2);
          }
        } else if (tile === T.ICE_WALL) {
          Sprites.draw(ctx, Sprites.iceWall, px, py);
          // Crystal shimmer
          const iwh = (x * 11 + y * 7) & 0xFF;
          if (iwh < 60) {
            ctx.fillStyle = 'rgba(160,210,240,0.08)';
            ctx.fillRect(px + 4, py + 6, 8, 4);
          }
        } else {
          Sprites.draw(ctx, Sprites.floor, px, py);
          // Subtle per-tile color variation using position hash
          const hash = (x * 7 + y * 13 + x * y * 3) & 0xFF;
          if (hash < 80) {
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            ctx.fillRect(px, py, TILE, TILE);
          } else if (hash > 200) {
            ctx.fillStyle = 'rgba(255,255,255,0.02)';
            ctx.fillRect(px, py, TILE, TILE);
          }
          // Occasional tiny debris/crack details
          if (hash % 17 === 0) {
            ctx.fillStyle = '#4a4a3a';
            ctx.fillRect(px + (hash % 5) * 5 + 4, py + (hash % 7) * 3 + 6, 2, 2);
          }
        }
      }
    }
  },
};
