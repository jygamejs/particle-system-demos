import { Particle, PathShape, FadeModifier, ScaleModifier, VelocityModifier } from "jygame";
import { DemoScene } from "./base.js";

export class HeartDemo extends DemoScene {
  static demoLabel = "Heart";

  onEnter() {
    const cx = this.w / 2;
    const cy = this.h / 2;
    this.cx = cx;
    this.cy = cy;
    const scale = 12;
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      points.push([x * scale, -y * scale]);
    }
    this.effect = Particle.create({
      rate: 0,
      shape: new PathShape(points),
      modifiers: [
        new VelocityModifier({ drag: 0.85 }),
        new ScaleModifier({ from: 1.2, to: 0, easing: "out" }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: { x: cx, y: cy },
      initializer: (p) => {
        const angle = Math.atan2(p.y - cy, p.x - cx);
        const speed = 120 + Math.random() * 200;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.r = 240;
        p.g = 40 + Math.random() * 80 | 0;
        p.b = 60 + Math.random() * 60 | 0;
        p.size = 3 + Math.random() * 4;
        p.alpha = 1;
        p.life = 1.5 + Math.random() * 2;
        p.maxLife = p.life;
      },
    });
    this.timer = 0;
  }

  update(dt) {
    super.update(dt);
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 2;
      this.effect.burst(1000);
    }
  }

  render(ctx) {
    ctx.fillStyle = "#080408";
    ctx.fillRect(0, 0, this.w, this.h);
    const grad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, 80);
    grad.addColorStop(0, "rgba(200, 40, 60, 0.06)");
    grad.addColorStop(1, "rgba(200, 40, 60, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

