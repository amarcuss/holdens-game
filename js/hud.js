const HUD = {
  draw(ctx, player) {
    // Background bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, CANVAS_H - 36, CANVAS_W, 36);

    // Hearts
    const heartSize = 16;
    const heartGap = 4;
    const heartsX = 10;
    const heartsY = CANVAS_H - 28;

    for (let i = 0; i < player.maxHp; i++) {
      const x = heartsX + i * (heartSize + heartGap);
      if (i < player.hp) {
        // Full heart
        this._drawHeart(ctx, x, heartsY, heartSize, COLORS.HEART);
      } else {
        // Empty heart
        this._drawHeart(ctx, x, heartsY, heartSize, '#666');
      }
    }

    // Coins
    ctx.fillStyle = COLORS.COIN;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(player.coins + 'c', CANVAS_W - 10, CANVAS_H - 14);

    // Equipped items
    ctx.textAlign = 'center';
    ctx.font = '12px monospace';

    const eqY = CANVAS_H - 14;

    // Sword
    if (Inventory.equippedSword) {
      const sword = ITEMS[Inventory.equippedSword];
      ctx.fillStyle = '#f39c12';
      ctx.fillText('ATK:' + player.attack, CANVAS_W / 2 - 50, eqY);
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('ATK:' + player.attack, CANVAS_W / 2 - 50, eqY);
    }

    // Armor
    if (Inventory.equippedArmor) {
      const armor = ITEMS[Inventory.equippedArmor];
      ctx.fillStyle = '#3498db';
      ctx.fillText('DEF:' + player.defense, CANVAS_W / 2 + 50, eqY);
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('DEF:' + player.defense, CANVAS_W / 2 + 50, eqY);
    }

    // Ranged weapon indicator
    if (Inventory.equippedRanged) {
      const rangedItem = ITEMS[Inventory.equippedRanged];
      const dmg = Inventory.getRangedDamage();
      if (rangedItem.type === 'staff') {
        ctx.fillStyle = '#9b59b6';
        ctx.fillText('MAG:' + dmg, CANVAS_W / 2 + 130, eqY);
      } else {
        ctx.fillStyle = '#8b6914';
        ctx.fillText('RNG:' + dmg, CANVAS_W / 2 + 130, eqY);
      }
    }

    // Book icon
    Bestiary.drawIcon(ctx);

    ctx.textAlign = 'left';
  },

  _drawHeart(ctx, x, y, size, color) {
    const s = size;
    ctx.fillStyle = color;
    // Simple heart shape using rectangles
    // Top bumps
    ctx.fillRect(x + s * 0.1, y + s * 0.15, s * 0.35, s * 0.35);
    ctx.fillRect(x + s * 0.55, y + s * 0.15, s * 0.35, s * 0.35);
    // Middle
    ctx.fillRect(x, y + s * 0.3, s, s * 0.3);
    // Bottom taper
    ctx.fillRect(x + s * 0.1, y + s * 0.55, s * 0.8, s * 0.2);
    ctx.fillRect(x + s * 0.25, y + s * 0.7, s * 0.5, s * 0.15);
    ctx.fillRect(x + s * 0.4, y + s * 0.8, s * 0.2, s * 0.1);
  },
};
