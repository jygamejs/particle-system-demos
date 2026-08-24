import { Particle, RectangleShape, FadeModifier, TurbulenceModifier, CircleParticleVisual } from "jygame";
import { DemoScene } from "./base.js";

export class FirefliesDemo extends DemoScene {
  static demoLabel = "Fireflies";

  onEnter() {
    this.effect = Particle.create({
      rate: 10,
      lifetime: [5, 10],
      shape: new RectangleShape({ width: this.w, height: this.h }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new TurbulenceModifier({ strength: 20, frequency: 0.4, amplitude: 0.6 }),
        new FadeModifier({ mode: "in-out", easing: "linear" }),
      ],
      position: this.center,
      initializer: (p) => {
        p.vx = (Math.random() - 0.5) * 6;
        p.vy = (Math.random() - 0.5) * 6;
        p.r = 180 + Math.random() * 75 | 0;
        p.g = 200 + Math.random() * 55 | 0;
        p.b = 100 + Math.random() * 80 | 0;
        p.size = 2 + Math.random() * 2.5;
        p.alpha = 0;
      },
    });
    this.effect.play();
  }

  render(ctx) {
    ctx.fillStyle = "#06060a";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

