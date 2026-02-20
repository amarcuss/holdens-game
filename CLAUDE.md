# CLAUDE.md

## Project Overview

Holden's Dungeon — a 2D tile-based dungeon crawler using HTML5 Canvas and vanilla JS. No frameworks, no build tools, no external assets.

## File Structure

- `index.html` — Canvas element, loads all scripts in dependency order
- `css/style.css` — Pixelated rendering, dark background, centered canvas
- `js/constants.js` — Tile size, colors, game config, directions
- `js/input.js` — Keyboard polling with edge detection (`wasPressed`) and held state (`isDown`)
- `js/sprites.js` — All pixel art as 16x16 color arrays, drawn with `fillRect()` at 2x
- `js/camera.js` — Smooth-lerp viewport that follows the player, snaps on room transitions
- `js/map.js` — 5 hand-crafted rooms as 20x15 tile grids, door connections, tile rendering
- `js/entity.js` — Base class for player/enemies: position, health, smooth tile-to-tile movement
- `js/player.js` — Arrow key input, attack cooldown, hurt blink
- `js/enemy.js` — Slime/Skeleton AI with IDLE/PATROL/CHASE states, greedy pathfinding
- `js/combat.js` — Auto-targeting nearest adjacent enemy, knockback, visual effects (slash, sparks, damage numbers, target box)
- `js/items.js` — Item definitions table, Coin pickup class
- `js/inventory.js` — Equipment slots (sword + armor), stat bonuses
- `js/shop.js` — Modal shop UI with cursor navigation and purchase logic
- `js/hud.js` — Health hearts, coin count, ATK/DEF display
- `js/game.js` — Game loop, state machine (TITLE/PLAYING/SHOP/GAME_OVER), room transitions, particles, screen shake
- `js/main.js` — Bootstrap on window load

## Key Architecture

- **Script loading order matters** — no modules, all globals. `constants.js` must load first, `main.js` last.
- **Grid-locked movement** — entities have `tileX/tileY` (grid) and `px/py` (pixel). `startMove()` sets the tile destination immediately, then `updateMovement()` lerps the pixel position.
- **State machine** — `game.state` controls what updates and draws. PLAYING is the main gameplay state.
- **Combat auto-targets** — Space attacks the nearest enemy within 1 tile (including diagonals). No enemy nearby = whiff slash in facing direction.
- **Room persistence** — `clearedRooms` Set tracks which rooms have had all enemies killed. Re-entering a cleared room skips enemy spawning.
- **Invincibility frames** — Player has 0.5s i-frames after taking damage (`hurtTimer > 0` blocks further damage).

## Conventions

- All sprites are 16x16 grids of color strings (null = transparent), rendered at 2x scale (32px tiles)
- Room layouts are strings where `W`=wall, `.`=floor, `D`=door — must be exactly 20 chars wide, 15 rows
- Colors are defined in `COLORS` object in constants.js
- Enemy types are defined in `Enemy.TYPES` static object
- Items are defined in the `ITEMS` object in items.js

## Common Tasks

- **Add a new room**: Add a `_makeRoomN()` method in map.js, add it to `this.rooms` in `init()`, add door connections
- **Add a new enemy type**: Add entry to `Enemy.TYPES`, add sprites in `sprites.js`, add to room enemy arrays
- **Add a new item**: Add entry to `ITEMS` in items.js, add key to `SHOP_ITEMS` array
- **Change player stats**: Edit `PLAYER_*` constants in constants.js
