import {
  ParticleSystem, ParticleEmitter, RingShape,
  FadeModifier, ScaleModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";
import { AttractionModifier } from "../../node_modules/jygame/modifiers/AttractionModifier.js";

export function createWhirlpoolDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha})`;
    ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
  };

  const cx = w / 2;
  const cy = h / 2;

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new AttractionModifier({
    x: cx, y: cy,
    strength: 8000,
    falloff: "inverse",
  }));
  ps.addModifier(new ScaleModifier({ from: 2, to: 0, easing: "linear" }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 50,
    shape: new RingShape({
      innerRadius: 20,
      outerRadius: 200,
      direction: "clockwise",
      speed: 80,
      spread: 0.3,
    }),
    initializer: (p) => {
      p.maxLife = 6 + Math.random() * 3;
      p.life = p.maxLife;
      const t = Math.random();
      p.r = 130 + 70 * t;
      p.g = 60 + 60 * t;
      p.b = 200 + 55 * t;
      p.size = 3 + Math.random() * 3;
      p.alpha = 1;
    },
  });
  emitter.setPosition(cx, cy);
  emitter.start();

  return {
    label: "Whirlpool",
    update(dt) {
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#07050a";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#ffffff08";
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.stroke();

      ps.render(ctx);

      ctx.fillStyle = "#ffffff60";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
