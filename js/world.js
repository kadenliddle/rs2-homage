import { TILE, MAP_W, MAP_H, VIEW_W, VIEW_H, MAP, OBJECTS, T, PLAYER_START } from './config.js';
import {
  drawGrass, drawPath, drawDirt, drawWater, drawFlower, drawStone,
  drawTree, drawRock, drawBank, drawPlayer, drawMarker,
} from './sprites.js';

export class World {
  constructor() {
    this.objects = OBJECTS.map((o) => ({
      ...o,
      depleted: false,
      respawnAt: 0,
    }));
    // Blocked object tiles (trees, rocks, bank occupy their tile)
    this.objectBlocked = new Set(this.objects.map((o) => `${o.x},${o.y}`));
    /** Camera top-left in world pixels */
    this.camX = 0;
    this.camY = 0;
  }

  isWalkable(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
    const tile = MAP[ty][tx];
    if (tile === T.WATER) return false;
    if (this.objectBlocked.has(`${tx},${ty}`)) return false;
    return true;
  }

  /** Circle vs tile occupancy for player (radius ~0.35 tiles). */
  canOccupy(wx, wy) {
    const r = 0.32;
    const samples = [
      [wx - r, wy - r], [wx + r, wy - r],
      [wx - r, wy + r], [wx + r, wy + r],
      [wx, wy],
    ];
    return samples.every(([x, y]) => this.isWalkable(Math.floor(x), Math.floor(y)));
  }

  objectAt(tx, ty) {
    return this.objects.find((o) => o.x === tx && o.y === ty) || null;
  }

  update(now) {
    for (const o of this.objects) {
      if (o.depleted && now >= o.respawnAt) {
        o.depleted = false;
      }
    }
  }

  deplete(obj, now) {
    if (obj.kind === 'bank') return;
    obj.depleted = true;
    obj.respawnAt = now + (obj.respawnMs || 8000);
  }

  /** Center camera on player, clamped to map bounds. */
  updateCamera(player, viewWpx, viewHpx) {
    const worldW = MAP_W * TILE;
    const worldH = MAP_H * TILE;
    let cx = player.x * TILE - viewWpx / 2;
    let cy = player.y * TILE - viewHpx / 2;
    cx = Math.max(0, Math.min(Math.max(0, worldW - viewWpx), cx));
    cy = Math.max(0, Math.min(Math.max(0, worldH - viewHpx), cy));
    this.camX = cx;
    this.camY = cy;
  }

  render(ctx, player, marker, now, viewWpx, viewHpx) {
    this.updateCamera(player, viewWpx, viewHpx);
    const camX = this.camX;
    const camY = this.camY;

    // Visible tile range (pad 1 for overhanging sprites)
    const x0 = Math.max(0, Math.floor(camX / TILE) - 1);
    const y0 = Math.max(0, Math.floor(camY / TILE) - 1);
    const x1 = Math.min(MAP_W - 1, Math.ceil((camX + viewWpx) / TILE) + 1);
    const y1 = Math.min(MAP_H - 1, Math.ceil((camY + viewHpx) / TILE) + 1);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const px = x * TILE - camX;
        const py = y * TILE - camY;
        const t = MAP[y][x];
        const v = (x * 7 + y * 13) % 5;
        if (t === T.GRASS) drawGrass(ctx, px, py, TILE, v);
        else if (t === T.PATH) drawPath(ctx, px, py, TILE);
        else if (t === T.DIRT) drawDirt(ctx, px, py, TILE);
        else if (t === T.WATER) drawWater(ctx, px, py, TILE, now);
        else if (t === T.FLOWER) drawFlower(ctx, px, py, TILE);
        else if (t === T.STONE) drawStone(ctx, px, py, TILE);
      }
    }

    // objects sorted by y for simple depth; player interleaved
    const objs = this.objects.filter((o) =>
      o.x >= x0 && o.x <= x1 && o.y >= y0 - 1 && o.y <= y1 + 1
    ).sort((a, b) => a.y - b.y);

    let playerDrawn = false;
    const py = player.y;

    for (const o of objs) {
      if (!playerDrawn && o.y >= py) {
        drawPlayer(
          ctx,
          player.x * TILE - 8 - camX,
          player.y * TILE - 12 - camY,
          player.facing,
          player.walking,
          now,
        );
        playerDrawn = true;
      }
      const ox = o.x * TILE - camX;
      const oy = o.y * TILE - camY;
      if (o.kind === 'tree') drawTree(ctx, ox, oy, TILE, o.depleted);
      else if (o.kind === 'rock') drawRock(ctx, ox, oy, TILE, o.depleted);
      else if (o.kind === 'bank') drawBank(ctx, ox, oy, TILE);
    }
    if (!playerDrawn) {
      drawPlayer(
        ctx,
        player.x * TILE - 8 - camX,
        player.y * TILE - 12 - camY,
        player.facing,
        player.walking,
        now,
      );
    }

    if (marker) {
      drawMarker(ctx, marker.x * TILE - camX, marker.y * TILE - camY, now);
    }
  }
}

export { PLAYER_START, TILE, MAP_W, MAP_H, VIEW_W, VIEW_H };
