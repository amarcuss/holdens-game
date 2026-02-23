// Item definitions
const ITEMS = {
  woodenSword:  { name: 'Wooden Sword',  type: 'sword', stat: 1, price: 10, desc: '+1 Attack' },
  ironSword:    { name: 'Iron Sword',    type: 'sword', stat: 3, price: 30, desc: '+3 Attack' },
  fireSword:    { name: 'Fire Sword',    type: 'sword', stat: 5, price: 75, desc: '+5 Attack' },
  leatherArmor: { name: 'Leather Armor', type: 'armor', stat: 1, price: 15, desc: '+1 Defense' },
  chainMail:    { name: 'Chain Mail',    type: 'armor', stat: 3, price: 40, desc: '+3 Defense' },
  plateArmor:   { name: 'Plate Armor',   type: 'armor', stat: 5, price: 80, desc: '+5 Defense' },
  healthPotion: { name: 'Health Potion', type: 'heal',  stat: 3, price: 5,  desc: '+3 HP' },

  // Ranged weapons
  wizardStaff:  { name: "Wizard's Staff", type: 'staff', stat: 2, desc: '+2 ATK',
                  range: 6, cooldown: 0.7, projectileSpeed: 180, projectileColor: '#9b59b6', effect: null },
  hunterBow:    { name: "Hunter's Bow",   type: 'bow',   stat: 2, desc: '+2 ATK',
                  range: 7, cooldown: 0.6, projectileSpeed: 220, projectileColor: '#8b6914', effect: null },

  // Staff path upgrades (spells)
  frostbolt:    { name: 'Frostbolt',      type: 'spell', stat: 3, desc: '+3 ATK',
                  range: 6, cooldown: 0.8, projectileSpeed: 200, projectileColor: '#6ac8e8', effect: 'freeze' },
  lightning:    { name: 'Lightning',       type: 'spell', stat: 3, desc: '+3 ATK',
                  range: 8, cooldown: 0.9, projectileSpeed: 300, projectileColor: '#f1c40f', effect: 'pierce' },

  // Bow path upgrades
  longbow:      { name: 'Longbow',         type: 'bow',   stat: 4, desc: '+4 ATK',
                  range: 9, cooldown: 0.6, projectileSpeed: 260, projectileColor: '#8b6914', effect: null },
  fireArrows:   { name: 'Fire Arrows',     type: 'ammo',  stat: 1, desc: '+1 ATK',
                  range: 7, cooldown: 0.6, projectileSpeed: 220, projectileColor: '#e67e22', effect: 'burn' },

  // Volcano reward weapons
  meteor:       { name: 'Meteor Strike',   type: 'spell', stat: 5, desc: '+5 ATK',
                  range: 6, cooldown: 0.9, projectileSpeed: 160, projectileColor: '#e74c3c', effect: 'burn' },
  chainLightning: { name: 'Chain Lightning', type: 'spell', stat: 4, desc: '+4 ATK',
                  range: 8, cooldown: 0.8, projectileSpeed: 320, projectileColor: '#f1c40f', effect: 'pierce' },
  dragonbow:    { name: 'Dragonbow',        type: 'bow',   stat: 6, desc: '+6 ATK',
                  range: 9, cooldown: 0.6, projectileSpeed: 300, projectileColor: '#e74c3c', effect: null },
  explosiveArrows: { name: 'Explosive Arrows', type: 'ammo', stat: 3, desc: '+3 ATK',
                  range: 7, cooldown: 0.6, projectileSpeed: 200, projectileColor: '#e67e22', effect: 'burn' },
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
