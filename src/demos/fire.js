import {
  ParticleSystem, ParticleEmitter, ConeShape,
  FadeModifier, ScaleModifier, ColorModifier, VelocityModifier,
  TurbulenceModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createFireDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new VelocityModifier({ drag: 0.3 }));
  ps.addModifier(new TurbulenceModifier({ strength: 60, frequency: 2 }));
  ps.addModifier(new ColorModifier({ from: "#ffcc00", to: "#ff2200" }));
  ps.addModifier(new ScaleModifier({ from: 8, to: 2, easing: "quadOut" }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 120,
    shape: new ConeShape({
      radius: 15,
      angle: Math.PI / 3,
      direction: -Math.PI / 2,
      speed: [120, 200],
      spread: 0.2,
    }),
    initializer: (p) => {
      p.maxLife = 1 + Math.random() * 1.5;
      p.life = p.maxLife;
      p.size = 4 + Math.random() * 6;
    },
  });
  emitter.setPosition(w / 2, h - 40);
  emitter.start();

  return {
    label: "Fire",
    update(dt) {
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);
      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
