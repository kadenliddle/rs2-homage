/** Grovehaven — game constants & XP curve (original names only). */

export const TILE = 16;
export const MAP_W = 30;
export const MAP_H = 22;
export const INV_SIZE = 28;
export const PLAYER_SPEED = 2.4; // tiles per second
export const REACH = 1.35; // tiles

/** Simplified RS-like XP table: XP required to reach each level (cumulative). */
export function xpForLevel(level) {
  // level 1 = 0; each level needs more XP
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
};

/**
 * Outdoor map — walkable grass/path/dirt; water blocked.
 * Objects (trees, rocks, bank) are separate entities with collision.
 */
export const MAP = (() => {
  const g = T.GRASS, p = T.PATH, d = T.DIRT, w = T.WATER, f = T.FLOWER;
  // 30 x 22
  const rows = [
    'gggggggggggggggggggggggggggggg',
    'ggffggggggddddddggggggggffgggg',
    'ggggggggggdppppdgggggggggggggg',
    'ggggggggggdppppdgggggggggggggg',
    'ggggdddddddppppdddddddgggggggg',
    'ggggdppppppppppppppppdgggggggg',
    'ggggdppppppppppppppppdgggggggg',
    'ggggdppppddddddddppppdgggggggg',
    'ggggdppppdggggggdppppdgggggggg',
    'ggggdppppdggggggdppppdgggggggg',
    'ggggdppppdggggggdppppdgggggggg',
    'ggggdppppddddddddppppdgggggggg',
    'ggggdppppppppppppppppdgggggggg',
    'ggggdppppppppppppppppdgggggggg',
    'ggggdddddddppppdddddddgggggggg',
    'ggggggggggdppppdgggggggggggggg',
    'ggffggggggdppppdggggggggffgggg',
    'ggggggggggddddddggwwwwwwgggggg',
    'ggggggggggggggggggwwwwwwgggggg',
    'ggggggggggggggggggwwwwwwgggggg',
    'gggggggggggggggggggggggggggggg',
    'gggggggggggggggggggggggggggggg',
  ];
  const key = { g, p, d, w, f };
  return rows.map((r) => [...r].map((c) => key[c]));
})();

/** Interactive world objects (tile coords). Original names. */
export const OBJECTS = [
  // Ashgrove trees (woodcutting) — at least 3
  { id: 'tree1', kind: 'tree', name: 'Ashgrove Tree', x: 4, y: 3, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree2', kind: 'tree', name: 'Ashgrove Tree', x: 8, y: 8, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree3', kind: 'tree', name: 'Ashgrove Tree', x: 22, y: 4, respawnMs: 8000, gatherMs: 2200 },
  { id: 'tree4', kind: 'tree', name: 'Ashgrove Tree', x: 25, y: 12, respawnMs: 9000, gatherMs: 2400 },
  // Copper seams (mining) — at least 2
  { id: 'rock1', kind: 'rock', name: 'Copper Seam', x: 18, y: 15, respawnMs: 7000, gatherMs: 2600 },
  { id: 'rock2', kind: 'rock', name: 'Copper Seam', x: 24, y: 9, respawnMs: 7000, gatherMs: 2600 },
  { id: 'rock3', kind: 'rock', name: 'Copper Seam', x: 15, y: 18, respawnMs: 7500, gatherMs: 2600 },
  // Waybank booth
  { id: 'bank1', kind: 'bank', name: 'Waybank Booth', x: 14, y: 5 },
];

export const PLAYER_START = { x: 12.5, y: 10.5 };
