import { Particle, RectangleShape, FadeModifier, VelocityModifier, TurbulenceModifier, WindModifier } from "jygame";
import { DemoScene } from "./base.js";

export class SnowDemo extends DemoScene {
  static demoLabel = "Snow";

  onEnter() {
    this.wind = new WindModifier({ x: 20, y: 0 });
    this.effect = Particle.create({
      rate: 100,
      lifetime: [5, 8],
      shape: new RectangleShape({
        width: this.w + 40,
        height: 10,
        direction: "down",
        speed: [60, 120],
        spread: 0.3,
      }),
      modifiers: [
        new VelocityModifier({ drag: 0.1 }),
        new TurbulenceModifier({ strength: 30, frequency: 0.8 }),
        this.wind,
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: { x: this.w / 2, y: -10 },
      initializer: (p) => {
        p.size = 2 + Math.random() * 3;
        p.vx = 20 + Math.random() * 10;
      },
    });
    this.effect.play();
    this.gustTimer = 2 + Math.random() * 3;
    this.gustDuration = 0;
    this.gustWind = 0;
  }

  update(dt) {
    super.update(dt);
    this.gustTimer -= dt;
    if (this.gustTimer <= 0 && this.gustDuration <= 0) {
      this.gustTimer = 3 + Math.random() * 6;
      this.gustDuration = 0.6 + Math.random() * 0.8;
      this.gustWind = 100 + Math.random() * 100;
    }
    const base = 20;
    this.wind.x = this.gustDuration > 0 ? base + this.gustWind : base;
    if (this.gustDuration > 0) this.gustDuration -= dt;
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.effect?.destroy();
  }
}

