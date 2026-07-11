import { ParticleSystem } from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

const PERCEPTION = 60;
const SEPARATION_DIST = 25;
const MAX_SPEED = 150;
const MIN_SPEED = 50;
const SEP_WEIGHT = 200;
const ALIGN_WEIGHT = 3;
const COHES_WEIGHT = 1.5;

const PALETTE = [
  [0, 180, 255], [0, 220, 180], [100, 220, 255],
  [180, 120, 255], [255, 200, 80],
];

class SpatialGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }

  clear() {
    this.cells.clear();
  }

  insert(p) {
    const cx = Math.floor(p.x / this.cellSize);
    const cy = Math.floor(p.y / this.cellSize);
    const key = cx + ':' + cy;
    let cell = this.cells.get(key);
    if (!cell) {
      cell = [];
      this.cells.set(key, cell);
    }
    cell.push(p);
  }

  query(x, y, radius) {
    const results = [];
    const minCX = Math.floor((x - radius) / this.cellSize);
    const maxCX = Math.floor((x + radius) / this.cellSize);
    const minCY = Math.floor((y - radius) / this.cellSize);
    const maxCY = Math.floor((y + radius) / this.cellSize);
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const cell = this.cells.get(cx + ':' + cy);
        if (!cell) continue;
        for (let i = 0; i < cell.length; i++) {
          results.push(cell[i]);
        }
      }
    }
    return results;
  }
}

const OBSTACLE_SIZE = 40;
const OBSTACLE_AVOID_DIST = 60;
const OBSTACLE_AVOID_WEIGHT = 300;

export function createFlockingDemo(w, h) {
  const obstacles = [];
  const grid = new SpatialGrid(PERCEPTION);

  const renderParticle = (ctx, p) => {
    const size = 7;
    const angle = Math.atan2(p.vy, p.vx);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.6, -size * 0.5);
    ctx.lineTo(-size * 0.6, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 2000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });

  let i = 0;
  ps.emit(150, (p) => {
    p.x = Math.random() * w;
    p.y = Math.random() * h;
    const a = Math.random() * Math.PI * 2;
    const s = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    p.vx = Math.cos(a) * s;
    p.vy = Math.sin(a) * s;
    p.life = 1e10;
    p.maxLife = 1e10;
    const c = PALETTE[i % PALETTE.length];
    p.r = c[0];
    p.g = c[1];
    p.b = c[2];
    i++;
  });

  function addBird(x, y) {
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    ps.emit(1, (p) => {
      p.x = x + (Math.random() - 0.5) * 10;
      p.y = y + (Math.random() - 0.5) * 10;
      const a = Math.random() * Math.PI * 2;
      const s = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s;
      p.life = 1e10;
      p.maxLife = 1e10;
      p.r = c[0];
      p.g = c[1];
      p.b = c[2];
    });
  }

  function addObstacle(x, y) {
    obstacles.push({ x, y });
  }

  const onPointerDown = (e) => {
    if (e.button === 0) addBird(e.clientX, e.clientY);
    if (e.button === 2) addObstacle(e.clientX, e.clientY);
  };
  const onContextMenu = (e) => e.preventDefault();
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("contextmenu", onContextMenu);

  return {
    label: "Flocking",
    update(dt) {
      const particles = ps.particles;

      grid.clear();
      for (let i = 0; i < particles.length; i++) {
        grid.insert(particles[i]);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const neighbors = grid.query(p.x, p.y, PERCEPTION);

        let count = 0;
        let avgVx = 0, avgVy = 0;
        let avgX = 0, avgY = 0;
        let sepX = 0, sepY = 0;

        for (let j = 0; j < neighbors.length; j++) {
          const n = neighbors[j];
          if (n === p) continue;
          const dx = p.x - n.x;
          const dy = p.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > PERCEPTION || dist < 0.001) continue;

          if (dist < SEPARATION_DIST) {
            sepX += (dx / dist) / dist;
            sepY += (dy / dist) / dist;
          }

          avgVx += n.vx;
          avgVy += n.vy;
          avgX += n.x;
          avgY += n.y;
          count++;
        }

        let obsX = 0, obsY = 0;
        for (let j = 0; j < obstacles.length; j++) {
          const o = obstacles[j];
          const dx = p.x - o.x;
          const dy = p.y - o.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > OBSTACLE_AVOID_DIST || dist < 0.001) continue;
          const closeness = 1 - dist / OBSTACLE_AVOID_DIST;
          obsX += (dx / dist) * closeness;
          obsY += (dy / dist) * closeness;
        }

        if (count > 0) {
          avgVx /= count;
          avgVy /= count;
          avgX /= count;
          avgY /= count;

          const ax = sepX * SEP_WEIGHT
                   + (avgVx - p.vx) * ALIGN_WEIGHT
                   + (avgX - p.x) * COHES_WEIGHT
                   + obsX * OBSTACLE_AVOID_WEIGHT;
          const ay = sepY * SEP_WEIGHT
                   + (avgVy - p.vy) * ALIGN_WEIGHT
                   + (avgY - p.y) * COHES_WEIGHT
                   + obsY * OBSTACLE_AVOID_WEIGHT;

          p.vx += ax * dt;
          p.vy += ay * dt;
        } else if (obstacles.length > 0) {
          p.vx += obsX * OBSTACLE_AVOID_WEIGHT * dt;
          p.vy += obsY * OBSTACLE_AVOID_WEIGHT * dt;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        } else if (speed < MIN_SPEED && speed > 0.01) {
          p.vx = (p.vx / speed) * MIN_SPEED;
          p.vy = (p.vy / speed) * MIN_SPEED;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
      }
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#ff4444";
      for (let j = 0; j < obstacles.length; j++) {
        const o = obstacles[j];
        ctx.fillRect(o.x - OBSTACLE_SIZE / 2, o.y - OBSTACLE_SIZE / 2, OBSTACLE_SIZE, OBSTACLE_SIZE);
      }

      ps.render(ctx);
    },
    destroy() {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("contextmenu", onContextMenu);
      ps.destroy();
    },
  };
}
