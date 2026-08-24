import { Particle, CircleShape, FadeModifier, ScaleModifier, VelocityModifier, WindModifier, CircleParticleVisual } from "jygame";
import { DemoScene } from "./base.js";

const PALETTE = [
  [255, 50, 50], [255, 200, 50], [50, 200, 255],
  [255, 80, 200], [100, 255, 80], [255, 150, 50],
  [200, 100, 255], [50, 255, 200], [255, 255, 100],
  [255, 100, 100],
];

export class FireworksDemo extends DemoScene {
  static demoLabel = "Fireworks";

  onEnter() {
    this.burst = Particle.create({
      rate: 0,
      shape: new CircleShape({ radius: 4, direction: "outward", speed: [200, 400], spread: 0.4 }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new VelocityModifier({ drag: 0.8 }),
        new WindModifier({ y: 60 }),
        new FadeModifier({ mode: "out", easing: "quadOut" }),
        new ScaleModifier({ from: 4, to: 0, easing: "quadOut" }),
      ],
      initializer: (p) => {
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        p.r = c[0];
        p.g = c[1];
        p.b = c[2];
        p.life = 1.2 + Math.random() * 1;
        p.maxLife = p.life;
        p.size = 2 + Math.random() * 3;
      },
      capacity: 4000,
    });
    this.sparkle = Particle.create({
      rate: 0,
      shape: new CircleShape({ radius: 2 }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new FadeModifier({ mode: "out", easing: "quadOut" }),
        new ScaleModifier({ from: 1, to: 0, easing: "linear" }),
      ],
      initializer: (p) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 20 + Math.random() * 40;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.r = 255;
        p.g = 255;
        p.b = 255;
        p.life = 0.3 + Math.random() * 0.4;
        p.maxLife = p.life;
        p.size = 1.5;
      },
      capacity: 300,
    });
    this.timer = 0.2 + Math.random() * 0.3;
  }

  update(dt) {
    super.update(dt);
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 0.3 + Math.random() * 0.6;
      const x = 60 + Math.random() * (this.w - 120);
      const y = 40 + Math.random() * (this.h * 0.35);
      this.burst.position.set(x, y);
      this.burst.burst(100 + Math.floor(Math.random() * 100));
      this.sparkle.position.set(x, y);
      this.sparkle.burst(10 + Math.floor(Math.random() * 15));
    }
  }

  render(ctx) {
    ctx.fillStyle = "#08080e";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#ffffff08";
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc((i * 151.7 + 30) % this.w, (i * 97.1 + 50) % this.h, 1 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
    super.render(ctx);
  }

  onExit() {
    this.burst?.destroy();
    this.sparkle?.destroy();
  }
}

