import { Particle, Input } from "jygame";
import { DemoScene } from "./base.js";

const NUM_BOIDS = 100;
const VISUAL_RANGE = 75;
const MIN_DISTANCE = 20;
const CENTERING_FACTOR = 0.005;
const AVOID_FACTOR = 0.05;
const MATCHING_FACTOR = 0.05;
const SPEED_LIMIT = 15;
const MARGIN = 200;
const TURN_FACTOR = 1;

const PALETTE = [
  [0, 180, 255], [0, 220, 180], [100, 220, 255],
  [180, 120, 255], [255, 200, 80],
];

function createTriangleTexture(r, g, b) {
  // Matches boids renderParticle: moveTo(15,0) lineTo(-5,-4) lineTo(-5,4)
  const canvas = document.createElement("canvas");
  canvas.width = 20;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.translate(5, 4);
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(-5, -4);
  ctx.lineTo(-5, 4);
  ctx.closePath();
  ctx.fill();
  return canvas;
}

const textures = PALETTE.map(([r, g, b]) => createTriangleTexture(r, g, b));

export class BoidsDemo extends DemoScene {
  static demoLabel = "Boids";

  onEnter() {
    this.effect = Particle.create({
      capacity: 1000,
      initializer: (p, i) => {
        p.x = Math.random() * this.w;
        p.y = Math.random() * this.h;
        p.vx = Math.random() * 10 - 5;
        p.vy = Math.random() * 10 - 5;
        p.life = 1e10;
        p.maxLife = 1e10;
        const idx = i % PALETTE.length;
        p.texture = textures[idx];
        p.width = 20;
        p.height = 8;
        p.originX = 0.5;
        p.originY = 0.5;
        p.rotation = Math.atan2(p.vy, p.vx);
      },
    });
    this.effect.burst(NUM_BOIDS);
  }

  update() {
    super.update();
    if (Input.pointer.pressed) {
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const texture = createTriangleTexture(c[0], c[1], c[2]);
      this.effect.burst(1);
      const list = this.effect.system.particles;
      const p = list[list.length - 1];
      if (p) {
        p.x = Input.pointer.x;
        p.y = Input.pointer.y;
        p.vx = Math.random() * 10 - 5;
        p.vy = Math.random() * 10 - 5;
        p.texture = texture;
        p.width = 20;
        p.height = 8;
        p.originX = 0.5;
        p.originY = 0.5;
      }
    }

    const boids = this.effect.system.particles;

    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];
      let centerX = 0, centerY = 0, numNeighbors = 0;
      let avgDx = 0, avgDy = 0;
      let moveX = 0, moveY = 0;

      for (let j = 0; j < boids.length; j++) {
        const other = boids[j];
        if (other === boid) continue;
        const dist = distance(boid, other);
        if (dist < VISUAL_RANGE) {
          centerX += other.x;
          centerY += other.y;
          avgDx += other.vx;
          avgDy += other.vy;
          numNeighbors++;
        }
        if (dist < MIN_DISTANCE) {
          moveX += boid.x - other.x;
          moveY += boid.y - other.y;
        }
      }

      if (numNeighbors > 0) {
        boid.vx += ((centerX / numNeighbors - boid.x) * CENTERING_FACTOR + (avgDx / numNeighbors - boid.vx) * MATCHING_FACTOR);
        boid.vy += ((centerY / numNeighbors - boid.y) * CENTERING_FACTOR + (avgDy / numNeighbors - boid.vy) * MATCHING_FACTOR);
      }
      boid.vx += moveX * AVOID_FACTOR;
      boid.vy += moveY * AVOID_FACTOR;

      if (boid.x < MARGIN) boid.vx += TURN_FACTOR;
      if (boid.x > this.w - MARGIN) boid.vx -= TURN_FACTOR;
      if (boid.y < MARGIN) boid.vy += TURN_FACTOR;
      if (boid.y > this.h - MARGIN) boid.vy -= TURN_FACTOR;

      const speed = Math.hypot(boid.vx, boid.vy);
      if (speed > SPEED_LIMIT) {
        boid.vx = (boid.vx / speed) * SPEED_LIMIT;
        boid.vy = (boid.vy / speed) * SPEED_LIMIT;
      }
      boid.x += boid.vx;
      boid.y += boid.vy;
      boid.rotation = Math.atan2(boid.vy, boid.vx);
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

