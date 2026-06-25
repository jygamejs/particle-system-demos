import {
  ParticleSystem, ParticleEmitter, RectangleShape,
  FadeModifier, VelocityModifier, TurbulenceModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createSnowDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const storage = new SoAParticleStorage({ capacity: 2000 });
  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage,
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new VelocityModifier({ drag: 0.1 }));
  ps.addModifier(new TurbulenceModifier({ strength: 30, frequency: 0.8 }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 100,
    shape: new RectangleShape({
      width: w + 40,
      height: 10,
      direction: "down",
      speed: [60, 120],
      spread: 0.3,
    }),
    initializer: (p) => {
      p.maxLife = 5 + Math.random() * 3;
      p.life = p.maxLife;
      p.size = 2 + Math.random() * 3;
      p.vx = 20 + Math.random() * 10;
    },
  });
  emitter.setPosition(w / 2, -10);
  emitter.start();

  let gustTimer = 2 + Math.random() * 3;
  let gustDuration = 0;
  let gustWind = 0;

  return {
    label: "Snow",
    update(dt) {
      gustTimer -= dt;
      if (gustTimer <= 0 && gustDuration <= 0) {
        gustTimer = 3 + Math.random() * 6;
        gustDuration = 0.6 + Math.random() * 0.8;
        gustWind = 100 + Math.random() * 100;
      }

      const wind = gustDuration > 0 ? 20 + gustWind : 20;
      if (gustDuration > 0) gustDuration -= dt;

      const arr = storage._activeAccessors;
      for (let i = 0; i < arr.length; i++) {
        storage._vx[arr[i]._i] += wind * dt;
      }

      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
