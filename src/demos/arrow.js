import { Particle, CircleShape, FadeModifier, ScaleModifier, VelocityModifier, TextureParticleVisual } from "jygame";
import { DemoScene } from "./base.js";

const img = new Image();
img.src = "/arrow.png";

export class ArrowDemo extends DemoScene {
  static demoLabel = "Arrows";

  onEnter() {
    this.effect = Particle.create({
      rate: 40,
      shape: new CircleShape({ radius: 5, direction: "outward", speed: [200, 400], spread: 0.2 }),
      visual: new TextureParticleVisual({
        texture: img,
        width: 39,
        height: 8,
        originX: 0,
        originY: 0.5,
      }),
      modifiers: [
        new VelocityModifier({ drag: 0.3 }),
        new FadeModifier({ mode: "out", easing: "quadOut" }),
        new ScaleModifier({ from: 1, to: 0.3, easing: "quadOut" }),
      ],
      position: this.center,
      lifetime: [2, 4],
      initializer: (p) => {
        p.rotation = Math.atan2(p.vy, p.vx);
      },
      capacity: 500,
    });
    this.effect.play();
  }

  render(ctx) {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

