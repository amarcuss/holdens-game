// Room definitions: 20x15 tile grids
// W=wall, .=floor, D=door

const DungeonMap = {
  rooms: [],
  currentRoom: 0,

  init() {
    this.rooms = [
      this._makeRoom0(), // Entrance Hall
      this._makeRoom1(), // Corridor
      this._makeRoom2(), // Great Hall
      this._makeRoom3(), // Treasury
      this._makeRoom4(), // Dungeon Depths
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
      'WWWWWWWWWWWWWWWWWWWW',
    ]);
    return {
      name: 'Treasury',
      tiles,
      width: ROOM_W,
      height: ROOM_H,
      playerStart: { x: 1, y: 7 },
      doors: [
        { x: 0, y: 7, targetRoom: 1, targetX: 17, targetY: 7 },
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
      'W..................W',
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
    if (tile !== T.FLOOR && tile !== T.DOOR && tile !== T.SHOP_FLOOR) return false;
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
        } else if (tile === T.DOOR) {
          Sprites.draw(ctx, Sprites.door, px, py);
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
