const DungeonMapOverlay = {
  open: false,

  // Hand-placed room positions per dungeon (col, row)
  // Dungeon 1: rooms 0-14
  _dungeon1Layout: {
    0:  { col: 2, row: 0, label: 'Entrance' },
    1:  { col: 3, row: 0, label: 'Corridor' },
    2:  { col: 2, row: 1, label: 'Great Hall' },
    3:  { col: 4, row: 0, label: 'Treasury' },
    4:  { col: 2, row: 2, label: 'Depths' },
    5:  { col: 4, row: 1, label: 'Secret' },
    6:  { col: 1, row: 2, label: 'Crypt' },
    7:  { col: 3, row: 2, label: 'Maze' },
    8:  { col: 4, row: 2, label: 'Armory' },
    9:  { col: 1, row: 3, label: 'Catacomb' },
    10: { col: 3, row: 3, label: 'Gauntlet' },
    11: { col: 4, row: 3, label: 'The Pit' },
    12: { col: 1, row: 4, label: 'Ossuary' },
    13: { col: 2, row: 4, label: 'Antechamber' },
    14: { col: 2, row: 5, label: 'Throne' },
  },

  // Dungeon 2: rooms 16-35
  _dungeon2Layout: {
    16: { col: 2, row: 0, label: 'Entrance' },
    17: { col: 3, row: 0, label: 'Corridor' },
    18: { col: 2, row: 1, label: 'Crossroads' },
    19: { col: 3, row: 1, label: 'Hall' },
    20: { col: 1, row: 1, label: 'Crystal' },
    21: { col: 2, row: 2, label: 'Passage' },
    22: { col: 1, row: 2, label: 'Bridge' },
    23: { col: 2, row: 3, label: 'Crypt' },
    24: { col: 1, row: 3, label: 'Falls' },
    25: { col: 2, row: 4, label: 'Gallery' },
    26: { col: 1, row: 4, label: 'Maze' },
    27: { col: 0, row: 4, label: 'Lake' },
    28: { col: 2, row: 5, label: 'Drift' },
    29: { col: 0, row: 5, label: 'Tomb' },
    30: { col: 1, row: 5, label: 'Archive' },
    31: { col: 1, row: 6, label: 'Depths' },
    32: { col: 1, row: 7, label: 'Gauntlet' },
    33: { col: 1, row: 8, label: 'Permafrost' },
    34: { col: 1, row: 9, label: 'Antechamber' },
    35: { col: 1, row: 10, label: 'Throne' },
  },

  // Dungeon 3: rooms 36-45
  _dungeon3Layout: {
    36: { col: 2, row: 0, label: 'Entrance' },
    37: { col: 3, row: 0, label: 'Corridor' },
    38: { col: 2, row: 1, label: 'Crossroads' },
    39: { col: 3, row: 1, label: 'Shop' },
    40: { col: 1, row: 1, label: 'Cavern' },
    41: { col: 2, row: 2, label: 'Bridge' },
    42: { col: 1, row: 2, label: 'Caldera' },
    43: { col: 2, row: 3, label: 'Depths' },
    44: { col: 1, row: 3, label: 'Antechamber' },
    45: { col: 1, row: 4, label: 'Throne' },
  },

  // Door connections per dungeon (derived from room data)
  _getConnections(layout) {
    const connections = [];
    const roomIds = Object.keys(layout).map(Number);
    const seen = new Set();

    for (const roomId of roomIds) {
      const room = DungeonMap.rooms[roomId];
      if (!room || !room.doors) continue;
      for (const door of room.doors) {
        if (door.targetRoom === -1) continue;
        if (!layout[door.targetRoom]) continue;
        const key = Math.min(roomId, door.targetRoom) + '-' + Math.max(roomId, door.targetRoom);
        if (seen.has(key)) continue;
        seen.add(key);
        connections.push([roomId, door.targetRoom]);
      }
    }
    return connections;
  },

  show() {
    this.open = true;
  },

  hide() {
    this.open = false;
  },

  update(dt) {
    if (!this.open) return;
    if (Input.wasPressed('Escape') || Input.wasPressed('KeyM')) {
      this.hide();
    }
  },

  draw(ctx, visitedRooms) {
    if (!this.open) return;

    // Determine which dungeon we're in
    const currentRoom = DungeonMap.currentRoom;
    let layout, dungeonName;

    if (currentRoom >= 36 && currentRoom <= 45) {
      layout = this._dungeon3Layout;
      dungeonName = 'The Volcano';
    } else if (currentRoom >= 16 && currentRoom <= 35) {
      layout = this._dungeon2Layout;
      dungeonName = 'The Frozen Depths';
    } else if (currentRoom <= 14) {
      layout = this._dungeon1Layout;
      dungeonName = "Holden's Dungeon";
    } else {
      // Hub room — show dungeon 1 by default
      layout = this._dungeon1Layout;
      dungeonName = "Holden's Dungeon";
    }

    // Overlay background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Title
    ctx.fillStyle = '#d4a017';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DUNGEON MAP', CANVAS_W / 2, 30);

    // Dungeon name
    ctx.fillStyle = '#aaa';
    ctx.font = '13px monospace';
    ctx.fillText(dungeonName, CANVAS_W / 2, 48);

    // Calculate grid bounds
    const roomIds = Object.keys(layout).map(Number);
    let minCol = Infinity, maxCol = -Infinity, minRow = Infinity, maxRow = -Infinity;
    for (const id of roomIds) {
      const pos = layout[id];
      minCol = Math.min(minCol, pos.col);
      maxCol = Math.max(maxCol, pos.col);
      minRow = Math.min(minRow, pos.row);
      maxRow = Math.max(maxRow, pos.row);
    }

    const cols = maxCol - minCol + 1;
    const rows = maxRow - minRow + 1;

    // Dynamic sizing to fit canvas
    const mapAreaW = CANVAS_W - 80;
    const mapAreaH = CANVAS_H - 100;
    const cellW = Math.min(110, Math.floor(mapAreaW / cols));
    const cellH = Math.min(45, Math.floor(mapAreaH / rows));
    const rectW = Math.min(80, cellW - 12);
    const rectH = Math.min(28, cellH - 8);

    const mapW = cols * cellW;
    const mapH = rows * cellH;
    const offsetX = (CANVAS_W - mapW) / 2;
    const offsetY = 60 + (mapAreaH - mapH) / 2;

    // Helper: get center of a room rectangle
    const getCenter = (id) => {
      const pos = layout[id];
      const cx = offsetX + (pos.col - minCol) * cellW + cellW / 2;
      const cy = offsetY + (pos.row - minRow) * cellH + cellH / 2;
      return { x: cx, y: cy };
    };

    // Draw connection lines
    const connections = this._getConnections(layout);
    for (const [a, b] of connections) {
      const ca = getCenter(a);
      const cb = getCenter(b);
      const aVisited = visitedRooms && visitedRooms.has(a);
      const bVisited = visitedRooms && visitedRooms.has(b);

      if (aVisited && bVisited) {
        ctx.strokeStyle = '#555';
      } else if (aVisited || bVisited) {
        ctx.strokeStyle = '#333';
      } else {
        ctx.strokeStyle = '#222';
      }
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ca.x, ca.y);
      ctx.lineTo(cb.x, cb.y);
      ctx.stroke();
    }

    // Draw room rectangles
    for (const id of roomIds) {
      const pos = layout[id];
      const cx = offsetX + (pos.col - minCol) * cellW + cellW / 2;
      const cy = offsetY + (pos.row - minRow) * cellH + cellH / 2;
      const rx = cx - rectW / 2;
      const ry = cy - rectH / 2;

      const visited = visitedRooms && visitedRooms.has(id);
      const isCurrent = id === currentRoom;

      // Room background
      if (isCurrent) {
        ctx.fillStyle = 'rgba(212, 160, 23, 0.3)';
      } else if (visited) {
        ctx.fillStyle = 'rgba(100, 100, 120, 0.4)';
      } else {
        ctx.fillStyle = 'rgba(40, 40, 50, 0.5)';
      }
      ctx.fillRect(rx, ry, rectW, rectH);

      // Room border
      if (isCurrent) {
        ctx.strokeStyle = '#d4a017';
        ctx.lineWidth = 2;
      } else if (visited) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
      } else {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
      }
      ctx.strokeRect(rx, ry, rectW, rectH);

      // Room label
      ctx.textAlign = 'center';
      ctx.font = '10px monospace';
      if (isCurrent) {
        ctx.fillStyle = '#d4a017';
      } else if (visited) {
        ctx.fillStyle = '#bbb';
      } else {
        ctx.fillStyle = '#555';
      }
      ctx.fillText(visited ? pos.label : '?', cx, cy + 4);
    }

    // Instructions
    ctx.textAlign = 'center';
    ctx.fillStyle = '#555';
    ctx.font = '12px monospace';
    ctx.fillText('M / Esc: close', CANVAS_W / 2, CANVAS_H - 16);
    ctx.textAlign = 'left';
  },
};
