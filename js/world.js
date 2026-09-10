import { TILE, MAP_W, MAP_H, MAP, OBJECTS, T, PLAYER_START } from './config.js';
import {
  drawGrass, drawPath, drawDirt, drawWater, drawFlower,
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

  render(ctx, player, marker, now) {
    // tiles
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const px = x * TILE;
        const py = y * TILE;
        const t = MAP[y][x];
        const v = (x * 7 + y * 13) % 5;
        if (t === T.GRASS) drawGrass(ctx, px, py, TILE, v);
        else if (t === T.PATH) drawPath(ctx, px, py, TILE);
        else if (t === T.DIRT) drawDirt(ctx, px, py, TILE);
        else if (t === T.WATER) drawWater(ctx, px, py, TILE, now);
        else if (t === T.FLOWER) drawFlower(ctx, px, py, TILE);
      }
    }

    // objects (behind player if above)
    const objs = [...this.objects].sort((a, b) => a.y - b.y);
    let playerDrawn = false;
    const py = player.y;

    for (const o of objs) {
      if (!playerDrawn && o.y >= py) {
        drawPlayer(ctx, player.x * TILE - 8, player.y * TILE - 12, player.facing, player.walking, now);
        playerDrawn = true;
      }
      const ox = o.x * TILE;
      const oy = o.y * TILE;
      if (o.kind === 'tree') drawTree(ctx, ox, oy, TILE, o.depleted);
      else if (o.kind === 'rock') drawRock(ctx, ox, oy, TILE, o.depleted);
      else if (o.kind === 'bank') drawBank(ctx, ox, oy, TILE);
    }
    if (!playerDrawn) {
      drawPlayer(ctx, player.x * TILE - 8, player.y * TILE - 12, player.facing, player.walking, now);
    }

    if (marker) {
      drawMarker(ctx, marker.x * TILE, marker.y * TILE, now);
    }
  }
}

export { PLAYER_START, TILE, MAP_W, MAP_H };
