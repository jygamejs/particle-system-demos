import { Particle, ConeShape, FadeModifier, ScaleModifier, ColorModifier, WindModifier } from "jygame";
import { DemoScene } from "./base.js";

export class FountainDemo extends DemoScene {
  static demoLabel = "Fountain";

  onEnter() {
    this.effect = Particle.create({
      rate: 200,
      lifetime: [1.5, 3],
      shape: new ConeShape({
        radius: 3,
        angle: Math.PI / 3,
        direction: -Math.PI / 2,
        speed: [300, 450],
        spread: 0.15,
      }),
      modifiers: [
        new WindModifier({ y: 220 }),
        new ColorModifier({ from: "#cce0ff", to: "#6699cc" }),
        new ScaleModifier({ from: 1.5, to: 0, easing: "quadOut" }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: { x: this.w / 2, y: this.h - 10 },
      initializer: (p) => {
        p.size = 2 + Math.random() * 3;
        p.r = 180;
        p.g = 210;
        p.b = 255;
      },
    });
    this.effect.play();
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, this.h - 4, this.w, 4);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

