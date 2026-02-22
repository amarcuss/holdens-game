const BESTIARY_DATA = {
  slime: {
    name: 'Slime',
    flavor: 'A gelatinous blob that oozes through the dungeon. Scholars debate whether it thinks at all, or simply digests.',
    getSprite() { return Sprites.slimeDown; },
  },
  skeleton: {
    name: 'Skeleton',
    flavor: 'The restless bones of a fallen adventurer. Still remembers how to swing a sword, but forgot why.',
    getSprite() { return Sprites.skeletonDown; },
  },
  archer: {
    name: 'Shadow Archer',
    flavor: 'A hooded marksman who lurks in dark corridors. Never misses... unless you keep moving.',
    getSprite() { return Sprites.archerDown; },
  },
  brute: {
    name: 'Brute Slime',
    flavor: 'A massive slime that has consumed enough adventurers to grow twice as large. Splits into two smaller slimes upon defeat.',
    getSprite() { return Sprites.slimeDown; },
  },
};

const ALL_TYPES = Object.keys(BESTIARY_DATA);

const EQUIP_SLOTS = [
  { key: 'sword', label: 'Sword', emptyLabel: 'No sword equipped', color: '#f39c12' },
  { key: 'armor', label: 'Armor', emptyLabel: 'No armor equipped', color: '#3498db' },
];

const Bestiary = {
  open: false,
  tab: 0,           // 0 = Monsters, 1 = Equipment
  cursor: 0,
  entries: {},       // { type: { discovered: bool, kills: int } }
  newEntryTimer: 0,

  _TABS: ['Monsters', 'Equipment'],

  init() {
    this.entries = {};
    for (const type of ALL_TYPES) {
      this.entries[type] = { discovered: false, kills: 0 };
    }
  },

  reset() {
    this.init();
    this.newEntryTimer = 0;
    this.tab = 0;
    this.cursor = 0;
  },

  recordKill(type) {
    if (!this.entries[type]) return;
    if (!this.entries[type].discovered) {
      this.entries[type].discovered = true;
      this.newEntryTimer = 3;
    }
    this.entries[type].kills++;
  },

  show() {
    this.open = true;
  },

  hide() {
    this.open = false;
  },

  _getListLength() {
    if (this.tab === 0) return ALL_TYPES.length;
    return EQUIP_SLOTS.length;
  },

  update(dt) {
    if (!this.open) return;

    // Switch tabs
    if (Input.wasPressed('ArrowLeft')) {
      this.tab = (this.tab - 1 + this._TABS.length) % this._TABS.length;
      this.cursor = 0;
    }
    if (Input.wasPressed('ArrowRight')) {
      this.tab = (this.tab + 1) % this._TABS.length;
      this.cursor = 0;
    }

    // Navigate list
    const len = this._getListLength();
    if (Input.wasPressed('ArrowUp')) {
      this.cursor = (this.cursor - 1 + len) % len;
    }
    if (Input.wasPressed('ArrowDown')) {
      this.cursor = (this.cursor + 1) % len;
    }

    // Close
    if (Input.wasPressed('Escape') || Input.wasPressed('KeyB')) {
      this.hide();
    }
  },

  updateIcon(dt) {
    if (this.newEntryTimer > 0) {
      this.newEntryTimer = Math.max(0, this.newEntryTimer - dt);
    }
  },

  draw(ctx) {
    if (!this.open) return;

    // Overlay background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Title
    ctx.fillStyle = '#d4a017';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BESTIARY', CANVAS_W / 2, 34);

    // Tabs
    this._drawTabs(ctx);

    // Divider under tabs
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 68);
    ctx.lineTo(CANVAS_W - 60, 68);
    ctx.stroke();

    if (this.tab === 0) {
      this._drawMonstersTab(ctx);
    } else {
      this._drawEquipmentTab(ctx);
    }

    // Instructions
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText('L/R: tab | Up/Down: navigate | B/Esc: close', CANVAS_W / 2, CANVAS_H - 24);
    ctx.textAlign = 'left';
  },

  _drawTabs(ctx) {
    const tabW = 120;
    const totalW = this._TABS.length * tabW + (this._TABS.length - 1) * 8;
    const startX = (CANVAS_W - totalW) / 2;
    const tabY = 44;
    const tabH = 22;

    for (let i = 0; i < this._TABS.length; i++) {
      const x = startX + i * (tabW + 8);
      const active = i === this.tab;

      // Tab background
      ctx.fillStyle = active ? 'rgba(212, 160, 23, 0.25)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(x, tabY, tabW, tabH);

      // Tab border
      ctx.strokeStyle = active ? '#d4a017' : '#444';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, tabY, tabW, tabH);

      // Tab label
      ctx.fillStyle = active ? '#d4a017' : '#888';
      ctx.font = active ? 'bold 12px monospace' : '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this._TABS[i], x + tabW / 2, tabY + 15);
    }
  },

  _drawMonstersTab(ctx) {
    const listX = 60;
    const listY = 90;
    const lineH = 32;

    ctx.textAlign = 'left';
    for (let i = 0; i < ALL_TYPES.length; i++) {
      const type = ALL_TYPES[i];
      const entry = this.entries[type];
      const data = BESTIARY_DATA[type];
      const y = listY + i * lineH;
      const selected = i === this.cursor;

      if (selected) {
        ctx.fillStyle = 'rgba(212, 160, 23, 0.15)';
        ctx.fillRect(listX - 8, y - 14, 200, lineH - 2);
        ctx.strokeStyle = 'rgba(212, 160, 23, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(listX - 8, y - 14, 200, lineH - 2);

        ctx.fillStyle = '#d4a017';
        ctx.font = '16px monospace';
        ctx.fillText('>', listX, y);
      }

      ctx.font = '14px monospace';
      if (entry.discovered) {
        ctx.fillStyle = COLORS.TEXT;
        ctx.fillText(data.name, listX + 18, y);
      } else {
        ctx.fillStyle = '#555';
        ctx.fillText('???', listX + 18, y);
      }
    }

    // Vertical divider
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(270, 76);
    ctx.lineTo(270, CANVAS_H - 50);
    ctx.stroke();

    // Right panel: details
    const type = ALL_TYPES[this.cursor];
    const entry = this.entries[type];
    const data = BESTIARY_DATA[type];

    if (entry.discovered) {
      const detailX = 290;
      const detailY = 90;

      const sprite = data.getSprite();
      Sprites.draw(ctx, sprite, detailX + 10, detailY);

      ctx.fillStyle = '#d4a017';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(data.name, detailX + 50, detailY + 14);

      ctx.fillStyle = '#e74c3c';
      ctx.font = '12px monospace';
      ctx.fillText('Defeated: ' + entry.kills, detailX + 50, detailY + 30);

      const config = Enemy.TYPES[type];
      const statsY = detailY + 52;
      const statsGap = 18;
      ctx.fillStyle = '#aaa';
      ctx.font = '12px monospace';

      ctx.fillText('HP: ' + config.hp, detailX, statsY);
      ctx.fillText('ATK: ' + config.damage, detailX + 100, statsY);
      ctx.fillText('Speed: ' + config.speed, detailX, statsY + statsGap);
      ctx.fillText('Range: ' + config.chaseRange, detailX + 100, statsY + statsGap);
      ctx.fillText('Coins: ' + config.coinDrop.min + '-' + config.coinDrop.max, detailX, statsY + statsGap * 2);
      ctx.fillText('XP: ' + config.xp, detailX + 100, statsY + statsGap * 2);

      ctx.fillStyle = '#ccc';
      ctx.font = '12px monospace';
      const flavorY = statsY + statsGap * 3 + 10;
      const maxW = CANVAS_W - detailX - 70;
      this._drawWrappedText(ctx, data.flavor, detailX, flavorY, maxW, 16);
    } else {
      ctx.fillStyle = '#555';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Not yet discovered.', (270 + CANVAS_W) / 2, CANVAS_H / 2);
      ctx.font = '12px monospace';
      ctx.fillText('Defeat this creature to learn more.', (270 + CANVAS_W) / 2, CANVAS_H / 2 + 24);
    }
  },

  _drawEquipmentTab(ctx) {
    const listX = 60;
    const listY = 90;
    const lineH = 32;

    ctx.textAlign = 'left';
    for (let i = 0; i < EQUIP_SLOTS.length; i++) {
      const slot = EQUIP_SLOTS[i];
      const y = listY + i * lineH;
      const selected = i === this.cursor;
      const equipped = slot.key === 'sword' ? Inventory.equippedSword : Inventory.equippedArmor;

      if (selected) {
        ctx.fillStyle = 'rgba(212, 160, 23, 0.15)';
        ctx.fillRect(listX - 8, y - 14, 200, lineH - 2);
        ctx.strokeStyle = 'rgba(212, 160, 23, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(listX - 8, y - 14, 200, lineH - 2);

        ctx.fillStyle = '#d4a017';
        ctx.font = '16px monospace';
        ctx.fillText('>', listX, y);
      }

      ctx.font = '14px monospace';
      if (equipped) {
        ctx.fillStyle = slot.color;
        ctx.fillText(ITEMS[equipped].name, listX + 18, y);
      } else {
        ctx.fillStyle = '#555';
        ctx.fillText(slot.label + ': ---', listX + 18, y);
      }
    }

    // Vertical divider
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(270, 76);
    ctx.lineTo(270, CANVAS_H - 50);
    ctx.stroke();

    // Right panel: selected slot details
    const slot = EQUIP_SLOTS[this.cursor];
    const equippedKey = slot.key === 'sword' ? Inventory.equippedSword : Inventory.equippedArmor;

    const detailX = 290;
    const detailY = 90;

    if (equippedKey) {
      const item = ITEMS[equippedKey];

      // Slot label
      ctx.fillStyle = slot.color;
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item.name, detailX, detailY + 14);

      // Stat
      ctx.fillStyle = '#aaa';
      ctx.font = '14px monospace';
      const statLabel = item.type === 'sword' ? 'Attack bonus' : 'Defense bonus';
      ctx.fillText(statLabel + ': +' + item.stat, detailX, detailY + 40);

      // Price paid
      ctx.fillStyle = COLORS.COIN;
      ctx.font = '12px monospace';
      ctx.fillText('Value: ' + item.price + 'c', detailX, detailY + 62);

      // Description
      ctx.fillStyle = '#ccc';
      ctx.font = '12px monospace';
      ctx.fillText(item.desc, detailX, detailY + 84);
    } else {
      ctx.fillStyle = '#555';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(slot.emptyLabel, (270 + CANVAS_W) / 2, CANVAS_H / 2);
      ctx.font = '12px monospace';
      ctx.fillText('Visit the shop to buy one!', (270 + CANVAS_W) / 2, CANVAS_H / 2 + 24);
    }
  },

  drawIcon(ctx) {
    const ix = CANVAS_W - 80;
    const iy = CANVAS_H - 32;

    // Glow effect when new entry discovered
    if (this.newEntryTimer > 0) {
      const pulse = 0.4 + 0.6 * Math.abs(Math.sin(this.newEntryTimer * 4));
      ctx.save();
      ctx.shadowColor = '#d4a017';
      ctx.shadowBlur = 8 * pulse;
      this._drawBookAt(ctx, ix, iy);
      ctx.restore();
    } else {
      this._drawBookAt(ctx, ix, iy);
    }
  },

  _drawBookAt(ctx, ix, iy) {
    const sprite = Sprites.book;
    for (let y = 0; y < sprite.length; y++) {
      for (let x = 0; x < sprite[y].length; x++) {
        const c = sprite[y][x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(ix + x, iy + y, 1, 1);
        }
      }
    }
  },

  _drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (const word of words) {
      const testLine = line ? line + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, x, curY);
        line = word;
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, curY);
    }
  },
};
