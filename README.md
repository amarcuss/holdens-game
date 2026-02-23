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
| X | Fire ranged weapon |
| Enter | Interact / Start / Restart |
| B | Open bestiary |
| M | Open map |
| Escape | Close menus |

## Gameplay

- Explore three dungeons: Holden's Dungeon, the Frozen Depths, and the Volcano
- Fight a variety of enemies — slimes, skeletons, archers, ice golems, flame casters, and more
- Uncover the story of **The Architect** — a dark sorcerer who built these dungeons as your prison
- Choose your weapon path after clearing the first dungeon (staff or bow), with upgrades after each boss
- Collect coins dropped by defeated enemies
- Visit shopkeepers to buy swords, armor, and health potions
- Cleared rooms stay cleared — no enemy respawns
- Return to the cliff house between dungeons to pick your next challenge

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
