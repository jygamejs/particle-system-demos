import {
  ParticleSystem, ParticleEmitter, PathShape,
  FadeModifier, ScaleModifier, VelocityModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createHeartDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha * 0.85})`;
    ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
  };

  const cx = w / 2;
  const cy = h / 2;
  const scale = 12;

  const points = [];
  for (let i = 0; i <= 50; i++) {
    const t = (i / 50) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    points.push([x * scale, -y * scale]);
  }

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 3000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new VelocityModifier({ drag: 0.85 }));
  ps.addModifier(new ScaleModifier({ from: 1.2, to: 0, easing: "out" }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 0,
    shape: new PathShape(points),
    initializer: (p) => {
      p.maxLife = 1.5 + Math.random() * 2;
      p.life = p.maxLife;
      const angle = Math.atan2(p.y - cy, p.x - cx);
      const speed = 120 + Math.random() * 200;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = 240;
      p.g = 40 + Math.random() * 80 | 0;
      p.b = 60 + Math.random() * 60 | 0;
      p.size = 3 + Math.random() * 4;
      p.alpha = 1;
    },
  });
  emitter.setPosition(cx, cy);

  let timer = 0;

  return {
    label: "Heart",
    update(dt) {
      timer -= dt;
      if (timer <= 0) {
        timer = 2;
        emitter.burst(1500);
      }
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#080408";
      ctx.fillRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      grad.addColorStop(0, "rgba(200, 40, 60, 0.06)");
      grad.addColorStop(1, "rgba(200, 40, 60, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
