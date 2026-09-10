/** Grovehaven — game constants & XP curve (original names only). */

export const TILE = 16;
/** Playable world size (tiles). ~2.1× prior linear size (was 30×22). */
export const MAP_W = 64;
export const MAP_H = 48;
/** Fixed viewport in tiles (canvas stays 480×352). */
export const VIEW_W = 30;
export const VIEW_H = 22;
export const INV_SIZE = 28;
export const PLAYER_SPEED = 2.4; // tiles per second
export const REACH = 1.35; // tiles

/** Simplified RS-like XP table: XP required to reach each level (cumulative). */
export function xpForLevel(level) {
  let total = 0;
  for (let L = 1; L < level; L++) {
    total += Math.floor(L + 300 * Math.pow(2, L / 7));
  }
  return Math.floor(total / 4);
}

export function levelFromXp(xp) {
  let level = 1;
  while (level < 99 && xp >= xpForLevel(level + 1)) level++;
  return level;
}

export const ITEMS = {
  timber: { id: 'timber', name: 'Ashgrove Logs', color: '#8b5a2b', accent: '#c4a060' },
  ore: { id: 'ore', name: 'Copper Seam Ore', color: '#b87333', accent: '#e8a050' },
};

export const SKILLS = {
  woodcutting: { name: 'Woodcutting', xpPer: 25 },
  mining: { name: 'Mining', xpPer: 35 },
};

/** Tile types */
export const T = {
  GRASS: 0,
  PATH: 1,
  DIRT: 2,
  WATER: 3,
  FLOWER: 4,
  STONE: 5,
};

function hash2(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function setRect(map, x0, y0, x1, y1, tile) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) map[y][x] = tile;
    }
  }
}

function setHPath(map, x0, x1, y, tile) {
  const a = Math.min(x0, x1);
  const b = Math.max(x0, x1);
  for (let x = a; x <= b; x++) {
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) map[y][x] = tile;
  }
}

function setVPath(map, x, y0, y1, tile) {
  const a = Math.min(y0, y1);
  const b = Math.max(y0, y1);
  for (let y = a; y <= b; y++) {
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) map[y][x] = tile;
  }
}

function thickenPath(map, pathTile, edgeTile) {
  const next = map.map((row) => row.slice());
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (map[y][x] !== pathTile) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H) continue;
        if (next[ny][nx] === T.GRASS || next[ny][nx] === T.FLOWER) {
          next[ny][nx] = edgeTile;
        }
      }
    }
  }
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) map[y][x] = next[y][x];
  }
}

/**
 * Outdoor map — walkable grass/path/dirt/stone; water blocked.
 * Starter clearing near spawn; paths to resource clusters further out.
 */
export const MAP = (() => {
  const map = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(T.GRASS));

  // Soft grass / flower variation
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (hash2(x, y) < 0.04) map[y][x] = T.FLOWER;
    }
  }

  // Pond (SE)
  setRect(map, 48, 36, 58, 44, T.WATER);
  setRect(map, 50, 35, 56, 35, T.WATER);
  setRect(map, 50, 45, 56, 45, T.WATER);

  // Small north pond
  setRect(map, 8, 4, 14, 8, T.WATER);

  // Starter clearing (dirt plaza) around Waybank / spawn
  setRect(map, 26, 18, 38, 28, T.DIRT);
  setRect(map, 28, 20, 36, 26, T.PATH);
  // Stone pad under bank
  setRect(map, 30, 19, 34, 21, T.STONE);

  // Main road network (stone/dirt paths connecting areas)
  // East–west spine through clearing
  setHPath(map, 6, 58, 23, T.PATH);
  setHPath(map, 6, 58, 24, T.PATH);
  // North spur to tree grove
  setVPath(map, 32, 6, 23, T.PATH);
  setVPath(map, 33, 6, 23, T.PATH);
  // South spur toward copper hills
  setVPath(map, 32, 24, 40, T.PATH);
  setVPath(map, 33, 24, 40, T.PATH);
  // West fork to west woods
  setHPath(map, 6, 32, 12, T.PATH);
  setVPath(map, 10, 12, 23, T.PATH);
  // East fork to east copper / east woods
  setHPath(map, 33, 55, 14, T.PATH);
  setVPath(map, 52, 14, 30, T.PATH);
  setHPath(map, 40, 52, 30, T.PATH);
  // SE path near pond shore
  setHPath(map, 33, 46, 38, T.PATH);
  setVPath(map, 42, 30, 38, T.PATH);

  thickenPath(map, T.PATH, T.DIRT);

  // Dirt patches near resource clusters
  setRect(map, 4, 14, 12, 20, T.DIRT);
  setRect(map, 48, 8, 58, 16, T.DIRT);
  setRect(map, 16, 34, 28, 42, T.DIRT);
  setRect(map, 40, 32, 48, 40, T.DIRT);

  // Keep plaza paths clean after thicken
  setRect(map, 28, 20, 36, 26, T.PATH);
  setRect(map, 30, 19, 34, 21, T.STONE);
  setHPath(map, 6, 58, 23, T.PATH);
  setHPath(map, 6, 58, 24, T.PATH);

  // Shore dirt around ponds
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (map[y][x] !== T.WATER) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H) continue;
        if (map[ny][nx] === T.GRASS || map[ny][nx] === T.FLOWER) map[ny][nx] = T.DIRT;
      }
    }
  }

  return map;
})();

/** Interactive world objects (tile coords). Original names. */
export const OBJECTS = [
  // --- Starter Ashgrove (near clearing, easy reach) ---
  { id: 'tree_s1', kind: 'tree', name: 'Ashgrove Tree', x: 24, y: 17, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree_s2', kind: 'tree', name: 'Ashgrove Tree', x: 39, y: 18, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree_s3', kind: 'tree', name: 'Ashgrove Tree', x: 27, y: 29, respawnMs: 8500, gatherMs: 2300 },

  // --- North grove (along north spur) ---
  { id: 'tree_n1', kind: 'tree', name: 'Ashgrove Tree', x: 28, y: 5, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree_n2', kind: 'tree', name: 'Ashgrove Tree', x: 30, y: 7, respawnMs: 8500, gatherMs: 2200 },
  { id: 'tree_n3', kind: 'tree', name: 'Ashgrove Tree', x: 35, y: 5, respawnMs: 8000, gatherMs: 2300 },
  { id: 'tree_n4', kind: 'tree', name: 'Ashgrove Tree', x: 37, y: 8, respawnMs: 9000, gatherMs: 2400 },
  { id: 'tree_n5', kind: 'tree', name: 'Ashgrove Tree', x: 26, y: 9, respawnMs: 8500, gatherMs: 2200 },

  // --- West woods ---
  { id: 'tree_w1', kind: 'tree', name: 'Ashgrove Tree', x: 4, y: 11, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree_w2', kind: 'tree', name: 'Ashgrove Tree', x: 6, y: 15, respawnMs: 8500, gatherMs: 2300 },
  { id: 'tree_w3', kind: 'tree', name: 'Ashgrove Tree', x: 3, y: 18, respawnMs: 9000, gatherMs: 2400 },
  { id: 'tree_w4', kind: 'tree', name: 'Ashgrove Tree', x: 8, y: 19, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree_w5', kind: 'tree', name: 'Ashgrove Tree', x: 12, y: 10, respawnMs: 8500, gatherMs: 2300 },

  // --- East woods ---
  { id: 'tree_e1', kind: 'tree', name: 'Ashgrove Tree', x: 56, y: 10, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree_e2', kind: 'tree', name: 'Ashgrove Tree', x: 58, y: 13, respawnMs: 8500, gatherMs: 2300 },
  { id: 'tree_e3', kind: 'tree', name: 'Ashgrove Tree', x: 54, y: 16, respawnMs: 9000, gatherMs: 2400 },
  { id: 'tree_e4', kind: 'tree', name: 'Ashgrove Tree', x: 60, y: 18, respawnMs: 8500, gatherMs: 2200 },

  // --- South fringe trees ---
  { id: 'tree_s4', kind: 'tree', name: 'Ashgrove Tree', x: 18, y: 40, respawnMs: 9000, gatherMs: 2400 },
  { id: 'tree_s5', kind: 'tree', name: 'Ashgrove Tree', x: 22, y: 36, respawnMs: 8500, gatherMs: 2300 },
  { id: 'tree_s6', kind: 'tree', name: 'Ashgrove Tree', x: 14, y: 34, respawnMs: 8000, gatherMs: 2200 },

  // --- Copper seams: SW hills ---
  { id: 'rock_sw1', kind: 'rock', name: 'Copper Seam', x: 18, y: 36, respawnMs: 7000, gatherMs: 2600 },
  { id: 'rock_sw2', kind: 'rock', name: 'Copper Seam', x: 20, y: 39, respawnMs: 7200, gatherMs: 2600 },
  { id: 'rock_sw3', kind: 'rock', name: 'Copper Seam', x: 24, y: 41, respawnMs: 7500, gatherMs: 2700 },
  { id: 'rock_sw4', kind: 'rock', name: 'Copper Seam', x: 16, y: 42, respawnMs: 7000, gatherMs: 2600 },

  // --- Copper seams: SE near pond ---
  { id: 'rock_se1', kind: 'rock', name: 'Copper Seam', x: 44, y: 34, respawnMs: 7000, gatherMs: 2600 },
  { id: 'rock_se2', kind: 'rock', name: 'Copper Seam', x: 46, y: 37, respawnMs: 7300, gatherMs: 2600 },
  { id: 'rock_se3', kind: 'rock', name: 'Copper Seam', x: 42, y: 40, respawnMs: 7500, gatherMs: 2700 },

  // --- Copper seams: NE cluster ---
  { id: 'rock_ne1', kind: 'rock', name: 'Copper Seam', x: 50, y: 10, respawnMs: 7000, gatherMs: 2600 },
  { id: 'rock_ne2', kind: 'rock', name: 'Copper Seam', x: 53, y: 12, respawnMs: 7200, gatherMs: 2600 },
  { id: 'rock_ne3', kind: 'rock', name: 'Copper Seam', x: 48, y: 14, respawnMs: 7500, gatherMs: 2700 },

  // --- Nearby starter copper (short walk from plaza) ---
  { id: 'rock_near1', kind: 'rock', name: 'Copper Seam', x: 40, y: 26, respawnMs: 7000, gatherMs: 2600 },
  { id: 'rock_near2', kind: 'rock', name: 'Copper Seam', x: 42, y: 22, respawnMs: 7200, gatherMs: 2600 },

  // Waybank booth — center of starter plaza
  { id: 'bank1', kind: 'bank', name: 'Waybank Booth', x: 32, y: 20 },
];

export const PLAYER_START = { x: 32.5, y: 24.5 };
