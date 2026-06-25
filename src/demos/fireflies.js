import {
  ParticleSystem, ParticleEmitter, RectangleShape,
  FadeModifier, TurbulenceModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createFirefliesDemo(w, h) {
  const renderParticle = (ctx, p) => {
    const s = p.size;
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, s * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 300 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new TurbulenceModifier({
    strength: 20,
    frequency: 0.4,
    amplitude: 0.6,
  }));
  ps.addModifier(new FadeModifier({ mode: "in-out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 10,
    shape: new RectangleShape({ width: w, height: h }),
    initializer: (p) => {
      p.maxLife = 5 + Math.random() * 5;
      p.life = p.maxLife;
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6;
      p.r = 180 + Math.random() * 75 | 0;
      p.g = 200 + Math.random() * 55 | 0;
      p.b = 100 + Math.random() * 80 | 0;
      p.size = 2 + Math.random() * 2.5;
      p.alpha = 0;
    },
  });
  emitter.setPosition(w / 2, h / 2);
  emitter.start();

  return {
    label: "Fireflies",
    update(dt) {
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#06060a";
      ctx.fillRect(0, 0, w, h);
      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
