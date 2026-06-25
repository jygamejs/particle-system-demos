import {
  ParticleSystem, ParticleEmitter, ConeShape,
  FadeModifier, ScaleModifier, ColorModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";
import { WindModifier } from "../../node_modules/jygame/modifiers/WindModifier.js";

export function createFountainDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha})`;
    ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
  };

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1500 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new WindModifier({ y: 220 }));
  ps.addModifier(new ColorModifier({ from: "#cce0ff", to: "#6699cc" }));
  ps.addModifier(new ScaleModifier({ from: 1.5, to: 0, easing: "quadOut" }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 200,
    shape: new ConeShape({
      radius: 3,
      angle: Math.PI / 3,
      direction: -Math.PI / 2,
      speed: [300, 450],
      spread: 0.15,
    }),
    initializer: (p) => {
      p.maxLife = 1.5 + Math.random() * 1.5;
      p.life = p.maxLife;
      p.size = 2 + Math.random() * 3;
      p.r = 180;
      p.g = 210;
      p.b = 255;
    },
  });
  emitter.setPosition(w / 2, h - 10);
  emitter.start();

  return {
    label: "Fountain",
    update(dt) {
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, h - 4, w, 4);

      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
