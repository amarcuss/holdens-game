# Holden's Dungeon

A 2D dungeon crawler built with HTML5 Canvas and vanilla JavaScript. All sprites are drawn programmatically with colored rectangles — no external image assets needed.

**Play it now:** https://amarcuss.github.io/holdens-game/

## How to Play

Open `index.html` in any modern browser, or visit the GitHub Pages link above.

### Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Move (hold to keep moving) |
| Space | Attack nearest enemy |
| Enter | Interact / Start / Restart |
| Escape | Close shop |

## Gameplay

- Explore 5 dungeon rooms connected by doors
- Fight slimes and skeletons — attacks auto-target the nearest adjacent enemy
- Collect coins dropped by defeated enemies
- Visit the shopkeeper in the Treasury to buy swords, armor, and health potions
- Cleared rooms stay cleared — no enemy respawns
- Survive as long as you can

## Items

| Item | Type | Stat | Price |
|------|------|------|-------|
| Wooden Sword | Sword | +1 ATK | 10c |
| Iron Sword | Sword | +3 ATK | 30c |
| Fire Sword | Sword | +5 ATK | 75c |
| Leather Armor | Armor | +1 DEF | 15c |
| Chain Mail | Armor | +3 DEF | 40c |
| Plate Armor | Armor | +5 DEF | 80c |
| Health Potion | Heal | +3 HP | 5c |

## Tech

- HTML5 Canvas (640x480)
- Vanilla JavaScript, no dependencies
- 16x16 pixel art sprites rendered at 2x scale with `fillRect()`
- Tile-based grid movement with smooth interpolation
- No build tools — just open `index.html`
