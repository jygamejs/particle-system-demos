import { Particle, RectangleShape, FadeModifier, ScaleModifier, ColorModifier, VelocityModifier, WindModifier, CircleParticleVisual } from "jygame";
import { DemoScene } from "./base.js";

export class RainDemo extends DemoScene {
  static demoLabel = "Rain";

  onEnter() {
    this.rain = Particle.create({
      rate: 300,
      lifetime: [0.6, 1],
      shape: new RectangleShape({
        width: this.w + 60,
        height: 5,
        direction: "down",
        speed: [500, 700],
        spread: 0.05,
      }),
      modifiers: [
        new VelocityModifier({ drag: 0.05 }),
        new WindModifier({ x: 40 }),
        new ColorModifier({ from: "#b8d4ff", to: "#7a9ecf" }),
        new FadeModifier({ mode: "out", easing: "linear" }),
      ],
      position: { x: this.w / 2, y: -10 },
      initializer: (p) => {
        p.width = 1;
        p.height = 8 + Math.random() * 8;
        p.originX = 0;
        p.originY = 0;
      },
    });
    this.rain.play();

    this.splash = Particle.create({
      rate: 100,
      lifetime: [0.3, 0.6],
      shape: new RectangleShape({ width: this.w, height: 2 }),
      visual: new CircleParticleVisual(),
      modifiers: [
        new VelocityModifier({ drag: 4 }),
        new FadeModifier({ mode: "out", easing: "quadOut" }),
        new ScaleModifier({ from: 0.5, to: 1.5, easing: "quadOut" }),
      ],
      position: { x: this.w / 2, y: this.h - 4 },
      initializer: (p) => {
        p.vy = -(30 + Math.random() * 40);
        p.vx = (Math.random() - 0.5) * 20;
        p.size = 2;
        p.r = 160;
        p.g = 190;
        p.b = 220;
      },
    });
    this.splash.play();
  }

  render(ctx) {
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, this.w, this.h);
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, "#0a0a18");
    grd.addColorStop(0.6, "#0f0f20");
    grd.addColorStop(1, "#151530");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);
    super.render(ctx);
  }

  onExit() {
    this.rain?.destroy();
    this.splash?.destroy();
  }
}

