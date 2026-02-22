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

    // Multi-tile size (default 1x1)
    this.tileW = 1;
    this.tileH = 1;

    // Animation
    this.animTimer = 0;
    this.animFrame = 0;
  }

  // Check if this entity occupies a given tile
  occupiesTile(x, y) {
    return x >= this.tileX && x < this.tileX + this.tileW &&
           y >= this.tileY && y < this.tileY + this.tileH;
  }

  // Minimum Manhattan distance from any occupied tile to target
  distanceTo(tx, ty) {
    const cx = Math.max(this.tileX, Math.min(tx, this.tileX + this.tileW - 1));
    const cy = Math.max(this.tileY, Math.min(ty, this.tileY + this.tileH - 1));
    return Math.abs(tx - cx) + Math.abs(ty - cy);
  }

  // Start moving toward a tile
  startMove(dx, dy) {
    const newX = this.tileX + dx;
    const newY = this.tileY + dy;

    // Check walkability for all tiles in footprint
    for (let oy = 0; oy < this.tileH; oy++) {
      for (let ox = 0; ox < this.tileW; ox++) {
        if (!DungeonMap.isWalkable(newX + ox, newY + oy)) return false;
      }
    }

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
