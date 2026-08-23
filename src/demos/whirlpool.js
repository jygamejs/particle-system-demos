import { Particle, RingShape, FadeModifier, ScaleModifier, AttractionModifier } from "jygame";
import { DemoScene } from "./base.js";

export class WhirlpoolDemo extends DemoScene {
  static demoLabel = "Whirlpool";

  onEnter() {
    const cx = this.w / 2;
    const cy = this.h / 2;
    this.cx = cx;
    this.cy = cy;
    this.effect = Particle.create({
      rate: 50,
      lifetime: [6, 9],
      shape: new RingShape({
        innerRadius: 20,
        outerRadius: 200,
        direction: "clockwise",
        speed: 80,
        spread: 0.3,
      }),
      modifiers: [
        new AttractionModifier({ x: cx, y: cy, strength: 8000, falloff: "inverse" }),
        new ScaleModifier({ from: 2, to: 0, easing: "linear" }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: { x: cx, y: cy },
      initializer: (p) => {
        const t = Math.random();
        p.r = 130 + 70 * t;
        p.g = 60 + 60 * t;
        p.b = 200 + 55 * t;
        p.size = 3 + Math.random() * 3;
        p.alpha = 1;
      },
    });
    this.effect.play();
  }

  render(ctx) {
    ctx.fillStyle = "#07050a";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "#ffffff08";
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff60";
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 3, 0, Math.PI * 2);
    ctx.fill();
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

