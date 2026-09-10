# Grovehaven Skilling Grounds

An unofficial fan **homage** to early-2000s fantasy MMOs (especially the *feel* of RuneScape 2–era outdoor skilling).  
**Original pixel art, names, and UI.** Not affiliated with Jagex Ltd. or RuneScape.

No Jagex/RuneScape sprites, models, audio, fonts, or trademarked product titles are used in this project.

## How to play

### Run locally (no npm)

```bash
cd rs2-homage   # or: cd /workspace/rs2-homage
python3 -m http.server 8080
```

Open **http://localhost:8080** in your browser.

ES modules need a static server — opening `index.html` via `file://` may be blocked by the browser.

### Controls

| Action | Desktop | Mobile / touch |
|--------|---------|----------------|
| Walk | Left-click empty ground | Tap empty ground |
| Chop / mine / bank | Click an Ashgrove tree, Copper seam, or Waybank booth | Tap the object |
| Cancel action | Click elsewhere / walk away | Tap elsewhere |

### Sandbox loop

1. Walk the outdoor map (grass, stone paths, water).
2. Chop **Ashgrove Trees** → **Ashgrove Logs** + **Woodcutting** XP (progress bar).
3. Mine **Copper Seams** → **Copper Seam Ore** + **Mining** XP.
4. Click the **Waybank Booth** to deposit your inventory.
5. Full inventory (28 slots) blocks gathering with a chat warning — bank to continue.
6. Watch levels / XP bars in the Skills panel; actions appear in the bottom log.

Resources deplete briefly, then respawn. Trees, rocks, water, and the booth block walking.

## Disclaimer

This is an **unofficial fan homage** with **original assets**.  
It is **not** affiliated with, endorsed by, or connected to Jagex Ltd. or RuneScape.

## Project layout

```
rs2-homage/
  index.html
  css/style.css
  js/
    config.js    # map, XP curve, Ashgrove / Copper / Waybank names
    sprites.js   # procedural pixel art
    world.js     # collision, render, respawn
    player.js    # walk, inventory, skills
    ui.js        # panels + chat
    game.js      # input + main loop
  README.md
  .gitignore
```

## Known limits

- One outdoor map; no combat, quests, or multiplayer.
- Straight-line walk with axis slide (not full A* pathfinding).
- Inventory items are unstackable in this slice (so the bank loop is reachable).
- Procedural rectangle sprites only — intentionally chunky / low-res.

## Intent

Personal / educational fan project. Homage only — do not redistribute as an official RuneScape product. Ready to push to `https://github.com/kadenliddle/rs2-homage` (push not performed by this build).
