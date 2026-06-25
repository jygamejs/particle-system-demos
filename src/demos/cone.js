import {
  ParticleSystem, ParticleEmitter, ConeShape,
  FadeModifier, ScaleModifier, ColorModifier, VelocityModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createConeDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha})`;
    ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
  };

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new VelocityModifier({ drag: 1.5 }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));
  ps.addModifier(new ScaleModifier({ from: 5, to: 0, easing: "quadOut" }));
  ps.addModifier(new ColorModifier({ from: "#ffaa00", to: "#ff0044" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 80,
    shape: new ConeShape({
      radius: 5,
      angle: Math.PI / 4,
      direction: -Math.PI / 4,
      speed: 250,
    }),
    initializer: (p) => {
      p.maxLife = 2.5 + Math.random() * 2;
      p.life = p.maxLife;
    },
  });
  emitter.setPosition(w / 2, h / 2);
  emitter.start();

  let time = 0;

  return {
    label: "Cone",
    update(dt) {
      time += dt;
      emitter._shape._coneDirection = time;
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);
      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
