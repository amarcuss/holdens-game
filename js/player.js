class Player extends Entity {
  constructor(tileX, tileY) {
    super(tileX, tileY, PLAYER_MAX_HP);

    this.coins = 0;
    this.attack = PLAYER_BASE_ATK;
    this.defense = PLAYER_BASE_DEF;

    // Movement buffering: queue direction input during movement
    this.queuedDir = null;

    // Combat
    this.attackCooldown = 0;
    this.rangedCooldown = 0;
    this.hurtTimer = 0;

    // Freeze effect
    this.freezeTimer = 0;
  }

  update(dt) {
    const speed = this.freezeTimer > 0 ? PLAYER_SPEED * 0.4 : PLAYER_SPEED;
    this.updateMovement(dt, speed);
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.rangedCooldown = Math.max(0, this.rangedCooldown - dt);
    this.hurtTimer = Math.max(0, this.hurtTimer - dt);
    this.freezeTimer = Math.max(0, this.freezeTimer - dt);

    // Handle input: hold key to keep moving tile by tile
    if (!this.moving) {
      if (Input.isDown('ArrowUp')) {
        this.facing = DIR.UP;
        this.startMove(0, -1);
      } else if (Input.isDown('ArrowDown')) {
        this.facing = DIR.DOWN;
        this.startMove(0, 1);
      } else if (Input.isDown('ArrowLeft')) {
        this.facing = DIR.LEFT;
        this.startMove(-1, 0);
      } else if (Input.isDown('ArrowRight')) {
        this.facing = DIR.RIGHT;
        this.startMove(1, 0);
      }
    }
  }

  draw(ctx, camera) {
    // Hurt blink
    if (this.hurtTimer > 0 && Math.floor(this.hurtTimer * 20) % 2 === 0) {
      return;
    }
    super.draw(ctx, camera, Sprites.playerSprites);

    // Blue tint overlay when frozen
    if (this.freezeTimer > 0) {
      const ox = this.px - camera.x;
      const oy = this.py - camera.y;
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#6ac8e8';
      ctx.fillRect(ox, oy, TILE, TILE);
      ctx.restore();
    }
  }

  // Check if player is standing on a door
  checkDoor() {
    if (this.moving) return null;
    return DungeonMap.getDoorAt(this.tileX, this.tileY);
  }
}
