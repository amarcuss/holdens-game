const Shop = {
  open: false,
  cursor: 0,
  message: '',
  messageTimer: 0,

  show() {
    this.open = true;
    this.cursor = 0;
    this.message = '';
    this.messageTimer = 0;
  },

  hide() {
    this.open = false;
  },

  update(dt, player) {
    if (!this.open) return;

    this.messageTimer = Math.max(0, this.messageTimer - dt);

    // Navigate
    if (Input.wasPressed('ArrowUp')) {
      this.cursor = (this.cursor - 1 + SHOP_ITEMS.length) % SHOP_ITEMS.length;
    }
    if (Input.wasPressed('ArrowDown')) {
      this.cursor = (this.cursor + 1) % SHOP_ITEMS.length;
    }

    // Purchase
    if (Input.wasPressed('Space') || Input.wasPressed('Enter')) {
      const key = SHOP_ITEMS[this.cursor];
      const item = ITEMS[key];

      if (player.coins < item.price) {
        this.message = 'Not enough coins!';
        this.messageTimer = 1.5;
      } else if (item.type === 'heal') {
        if (player.hp >= player.maxHp) {
          this.message = 'Already full HP!';
          this.messageTimer = 1.5;
        } else {
          player.coins -= item.price;
          player.hp = Math.min(player.maxHp, player.hp + item.stat);
          this.message = 'Healed +' + item.stat + ' HP!';
          this.messageTimer = 1.5;
        }
      } else {
        // Equipment: check if already equipped same or better
        const currentKey = item.type === 'sword' ? Inventory.equippedSword : Inventory.equippedArmor;
        if (currentKey === key) {
          this.message = 'Already equipped!';
          this.messageTimer = 1.5;
        } else if (currentKey && ITEMS[currentKey].stat >= item.stat) {
          this.message = 'You have something better!';
          this.messageTimer = 1.5;
        } else {
          player.coins -= item.price;
          Inventory.equip(key);
          player.attack = PLAYER_BASE_ATK + Inventory.getAttackBonus();
          player.defense = PLAYER_BASE_DEF + Inventory.getDefenseBonus();
          this.message = 'Equipped ' + item.name + '!';
          this.messageTimer = 1.5;
        }
      }
    }

    // Close
    if (Input.wasPressed('Escape')) {
      this.hide();
    }
  },

  draw(ctx) {
    if (!this.open) return;

    // Overlay background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Title
    ctx.fillStyle = COLORS.COIN;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SHOP', CANVAS_W / 2, 50);

    // Coin count
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '14px monospace';
    ctx.fillText('Your coins: ' + this._playerCoins, CANVAS_W / 2, 75);

    // Items list
    const startY = 110;
    const lineH = 36;
    ctx.textAlign = 'left';

    for (let i = 0; i < SHOP_ITEMS.length; i++) {
      const key = SHOP_ITEMS[i];
      const item = ITEMS[key];
      const y = startY + i * lineH;
      const selected = i === this.cursor;

      // Selection highlight
      if (selected) {
        ctx.fillStyle = 'rgba(241, 196, 15, 0.15)';
        ctx.fillRect(120, y - 16, 400, lineH - 2);
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(120, y - 16, 400, lineH - 2);
      }

      // Cursor arrow
      if (selected) {
        ctx.fillStyle = COLORS.COIN;
        ctx.font = '16px monospace';
        ctx.fillText('>', 130, y);
      }

      // Item name
      ctx.fillStyle = COLORS.TEXT;
      ctx.font = '14px monospace';
      ctx.fillText(item.name, 150, y);

      // Stat description
      ctx.fillStyle = '#aaa';
      ctx.fillText(item.desc, 310, y);

      // Price
      ctx.fillStyle = COLORS.COIN;
      ctx.fillText(item.price + 'c', 440, y);

      // Equipped indicator
      if (key === Inventory.equippedSword || key === Inventory.equippedArmor) {
        ctx.fillStyle = '#4ecdc4';
        ctx.fillText('[E]', 490, y);
      }
    }

    // Message
    if (this.messageTimer > 0) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(this.message, CANVAS_W / 2, startY + SHOP_ITEMS.length * lineH + 20);
    }

    // Instructions
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText('Arrow keys: navigate | Space/Enter: buy | Esc: close', CANVAS_W / 2, CANVAS_H - 30);
    ctx.textAlign = 'left';
  },

  // Store reference to player coins for display
  _playerCoins: 0,
};
