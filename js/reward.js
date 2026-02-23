const Reward = {
  open: false,
  cursor: 0,
  title: '',
  choices: [],    // [{key, name, desc, sprite}]
  onChoose: null,

  show(title, choices, onChoose) {
    this.open = true;
    this.cursor = 0;
    this.title = title;
    this.choices = choices;
    this.onChoose = onChoose;
  },

  hide() {
    this.open = false;
    this.choices = [];
    this.onChoose = null;
  },

  update(dt) {
    if (!this.open) return;

    if (Input.wasPressed('ArrowLeft')) {
      this.cursor = 0;
    }
    if (Input.wasPressed('ArrowRight')) {
      this.cursor = 1;
    }

    if (Input.wasPressed('Enter') || Input.wasPressed('Space')) {
      const chosen = this.choices[this.cursor];
      const cb = this.onChoose;
      this.hide();
      if (cb) cb(chosen.key);
    }
  },

  draw(ctx) {
    if (!this.open) return;

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.COIN;
    ctx.font = 'bold 24px monospace';
    ctx.fillText(this.title, CANVAS_W / 2, 60);

    // Two panels side by side
    const panelW = 200;
    const panelH = 260;
    const gap = 40;
    const startX = (CANVAS_W - panelW * 2 - gap) / 2;
    const panelY = 100;

    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];
      const px = startX + i * (panelW + gap);
      const selected = i === this.cursor;

      // Panel background
      ctx.fillStyle = selected ? 'rgba(241, 196, 15, 0.12)' : 'rgba(40, 40, 60, 0.8)';
      ctx.fillRect(px, panelY, panelW, panelH);

      // Panel border
      ctx.strokeStyle = selected ? 'rgba(241, 196, 15, 0.6)' : 'rgba(100, 100, 120, 0.4)';
      ctx.lineWidth = selected ? 2 : 1;
      ctx.strokeRect(px, panelY, panelW, panelH);

      // Selection arrow
      if (selected) {
        ctx.fillStyle = COLORS.COIN;
        ctx.font = 'bold 20px monospace';
        ctx.fillText('v', px + panelW / 2, panelY - 5);
      }

      // Sprite centered in panel
      if (choice.sprite) {
        const spriteX = px + (panelW - TILE) / 2;
        const spriteY = panelY + 25;
        Sprites.draw(ctx, choice.sprite, spriteX, spriteY);
      }

      // Weapon name
      ctx.fillStyle = COLORS.TEXT;
      ctx.font = 'bold 16px monospace';
      ctx.fillText(choice.name, px + panelW / 2, panelY + 90);

      // Stat
      ctx.fillStyle = '#f39c12';
      ctx.font = '14px monospace';
      ctx.fillText(choice.stat || '', px + panelW / 2, panelY + 115);

      // Description (word-wrapped)
      ctx.fillStyle = '#aaa';
      ctx.font = '12px monospace';
      const lines = this._wrapText(choice.desc, 22);
      for (let l = 0; l < lines.length; l++) {
        ctx.fillText(lines[l], px + panelW / 2, panelY + 145 + l * 16);
      }
    }

    // Instructions
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText('Left/Right: choose | Enter/Space: confirm', CANVAS_W / 2, CANVAS_H - 30);

    ctx.textAlign = 'left';
  },

  _wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
      if (current.length + word.length + 1 > maxChars) {
        lines.push(current);
        current = word;
      } else {
        current = current ? current + ' ' + word : word;
      }
    }
    if (current) lines.push(current);
    return lines;
  },
};
