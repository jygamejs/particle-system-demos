import { Particle, ConeShape, FadeModifier, ScaleModifier, ColorModifier, VelocityModifier } from "jygame";
import { DemoScene } from "./base.js";

export class ConeDemo extends DemoScene {
  static demoLabel = "Cone";

  onEnter() {
    this.effect = Particle.create({
      rate: 80,
      lifetime: [2.5, 4.5],
      shape: new ConeShape({
        radius: 5,
        angle: Math.PI / 4,
        direction: -Math.PI / 4,
        speed: 250,
      }),
      modifiers: [
        new VelocityModifier({ drag: 1.5 }),
        new FadeModifier({ mode: "out", easing: "quadOut" }),
        new ScaleModifier({ from: 5, to: 0, easing: "quadOut" }),
        new ColorModifier({ from: "#ffaa00", to: "#ff0044" }),
      ],
      position: this.center,
    });
    this.effect.play();
  }

  update(dt) {
    super.update(dt);
    if (this.effect) this.effect.rotation += dt;
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

