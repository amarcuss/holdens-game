// Enemy AI states
const AI = {
  IDLE: 'IDLE',
  PATROL: 'PATROL',
  CHASE: 'CHASE',
};

class Enemy extends Entity {
  constructor(tileX, tileY, type) {
    const config = Enemy.TYPES[type];
    super(tileX, tileY, config.hp);

    this.type = type;
    this.tileW = config.tileW || 1;
    this.tileH = config.tileH || 1;
    this.speed = config.speed;
    this.chaseRange = config.chaseRange;
    this.attackDamage = config.damage;
    this.xpValue = config.xp;

    // AI state
    this.aiState = AI.IDLE;
    this.aiTimer = 0;
    this.patrolDir = DIR.DOWN;

    // Idle pause before first action
    this.idleTime = 1 + Math.random() * 2;

    // Attack cooldown
    this.attackCooldown = 0;
    this.attackRate = config.attackRate;

    // Hurt flash
    this.hurtTimer = 0;

    // Status effects
    this.freezeTimer = 0;
    this.burnTimer = 0;
    this.burnDamage = 0;
    this.burnTickTimer = 0;

    // Death animation
    this.deathTimer = 0;
    this.deathDuration = 0.4;
  }

  update(dt, player, enemies) {
    // Death animation
    if (!this.alive) {
      this.deathTimer += dt;
      return;
    }

    this.hurtTimer = Math.max(0, this.hurtTimer - dt);
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);

    // Burn DOT
    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      this.burnTickTimer += dt;
      if (this.burnTickTimer >= 1.0) {
        this.burnTickTimer -= 1.0;
        this.takeDamage(this.burnDamage);
        Combat.addDamageNumber(this.tileX, this.tileY, this.burnDamage, '#e67e22');
      }
      if (this.burnTimer <= 0) {
        this.burnTimer = 0;
        this.burnDamage = 0;
        this.burnTickTimer = 0;
      }
    }

    // Freeze: skip AI while frozen
    if (this.freezeTimer > 0) {
      this.freezeTimer -= dt;
      this.updateMovement(dt, this.speed);
      return;
    }

    this.updateMovement(dt, this.speed);

    if (this.moving) return;

    // Calculate distance to player (uses nearest tile for multi-tile entities)
    const dist = this.distanceTo(player.tileX, player.tileY);
    // Direction from center of this entity to player (for movement decisions)
    const centerX = this.tileX + (this.tileW - 1) / 2;
    const centerY = this.tileY + (this.tileH - 1) / 2;
    const dx = player.tileX - centerX;
    const dy = player.tileY - centerY;

    // State transitions
    if (dist <= this.chaseRange && player.alive) {
      this.aiState = AI.CHASE;
    } else if (this.aiState === AI.CHASE) {
      this.aiState = AI.PATROL;
      this.aiTimer = 0;
    }

    switch (this.aiState) {
      case AI.IDLE:
        this.idleTime -= dt;
        if (this.idleTime <= 0) {
          this.aiState = AI.PATROL;
          this.aiTimer = 0;
        }
        break;

      case AI.PATROL:
        this.aiTimer += dt;
        if (this.aiTimer >= 1.5) {
          this.aiTimer = 0;
          // Pick a random direction
          this.patrolDir = Math.floor(Math.random() * 4);
          const pdx = DIR_DX[this.patrolDir];
          const pdy = DIR_DY[this.patrolDir];
          if (!this._isDestinationBlocked(this.tileX + pdx, this.tileY + pdy, enemies)) {
            this.startMove(pdx, pdy);
          }
        }
        break;

      case AI.CHASE:
        this.aiTimer += dt;
        if (this.aiTimer >= 0.4) {
          this.aiTimer = 0;

          // Archer: ranged AI
          if (this.type === 'archer') {
            this._archerChase(dx, dy, dist, player, enemies);
            return;
          }

          // Adjacent to player? Attack instead of move
          if (dist === 1) {
            this._facePlayer(dx, dy);
            if (this.attackCooldown <= 0) {
              this.attackCooldown = this.attackRate;
              Combat.enemyAttack(this, player);
            }
            return;
          }

          // Greedy pathfinding: move on the axis with the largest gap
          let moveDx = 0, moveDy = 0;
          if (Math.abs(dx) >= Math.abs(dy)) {
            moveDx = dx > 0 ? 1 : -1;
            // If blocked, try the other axis
            if (this._isDestinationBlocked(this.tileX + moveDx, this.tileY, enemies)) {
              moveDx = 0;
              moveDy = dy > 0 ? 1 : (dy < 0 ? -1 : 0);
            }
          } else {
            moveDy = dy > 0 ? 1 : -1;
            if (this._isDestinationBlocked(this.tileX, this.tileY + moveDy, enemies)) {
              moveDy = 0;
              moveDx = dx > 0 ? 1 : (dx < 0 ? -1 : 0);
            }
          }

          if ((moveDx !== 0 || moveDy !== 0) &&
              !this._isDestinationBlocked(this.tileX + moveDx, this.tileY + moveDy, enemies)) {
            this.startMove(moveDx, moveDy);
          }
        }
        break;
    }
  }

  _facePlayer(dx, dy) {
    if (Math.abs(dx) >= Math.abs(dy)) {
      this.facing = dx > 0 ? DIR.RIGHT : DIR.LEFT;
    } else {
      this.facing = dy > 0 ? DIR.DOWN : DIR.UP;
    }
  }

  _archerChase(dx, dy, dist, player, enemies) {
    const config = Enemy.TYPES.archer;

    // Always prioritize shooting if we have LOS and cooldown is ready
    const losDir = this._getLineOfSight(player);
    if (losDir !== null && this.attackCooldown <= 0) {
      this.facing = losDir;
      this.attackCooldown = this.attackRate;
      Projectiles.shoot(this.tileX, this.tileY, losDir, this.attackDamage, config.projectileSpeed);
      return;
    }

    // Only retreat when player is directly adjacent
    if (dist <= 1) {
      this._moveAwayFrom(dx, dy, enemies);
      return;
    }

    // Too far — move closer
    if (dist > config.preferredRange) {
      this._moveToward(dx, dy, enemies);
      return;
    }

    // At good range but no LOS — strafe to find a shot
    if (losDir === null) {
      this._strafeForLineOfSight(dx, dy, player, enemies);
    }
  }

  // Returns direction constant if player is on same row/col with clear tiles between, else null
  _getLineOfSight(player) {
    const dx = player.tileX - this.tileX;
    const dy = player.tileY - this.tileY;

    if (dx === 0 && dy !== 0) {
      const dir = dy > 0 ? DIR.DOWN : DIR.UP;
      const step = dy > 0 ? 1 : -1;
      for (let y = this.tileY + step; y !== player.tileY; y += step) {
        if (!DungeonMap.isWalkable(this.tileX, y)) return null;
      }
      return dir;
    }
    if (dy === 0 && dx !== 0) {
      const dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
      const step = dx > 0 ? 1 : -1;
      for (let x = this.tileX + step; x !== player.tileX; x += step) {
        if (!DungeonMap.isWalkable(x, this.tileY)) return null;
      }
      return dir;
    }
    return null;
  }

  _moveAwayFrom(dx, dy, enemies) {
    // Move in the opposite direction of the player
    const tryDirs = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
      tryDirs.push({ mx: dx > 0 ? -1 : 1, my: 0 });
      tryDirs.push({ mx: 0, my: dy > 0 ? -1 : 1 });
    } else {
      tryDirs.push({ mx: 0, my: dy > 0 ? -1 : 1 });
      tryDirs.push({ mx: dx > 0 ? -1 : 1, my: 0 });
    }
    for (const d of tryDirs) {
      if (!this._isDestinationBlocked(this.tileX + d.mx, this.tileY + d.my, enemies)) {
        this.startMove(d.mx, d.my);
        return;
      }
    }
  }

  _moveToward(dx, dy, enemies) {
    let moveDx = 0, moveDy = 0;
    if (Math.abs(dx) >= Math.abs(dy)) {
      moveDx = dx > 0 ? 1 : -1;
      if (this._isDestinationBlocked(this.tileX + moveDx, this.tileY, enemies)) {
        moveDx = 0;
        moveDy = dy > 0 ? 1 : (dy < 0 ? -1 : 0);
      }
    } else {
      moveDy = dy > 0 ? 1 : -1;
      if (this._isDestinationBlocked(this.tileX, this.tileY + moveDy, enemies)) {
        moveDy = 0;
        moveDx = dx > 0 ? 1 : (dx < 0 ? -1 : 0);
      }
    }
    if ((moveDx !== 0 || moveDy !== 0) &&
        !this._isDestinationBlocked(this.tileX + moveDx, this.tileY + moveDy, enemies)) {
      this.startMove(moveDx, moveDy);
    }
  }

  _strafeForLineOfSight(dx, dy, player, enemies) {
    // Move perpendicular to the player direction to find LOS
    const perpDirs = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
      // Player is mostly horizontal — strafe vertically
      perpDirs.push({ mx: 0, my: -1 });
      perpDirs.push({ mx: 0, my: 1 });
    } else {
      // Player is mostly vertical — strafe horizontally
      perpDirs.push({ mx: -1, my: 0 });
      perpDirs.push({ mx: 1, my: 0 });
    }
    // Shuffle to avoid always going same direction
    if (Math.random() < 0.5) perpDirs.reverse();
    for (const d of perpDirs) {
      if (!this._isDestinationBlocked(this.tileX + d.mx, this.tileY + d.my, enemies)) {
        this.startMove(d.mx, d.my);
        return;
      }
    }
  }

  _isOccupied(x, y, enemies) {
    for (const e of enemies) {
      if (e !== this && e.alive && e.occupiesTile(x, y)) return true;
    }
    return false;
  }

  // Check if moving to newX, newY would be blocked by walls or other enemies
  _isDestinationBlocked(newX, newY, enemies) {
    for (let oy = 0; oy < this.tileH; oy++) {
      for (let ox = 0; ox < this.tileW; ox++) {
        if (!DungeonMap.isWalkable(newX + ox, newY + oy)) return true;
        if (this._isOccupied(newX + ox, newY + oy, enemies)) return true;
      }
    }
    return false;
  }

  draw(ctx, camera) {
    if (!this.alive) {
      // Death animation: pop up then shrink and fade
      const t = this.deathTimer / this.deathDuration;
      if (t >= 1) return;
      ctx.save();
      let scale, alpha, offsetY;
      if (t < 0.2) {
        // Pop phase: scale up and jump
        const pt = t / 0.2;
        scale = 1 + pt * 0.15;
        alpha = 1;
        offsetY = -pt * 6;
      } else {
        // Shrink phase: shrink down and fade
        const st = (t - 0.2) / 0.8;
        scale = 1.15 - st * 0.65;
        alpha = 1 - st;
        offsetY = -6 + st * 6;
      }
      ctx.globalAlpha = alpha;
      const fullW = TILE * this.tileW;
      const fullH = TILE * this.tileH;
      const drawX = this.px - camera.x + fullW * (1 - scale) / 2;
      const drawY = this.py - camera.y + fullH * (1 - scale) + offsetY;
      ctx.translate(drawX, drawY);
      ctx.scale(scale, scale);
      Sprites.draw(ctx, this._getSprite(), 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
      return;
    }

    // Hurt flash
    if (this.hurtTimer > 0 && Math.floor(this.hurtTimer * 20) % 2 === 0) {
      return; // blink
    }

    super.draw(ctx, camera, this._getSprites());

    // Status effect tint overlay
    if (this.freezeTimer > 0 || this.burnTimer > 0) {
      const ox = this.px - camera.x;
      const oy = this.py - camera.y;
      const w = this.tileW * TILE;
      const h = this.tileH * TILE;
      ctx.save();
      ctx.globalAlpha = 0.3;
      if (this.freezeTimer > 0) {
        ctx.fillStyle = '#6ac8e8';
      } else {
        ctx.fillStyle = '#e67e22';
      }
      ctx.fillRect(ox, oy, w, h);
      ctx.restore();
    }
  }

  _getSprite() {
    return this._getSprites()[this.facing];
  }

  _getSprites() {
    if (this.type === 'slime') return Sprites.slimeSprites;
    if (this.type === 'archer') return Sprites.archerSprites;
    if (this.type === 'brute') return Sprites.bruteSprites;
    if (this.type === 'frost_sprite') return Sprites.frostSpriteSprites;
    return Sprites.skeletonSprites;
  }

  get isDead() {
    return !this.alive && this.deathTimer >= this.deathDuration;
  }
}

// Enemy type definitions
Enemy.TYPES = {
  slime: {
    hp: 2,
    speed: 2,
    chaseRange: 4,
    damage: 1,
    attackRate: 1.2,
    xp: 1,
    coinDrop: { min: 1, max: 3 },
  },
  skeleton: {
    hp: 4,
    speed: 2.5,
    chaseRange: 6,
    damage: 2,
    attackRate: 0.8,
    xp: 2,
    coinDrop: { min: 2, max: 5 },
  },
  archer: {
    hp: 3,
    speed: 2,
    chaseRange: 7,
    damage: 1,
    attackRate: 2.0,
    xp: 3,
    coinDrop: { min: 2, max: 4 },
    preferredRange: 4,
    projectileSpeed: 200,
  },
  brute: {
    hp: 10,
    speed: 1.2,
    chaseRange: 5,
    damage: 3,
    attackRate: 1.5,
    xp: 5,
    coinDrop: { min: 4, max: 8 },
    tileW: 2,
    tileH: 2,
  },
  frost_sprite: {
    hp: 5,
    speed: 3,
    chaseRange: 6,
    damage: 2,
    attackRate: 1.0,
    xp: 4,
    coinDrop: { min: 3, max: 6 },
  },
};
