/** Original procedural pixel sprites — no ripped assets. */

const cache = new Map();

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function drawGrass(ctx, x, y, tile, variant) {
  const base = variant % 3 === 0 ? '#4a7a3a' : variant % 3 === 1 ? '#3f6e34' : '#457538';
  px(ctx, x, y, tile, tile, base);
  // soft tufts
  px(ctx, x + 3, y + 4, 2, 2, '#5a8a48');
  px(ctx, x + 10, y + 9, 2, 2, '#356028');
  px(ctx, x + 7, y + 2, 1, 1, '#6a9a55');
}

export function drawPath(ctx, x, y, tile) {
  px(ctx, x, y, tile, tile, '#8a8470');
  px(ctx, x + 1, y + 1, tile - 2, tile - 2, '#9a9480');
  px(ctx, x + 3, y + 4, 2, 1, '#7a7460');
  px(ctx, x + 9, y + 10, 3, 1, '#a8a090');
}

export function drawDirt(ctx, x, y, tile) {
  px(ctx, x, y, tile, tile, '#6a5438');
  px(ctx, x + 2, y + 3, 2, 1, '#5a4428');
  px(ctx, x + 10, y + 8, 2, 1, '#7a6448');
}

export function drawWater(ctx, x, y, tile, t) {
  const wave = Math.sin(t * 0.003 + x * 0.1) > 0 ? '#3a6a8a' : '#2e5a78';
  px(ctx, x, y, tile, tile, '#2a5070');
  px(ctx, x + 2, y + 4, 5, 1, wave);
  px(ctx, x + 8, y + 10, 4, 1, '#4a7a9a');
}

export function drawFlower(ctx, x, y, tile) {
  drawGrass(ctx, x, y, tile, 1);
  px(ctx, x + 6, y + 5, 3, 3, '#c85070');
  px(ctx, x + 7, y + 6, 1, 1, '#f0e080');
}

/** Chunky Ashgrove tree (top-down canopy + trunk stump). */
export function drawTree(ctx, x, y, tile, depleted) {
  if (depleted) {
    // stump
    px(ctx, x + 5, y + 6, 6, 5, '#5a3a20');
    px(ctx, x + 6, y + 7, 4, 3, '#7a5a38');
    px(ctx, x + 7, y + 8, 2, 1, '#3a2810');
    return;
  }
  // shadow
  px(ctx, x + 3, y + 11, 10, 3, 'rgba(0,0,0,0.25)');
  // canopy layers
  px(ctx, x + 2, y + 1, 12, 10, '#2d5a28');
  px(ctx, x + 3, y + 2, 10, 8, '#3d7a38');
  px(ctx, x + 5, y + 3, 6, 5, '#4a8a42');
  // trunk peek
  px(ctx, x + 7, y + 10, 2, 4, '#6a4428');
  px(ctx, x + 6, y + 11, 4, 2, '#5a3820');
}

/** Copper seam rock. */
export function drawRock(ctx, x, y, tile, depleted) {
  if (depleted) {
    px(ctx, x + 4, y + 8, 8, 4, '#5a5850');
    px(ctx, x + 5, y + 9, 6, 2, '#4a4840');
    return;
  }
  px(ctx, x + 2, y + 4, 12, 10, '#6a6860');
  px(ctx, x + 3, y + 5, 10, 8, '#8a8880');
  px(ctx, x + 4, y + 6, 8, 5, '#9a9890');
  // copper flecks
  px(ctx, x + 5, y + 7, 3, 2, '#b87333');
  px(ctx, x + 10, y + 9, 2, 2, '#d49040');
  px(ctx, x + 7, y + 10, 2, 1, '#e8a860');
}

/** Waybank booth — stone counter vibe. */
export function drawBank(ctx, x, y, tile) {
  // base plinth (2 tiles tall visually centered on tile)
  px(ctx, x + 1, y + 2, 14, 12, '#5a5648');
  px(ctx, x + 2, y + 3, 12, 10, '#8a8470');
  // counter top
  px(ctx, x + 2, y + 3, 12, 3, '#c8b88a');
  px(ctx, x + 3, y + 4, 10, 1, '#e8dcb0');
  // booth window / grill
  px(ctx, x + 4, y + 7, 8, 5, '#3a3428');
  px(ctx, x + 5, y + 8, 2, 3, '#6a6048');
  px(ctx, x + 9, y + 8, 2, 3, '#6a6048');
  // sign gem
  px(ctx, x + 7, y + 1, 2, 2, '#d4a020');
}

/** Simple geometric player figure (top-down). */
export function drawPlayer(ctx, pxX, pxY, facing, walking, t) {
  const bob = walking ? Math.sin(t * 0.02) * 1 : 0;
  const x = Math.round(pxX);
  const y = Math.round(pxY + bob);
  // shadow
  px(ctx, x + 3, y + 13, 10, 3, 'rgba(0,0,0,0.3)');
  // body tunic
  px(ctx, x + 4, y + 6, 8, 8, '#3a5a8a');
  px(ctx, x + 5, y + 7, 6, 6, '#4a6a9a');
  // head
  px(ctx, x + 5, y + 2, 6, 5, '#d4a878');
  px(ctx, x + 6, y + 3, 4, 3, '#e8c090');
  // hair
  px(ctx, x + 5, y + 1, 6, 2, '#3a2818');
  // facing indicator (nose / gaze)
  if (facing === 'down') px(ctx, x + 7, y + 5, 2, 1, '#2a2010');
  if (facing === 'up') px(ctx, x + 7, y + 2, 2, 1, '#2a2010');
  if (facing === 'left') px(ctx, x + 5, y + 4, 1, 2, '#2a2010');
  if (facing === 'right') px(ctx, x + 10, y + 4, 1, 2, '#2a2010');
  // legs
  const step = walking ? (Math.sin(t * 0.025) > 0 ? 1 : -1) : 0;
  px(ctx, x + 5 + step, y + 13, 2, 2, '#2a2838');
  px(ctx, x + 9 - step, y + 13, 2, 2, '#2a2838');
}

/** Tiny inventory icons drawn to offscreen canvases. */
export function getItemIcon(itemId) {
  if (cache.has(itemId)) return cache.get(itemId);
  const c = makeCanvas(16, 16);
  const ctx = c.getContext('2d');
  if (itemId === 'timber') {
    px(ctx, 3, 5, 10, 6, '#6a4020');
    px(ctx, 4, 6, 8, 4, '#8b5a2b');
    px(ctx, 5, 7, 6, 2, '#c4a060');
    px(ctx, 2, 7, 2, 2, '#5a3018');
  } else if (itemId === 'ore') {
    px(ctx, 4, 4, 8, 8, '#6a6860');
    px(ctx, 5, 5, 6, 6, '#8a8880');
    px(ctx, 6, 6, 3, 3, '#b87333');
    px(ctx, 9, 9, 2, 2, '#e8a860');
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
