import { Particle, CircleShape, Input, FadeModifier, ScaleModifier, TurbulenceModifier, VelocityModifier, CircleParticleVisual } from "jygame";
import { DemoScene } from "./base.js";

export class SmokeDemo extends DemoScene {
  static demoLabel = "Smoke";

  onEnter() {
    this.effect = Particle.create({
      rate: 50,
      lifetime: [3, 6],
      shape: new CircleShape({ radius: 4 }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new VelocityModifier({ drag: 0.92 }),
        new TurbulenceModifier({ strength: 30, frequency: 0.3, amplitude: 0.5 }),
        new ScaleModifier({ from: 20, to: 25, easing: "out" }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: this.center,
      initializer: (p) => {
        p.vx += (Math.random() - 0.5) * 15;
        p.vy += (Math.random() - 0.5) * 15 - 20;
        const g = 160 + Math.random() * 60 | 0;
        p.r = g;
        p.g = g;
        p.b = g;
        p.alpha = 1;
      },
    });
    this.effect.play();
  }

  update(dt) {
    super.update(dt);
    const ptr = Input.pointer;
    if (ptr.hasPosition) {
      this.effect.position.x = ptr.x;
      this.effect.position.y = ptr.y;
    }
  }

  render(ctx) {
    ctx.fillStyle = "#08080a";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

