import { Particle, ConeShape, FadeModifier, ScaleModifier, ColorModifier, VelocityModifier, TurbulenceModifier } from "jygame";
import { DemoScene } from "./base.js";

export class FireDemo extends DemoScene {
  static demoLabel = "Fire";

  onEnter() {
    this.effect = Particle.create({
      rate: 120,
      lifetime: [1, 2.5],
      shape: new ConeShape({
        radius: 15,
        angle: Math.PI / 3,
        direction: -Math.PI / 2,
        speed: [120, 200],
        spread: 0.2,
      }),
      modifiers: [
        new VelocityModifier({ drag: 0.3 }),
        new TurbulenceModifier({ strength: 60, frequency: 2 }),
        new ColorModifier({ from: "#ffcc00", to: "#ff2200" }),
        new ScaleModifier({ from: 8, to: 2, easing: "quadOut" }),
        new FadeModifier({ mode: "out", easing: "quadOut" }),
      ],
      position: { x: this.w / 2, y: this.h - 40 },
      initializer: (p) => {
        p.size = 4 + Math.random() * 6;
      },
    });
    this.effect.play();
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

