import {
  ParticleSystem, ParticleEmitter, CircleShape,
  FadeModifier, ScaleModifier, VelocityModifier,
  WindModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

const PALETTE = [
  [255, 50, 50], [255, 200, 50], [50, 200, 255],
  [255, 80, 200], [100, 255, 80], [255, 150, 50],
  [200, 100, 255], [50, 255, 200], [255, 255, 100],
  [255, 100, 100],
];

export function createFireworksDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const burst = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 4000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  burst.addModifier(new VelocityModifier({ drag: 0.8 }));
  burst.addModifier(new WindModifier({ y: 60 }));
  burst.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));
  burst.addModifier(new ScaleModifier({ from: 4, to: 0, easing: "quadOut" }));

  const burstEmitter = new ParticleEmitter({
    system: burst,
    rate: 0,
    shape: new CircleShape({
      radius: 4,
      direction: "outward",
      speed: [200, 400],
      spread: 0.4,
    }),
    initializer: (p) => {
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      p.r = c[0];
      p.g = c[1];
      p.b = c[2];
      p.maxLife = 1.2 + Math.random() * 1;
      p.life = p.maxLife;
      p.size = 2 + Math.random() * 3;
    },
  });

  const sparkle = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 300 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  sparkle.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));
  sparkle.addModifier(new ScaleModifier({ from: 1, to: 0, easing: "linear" }));

  const sparkleEmitter = new ParticleEmitter({
    system: sparkle,
    rate: 0,
    shape: new CircleShape({ radius: 2 }),
    initializer: (p) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 40;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = 255;
      p.g = 255;
      p.b = 255;
      p.maxLife = 0.3 + Math.random() * 0.4;
      p.life = p.maxLife;
      p.size = 1.5;
    },
  });

  let timer = 0.2 + Math.random() * 0.3;

  return {
    label: "Fireworks",
    update(dt) {
      timer -= dt;
      if (timer <= 0) {
        timer = 0.3 + Math.random() * 0.6;

        const x = 60 + Math.random() * (w - 120);
        const y = 40 + Math.random() * (h * 0.35);

        burstEmitter.setPosition(x, y);
        burstEmitter.burst(100 + Math.floor(Math.random() * 100));

        sparkleEmitter.setPosition(x, y);
        sparkleEmitter.burst(10 + Math.floor(Math.random() * 15));
      }

      burst.update(dt);
      sparkle.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#08080e";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff08";
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(
          (i * 151.7 + 30) % w,
          (i * 97.1 + 50) % h,
          1 + (i % 2),
          0, Math.PI * 2,
        );
        ctx.fill();
      }

      sparkle.render(ctx);
      burst.render(ctx);
    },
    destroy() {
      burstEmitter.destroy();
      burst.destroy();
      sparkleEmitter.destroy();
      sparkle.destroy();
    },
  };
}
