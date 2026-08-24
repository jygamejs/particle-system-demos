import { Particle, CircleShape, FadeModifier, ScaleModifier, ColorModifier, VelocityModifier, WindModifier, CircleParticleVisual } from "jygame";
import { DemoScene } from "./base.js";

export class ExplosionDemo extends DemoScene {
  static demoLabel = "Explosion";

  onEnter() {
    this.boom = Particle.create({
      rate: 0,
      shape: new CircleShape({ radius: 8, direction: "outward", speed: [300, 600], spread: 0.3 }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new VelocityModifier({ drag: 0.6 }),
        new WindModifier({ y: 40 }),
        new ColorModifier({ from: "#fff5e0", to: "#ff4400" }),
        new ScaleModifier({ from: 6, to: 0, easing: "quadOut" }),
        new FadeModifier({ mode: "out", easing: "quadOut" }),
      ],
      position: this.center,
      initializer: (p) => {
        p.life = 0.6 + Math.random() * 0.6;
        p.maxLife = p.life;
        p.size = 3 + Math.random() * 5;
      },
      capacity: 1000,
    });
    this.debris = Particle.create({
      rate: 0,
      shape: new CircleShape({ radius: 5, direction: "outward", speed: [500, 800] }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new VelocityModifier({ drag: 0.3 }),
        new WindModifier({ y: 80 }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: this.center,
      initializer: (p) => {
        p.r = 200 + Math.floor(Math.random() * 55);
        p.g = 120 + Math.floor(Math.random() * 40);
        p.b = 40 + Math.floor(Math.random() * 30);
        p.life = 1 + Math.random() * 1;
        p.maxLife = p.life;
        p.size = 2 + Math.random() * 2;
      },
      capacity: 200,
    });
    this.timer = 0.8 + Math.random() * 0.5;
  }

  update(dt) {
    super.update(dt);
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 1 + Math.random() * 1.5;
      const cx = 80 + Math.random() * (this.w - 160);
      const cy = 80 + Math.random() * (this.h - 160);
      this.boom.position.set(cx, cy);
      this.boom.burst(80 + Math.floor(Math.random() * 80));
      this.debris.position.set(cx, cy);
      this.debris.burst(10 + Math.floor(Math.random() * 15));
    }
  }

  render(ctx) {
    ctx.fillStyle = "#08080a";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.boom?.destroy();
    this.debris?.destroy();
  }
}

