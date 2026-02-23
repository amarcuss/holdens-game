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
- `js/map.js` — 46 hand-crafted rooms across 3 dungeons as 20x15 tile grids, door connections, tile rendering
- `js/bestiary.js` — Monster/equipment compendium UI with discovery tracking
- `js/entity.js` — Base class for player/enemies: position, health, smooth tile-to-tile movement
- `js/player.js` — Arrow key input, attack cooldown, hurt blink
- `js/enemy.js` — Enemy AI with IDLE/PATROL/CHASE states, greedy pathfinding, ranged AI for casters/archers
- `js/combat.js` — Auto-targeting nearest adjacent enemy, knockback, visual effects (slash, sparks, damage numbers, target box)
- `js/items.js` — Item definitions table, Coin pickup class
- `js/inventory.js` — Equipment slots (sword + armor), stat bonuses
- `js/shop.js` — Modal shop UI with cursor navigation and purchase logic
- `js/hud.js` — Health hearts, coin count, ATK/DEF display
- `js/game.js` — Game loop, state machine (TITLE/PLAYING/SHOP/GAME_OVER/STORY/REWARD_CHOICE/etc), room transitions, particles, screen shake, dungeon select, boss rewards
- `js/main.js` — Bootstrap on window load

## Key Architecture

- **Script loading order matters** — no modules, all globals. `constants.js` must load first, `main.js` last.
- **Grid-locked movement** — entities have `tileX/tileY` (grid) and `px/py` (pixel). `startMove()` sets the tile destination immediately, then `updateMovement()` lerps the pixel position.
- **State machine** — `game.state` controls what updates and draws. PLAYING is the main gameplay state.
- **Combat auto-targets** — Space attacks the nearest enemy within 1 tile (including diagonals). No enemy nearby = whiff slash in facing direction.
- **Room persistence** — `clearedRooms` Set tracks which rooms have had all enemies killed. Re-entering a cleared room skips enemy spawning.
- **Invincibility frames** — Player has 0.5s i-frames after taking damage (`hurtTimer > 0` blocks further damage).
- **Story scenes** — `STORY_SCENES` in constants.js holds narrative text (arrays of pages). `ROOM_STORIES` maps room indices to scene keys, triggered on first entry. Intro/ending scenes are defined per-dungeon in the `DUNGEONS` array.
- **Retreat mechanic** — enemies with `retreats: true` in their config skip coin drops on death (fade-out acts as vanishing). Used by The Architect.

## Dungeons & Storyline

Three dungeons connected via a cliff house hub (room 15):
- **Holden's Dungeon** (rooms 0–14) — stone dungeon, boss: Brute (room 14)
- **Frozen Depths** (rooms 16–35) — ice dungeon, boss: The Architect (room 35)
- **The Volcano** (rooms 36–45) — lava dungeon, boss: Volcano Lord (room 45)

**The Architect** is a recurring villain — an ancient sorcerer who built the dungeons as a prison. Their presence is felt through carved inscriptions (Dungeon 1), direct speech (Dungeon 2), and lingering traces (Dungeon 3). They are fought as the boss of the Frozen Depths, and retreat when defeated rather than dying.

## Debug Keys

- **V** — trigger victory (plays ending scene + boss reward for current dungeon)
- **T** — teleport to boss room of current dungeon

## Conventions

- All sprites are 16x16 grids of color strings (null = transparent), rendered at 2x scale (32px tiles)
- Room layouts are strings where `W`=wall, `.`=floor, `D`=door — must be exactly 20 chars wide, 15 rows
- Colors are defined in `COLORS` object in constants.js
- Enemy types are defined in `Enemy.TYPES` static object
- Items are defined in the `ITEMS` object in items.js

## Common Tasks

- **Add a new room**: Add a `_makeRoomN()` method in map.js, add it to `this.rooms` in `init()`, add door connections
- **Add a new enemy type**: Add entry to `Enemy.TYPES`, add sprites in `sprites.js`, add sprite getter in `_getSprites()`, add bestiary entry in `bestiary.js`, add to room enemy arrays
- **Add a new item**: Add entry to `ITEMS` in items.js, add key to `SHOP_ITEMS` array
- **Add a story scene**: Add entry to `STORY_SCENES` in constants.js, map room index in `ROOM_STORIES`
- **Change player stats**: Edit `PLAYER_*` constants in constants.js
