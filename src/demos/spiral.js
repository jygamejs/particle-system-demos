import {
  ParticleSystem, ParticleEmitter, ConeShape,
  FadeModifier, ScaleModifier, ColorModifier, VelocityModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createGalaxyDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha})`;
    ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
  };

  const arms = [
    { offset: 0 },
    { offset: Math.PI },
  ];

  for (const arm of arms) {
    const ps = new ParticleSystem({
      backend: new GpuParticleBackend({
        storage: new SoAParticleStorage({ capacity: 4000 }),
        renderer: new CanvasParticleRenderer({ renderParticle }),
      }),
    });
    ps.addModifier(new VelocityModifier({ drag: 1.5 }));
    ps.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));
    ps.addModifier(new ScaleModifier({ from: 2, to: 0, easing: "quadOut" }));
    ps.addModifier(new ColorModifier({ from: "#4488ff", to: "#0044cc" }));

    const emitter = new ParticleEmitter({
      system: ps,
      rate: 500,
      shape: new ConeShape({
        radius: 5,
        angle: Math.PI / 4,
        direction: -Math.PI / 4 + arm.offset,
        speed: 250,
      }),
      initializer: (p) => {
        p.maxLife = 2.5 + Math.random() * 2;
        p.life = p.maxLife;
      },
    });
    emitter.setPosition(w / 2, h / 2);
    emitter.start();
    arm.ps = ps;
    arm.emitter = emitter;
  }

  let time = 0;

  return {
    label: "Spiral",
    update(dt) {
      time += dt;
      for (const arm of arms) {
        arm.emitter._shape._coneDirection = time + arm.offset;
        arm.emitter.update(dt);
        arm.ps.update(dt);
      }
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);
      for (const arm of arms) {
        arm.ps.render(ctx);
      }
    },
    destroy() {
      for (const arm of arms) {
        arm.emitter.destroy();
        arm.ps.destroy();
      }
    },
  };
}
