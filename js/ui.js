import { ITEMS, INV_SIZE } from './config.js';
import { getItemIcon } from './sprites.js';

export class UI {
  constructor() {
    this.chatEl = document.getElementById('chat-log');
    this.invGrid = document.getElementById('inventory-grid');
    this.invCount = document.getElementById('inv-count');
    this.actionBar = document.getElementById('action-bar');
    this.actionLabel = document.getElementById('action-label');
    this.actionFill = document.getElementById('action-fill');
    this._buildSlots();
    this.log('Welcome to Grovehaven Skilling Grounds.', 'system');
    this.log('Click or tap the ground to walk. Interact with Ashgrove trees, Copper seams, or the Waybank booth.', 'system');
  }

  _buildSlots() {
    this.invGrid.innerHTML = '';
    this.slots = [];
    for (let i = 0; i < INV_SIZE; i++) {
      const el = document.createElement('div');
      el.className = 'inv-slot';
      this.invGrid.appendChild(el);
      this.slots.push(el);
    }
  }

  log(msg, kind = '') {
    const line = document.createElement('div');
    line.className = 'line' + (kind ? ` ${kind}` : '');
    line.textContent = msg;
    this.chatEl.appendChild(line);
    this.chatEl.scrollTop = this.chatEl.scrollHeight;
    while (this.chatEl.children.length > 40) {
      this.chatEl.removeChild(this.chatEl.firstChild);
    }
  }

  refreshInventory(player) {
    this.invCount.textContent = `(${player.invCount()}/${INV_SIZE})`;
    for (let i = 0; i < INV_SIZE; i++) {
      const slot = this.slots[i];
      slot.innerHTML = '';
      const item = player.inventory[i];
      if (!item) continue;
      const img = document.createElement('canvas');
      img.width = 16;
      img.height = 16;
      img.className = 'icon';
      img.getContext('2d').drawImage(getItemIcon(item.id), 0, 0);
      img.title = ITEMS[item.id]?.name || item.id;
      slot.appendChild(img);
    }
  }

  refreshSkills(player) {
    for (const key of ['woodcutting', 'mining']) {
      const p = player.xpProgress(key);
      const prefix = key === 'woodcutting' ? 'wc' : 'mining';
      document.getElementById(`${prefix}-level`).textContent = String(p.level);
      document.getElementById(`${prefix}-xp`).style.width = `${p.pct}%`;
      document.getElementById(`${prefix}-xp-text`).textContent =
        p.level >= 99 ? `${p.xp} XP (max)` : `${p.xp} XP · next ${p.next}`;
    }
  }

  showAction(label, progress01) {
    this.actionBar.classList.remove('hidden');
    this.actionLabel.textContent = label;
    this.actionFill.style.width = `${Math.max(0, Math.min(100, progress01 * 100))}%`;
  }

  hideAction() {
    this.actionBar.classList.add('hidden');
    this.actionFill.style.width = '0%';
  }
}
