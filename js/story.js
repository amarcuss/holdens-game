const Story = {
  active: false,
  scene: null,
  pageIndex: 0,
  charIndex: 0,
  charTimer: 0,
  onDone: null,

  // Typewriter speed (characters per second)
  CHAR_SPEED: 29,
  // Blink rate for prompt
  BLINK_RATE: 2,

  play(sceneKey, onDone) {
    this.scene = STORY_SCENES[sceneKey];
    this.pageIndex = 0;
    this.charIndex = 0;
    this.charTimer = 0;
    this.active = true;
    this.onDone = onDone || null;
    this._blinkTimer = 0;
  },

  _currentPage() {
    return this.scene[this.pageIndex];
  },

  _totalChars() {
    const page = this._currentPage();
    let total = 0;
    for (const line of page) {
      total += line.length;
    }
    return total;
  },

  _pageComplete() {
    return this.charIndex >= this._totalChars();
  },

  update(dt) {
    if (!this.active) return;

    this._blinkTimer += dt;

    if (!this._pageComplete()) {
      // Typewriter: reveal characters
      this.charTimer += dt;
      const charsToAdd = Math.floor(this.charTimer * this.CHAR_SPEED);
      if (charsToAdd > 0) {
        this.charIndex += charsToAdd;
        this.charTimer -= charsToAdd / this.CHAR_SPEED;
        if (this.charIndex > this._totalChars()) {
          this.charIndex = this._totalChars();
        }
      }

      // Skip: instantly complete page
      if (Input.wasPressed('Enter') || Input.wasPressed('Space')) {
        this.charIndex = this._totalChars();
      }
    } else {
      // Page complete — advance or finish
      if (Input.wasPressed('Enter') || Input.wasPressed('Space')) {
        this.pageIndex++;
        if (this.pageIndex >= this.scene.length) {
          this.active = false;
          if (this.onDone) this.onDone();
        } else {
          this.charIndex = 0;
          this.charTimer = 0;
          this._blinkTimer = 0;
        }
      }
    }
  },

  draw(ctx) {
    if (!this.active) return;

    // Dark background
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const page = this._currentPage();
    const lineH = 28;
    const totalH = page.length * lineH;
    const startY = (CANVAS_H - totalH) / 2;

    ctx.textAlign = 'center';
    ctx.font = '16px monospace';

    // Draw revealed text
    let charsLeft = this.charIndex;
    for (let i = 0; i < page.length; i++) {
      const line = page[i];
      const y = startY + i * lineH;

      if (charsLeft <= 0) break;

      const visible = line.substring(0, charsLeft);
      charsLeft -= line.length;

      // Shadow
      ctx.fillStyle = '#000';
      ctx.fillText(visible, CANVAS_W / 2 + 1, y + 1);
      // Text
      ctx.fillStyle = COLORS.TEXT;
      ctx.fillText(visible, CANVAS_W / 2, y);
    }

    // Blinking prompt when page is complete
    if (this._pageComplete()) {
      if (Math.floor(this._blinkTimer * this.BLINK_RATE) % 2 === 0) {
        ctx.fillStyle = '#888';
        ctx.font = '12px monospace';
        ctx.fillText('Press Enter', CANVAS_W / 2, CANVAS_H - 50);
      }
    }

    // Page counter
    ctx.fillStyle = '#444';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText((this.pageIndex + 1) + ' / ' + this.scene.length, CANVAS_W - 20, CANVAS_H - 20);

    ctx.textAlign = 'left';
  },
};
