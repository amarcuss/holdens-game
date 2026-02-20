const Combat = {
  effects: [],

  // Player attacks the nearest enemy within 1 tile
  playerAttack(player, enemies) {
    // Find nearest alive enemy within 1 tile (including diagonals)
    let closest = null;
    let closestDist = Infinity;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const dx = Math.abs(enemy.tileX - player.tileX);
      const dy = Math.abs(enemy.tileY - player.tileY);
      if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
        const dist = dx + dy;
        if (dist < closestDist) {
          closestDist = dist;
          closest = enemy;
        }
      }
    }

    if (!closest) {
      // Whiff: slash in facing direction for feedback
      const whiffX = player.tileX + DIR_DX[player.facing];
      const whiffY = player.tileY + DIR_DY[player.facing];
      const angle = Math.atan2(DIR_DY[player.facing], DIR_DX[player.facing]);
      this.effects.push({
        type: 'slash',
        x: whiffX * TILE,
        y: whiffY * TILE,
        timer: 0,
        duration: 0.15,
        angle: angle,
      });
      return false;
    }

    const targetX = closest.tileX;
    const targetY = closest.tileY;

    // Red target box around the enemy
    this.addTargetBox(targetX, targetY);

    // Slash effect at the enemy tile
    this.addSlashEffect(player, targetX, targetY);

    const damage = Math.max(1, player.attack);
    closest.takeDamage(damage);
    closest.hurtTimer = 0.3;

    // Floating damage number + hit sparks
    this.addDamageNumber(targetX, targetY, damage);
    this.addHitSparks(targetX, targetY);

    // Knockback: push enemy away from player (cardinal only)
    let kbDx = Math.sign(targetX - player.tileX);
    let kbDy = Math.sign(targetY - player.tileY);
    // For diagonal hits, pick the dominant axis
    if (kbDx !== 0 && kbDy !== 0) {
      if (Math.abs(targetX - player.tileX) >= Math.abs(targetY - player.tileY)) {
        kbDy = 0;
      } else {
        kbDx = 0;
      }
    }
    if (kbDx !== 0 || kbDy !== 0) {
      const kbX = closest.tileX + kbDx;
      const kbY = closest.tileY + kbDy;
      if (DungeonMap.isWalkable(kbX, kbY) && !this._isEnemyAt(kbX, kbY, enemies)) {
        closest.startMove(kbDx, kbDy);
      }
    }

    return true;
  },

  // Enemy attacks the player
  enemyAttack(enemy, player) {
    // Invincibility frames: can't take damage while still hurt
    if (player.hurtTimer > 0) return;

    const damage = Math.max(1, enemy.attackDamage - player.defense);
    player.takeDamage(damage);
    player.hurtTimer = 0.5;

    this.addDamageNumber(player.tileX, player.tileY, damage, '#e74c3c');
  },

  addSlashEffect(player, tileX, tileY) {
    // Compute direction from player to target
    const dx = tileX - player.tileX;
    const dy = tileY - player.tileY;
    const angle = Math.atan2(dy, dx);
    this.effects.push({
      type: 'slash',
      x: tileX * TILE,
      y: tileY * TILE,
      timer: 0,
      duration: 0.2,
      angle: angle,
    });
  },

  addTargetBox(tileX, tileY) {
    this.effects.push({
      type: 'targetbox',
      x: tileX * TILE,
      y: tileY * TILE,
      timer: 0,
      duration: 0.3,
    });
  },

  addHitSparks(tileX, tileY) {
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 60;
      this.effects.push({
        type: 'spark',
        x: tileX * TILE + TILE / 2,
        y: tileY * TILE + TILE / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        timer: 0,
        duration: 0.3 + Math.random() * 0.2,
      });
    }
  },

  addDamageNumber(tileX, tileY, amount, color) {
    this.effects.push({
      type: 'damage',
      x: tileX * TILE + TILE / 2,
      y: tileY * TILE,
      timer: 0,
      duration: 0.8,
      text: '-' + amount,
      color: color || '#fff',
    });
  },

  _isEnemyAt(x, y, enemies) {
    for (const e of enemies) {
      if (e.alive && e.tileX === x && e.tileY === y) return true;
    }
    return false;
  },

  update(dt) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const fx = this.effects[i];
      fx.timer += dt;
      // Move sparks
      if (fx.type === 'spark') {
        fx.x += fx.vx * dt;
        fx.y += fx.vy * dt;
      }
      if (fx.timer >= fx.duration) {
        this.effects.splice(i, 1);
      }
    }
  },

  draw(ctx, camera) {
    for (const fx of this.effects) {
      if (fx.type === 'slash') {
        this._drawSlash(ctx, fx, camera);
      } else if (fx.type === 'damage') {
        this._drawDamage(ctx, fx, camera);
      } else if (fx.type === 'spark') {
        this._drawSpark(ctx, fx, camera);
      } else if (fx.type === 'targetbox') {
        this._drawTargetBox(ctx, fx, camera);
      }
    }
  },

  _drawSlash(ctx, fx, camera) {
    const t = fx.timer / fx.duration;
    const cx = fx.x + TILE / 2 - camera.x;
    const cy = fx.y + TILE / 2 - camera.y;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = 1 - t;

    // Rotate toward the target
    ctx.rotate(fx.angle);

    // Draw arc slash
    const radius = TILE * 0.6;
    const startAngle = -Math.PI * 0.4 + t * 0.5;
    const endAngle = Math.PI * 0.4 + t * 0.5;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.5 + t * 0.5), startAngle, endAngle);
    ctx.stroke();

    // Inner bright arc
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.3 + t * 0.4), startAngle + 0.2, endAngle - 0.2);
    ctx.stroke();

    ctx.restore();
  },

  _drawDamage(ctx, fx, camera) {
    const t = fx.timer / fx.duration;
    const x = fx.x - camera.x;
    const y = fx.y - camera.y - t * 35; // Float upward

    // Scale pop: starts at 1.4x, settles to 1x quickly
    const scale = t < 0.15 ? 1 + 0.4 * (1 - t / 0.15) : 1;

    ctx.save();
    ctx.globalAlpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';

    // Outline
    ctx.fillStyle = '#000';
    ctx.fillText(fx.text, 1, 1);
    ctx.fillText(fx.text, -1, -1);
    ctx.fillText(fx.text, 1, -1);
    ctx.fillText(fx.text, -1, 1);

    // Text
    ctx.fillStyle = fx.color;
    ctx.fillText(fx.text, 0, 0);

    ctx.restore();
  },

  _drawTargetBox(ctx, fx, camera) {
    const t = fx.timer / fx.duration;
    const x = fx.x - camera.x;
    const y = fx.y - camera.y;

    ctx.save();
    ctx.globalAlpha = (1 - t) * 0.9;
    // Outer glow
    ctx.strokeStyle = 'rgba(255, 68, 68, 0.4)';
    ctx.lineWidth = 6;
    ctx.strokeRect(x, y, TILE, TILE);
    // Inner crisp box
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.restore();
  },

  _drawSpark(ctx, fx, camera) {
    const t = fx.timer / fx.duration;
    const x = fx.x - camera.x;
    const y = fx.y - camera.y;

    ctx.save();
    ctx.globalAlpha = 1 - t;
    const size = 5 * (1 - t);
    // Glow
    ctx.fillStyle = 'rgba(255, 230, 100, 0.5)';
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    // Core
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    ctx.restore();
  },

  clear() {
    this.effects = [];
  },
};
