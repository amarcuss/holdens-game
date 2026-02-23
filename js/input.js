const Input = {
  keys: {},
  justPressed: {},
  _previousKeys: {},

  init() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'Escape', 'KeyB', 'KeyX', 'KeyM'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.repeat) return; // ignore OS key repeat
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  },

  update() {
    // A key is "just pressed" if it's down now but wasn't last frame
    for (const key in this.keys) {
      this.justPressed[key] = this.keys[key] && !this._previousKeys[key];
    }
    // Snapshot current state
    this._previousKeys = { ...this.keys };
  },

  isDown(code) {
    return !!this.keys[code];
  },

  wasPressed(code) {
    return !!this.justPressed[code];
  },
};
