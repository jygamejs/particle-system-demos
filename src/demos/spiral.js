import { Particle, ConeShape, FadeModifier, ScaleModifier, ColorModifier, VelocityModifier } from "jygame";
import { DemoScene } from "./base.js";

export class SpiralDemo extends DemoScene {
  static demoLabel = "Spiral";

  onEnter() {
    this.time = 0;
    this.arms = [
      { offset: 0 },
      { offset: Math.PI },
    ].map(({ offset }) => {
      const effect = Particle.create({
        rate: 500,
        lifetime: [2.5, 4.5],
        shape: new ConeShape({
          radius: 5,
          angle: Math.PI / 4,
          direction: -Math.PI / 4 + offset,
          speed: 250,
        }),
        modifiers: [
          new VelocityModifier({ drag: 1.5 }),
          new FadeModifier({ mode: "out", easing: "quadOut" }),
          new ScaleModifier({ from: 2, to: 0, easing: "quadOut" }),
          new ColorModifier({ from: "#4488ff", to: "#0044cc" }),
        ],
        position: this.center,
      });
      effect.play();
      return { offset, effect };
    });
  }

  update(dt) {
    super.update(dt);
    this.time += dt;
    for (const arm of this.arms) {
      arm.effect.rotation = this.time + arm.offset;
    }
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    for (const arm of this.arms ?? []) arm.effect.destroy();
  }
}

