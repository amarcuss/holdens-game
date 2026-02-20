// Item definitions
const ITEMS = {
  woodenSword:  { name: 'Wooden Sword',  type: 'sword', stat: 1, price: 10, desc: '+1 Attack' },
  ironSword:    { name: 'Iron Sword',    type: 'sword', stat: 3, price: 30, desc: '+3 Attack' },
  fireSword:    { name: 'Fire Sword',    type: 'sword', stat: 5, price: 75, desc: '+5 Attack' },
  leatherArmor: { name: 'Leather Armor', type: 'armor', stat: 1, price: 15, desc: '+1 Defense' },
  chainMail:    { name: 'Chain Mail',    type: 'armor', stat: 3, price: 40, desc: '+3 Defense' },
  plateArmor:   { name: 'Plate Armor',   type: 'armor', stat: 5, price: 80, desc: '+5 Defense' },
  healthPotion: { name: 'Health Potion', type: 'heal',  stat: 3, price: 5,  desc: '+3 HP' },
};

// Shop inventory (keys into ITEMS)
const SHOP_ITEMS = [
  'woodenSword', 'ironSword', 'fireSword',
  'leatherArmor', 'chainMail', 'plateArmor',
  'healthPotion',
];

// Coin pickup that sits on the ground
class Coin {
  constructor(tileX, tileY, value) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.value = value || 1;
    this.px = tileX * TILE;
    this.py = tileY * TILE;
    this.alive = true;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
  }

  draw(ctx, camera) {
    if (!this.alive) return;

    const x = this.px - camera.x + TILE / 2;
    const y = this.py - camera.y + TILE / 2;

    // Bob up and down
    const bob = Math.sin(this.timer * 4) * 2;

    // Spinning coin: width oscillates
    const spin = Math.abs(Math.cos(this.timer * 3));
    const w = Math.max(2, 8 * spin);
    const h = 10;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coin body
    ctx.fillStyle = COLORS.COIN;
    ctx.fillRect(x - w / 2, y - h / 2 + bob, w, h);

    // Highlight
    if (spin > 0.3) {
      ctx.fillStyle = '#ffe066';
      ctx.fillRect(x - w / 2 + 1, y - h / 2 + bob + 1, Math.max(1, w - 3), 2);
    }
  }
}
