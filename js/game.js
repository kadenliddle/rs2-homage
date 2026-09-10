/**
 * Grovehaven Skilling Grounds — main loop
 * Unofficial fan homage · original assets only
 */
import { TILE, MAP_W, MAP_H, SKILLS, ITEMS } from './config.js';
import { World, PLAYER_START } from './world.js';
import { Player } from './player.js';
import { UI } from './ui.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const world = new World();
const player = new Player(PLAYER_START);
const ui = new UI();

let marker = null;
let markerUntil = 0;
let pendingInteract = null; // object to interact with after walking adjacent
let lastTs = performance.now();

ui.refreshInventory(player);
ui.refreshSkills(player);

function canvasToWorld(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = (clientX - rect.left) * scaleX;
  const cy = (clientY - rect.top) * scaleY;
  // Convert viewport pixels → world tiles using camera offset
  const wx = (cx + world.camX) / TILE;
  const wy = (cy + world.camY) / TILE;
  return { x: wx, y: wy, tx: Math.floor(wx), ty: Math.floor(wy) };
}

function setMarker(wx, wy) {
  marker = { x: wx, y: wy };
  markerUntil = performance.now() + 1200;
}

function tryInteract(obj) {
  if (!obj) return;
  if (obj.kind === 'tree' || obj.kind === 'rock') {
    if (obj.depleted) {
      ui.log(`The ${obj.name} looks bare for now.`, 'warn');
      return;
    }
    if (player.isInvFull()) {
      ui.log('Your inventory is full. Visit the Waybank booth to deposit.', 'warn');
      return;
    }
    const type = obj.kind === 'tree' ? 'chop' : 'mine';
    const label = obj.kind === 'tree' ? `Chopping ${obj.name}…` : `Mining ${obj.name}…`;
    player.startAction(type, obj, obj.gatherMs || 2200);
    ui.showAction(label, 0);
  } else if (obj.kind === 'bank') {
    const n = player.clearInventory();
    if (n === 0) ui.log('Your inventory is already empty.', 'system');
    else {
      ui.log(`You deposit ${n} item${n === 1 ? '' : 's'} at the Waybank booth.`);
      ui.refreshInventory(player);
    }
  }
}

function onPointer(clientX, clientY) {
  const { x, y, tx, ty } = canvasToWorld(clientX, clientY);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return;

  const obj = world.objectAt(tx, ty);
  player.cancelAction();
  ui.hideAction();

  if (obj) {
    // Walk to nearest walkable adjacent tile, then interact
    pendingInteract = obj;
    const adj = findAdjacentStand(obj.x, obj.y);
    if (adj) {
      player.setWalkTarget(adj.x, adj.y);
      setMarker(adj.x, adj.y);
    } else if (player.inReachOf(obj)) {
      pendingInteract = null;
      tryInteract(obj);
    } else {
      ui.log('You cannot reach that.', 'warn');
      pendingInteract = null;
    }
    return;
  }

  pendingInteract = null;
  // Walk to click point (clamp into walkable)
  let wx = Math.max(0.35, Math.min(MAP_W - 0.35, x));
  let wy = Math.max(0.35, Math.min(MAP_H - 0.35, y));
  if (!world.canOccupy(wx, wy)) {
    // snap to tile center if tile walkable
    const cx = tx + 0.5;
    const cy = ty + 0.5;
    if (world.isWalkable(tx, ty) && world.canOccupy(cx, cy)) {
      wx = cx;
      wy = cy;
    } else {
      ui.log('You cannot walk there.', 'warn');
      return;
    }
  }
  player.setWalkTarget(wx, wy);
  setMarker(wx, wy);
}

/** Prefer closest walkable adjacent tile to the object. */
function findAdjacentStand(ox, oy) {
  const dirs = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];
  let best = null;
  let bestD = Infinity;
  for (const [dx, dy] of dirs) {
    const tx = ox + dx;
    const ty = oy + dy;
    if (!world.isWalkable(tx, ty)) continue;
    const wx = tx + 0.5;
    const wy = ty + 0.5;
    if (!world.canOccupy(wx, wy)) continue;
    const d = player.distTo(wx, wy);
    if (d < bestD) {
      bestD = d;
      best = { x: wx, y: wy };
    }
  }
  return best;
}

function completeGather(action, now) {
  const obj = action.target;
  if (!obj || obj.depleted) {
    ui.hideAction();
    player.cancelAction();
    return;
  }
  if (player.isInvFull()) {
    ui.log('Your inventory is full. Visit the Waybank booth to deposit.', 'warn');
    ui.hideAction();
    player.cancelAction();
    return;
  }

  if (action.type === 'chop') {
    player.addItem('timber', 1);
    const r = player.addXp('woodcutting', SKILLS.woodcutting.xpPer);
    ui.log(`You chop the ${obj.name} and receive ${ITEMS.timber.name}.`);
    ui.log(`Woodcutting XP +${SKILLS.woodcutting.xpPer}`, 'xp');
    if (r.after > r.before) ui.log(`Woodcutting level up! You are now level ${r.after}.`, 'level');
  } else if (action.type === 'mine') {
    player.addItem('ore', 1);
    const r = player.addXp('mining', SKILLS.mining.xpPer);
    ui.log(`You mine the ${obj.name} and receive ${ITEMS.ore.name}.`);
    ui.log(`Mining XP +${SKILLS.mining.xpPer}`, 'xp');
    if (r.after > r.before) ui.log(`Mining level up! You are now level ${r.after}.`, 'level');
  }

  world.deplete(obj, now);
  ui.refreshInventory(player);
  ui.refreshSkills(player);
  ui.hideAction();
  player.cancelAction();
}

function tick(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000);
  lastTs = ts;
  const now = ts;

  world.update(now);
  player.updateMove(dt, world);

  // Arrive for pending interact
  if (pendingInteract && !player.target && !player.action) {
    if (player.inReachOf(pendingInteract)) {
      const obj = pendingInteract;
      pendingInteract = null;
      tryInteract(obj);
    } else {
      pendingInteract = null;
    }
  }

  // Gathering progress
  if (player.action) {
    const a = player.action;
    const obj = a.target;
    if (!obj || obj.depleted || !player.inReachOf(obj)) {
      ui.hideAction();
      player.cancelAction();
    } else if (player.isInvFull()) {
      ui.log('Your inventory is full. Visit the Waybank booth to deposit.', 'warn');
      ui.hideAction();
      player.cancelAction();
    } else {
      const elapsed = now - a.started;
      const p = elapsed / a.duration;
      const label =
        a.type === 'chop' ? `Chopping ${obj.name}…` : `Mining ${obj.name}…`;
      ui.showAction(label, p);
      if (elapsed >= a.duration) completeGather(a, now);
    }
  }

  if (marker && now > markerUntil && !player.walking) marker = null;

  // draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.render(
    ctx,
    player,
    marker && (player.walking || now < markerUntil) ? marker : null,
    now,
    canvas.width,
    canvas.height,
  );

  requestAnimationFrame(tick);
}

// Input — mouse + touch
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  canvas.setPointerCapture?.(e.pointerId);
  onPointer(e.clientX, e.clientY);
});

// Prevent scroll/zoom gestures on canvas
canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });

requestAnimationFrame(tick);
