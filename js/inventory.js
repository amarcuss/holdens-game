const Inventory = {
  // Equipped item keys (into ITEMS)
  equippedSword: null,
  equippedArmor: null,

  // Ranged equipment slots
  equippedRanged: null,  // staff or bow key
  equippedSpell: null,   // spell key (staff path)
  equippedAmmo: null,    // ammo key (bow path)

  getAttackBonus() {
    if (!this.equippedSword) return 0;
    return ITEMS[this.equippedSword].stat;
  },

  getDefenseBonus() {
    if (!this.equippedArmor) return 0;
    return ITEMS[this.equippedArmor].stat;
  },

  getRangedDamage() {
    let dmg = 0;
    if (this.equippedRanged) dmg += ITEMS[this.equippedRanged].stat;
    if (this.equippedSpell) dmg += ITEMS[this.equippedSpell].stat;
    if (this.equippedAmmo) dmg += ITEMS[this.equippedAmmo].stat;
    return dmg;
  },

  getRangedConfig() {
    // Returns the config for firing: use spell/ammo if available, else base ranged weapon
    const spell = this.equippedSpell ? ITEMS[this.equippedSpell] : null;
    const ammo = this.equippedAmmo ? ITEMS[this.equippedAmmo] : null;
    const base = this.equippedRanged ? ITEMS[this.equippedRanged] : null;
    if (!base) return null;

    // Spell overrides base projectile properties for staff path
    const source = spell || ammo || base;
    return {
      damage: this.getRangedDamage(),
      range: source.range || base.range,
      cooldown: source.cooldown || base.cooldown,
      speed: source.projectileSpeed || base.projectileSpeed,
      color: source.projectileColor || base.projectileColor,
      effect: source.effect || base.effect || null,
      type: base.type,  // 'staff' or 'bow'
    };
  },

  equip(itemKey) {
    const item = ITEMS[itemKey];
    if (!item) return;

    if (item.type === 'sword') {
      this.equippedSword = itemKey;
    } else if (item.type === 'armor') {
      this.equippedArmor = itemKey;
    }
  },

  equipRanged(itemKey) {
    const item = ITEMS[itemKey];
    if (!item) return;

    if (item.type === 'staff' || item.type === 'bow') {
      this.equippedRanged = itemKey;
    } else if (item.type === 'spell') {
      this.equippedSpell = itemKey;
    } else if (item.type === 'ammo') {
      this.equippedAmmo = itemKey;
    }
  },

  reset() {
    this.equippedSword = null;
    this.equippedArmor = null;
    this.equippedRanged = null;
    this.equippedSpell = null;
    this.equippedAmmo = null;
  },
};
