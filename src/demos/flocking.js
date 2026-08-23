import { Particle, Input, SpatialHash } from "jygame";
import { DemoScene } from "./base.js";

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

function createTriangleTexture(r, g, b) {
  // Matches original flocking renderParticle: size 7
  // moveTo(7,0) lineTo(-4.2,-3.5) lineTo(-4.2,3.5)
  const canvas = document.createElement("canvas");
  canvas.width = 14;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.translate(7, 4);
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.lineTo(-7 * 0.6, -7 * 0.5);
  ctx.lineTo(-7 * 0.6, 7 * 0.5);
  ctx.closePath();
  ctx.fill();
  return canvas;
}

const textures = PALETTE.map(([r, g, b]) => createTriangleTexture(r, g, b));

export class FlockingDemo extends DemoScene {
  static demoLabel = "Flocking";

  onEnter() {
    this.hash = new SpatialHash(PERCEPTION);
    this.effect = Particle.create({
      capacity: 2000,
      initializer: (p, i) => {
        p.x = Math.random() * this.w;
        p.y = Math.random() * this.h;
        const a = Math.random() * Math.PI * 2;
        const s = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.life = 1e10;
        p.maxLife = 1e10;
        const idx = i % PALETTE.length;
        p.texture = textures[idx];
        p.width = 14;
        p.height = 8;
        p.originX = 0.5;
        p.originY = 0.5;
        p.rotation = a;
      },
    });
    this.effect.burst(150);
  }

  update(dt) {
    super.update(dt);

    if (Input.pointer.pressed) {
      const x = Input.pointer.x;
      const y = Input.pointer.y;
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const tex = createTriangleTexture(c[0], c[1], c[2]);
      this.effect.burst(1);
      const list = this.effect.system.particles;
      const p = list[list.length - 1];
      if (p) {
        p.x = x + (Math.random() - 0.5) * 10;
        p.y = y + (Math.random() - 0.5) * 10;
        const a = Math.random() * Math.PI * 2;
        const s = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.texture = tex;
        p.width = 14;
        p.height = 8;
        p.originX = 0.5;
        p.originY = 0.5;
        p.rotation = a;
      }
    }

    const particles = this.effect.system.particles;

    this.hash.clear();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      this.hash.insert(p, p.x, p.y, 1, 1);
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const neighbors = this.hash.queryCircle(p.x, p.y, PERCEPTION);

      let count = 0;
      let avgVx = 0, avgVy = 0;
      let avgX = 0, avgY = 0;
      let sepX = 0, sepY = 0;

      for (let j = 0; j < neighbors.length; j++) {
        const n = neighbors[j];
        if (n === p) continue;
        const dx = p.x - n.x;
        const dy = p.y - n.y;
        const dist = Math.hypot(dx, dy);
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

      if (count > 0) {
        avgVx /= count;
        avgVy /= count;
        avgX /= count;
        avgY /= count;
        const ax = sepX * SEP_WEIGHT + (avgVx - p.vx) * ALIGN_WEIGHT + (avgX - p.x) * COHES_WEIGHT;
        const ay = sepY * SEP_WEIGHT + (avgVy - p.vy) * ALIGN_WEIGHT + (avgY - p.y) * COHES_WEIGHT;
        p.vx += ax * dt;
        p.vy += ay * dt;
      }

      const speed = Math.hypot(p.vx, p.vy);
      if (speed > MAX_SPEED) {
        p.vx = (p.vx / speed) * MAX_SPEED;
        p.vy = (p.vy / speed) * MAX_SPEED;
      } else if (speed < MIN_SPEED && speed > 0.01) {
        p.vx = (p.vx / speed) * MIN_SPEED;
        p.vy = (p.vy / speed) * MIN_SPEED;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation = Math.atan2(p.vy, p.vx);

      if (p.x < 0) p.x += this.w;
      if (p.x > this.w) p.x -= this.w;
      if (p.y < 0) p.y += this.h;
      if (p.y > this.h) p.y -= this.h;
    }
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

