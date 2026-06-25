import {
  ParticleSystem, ParticleEmitter, RectangleShape, CircleShape,
  FadeModifier, ScaleModifier, ColorModifier, VelocityModifier,
  WindModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createRainDemo(w, h) {
  const renderDrop = (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
    ctx.fillRect(p.x, p.y, p.width || 1, p.height || p.size);
    ctx.globalAlpha = 1;
  };

  const renderSplash = (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const rain = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1000 }),
      renderer: new CanvasParticleRenderer({ renderParticle: renderDrop }),
    }),
  });
  rain.addModifier(new VelocityModifier({ drag: 0.05 }));
  rain.addModifier(new WindModifier({ x: 40 }));
  rain.addModifier(new ColorModifier({ from: "#b8d4ff", to: "#7a9ecf" }));
  rain.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const rainEmitter = new ParticleEmitter({
    system: rain,
    rate: 300,
    shape: new RectangleShape({
      width: w + 60,
      height: 5,
      direction: "down",
      speed: [500, 700],
      spread: 0.05,
    }),
    initializer: (p) => {
      p.maxLife = 0.6 + Math.random() * 0.4;
      p.life = p.maxLife;
      p.width = 1;
      p.height = 8 + Math.random() * 8;
    },
  });
  rainEmitter.setPosition(w / 2, -10);
  rainEmitter.start();

  const splash = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 200 }),
      renderer: new CanvasParticleRenderer({ renderParticle: renderSplash }),
    }),
  });
  splash.addModifier(new VelocityModifier({ drag: 4 }));
  splash.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));
  splash.addModifier(new ScaleModifier({ from: 0.5, to: 1.5, easing: "quadOut" }));

  const splashEmitter = new ParticleEmitter({
    system: splash,
    rate: 100,
    shape: new RectangleShape({ width: w, height: 2 }),
    initializer: (p) => {
      p.vy = -(30 + Math.random() * 40);
      p.vx = (Math.random() - 0.5) * 20;
      p.maxLife = 0.3 + Math.random() * 0.3;
      p.life = p.maxLife;
      p.size = 2;
      p.r = 160;
      p.g = 190;
      p.b = 220;
    },
  });
  splashEmitter.setPosition(w / 2, h - 4);
  splashEmitter.start();

  return {
    label: "Rain",
    update(dt) {
      rainEmitter.update(dt);
      rain.update(dt);
      splashEmitter.update(dt);
      splash.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "#0a0a18");
      grd.addColorStop(0.6, "#0f0f20");
      grd.addColorStop(1, "#151530");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      rain.render(ctx);
      splash.render(ctx);
    },
    destroy() {
      rainEmitter.destroy();
      rain.destroy();
      splashEmitter.destroy();
      splash.destroy();
    },
  };
}
