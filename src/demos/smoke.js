import {
  ParticleSystem, ParticleEmitter, CircleShape,
  FadeModifier, ScaleModifier, TurbulenceModifier,
  VelocityModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

export function createSmokeDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.alpha * 0.6})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const mouse = { x: w / 2, y: h / 2 };

  const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  window.addEventListener("mousemove", onMouse);

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 1000 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new VelocityModifier({ drag: 0.92 }));
  ps.addModifier(new TurbulenceModifier({
    strength: 30,
    frequency: 0.3,
    amplitude: 0.5,
  }));
  ps.addModifier(new ScaleModifier({ from: 20, to: 25, easing: "out" }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "linear" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 50,
    shape: new CircleShape({ radius: 4 }),
    initializer: (p) => {
      p.maxLife = 3 + Math.random() * 3;
      p.life = p.maxLife;
      p.vx += (Math.random() - 0.5) * 15;
      p.vy += (Math.random() - 0.5) * 15 - 20;
      const g = 160 + Math.random() * 60 | 0;
      p.r = g;
      p.g = g;
      p.b = g;
      p.alpha = 1;
    },
  });
  emitter.follow({ transform: mouse }, (t) => t.transform);
  emitter.start();

  let destroy = false;
  const cleanup = () => {
    if (destroy) return;
    destroy = true;
    window.removeEventListener("mousemove", onMouse);
    emitter.destroy();
    ps.destroy();
  };

  return {
    label: "Smoke",
    update(dt) {
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.fillStyle = "#08080a";
      ctx.fillRect(0, 0, w, h);
      ps.render(ctx);
    },
    destroy: cleanup,
  };
}
