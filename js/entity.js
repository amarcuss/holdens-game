class Entity {
  constructor(tileX, tileY, maxHp) {
    // Grid position (in tiles)
    this.tileX = tileX;
    this.tileY = tileY;

    // Pixel position (for smooth movement)
    this.px = tileX * TILE;
    this.py = tileY * TILE;

    // Health
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.alive = true;

    // Direction facing
    this.facing = DIR.DOWN;

    // Movement state
    this.moving = false;
    this.moveProgress = 0;
    this.moveFromX = 0;
    this.moveFromY = 0;
    this.justArrived = false;
    this.arrivedX = tileX;
    this.arrivedY = tileY;

    // Animation
    this.animTimer = 0;
    this.animFrame = 0;
  }

  // Start moving toward a tile
  startMove(dx, dy) {
    const newX = this.tileX + dx;
    const newY = this.tileY + dy;

    if (!DungeonMap.isWalkable(newX, newY)) return false;

    this.moving = true;
    this.moveProgress = 0;
    this.moveFromX = this.tileX;
    this.moveFromY = this.tileY;
    this.tileX = newX;
    this.tileY = newY;

    // Set facing
    if (dx === 1) this.facing = DIR.RIGHT;
    else if (dx === -1) this.facing = DIR.LEFT;
    else if (dy === 1) this.facing = DIR.DOWN;
    else if (dy === -1) this.facing = DIR.UP;

    return true;
  }

  // Update smooth movement
  updateMovement(dt, speed) {
    this.justArrived = false;
    if (!this.moving) return;

    this.moveProgress += speed * dt;

    if (this.moveProgress >= 1) {
      this.moveProgress = 1;
      this.moving = false;
      this.justArrived = true;
      this.arrivedX = this.tileX;
      this.arrivedY = this.tileY;
    }

    // Lerp pixel position
    this.px = (this.moveFromX + (this.tileX - this.moveFromX) * this.moveProgress) * TILE;
    this.py = (this.moveFromY + (this.tileY - this.moveFromY) * this.moveProgress) * TILE;
  }

  // Snap to tile (no animation)
  snapToTile(x, y) {
    this.tileX = x;
    this.tileY = y;
    this.px = x * TILE;
    this.py = y * TILE;
    this.moving = false;
    this.moveProgress = 0;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }

  draw(ctx, camera, sprites) {
    const sprite = sprites[this.facing];
    const drawX = this.px - camera.x;
    const drawY = this.py - camera.y;

    // Simple bob animation while moving
    let offsetY = 0;
    if (this.moving) {
      offsetY = Math.sin(this.moveProgress * Math.PI) * -4;
    }

    Sprites.draw(ctx, sprite, drawX, drawY + offsetY);
  }
}
