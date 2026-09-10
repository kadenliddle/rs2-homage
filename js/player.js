import { INV_SIZE, PLAYER_SPEED, REACH, ITEMS, SKILLS, xpForLevel, levelFromXp } from './config.js';

export class Player {
  constructor(start) {
    this.x = start.x;
    this.y = start.y;
    this.target = null;
    this.facing = 'down';
    this.walking = false;
    /** @type {{id:string}[]} one item per slot (sandbox: unstackable so bank loop matters) */
    this.inventory = [];
    this.skills = {
      woodcutting: { xp: 0 },
      mining: { xp: 0 },
    };
    this.action = null;
  }

  invCount() {
    return this.inventory.length;
  }

  isInvFull() {
    return this.invCount() >= INV_SIZE;
  }

  addItem(itemId, qty = 1) {
    for (let i = 0; i < qty; i++) {
      if (this.isInvFull()) return i > 0;
      this.inventory.push({ id: itemId });
    }
    return true;
  }

  clearInventory() {
    const n = this.inventory.length;
    this.inventory = [];
    return n;
  }

  skillLevel(key) {
    return levelFromXp(this.skills[key].xp);
  }

  addXp(key, amount) {
    const before = this.skillLevel(key);
    this.skills[key].xp += amount;
    const after = this.skillLevel(key);
    return { before, after, xp: this.skills[key].xp };
  }

  xpProgress(key) {
    const xp = this.skills[key].xp;
    const level = levelFromXp(xp);
    const cur = xpForLevel(level);
    const next = xpForLevel(Math.min(99, level + 1));
    const span = Math.max(1, next - cur);
    return { level, xp, pct: level >= 99 ? 100 : ((xp - cur) / span) * 100, next };
  }

  setWalkTarget(wx, wy) {
    this.target = { x: wx, y: wy };
    this.cancelAction();
  }

  cancelAction() {
    this.action = null;
  }

  startAction(type, target, duration) {
    this.action = { type, target, started: performance.now(), duration };
    this.target = null;
    this.walking = false;
  }

  distTo(wx, wy) {
    return Math.hypot(this.x - wx, this.y - wy);
  }

  inReachOf(obj) {
    return this.distTo(obj.x + 0.5, obj.y + 0.5) <= REACH;
  }

  updateMove(dt, world) {
    if (!this.target) {
      this.walking = false;
      return;
    }
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.08) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.target = null;
      this.walking = false;
      return;
    }
    this.walking = true;
    if (Math.abs(dx) > Math.abs(dy)) this.facing = dx > 0 ? 'right' : 'left';
    else this.facing = dy > 0 ? 'down' : 'up';

    const step = PLAYER_SPEED * dt;
    const nx = this.x + (dx / dist) * Math.min(step, dist);
    const ny = this.y + (dy / dist) * Math.min(step, dist);

    let moved = false;
    if (world.canOccupy(nx, ny)) {
      this.x = nx;
      this.y = ny;
      moved = true;
    } else if (world.canOccupy(nx, this.y)) {
      this.x = nx;
      moved = true;
    } else if (world.canOccupy(this.x, ny)) {
      this.y = ny;
      moved = true;
    }
    if (!moved) {
      this.target = null;
      this.walking = false;
    }
  }
}

export { ITEMS, SKILLS, INV_SIZE };
