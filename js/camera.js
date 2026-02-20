class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.smoothSpeed = 8; // lerp speed
  }

  follow(entity, roomW, roomH, dt) {
    // Center on entity
    let targetX = entity.px + TILE / 2 - CANVAS_W / 2;
    let targetY = entity.py + TILE / 2 - CANVAS_H / 2;

    // Clamp to room bounds
    const maxX = roomW * TILE - CANVAS_W;
    const maxY = roomH * TILE - CANVAS_H;

    targetX = Math.max(0, Math.min(targetX, maxX));
    targetY = Math.max(0, Math.min(targetY, maxY));

    // If room fits on screen, center it
    if (roomW * TILE <= CANVAS_W) {
      targetX = (roomW * TILE - CANVAS_W) / 2;
    }
    if (roomH * TILE <= CANVAS_H) {
      targetY = (roomH * TILE - CANVAS_H) / 2;
    }

    // Smooth lerp toward target
    const t = Math.min(1, this.smoothSpeed * (dt || 0.016));
    this.x += (targetX - this.x) * t;
    this.y += (targetY - this.y) * t;
  }

  // Snap immediately (for room transitions)
  snapTo(entity, roomW, roomH) {
    let targetX = entity.px + TILE / 2 - CANVAS_W / 2;
    let targetY = entity.py + TILE / 2 - CANVAS_H / 2;

    const maxX = roomW * TILE - CANVAS_W;
    const maxY = roomH * TILE - CANVAS_H;

    targetX = Math.max(0, Math.min(targetX, maxX));
    targetY = Math.max(0, Math.min(targetY, maxY));

    if (roomW * TILE <= CANVAS_W) {
      targetX = (roomW * TILE - CANVAS_W) / 2;
    }
    if (roomH * TILE <= CANVAS_H) {
      targetY = (roomH * TILE - CANVAS_H) / 2;
    }

    this.x = targetX;
    this.y = targetY;
  }
}
