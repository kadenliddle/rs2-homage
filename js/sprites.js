/** Original procedural pixel sprites — no ripped assets. Early-2000s nearest-neighbor vibe. */

const cache = new Map();

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function drawGrass(ctx, x, y, tile, variant) {
  const bases = ['#3f6e32', '#457538', '#3a6830', '#4a7a3a', '#3d7034'];
  const base = bases[variant % bases.length];
  px(ctx, x, y, tile, tile, base);
  const hi = '#5a8f48';
  const lo = '#2e5524';
  const mid = '#4a8240';
  const v = variant % 5;
  if (v === 0) {
    px(ctx, x + 2, y + 3, 1, 2, hi);
    px(ctx, x + 3, y + 2, 1, 1, mid);
    px(ctx, x + 11, y + 8, 1, 2, lo);
    px(ctx, x + 7, y + 12, 2, 1, hi);
    px(ctx, x + 13, y + 4, 1, 1, mid);
  } else if (v === 1) {
    px(ctx, x + 5, y + 5, 1, 2, hi);
    px(ctx, x + 9, y + 2, 1, 1, lo);
    px(ctx, x + 1, y + 10, 2, 1, mid);
    px(ctx, x + 12, y + 11, 1, 2, hi);
  } else if (v === 2) {
    px(ctx, x + 8, y + 6, 1, 2, lo);
    px(ctx, x + 3, y + 11, 1, 1, hi);
    px(ctx, x + 14, y + 3, 1, 2, mid);
    px(ctx, x + 6, y + 1, 2, 1, hi);
  } else if (v === 3) {
    px(ctx, x + 4, y + 7, 2, 1, mid);
    px(ctx, x + 10, y + 4, 1, 2, hi);
    px(ctx, x + 2, y + 13, 1, 1, lo);
    px(ctx, x + 12, y + 9, 1, 1, mid);
  } else {
    px(ctx, x + 6, y + 3, 1, 2, hi);
    px(ctx, x + 1, y + 6, 1, 1, lo);
    px(ctx, x + 9, y + 10, 2, 1, mid);
    px(ctx, x + 14, y + 13, 1, 1, hi);
  }
}

export function drawPath(ctx, x, y, tile) {
  px(ctx, x, y, tile, tile, '#8a8270');
  px(ctx, x + 1, y + 1, tile - 2, tile - 2, '#9a9280');
  px(ctx, x + 0, y + 7, tile, 1, '#7a7460');
  px(ctx, x + 7, y + 0, 1, tile, '#7a7460');
  px(ctx, x + 2, y + 2, 2, 1, '#aea890');
  px(ctx, x + 10, y + 3, 3, 1, '#aea890');
  px(ctx, x + 3, y + 10, 2, 1, '#6e6858');
  px(ctx, x + 11, y + 12, 2, 1, '#aea890');
  px(ctx, x + 9, y + 9, 1, 1, '#6e6858');
}

export function drawDirt(ctx, x, y, tile) {
  px(ctx, x, y, tile, tile, '#6a5438');
  px(ctx, x + 1, y + 1, tile - 2, tile - 2, '#755c3e');
  px(ctx, x + 2, y + 3, 2, 1, '#5a4428');
  px(ctx, x + 9, y + 5, 3, 1, '#8a6a48');
  px(ctx, x + 4, y + 10, 2, 1, '#5a4428');
  px(ctx, x + 12, y + 12, 2, 1, '#4a3820');
  px(ctx, x + 7, y + 7, 1, 1, '#8a6a48');
}

export function drawStone(ctx, x, y, tile) {
  px(ctx, x, y, tile, tile, '#6a6860');
  px(ctx, x + 1, y + 1, tile - 2, tile - 2, '#8a8880');
  px(ctx, x + 0, y + 5, tile, 1, '#5a5850');
  px(ctx, x + 0, y + 10, tile, 1, '#5a5850');
  px(ctx, x + 5, y + 0, 1, tile, '#5a5850');
  px(ctx, x + 10, y + 0, 1, tile, '#5a5850');
  px(ctx, x + 2, y + 2, 2, 1, '#a8a698');
  px(ctx, x + 7, y + 7, 2, 1, '#a8a698');
  px(ctx, x + 12, y + 3, 1, 1, '#4a4840');
}

export function drawWater(ctx, x, y, tile, t) {
  px(ctx, x, y, tile, tile, '#1e4a68');
  const phase = Math.sin(t * 0.003 + x * 0.08 + y * 0.05);
  const wave = phase > 0 ? '#3a6e8e' : '#2a5a7a';
  const spark = phase > 0.5 ? '#5a8aaa' : '#3a6e8e';
  px(ctx, x + 1, y + 3, 6, 1, wave);
  px(ctx, x + 8, y + 7, 5, 1, spark);
  px(ctx, x + 3, y + 11, 7, 1, wave);
  px(ctx, x + 12, y + 4, 2, 1, '#4a7a98');
  px(ctx, x + 2, y + 14, 4, 1, '#163850');
}

export function drawFlower(ctx, x, y, tile) {
  drawGrass(ctx, x, y, tile, 1);
  // stem
  px(ctx, x + 7, y + 8, 1, 4, '#2a6020');
  // petals
  px(ctx, x + 6, y + 5, 3, 3, '#c84868');
  px(ctx, x + 5, y + 6, 1, 1, '#d86078');
  px(ctx, x + 9, y + 6, 1, 1, '#d86078');
  px(ctx, x + 7, y + 4, 1, 1, '#d86078');
  px(ctx, x + 7, y + 6, 1, 1, '#f0e070');
}

/** Ashgrove tree — trunk + layered canopy silhouette (slightly taller than one tile). */
export function drawTree(ctx, x, y, tile, depleted) {
  if (depleted) {
    // stump + rings
    px(ctx, x + 5, y + 9, 6, 5, '#4a3018');
    px(ctx, x + 6, y + 10, 4, 3, '#6a4828');
    px(ctx, x + 7, y + 11, 2, 1, '#3a2008');
    px(ctx, x + 6, y + 10, 4, 1, '#8a6840');
    return;
  }
  // ground shadow
  px(ctx, x + 2, y + 13, 12, 3, 'rgba(0,0,0,0.28)');
  // trunk
  px(ctx, x + 7, y + 8, 3, 7, '#5a3820');
  px(ctx, x + 8, y + 8, 1, 7, '#7a5438');
  px(ctx, x + 6, y + 12, 5, 2, '#4a2810');
  // canopy — dark outline then mid then highlight (reads as a tree, not a blob)
  px(ctx, x + 1, y + 2, 14, 9, '#1e4a1c');
  px(ctx, x + 2, y + 1, 12, 2, '#1e4a1c');
  px(ctx, x + 3, y + 0, 10, 1, '#1e4a1c');
  px(ctx, x + 0, y + 4, 2, 5, '#1e4a1c');
  px(ctx, x + 14, y + 4, 2, 5, '#1e4a1c');
  px(ctx, x + 2, y + 3, 12, 7, '#2f6a2a');
  px(ctx, x + 3, y + 2, 10, 2, '#2f6a2a');
  px(ctx, x + 4, y + 1, 8, 1, '#3d7e36');
  px(ctx, x + 4, y + 4, 8, 5, '#3d7e36');
  px(ctx, x + 5, y + 3, 6, 2, '#4a8e42');
  px(ctx, x + 6, y + 5, 4, 2, '#5a9e50');
  // leaf speckles
  px(ctx, x + 3, y + 6, 1, 1, '#1e4a1c');
  px(ctx, x + 11, y + 5, 1, 1, '#1e4a1c');
  px(ctx, x + 8, y + 2, 1, 1, '#6ab060');
  px(ctx, x + 5, y + 7, 1, 1, '#6ab060');
}

/** Copper seam — rocky ore node with copper veins. */
export function drawRock(ctx, x, y, tile, depleted) {
  if (depleted) {
    px(ctx, x + 3, y + 9, 10, 5, '#4a4840');
    px(ctx, x + 4, y + 10, 8, 3, '#5a5850');
    px(ctx, x + 6, y + 11, 4, 1, '#3a3830');
    return;
  }
  // shadow
  px(ctx, x + 2, y + 13, 12, 2, 'rgba(0,0,0,0.25)');
  // rock body silhouette
  px(ctx, x + 2, y + 5, 12, 9, '#4a4840');
  px(ctx, x + 3, y + 4, 10, 2, '#4a4840');
  px(ctx, x + 4, y + 3, 8, 1, '#4a4840');
  px(ctx, x + 1, y + 7, 2, 5, '#4a4840');
  px(ctx, x + 13, y + 7, 2, 5, '#4a4840');
  // mid tones / facets
  px(ctx, x + 3, y + 6, 10, 7, '#6a6860');
  px(ctx, x + 4, y + 5, 8, 2, '#7a7870');
  px(ctx, x + 5, y + 4, 6, 1, '#8a8880');
  px(ctx, x + 4, y + 8, 5, 3, '#8a8880');
  px(ctx, x + 10, y + 9, 3, 2, '#5a5850');
  // copper ore veins / flecks (readable at a glance)
  px(ctx, x + 5, y + 7, 3, 2, '#b87333');
  px(ctx, x + 6, y + 7, 1, 1, '#e8a860');
  px(ctx, x + 9, y + 6, 2, 2, '#c87830');
  px(ctx, x + 10, y + 6, 1, 1, '#f0b870');
  px(ctx, x + 7, y + 10, 3, 1, '#d49040');
  px(ctx, x + 4, y + 11, 2, 1, '#a86028');
}

/** Waybank booth — stone counter with roof and teller window. */
export function drawBank(ctx, x, y, tile) {
  // shadow
  px(ctx, x + 1, y + 14, 14, 2, 'rgba(0,0,0,0.3)');
  // side walls
  px(ctx, x + 1, y + 5, 14, 9, '#5a5040');
  px(ctx, x + 2, y + 6, 12, 7, '#7a7060');
  // roof / awning
  px(ctx, x + 0, y + 2, 16, 4, '#6a3020');
  px(ctx, x + 1, y + 1, 14, 2, '#8a4030');
  px(ctx, x + 2, y + 0, 12, 1, '#a85038');
  px(ctx, x + 1, y + 4, 14, 1, '#4a2010');
  // counter top
  px(ctx, x + 2, y + 8, 12, 2, '#c8b070');
  px(ctx, x + 2, y + 8, 12, 1, '#e0d098');
  // teller window / grill
  px(ctx, x + 4, y + 10, 8, 4, '#2a2418');
  px(ctx, x + 5, y + 11, 2, 2, '#5a5040');
  px(ctx, x + 9, y + 11, 2, 2, '#5a5040');
  // gold Waybank gem / sign
  px(ctx, x + 7, y + 2, 2, 2, '#d4a020');
  px(ctx, x + 7, y + 2, 1, 1, '#f0d060');
  // booth posts
  px(ctx, x + 1, y + 5, 1, 9, '#3a3428');
  px(ctx, x + 14, y + 5, 1, 9, '#3a3428');
}

/**
 * Readable humanoid player with facing + walk bob/step.
 * Drawn in a 16×16 footprint with slight vertical overhang.
 */
export function drawPlayer(ctx, pxX, pxY, facing, walking, t) {
  const bob = walking ? Math.sin(t * 0.02) * 1 : 0;
  const x = Math.round(pxX);
  const y = Math.round(pxY + bob);
  const step = walking ? (Math.sin(t * 0.028) > 0 ? 1 : -1) : 0;

  // shadow
  px(ctx, x + 3, y + 14, 10, 2, 'rgba(0,0,0,0.32)');

  // legs (animate when walking)
  const legL = x + 5 + (facing === 'left' || facing === 'right' ? 0 : step);
  const legR = x + 9 - (facing === 'left' || facing === 'right' ? 0 : step);
  if (facing === 'left' || facing === 'right') {
    px(ctx, x + 6, y + 13, 2, 2, '#2a2838');
    px(ctx, x + 8 + step, y + 13, 2, 2, '#2a2838');
  } else {
    px(ctx, legL, y + 13, 2, 2, '#2a2838');
    px(ctx, legR, y + 13, 2, 2, '#2a2838');
  }

  // tunic body
  px(ctx, x + 4, y + 7, 8, 7, '#2a4a78');
  px(ctx, x + 5, y + 8, 6, 5, '#3a5a8a');
  px(ctx, x + 6, y + 9, 4, 3, '#4a6a9a');
  // belt
  px(ctx, x + 4, y + 12, 8, 1, '#6a5020');
  px(ctx, x + 7, y + 12, 2, 1, '#c8a040');

  // arms depend on facing
  if (facing === 'down' || facing === 'up') {
    px(ctx, x + 3, y + 8, 2, 4, '#d4a878');
    px(ctx, x + 11, y + 8, 2, 4, '#d4a878');
    px(ctx, x + 3, y + 8, 2, 2, '#3a5a8a');
    px(ctx, x + 11, y + 8, 2, 2, '#3a5a8a');
  } else if (facing === 'right') {
    px(ctx, x + 11, y + 8 + step, 3, 2, '#3a5a8a');
    px(ctx, x + 13, y + 9 + step, 2, 2, '#d4a878');
    px(ctx, x + 3, y + 9, 2, 3, '#2a4068');
  } else {
    px(ctx, x + 2, y + 8 + step, 3, 2, '#3a5a8a');
    px(ctx, x + 1, y + 9 + step, 2, 2, '#d4a878');
    px(ctx, x + 11, y + 9, 2, 3, '#2a4068');
  }

  // head
  px(ctx, x + 5, y + 2, 6, 5, '#d4a878');
  px(ctx, x + 6, y + 3, 4, 3, '#e8c090');
  // hair
  px(ctx, x + 5, y + 1, 6, 2, '#3a2818');
  px(ctx, x + 4, y + 2, 1, 2, '#3a2818');
  px(ctx, x + 11, y + 2, 1, 2, '#3a2818');
  if (facing === 'up') {
    // back of head / more hair
    px(ctx, x + 5, y + 2, 6, 3, '#3a2818');
    px(ctx, x + 6, y + 4, 4, 1, '#d4a878');
  }

  // face / facing cue
  if (facing === 'down') {
    px(ctx, x + 6, y + 4, 1, 1, '#2a2010'); // eye
    px(ctx, x + 9, y + 4, 1, 1, '#2a2010');
    px(ctx, x + 7, y + 5, 2, 1, '#c08060'); // mouth hint
  } else if (facing === 'left') {
    px(ctx, x + 5, y + 4, 1, 1, '#2a2010');
    px(ctx, x + 5, y + 5, 1, 1, '#c08060');
  } else if (facing === 'right') {
    px(ctx, x + 10, y + 4, 1, 1, '#2a2010');
    px(ctx, x + 10, y + 5, 1, 1, '#c08060');
  }
}

/** Tiny inventory icons drawn to offscreen canvases. */
export function getItemIcon(itemId) {
  if (cache.has(itemId)) return cache.get(itemId);
  const c = makeCanvas(16, 16);
  const ctx = c.getContext('2d');
  if (itemId === 'timber') {
    px(ctx, 2, 6, 12, 5, '#5a3018');
    px(ctx, 3, 7, 10, 3, '#8b5a2b');
    px(ctx, 4, 8, 8, 1, '#c4a060');
    px(ctx, 5, 5, 2, 2, '#6a4020');
    px(ctx, 10, 5, 2, 2, '#6a4020');
    px(ctx, 1, 8, 2, 2, '#4a2810');
  } else if (itemId === 'ore') {
    px(ctx, 3, 4, 10, 9, '#5a5850');
    px(ctx, 4, 5, 8, 7, '#8a8880');
    px(ctx, 5, 4, 6, 1, '#9a9890');
    px(ctx, 5, 6, 4, 3, '#b87333');
    px(ctx, 6, 7, 2, 1, '#e8a860');
    px(ctx, 9, 10, 3, 2, '#c87830');
  }
  cache.set(itemId, c);
  return c;
}

/** Click destination marker. */
export function drawMarker(ctx, x, y, t) {
  const pulse = 3 + Math.sin(t * 0.01) * 1.5;
  ctx.strokeStyle = 'rgba(255, 220, 100, 0.85)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 220, 100, 0.5)';
  ctx.fillRect(x - 1, y - 1, 2, 2);
}
