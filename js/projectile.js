const Projectiles = {
  arrows: [],

  shoot(fromTileX, fromTileY, direction, damage, speed, opts) {
    this.arrows.push({
      x: fromTileX * TILE + TILE / 2,
      y: fromTileY * TILE + TILE / 2,
      dir: direction,
      dx: DIR_DX[direction] * speed,
      dy: DIR_DY[direction] * speed,
      damage: damage,
      alive: true,
      source: 'enemy',
      color: opts && opts.color || null,
      effect: opts && opts.effect || null,
      type: opts && opts.type || null,
    });
  },

  shootPlayer(fromTileX, fromTileY, direction, config) {
    this.arrows.push({
      x: fromTileX * TILE + TILE / 2,
      y: fromTileY * TILE + TILE / 2,
      dir: direction,
      dx: DIR_DX[direction] * config.speed,
      dy: DIR_DY[direction] * config.speed,
      damage: config.damage,
      alive: true,
      source: 'player',
      color: config.color,
      effect: config.effect || null,
      pierce: config.effect === 'pierce',
      type: config.type,  // 'staff' or 'bow'
      maxRange: (config.range || 7) * TILE,
      distTraveled: 0,
    });
  },

  update(dt, player, enemies) {
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const a = this.arrows[i];
      const moveX = a.dx * dt;
      const moveY = a.dy * dt;
      a.x += moveX;
      a.y += moveY;

      // Track distance for range limit on player projectiles
      if (a.source === 'player') {
        a.distTraveled = (a.distTraveled || 0) + Math.abs(moveX) + Math.abs(moveY);
        if (a.distTraveled >= a.maxRange) {
          this.arrows.splice(i, 1);
          continue;
        }
      }

      // Check wall collision
      const tileX = Math.floor(a.x / TILE);
      const tileY = Math.floor(a.y / TILE);
      if (!DungeonMap.isWalkable(tileX, tileY)) {
        this.arrows.splice(i, 1);
        continue;
      }

      if (a.source === 'enemy') {
        // Check player hit (same tile + not invincible)
        if (player.alive && player.hurtTimer <= 0 &&
            player.tileX === tileX && player.tileY === tileY) {
          const damage = Math.max(1, a.damage - player.defense);
          player.takeDamage(damage);
          player.hurtTimer = 0.5;
          Combat.addDamageNumber(player.tileX, player.tileY, damage, '#e74c3c');
          // Apply freeze effect to player
          if (a.effect === 'freeze') {
            player.freezeTimer = 1.5;
          }
          this.arrows.splice(i, 1);
        }
      } else if (a.source === 'player' && enemies) {
        // Check enemy hits
        let hitAny = false;
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          if (enemy.occupiesTile(tileX, tileY)) {
            const damage = Math.max(1, a.damage);
            enemy.takeDamage(damage);
            enemy.hurtTimer = 0.3;
            Combat.addDamageNumber(
              tileX, tileY, damage, '#fff'
            );
            Combat.addHitSparks(tileX, tileY);

            // Apply status effects
            if (a.effect === 'freeze') {
              enemy.freezeTimer = 2.0;
            } else if (a.effect === 'burn') {
              enemy.burnTimer = 3.0;
              enemy.burnDamage = 1;
            }

            if (!a.pierce) {
              hitAny = true;
              break;
            }
          }
        }
        if (hitAny) {
          this.arrows.splice(i, 1);
        }
      }
    }
  },

  draw(ctx, camera) {
    for (const a of this.arrows) {
      const sx = a.x - camera.x;
      const sy = a.y - camera.y;

      if (a.type === 'staff') {
        // Magic bolt: glowing circle (player or enemy cryomancer)
        this._drawMagicBolt(ctx, sx, sy, a);
      } else {
        // Arrow (enemy or player bow)
        this._drawArrow(ctx, sx, sy, a);
      }
    }
  },

  _drawArrow(ctx, sx, sy, a) {
    ctx.save();
    ctx.translate(sx, sy);

    // Rotate based on direction
    const angles = [-Math.PI / 2, Math.PI / 2, Math.PI, 0];
    ctx.rotate(angles[a.dir]);

    // Arrow shaft
    ctx.fillStyle = a.color || COLORS.ARCHER_BOW;
    ctx.fillRect(-10, -1, 20, 2);

    // Arrowhead
    ctx.fillStyle = a.effect === 'burn' ? '#e67e22' : '#ccc';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(8, -3);
    ctx.lineTo(8, 3);
    ctx.closePath();
    ctx.fill();

    // Fletching
    ctx.fillStyle = a.source === 'player' ? '#4a90d9' : '#c0392b';
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

    // Fire arrows glow
    if (a.effect === 'burn') {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#e67e22';
      ctx.beginPath();
      ctx.arc(10, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  },

  _drawMagicBolt(ctx, sx, sy, a) {
    ctx.save();
    ctx.translate(sx, sy);

    // Outer glow
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = a.color || '#9b59b6';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = a.color || '#9b59b6';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bright center
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    // Lightning effect: flicker with yellow
    if (a.effect === 'pierce') {
      ctx.globalAlpha = 0.5 + Math.random() * 0.3;
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Freeze effect: icy trail
    if (a.effect === 'freeze') {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#9ae0f8';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  },

  clear() {
    this.arrows = [];
  },
};
