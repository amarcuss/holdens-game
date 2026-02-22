class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = STATE.TITLE;

    // Transition state
    this.transitioning = false;
    this.transitionAlpha = 0;
    this.transitionPhase = 'none';
    this.pendingDoor = null;
    this.transitionSpeed = 3;

    // Screen shake
    this.shakeTimer = 0;
    this.shakeIntensity = 0;

    // Particles
    this.particles = [];

    // Init subsystems
    Input.init();
    Sprites.init();
    DungeonMap.init();

    this.camera = new Camera();
    this.player = null;
    this.enemies = [];
    this.coins = [];

    // Stats for game over screen
    this.totalCoins = 0;
    this.enemiesSlain = 0;

    // Track which rooms have been cleared of enemies
    this.clearedRooms = new Set();

    // Track which story scenes have been played
    this.playedScenes = new Set();

    // Title screen animation
    this.titleTimer = 0;

    // Dungeon select cursor
    this.dungeonCursor = 0;

    this.lastTime = 0;
  }

  startNewGame() {
    this.state = STATE.PLAYING;
    DungeonMap.currentRoom = 0;
    const startRoom = DungeonMap.getRoom();
    this.player = new Player(startRoom.playerStart.x, startRoom.playerStart.y);
    Inventory.reset();
    this.totalCoins = 0;
    this.enemiesSlain = 0;
    this.particles = [];
    this.clearedRooms = new Set();
    this.playedScenes = new Set();
    this.spawnRoom();
    Combat.clear();
    Projectiles.clear();
    Bestiary.init();
    Bestiary.reset();
  }

  startDungeon() {
    this.state = STATE.PLAYING;
    DungeonMap.currentRoom = 0;
    const startRoom = DungeonMap.getRoom();
    // Preserve coins and equipment — only reset dungeon state
    const savedCoins = this.player ? this.player.coins : 0;
    this.player = new Player(startRoom.playerStart.x, startRoom.playerStart.y);
    this.player.coins = savedCoins;
    this.totalCoins = 0;
    this.enemiesSlain = 0;
    this.particles = [];
    this.clearedRooms = new Set();
    this.playedScenes = new Set();
    this.spawnRoom();
    Combat.clear();
    Projectiles.clear();
  }

  spawnRoom() {
    this.enemies = [];
    this.coins = [];
    const room = DungeonMap.getRoom();
    // Don't respawn enemies in cleared rooms
    if (room.enemies && !this.clearedRooms.has(DungeonMap.currentRoom)) {
      for (const spawn of room.enemies) {
        this.enemies.push(new Enemy(spawn.x, spawn.y, spawn.type));
      }
    }
  }

  start() {
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    Input.update();
    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  // --- Screen shake ---
  shake(intensity, duration) {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  // --- Sparkle particles ---
  spawnSparkles(px, py, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 60;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.4 + Math.random() * 0.4,
        size: 2 + Math.random() * 3,
        color: color || COLORS.COIN,
      });
    }
  }

  // =================== UPDATE ===================

  update(dt) {
    this.titleTimer += dt;

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt; // gravity
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update screen shake
    this.shakeTimer = Math.max(0, this.shakeTimer - dt);

    if (this.state === STATE.TITLE) {
      if (Input.wasPressed('Enter')) {
        this.state = STATE.STORY;
        Story.play('intro', () => this.startNewGame());
      }
      return;
    }

    if (this.state === STATE.STORY) {
      Story.update(dt);
      return;
    }

    if (this.transitioning) {
      this.updateTransition(dt);
      return;
    }

    if (this.state === STATE.SHOP) {
      Shop.update(dt, this.player);
      Shop._playerCoins = this.player.coins;
      if (!Shop.open) {
        this.state = STATE.PLAYING;
      }
      return;
    }

    if (this.state === STATE.BESTIARY) {
      Bestiary.update(dt);
      if (!Bestiary.open) {
        this.state = STATE.PLAYING;
      }
      return;
    }

    if (this.state === STATE.PLAYING) {
      this.player.update(dt);

      // Player attack
      if (Input.wasPressed('Space') && this.player.attackCooldown <= 0 && !this.player.moving) {
        this.player.attackCooldown = PLAYER_ATTACK_COOLDOWN;
        Combat.playerAttack(this.player, this.enemies);
      }

      // Update enemies
      for (const enemy of this.enemies) {
        enemy.update(dt, this.player, this.enemies);
      }

      // Check for newly dead enemies -> drop coins
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        if (!enemy.alive && !enemy._droppedCoins) {
          enemy._droppedCoins = true;
          this.enemiesSlain++;
          Bestiary.recordKill(enemy.type);
          const config = Enemy.TYPES[enemy.type];
          const count = config.coinDrop.min +
            Math.floor(Math.random() * (config.coinDrop.max - config.coinDrop.min + 1));
          const coinX = enemy.tileX + Math.floor(enemy.tileW / 2);
          const coinY = enemy.tileY + Math.floor(enemy.tileH / 2);
          this.coins.push(new Coin(coinX, coinY, count));
        }
        if (enemy.isDead) {
          // Brute splits into two slimes on death
          if (enemy.type === 'brute') {
            const s1 = new Enemy(enemy.tileX, enemy.tileY, 'slime');
            const s2 = new Enemy(enemy.tileX + 1, enemy.tileY + 1, 'slime');
            s1.aiState = AI.CHASE;
            s1.idleTime = 0;
            s2.aiState = AI.CHASE;
            s2.idleTime = 0;
            this.enemies.push(s1, s2);
          }
          this.enemies.splice(i, 1);
        }
      }

      // Mark room as cleared when all enemies are dead
      if (this.enemies.length === 0 && !this.clearedRooms.has(DungeonMap.currentRoom)) {
        const room = DungeonMap.getRoom();
        if (room.enemies && room.enemies.length > 0) {
          this.clearedRooms.add(DungeonMap.currentRoom);

          // Victory: clearing the Throne Room (room 14) triggers the ending
          if (DungeonMap.currentRoom === 14) {
            this.state = STATE.STORY;
            Story.play('ending', () => {
              this.state = STATE.PLAYING;
              DungeonMap.currentRoom = 15;
              const cliffRoom = DungeonMap.getRoom();
              this.player.snapToTile(cliffRoom.playerStart.x, cliffRoom.playerStart.y);
              this.spawnRoom();
              Combat.clear();
              Projectiles.clear();
              this.camera.snapTo(this.player, cliffRoom.width, cliffRoom.height);
            });
            return;
          }
        }
      }

      // Update coins
      for (const coin of this.coins) {
        coin.update(dt);
      }

      // Coin pickup: check tile player just arrived at, or standing on
      const checkX = this.player.justArrived ? this.player.arrivedX : (!this.player.moving ? this.player.tileX : -1);
      const checkY = this.player.justArrived ? this.player.arrivedY : (!this.player.moving ? this.player.tileY : -1);
      if (checkX >= 0) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
          const coin = this.coins[i];
          if (coin.alive && coin.tileX === checkX && coin.tileY === checkY) {
            coin.alive = false;
            this.player.coins += coin.value;
            this.totalCoins += coin.value;
            // Sparkle effect
            this.spawnSparkles(
              coin.px + TILE / 2 - this.camera.x,
              coin.py + TILE / 2 - this.camera.y,
              8, COLORS.COIN
            );
            this.coins.splice(i, 1);
          }
        }
      }

      // Update combat effects
      Combat.update(dt);

      // Update projectiles
      Projectiles.update(dt, this.player);

      // Check player took damage (for screen shake)
      if (this.player.hurtTimer > 0.28) {
        this.shake(4, 0.2);
      }

      // Check player death
      if (!this.player.alive) {
        this.state = STATE.GAME_OVER;
        this.shake(6, 0.4);
        Combat.clear();
        return;
      }

      // Bestiary icon glow timer
      Bestiary.updateIcon(dt);

      // Open bestiary
      if (Input.wasPressed('KeyB')) {
        this.state = STATE.BESTIARY;
        Bestiary.show();
      }

      // DEBUG: press V to trigger victory
      if (Input.wasPressed('KeyV')) {
        this.state = STATE.STORY;
        Story.play('ending', () => {
          this.state = STATE.PLAYING;
          DungeonMap.currentRoom = 15;
          const cliffRoom = DungeonMap.getRoom();
          this.player.snapToTile(cliffRoom.playerStart.x, cliffRoom.playerStart.y);
          this.spawnRoom();
          Combat.clear();
          Projectiles.clear();
          this.camera.snapTo(this.player, cliffRoom.width, cliffRoom.height);
        });
        return;
      }

      // Shopkeeper interaction
      this._checkShopkeeper();

      // Check for door transitions
      const door = this.player.checkDoor();
      if (door) {
        if (door.targetRoom === -1) {
          // House door — open dungeon select
          this.state = STATE.DUNGEON_SELECT;
          this.dungeonCursor = 0;
        } else {
          this.startTransition(door);
        }
      }

      // Camera follows player
      const room = DungeonMap.getRoom();
      this.camera.follow(this.player, room.width, room.height, dt);
    }

    if (this.state === STATE.GAME_OVER) {
      if (Input.wasPressed('Enter')) {
        this.startNewGame();
      }
    }

    if (this.state === STATE.DUNGEON_SELECT) {
      if (Input.wasPressed('ArrowUp')) {
        this.dungeonCursor = Math.max(0, this.dungeonCursor - 1);
      }
      if (Input.wasPressed('ArrowDown')) {
        this.dungeonCursor = Math.min(DUNGEONS.length - 1, this.dungeonCursor + 1);
      }
      if (Input.wasPressed('Enter')) {
        this.state = STATE.STORY;
        Story.play('intro', () => this.startDungeon());
      }
    }
  }

  _checkShopkeeper() {
    const room = DungeonMap.getRoom();
    if (!room.shopkeeper) return;

    const sk = room.shopkeeper;
    const dx = Math.abs(this.player.tileX - sk.x);
    const dy = Math.abs(this.player.tileY - sk.y);

    if (dx + dy <= 1 && !this.player.moving) {
      this._shopPromptVisible = true;
      if (Input.wasPressed('Enter')) {
        this.state = STATE.SHOP;
        Shop.show();
      }
    } else {
      this._shopPromptVisible = false;
    }
  }

  startTransition(door) {
    this.transitioning = true;
    this.transitionPhase = 'fadeOut';
    this.transitionAlpha = 0;
    this.pendingDoor = door;
  }

  updateTransition(dt) {
    if (this.transitionPhase === 'fadeOut') {
      this.transitionAlpha += this.transitionSpeed * dt;
      if (this.transitionAlpha >= 1) {
        this.transitionAlpha = 1;
        DungeonMap.currentRoom = this.pendingDoor.targetRoom;
        this.player.snapToTile(this.pendingDoor.targetX, this.pendingDoor.targetY);
        this.spawnRoom();
        Combat.clear();
        Projectiles.clear();

        const room = DungeonMap.getRoom();
        this.camera.snapTo(this.player, room.width, room.height);
        this.transitionPhase = 'fadeIn';
      }
    } else if (this.transitionPhase === 'fadeIn') {
      this.transitionAlpha -= this.transitionSpeed * dt;
      if (this.transitionAlpha <= 0) {
        this.transitionAlpha = 0;
        this.transitioning = false;
        this.transitionPhase = 'none';
        this.pendingDoor = null;

        // Trigger story scene on first visit to a room
        const sceneKey = ROOM_STORIES[DungeonMap.currentRoom];
        if (sceneKey && !this.playedScenes.has(sceneKey)) {
          this.playedScenes.add(sceneKey);
          this.state = STATE.STORY;
          Story.play(sceneKey, () => { this.state = STATE.PLAYING; });
        }
      }
    }
  }

  // =================== DRAW ===================

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (this.state === STATE.TITLE) {
      this.drawTitle(ctx);
      return;
    }

    if (this.state === STATE.STORY) {
      Story.draw(ctx);
      return;
    }

    if (this.state === STATE.DUNGEON_SELECT) {
      this.drawDungeonSelect(ctx);
      return;
    }

    // Apply screen shake
    ctx.save();
    if (this.shakeTimer > 0) {
      const sx = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      ctx.translate(sx, sy);
    }

    if (this.state === STATE.PLAYING || this.state === STATE.SHOP ||
        this.state === STATE.GAME_OVER || this.state === STATE.BESTIARY || this.transitioning) {
      // Draw room
      DungeonMap.drawRoom(ctx, this.camera);

      if (this.transitionAlpha < 1) {
        // Draw coins on the ground
        for (const coin of this.coins) {
          coin.draw(ctx, this.camera);
        }

        // Draw shopkeeper
        this._drawShopkeeper(ctx);

        // Collect all entities, sort by Y for proper overlap
        const entities = [];

        if (this.player && (this.player.alive || this.state !== STATE.GAME_OVER)) {
          entities.push({ y: this.player.py, draw: () => this.player.draw(ctx, this.camera) });
        }

        for (const enemy of this.enemies) {
          entities.push({ y: enemy.py + (enemy.tileH - 1) * TILE, draw: () => enemy.draw(ctx, this.camera) });
        }

        entities.sort((a, b) => a.y - b.y);
        for (const e of entities) {
          e.draw();
        }

        // Draw combat effects on top
        Combat.draw(ctx, this.camera);

        // Draw projectiles
        Projectiles.draw(ctx, this.camera);

        // Shop prompt
        if (this._shopPromptVisible && this.state === STATE.PLAYING) {
          this._drawShopPrompt(ctx);
        }
      }

      // Draw room name
      this.drawRoomName(ctx);

      // Draw HUD
      if (this.state !== STATE.GAME_OVER && this.player) {
        HUD.draw(ctx, this.player);
      }

      // Transition overlay
      if (this.transitioning) {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }
    }

    ctx.restore(); // end screen shake

    // Draw particles (in screen space, not affected by shake)
    this.drawParticles(ctx);

    // Overlays on top of everything
    if (this.state === STATE.SHOP) {
      Shop.draw(ctx);
    }

    if (this.state === STATE.BESTIARY) {
      Bestiary.draw(ctx);
    }

    if (this.state === STATE.GAME_OVER) {
      this.drawGameOver(ctx);
    }
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  drawTitle(ctx) {
    // Animated background
    const t = this.titleTimer;

    // Dark dungeon background
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Floating dungeon bricks in background
    ctx.fillStyle = '#1a1a30';
    for (let i = 0; i < 12; i++) {
      const bx = ((i * 73 + t * 10) % (CANVAS_W + 64)) - 32;
      const by = 80 + Math.sin(t * 0.5 + i * 1.3) * 20 + i * 30;
      ctx.fillRect(bx, by, 48, 24);
    }

    // Title
    ctx.textAlign = 'center';

    // Title shadow
    ctx.fillStyle = '#000';
    ctx.font = 'bold 40px monospace';
    ctx.fillText("HOLDEN'S DUNGEON", CANVAS_W / 2 + 2, 162);

    // Title text
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 40px monospace';
    ctx.fillText("HOLDEN'S DUNGEON", CANVAS_W / 2, 160);

    // Subtitle
    ctx.fillStyle = '#888';
    ctx.font = '14px monospace';
    ctx.fillText('A Dungeon Crawler Adventure', CANVAS_W / 2, 195);

    // Blinking "Press Enter"
    if (Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = COLORS.TEXT;
      ctx.font = '18px monospace';
      ctx.fillText('Press Enter to Start', CANVAS_W / 2, 300);
    }

    // Controls info
    ctx.fillStyle = '#555';
    ctx.font = '12px monospace';
    ctx.fillText('Arrows: Move | Space: Attack | Enter: Interact | B: Bestiary', CANVAS_W / 2, 420);

    ctx.textAlign = 'left';
  }

  _drawShopkeeper(ctx) {
    const room = DungeonMap.getRoom();
    if (!room.shopkeeper) return;

    const sk = room.shopkeeper;
    const px = sk.x * TILE - this.camera.x;
    const py = sk.y * TILE - this.camera.y;
    Sprites.draw(ctx, Sprites.shopkeeper, px, py);
  }

  _drawShopPrompt(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    const pw = 160;
    const ph = 24;
    const px = CANVAS_W / 2 - pw / 2;
    const py = CANVAS_H - 80;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = COLORS.COIN;
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, pw, ph);
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '12px monospace';
    ctx.fillText('Press Enter to shop', CANVAS_W / 2, py + 16);
    ctx.restore();
  }

  drawDungeonSelect(ctx) {
    // Dark dungeon background — same style as title screen
    const t = this.titleTimer;

    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Floating dungeon bricks in background (same as title)
    ctx.fillStyle = '#1a1a30';
    for (let i = 0; i < 12; i++) {
      const bx = ((i * 73 + t * 10) % (CANVAS_W + 64)) - 32;
      const by = 80 + Math.sin(t * 0.5 + i * 1.3) * 20 + i * 30;
      ctx.fillRect(bx, by, 48, 24);
    }

    // Overlay to darken bricks behind panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Title
    ctx.textAlign = 'center';

    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('SELECT DUNGEON', CANVAS_W / 2 + 2, 52);
    ctx.fillStyle = COLORS.COIN;
    ctx.font = 'bold 24px monospace';
    ctx.fillText('SELECT DUNGEON', CANVAS_W / 2, 50);

    // Coins
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '14px monospace';
    ctx.fillText('Your coins: ' + (this.player ? this.player.coins : 0), CANVAS_W / 2, 75);

    // Dungeon list — shop style
    const startY = 130;
    const lineH = 36;
    ctx.textAlign = 'left';

    for (let i = 0; i < DUNGEONS.length; i++) {
      const d = DUNGEONS[i];
      const y = startY + i * lineH;
      const selected = i === this.dungeonCursor;

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

      // Dungeon name
      ctx.fillStyle = COLORS.TEXT;
      ctx.font = '14px monospace';
      ctx.fillText(d.name, 150, y);

      // Description
      ctx.fillStyle = '#aaa';
      ctx.fillText(d.desc, 310, y);
    }

    // Instructions
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText('Arrow keys: navigate | Enter: select dungeon', CANVAS_W / 2, CANVAS_H - 30);

    ctx.textAlign = 'left';
  }

  drawRoomName(ctx) {
    const room = DungeonMap.getRoom();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, CANVAS_W, 24);
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(room.name, CANVAS_W / 2, 16);
    ctx.textAlign = 'left';
  }

  drawGameOver(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 38px monospace';
    ctx.fillText('GAME OVER', CANVAS_W / 2 + 2, CANVAS_H / 2 - 48);
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 38px monospace';
    ctx.fillText('GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 50);

    // Stats
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '14px monospace';
    ctx.fillText('Coins collected: ' + this.totalCoins, CANVAS_W / 2, CANVAS_H / 2);
    ctx.fillText('Enemies slain: ' + this.enemiesSlain, CANVAS_W / 2, CANVAS_H / 2 + 22);

    // Restart prompt
    if (Math.floor(this.titleTimer * 2) % 2 === 0) {
      ctx.fillStyle = '#aaa';
      ctx.font = '16px monospace';
      ctx.fillText('Press Enter to Restart', CANVAS_W / 2, CANVAS_H / 2 + 60);
    }

    ctx.textAlign = 'left';
  }
}
