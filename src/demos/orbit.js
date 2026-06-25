import {
  ParticleSystem, ParticleEmitter, CircleShape,
  FadeModifier, AttractionModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createOrbitDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha})`;
    ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
  };

  const cx = w / 2;
  const cy = h / 2;

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 2000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new AttractionModifier({
    x: cx, y: cy,
    strength: 50000,
    falloff: "inverseSquared",
  }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 0,
    shape: new CircleShape({ radius: 2 }),
    initializer: (p) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 180;
      p.x = cx + Math.cos(angle) * dist;
      p.y = cy + Math.sin(angle) * dist;
      const perp = angle + Math.PI / 2;
      const orbitSpeed = Math.sqrt(50000 / dist);
      p.vx = Math.cos(perp) * orbitSpeed;
      p.vy = Math.sin(perp) * orbitSpeed;
      p.maxLife = 60;
      p.life = p.maxLife;
      p.r = 200;
      p.g = 200;
      p.b = 255;
      p.size = 2.5;
    },
  });
  emitter.setPosition(cx, cy);

  let timer = 0;

  return {
    label: "Orbit",
    update(dt) {
      timer -= dt;
      if (timer <= 0) {
        timer = 0.3;
        emitter.burst(5);
      }
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff15";
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.stroke();

      ps.render(ctx);

      ctx.fillStyle = "#ffffff40";
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
