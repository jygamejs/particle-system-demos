import {
  ParticleSystem, ParticleEmitter, CircleShape,
  FadeModifier, ScaleModifier, ColorModifier, VelocityModifier,
  WindModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createExplosionDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const boom = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  boom.addModifier(new VelocityModifier({ drag: 0.6 }));
  boom.addModifier(new WindModifier({ y: 40 }));
  boom.addModifier(new ColorModifier({ from: "#fff5e0", to: "#ff4400" }));
  boom.addModifier(new ScaleModifier({ from: 6, to: 0, easing: "quadOut" }));
  boom.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));

  const boomEmitter = new ParticleEmitter({
    system: boom,
    rate: 0,
    shape: new CircleShape({
      radius: 8,
      direction: "outward",
      speed: [300, 600],
      spread: 0.3,
    }),
    initializer: (p) => {
      p.maxLife = 0.6 + Math.random() * 0.6;
      p.life = p.maxLife;
      p.size = 3 + Math.random() * 5;
    },
  });

  const debris = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 200 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  debris.addModifier(new VelocityModifier({ drag: 0.3 }));
  debris.addModifier(new WindModifier({ y: 80 }));
  debris.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const debrisEmitter = new ParticleEmitter({
    system: debris,
    rate: 0,
    shape: new CircleShape({
      radius: 5,
      direction: "outward",
      speed: [500, 800],
    }),
    initializer: (p) => {
      p.r = 200 + Math.floor(Math.random() * 55);
      p.g = 120 + Math.floor(Math.random() * 40);
      p.b = 40 + Math.floor(Math.random() * 30);
      p.maxLife = 1 + Math.random() * 1;
      p.life = p.maxLife;
      p.size = 2 + Math.random() * 2;
    },
  });

  let timer = 0.8 + Math.random() * 0.5;
  let cx = w / 2;
  let cy = h / 2;

  return {
    label: "Explosion",
    update(dt) {
      timer -= dt;
      if (timer <= 0) {
        timer = 1 + Math.random() * 1.5;
        cx = 80 + Math.random() * (w - 160);
        cy = 80 + Math.random() * (h - 160);

        boomEmitter.setPosition(cx, cy);
        boomEmitter.burst(80 + Math.floor(Math.random() * 80));

        debrisEmitter.setPosition(cx, cy);
        debrisEmitter.burst(10 + Math.floor(Math.random() * 15));
      }

      boom.update(dt);
      debris.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#08080a";
      ctx.fillRect(0, 0, w, h);
      debris.render(ctx);
      boom.render(ctx);
    },
    destroy() {
      boomEmitter.destroy();
      boom.destroy();
      debrisEmitter.destroy();
      debris.destroy();
    },
  };
}
