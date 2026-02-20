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
    this.updateMovement(dt, this.speed);

    if (this.moving) return;

    // Calculate distance to player
    const dx = player.tileX - this.tileX;
    const dy = player.tileY - this.tileY;
    const dist = Math.abs(dx) + Math.abs(dy);

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
          if (!this._isOccupied(this.tileX + pdx, this.tileY + pdy, enemies)) {
            this.startMove(pdx, pdy);
          }
        }
        break;

      case AI.CHASE:
        this.aiTimer += dt;
        if (this.aiTimer >= 0.4) {
          this.aiTimer = 0;

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
            if (!DungeonMap.isWalkable(this.tileX + moveDx, this.tileY) ||
                this._isOccupied(this.tileX + moveDx, this.tileY, enemies)) {
              moveDx = 0;
              moveDy = dy > 0 ? 1 : (dy < 0 ? -1 : 0);
            }
          } else {
            moveDy = dy > 0 ? 1 : -1;
            if (!DungeonMap.isWalkable(this.tileX, this.tileY + moveDy) ||
                this._isOccupied(this.tileX, this.tileY + moveDy, enemies)) {
              moveDy = 0;
              moveDx = dx > 0 ? 1 : (dx < 0 ? -1 : 0);
            }
          }

          if ((moveDx !== 0 || moveDy !== 0) &&
              !this._isOccupied(this.tileX + moveDx, this.tileY + moveDy, enemies)) {
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

  _isOccupied(x, y, enemies) {
    for (const e of enemies) {
      if (e !== this && e.alive && e.tileX === x && e.tileY === y) return true;
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
      const drawX = this.px - camera.x + TILE * (1 - scale) / 2;
      const drawY = this.py - camera.y + TILE * (1 - scale) + offsetY;
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
  }

  _getSprite() {
    return this._getSprites()[this.facing];
  }

  _getSprites() {
    if (this.type === 'slime') return Sprites.slimeSprites;
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
};
