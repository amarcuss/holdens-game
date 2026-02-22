const Projectiles = {
  arrows: [],

  shoot(fromTileX, fromTileY, direction, damage, speed) {
    this.arrows.push({
      x: fromTileX * TILE + TILE / 2,
      y: fromTileY * TILE + TILE / 2,
      dir: direction,
      dx: DIR_DX[direction] * speed,
      dy: DIR_DY[direction] * speed,
      damage: damage,
      alive: true,
    });
  },

  update(dt, player) {
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const a = this.arrows[i];
      a.x += a.dx * dt;
      a.y += a.dy * dt;

      // Check wall collision
      const tileX = Math.floor(a.x / TILE);
      const tileY = Math.floor(a.y / TILE);
      if (!DungeonMap.isWalkable(tileX, tileY)) {
        this.arrows.splice(i, 1);
        continue;
      }

      // Check player hit (same tile + not invincible)
      if (player.alive && player.hurtTimer <= 0 &&
          player.tileX === tileX && player.tileY === tileY) {
        const damage = Math.max(1, a.damage - player.defense);
        player.takeDamage(damage);
        player.hurtTimer = 0.5;
        Combat.addDamageNumber(player.tileX, player.tileY, damage, '#e74c3c');
        this.arrows.splice(i, 1);
      }
    }
  },

  draw(ctx, camera) {
    for (const a of this.arrows) {
      const sx = a.x - camera.x;
      const sy = a.y - camera.y;

      ctx.save();
      ctx.translate(sx, sy);

      // Rotate based on direction: UP=0, DOWN=1, LEFT=2, RIGHT=3
      const angles = [-Math.PI / 2, Math.PI / 2, Math.PI, 0];
      ctx.rotate(angles[a.dir]);

      // Arrow shaft
      ctx.fillStyle = COLORS.ARCHER_BOW;
      ctx.fillRect(-10, -1, 20, 2);

      // Arrowhead
      ctx.fillStyle = '#ccc';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(8, -3);
      ctx.lineTo(8, 3);
      ctx.closePath();
      ctx.fill();

      // Fletching
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-7, -3);
      ctx.lineTo(-7, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-7, 3);
      ctx.lineTo(-7, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  },

  clear() {
    this.arrows = [];
  },
};
