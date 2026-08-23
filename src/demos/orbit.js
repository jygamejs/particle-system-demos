import { Particle, CircleShape, FadeModifier, AttractionModifier } from "jygame";
import { DemoScene } from "./base.js";

export class OrbitDemo extends DemoScene {
  static demoLabel = "Orbit";

  onEnter() {
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.effect = Particle.create({
      rate: 0,
      shape: new CircleShape({ radius: 2 }),
      modifiers: [
        new AttractionModifier({ x: this.cx, y: this.cy, strength: 50000, falloff: "inverseSquared" }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: { x: this.cx, y: this.cy },
      initializer: (p) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 180;
        p.x = this.cx + Math.cos(angle) * dist;
        p.y = this.cy + Math.sin(angle) * dist;
        const perp = angle + Math.PI / 2;
        const orbitSpeed = Math.sqrt(50000 / dist);
        p.vx = Math.cos(perp) * orbitSpeed;
        p.vy = Math.sin(perp) * orbitSpeed;
        p.life = 60;
        p.maxLife = 60;
        p.r = 200;
        p.g = 200;
        p.b = 255;
        p.size = 2.5;
      },
    });
    this.timer = 0;
  }

  update(dt) {
    super.update(dt);
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 0.3;
      this.effect.burst(5);
    }
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "#ffffff15";
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff40";
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 3, 0, Math.PI * 2);
    ctx.fill();
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

