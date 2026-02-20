const Inventory = {
  // Equipped item keys (into ITEMS)
  equippedSword: null,
  equippedArmor: null,

  getAttackBonus() {
    if (!this.equippedSword) return 0;
    return ITEMS[this.equippedSword].stat;
  },

  getDefenseBonus() {
    if (!this.equippedArmor) return 0;
    return ITEMS[this.equippedArmor].stat;
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

  reset() {
    this.equippedSword = null;
    this.equippedArmor = null;
  },
};
