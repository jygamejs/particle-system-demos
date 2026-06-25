import {
  ParticleSystem, ParticleEmitter, CircleShape,
  FadeModifier, ScaleModifier, VelocityModifier,
} from "jygame";
import { GpuParticleBackend } from "../../node_modules/jygame/particles/backends/GpuParticleBackend.js";
import { CanvasParticleRenderer } from "../../node_modules/jygame/particles/renderers/CanvasParticleRenderer.js";
import { SoAParticleStorage } from "../../node_modules/jygame/particles/storage/SoAParticleStorage.js";

const img = new Image();
img.src = "/arrow.png";

export function createArrowDemo(w, h) {
  const renderParticle = (ctx, p) => {
    ctx.imageSmoothingEnabled = false;
    if (p.texture) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.drawImage(p.texture, 0, -p.height * 0.5, p.width, p.height);
      ctx.restore();
    }
  };

  const ps = new ParticleSystem({
    backend: new GpuParticleBackend({
      storage: new SoAParticleStorage({ capacity: 500 }),
      renderer: new CanvasParticleRenderer({ renderParticle }),
    }),
  });
  ps.addModifier(new VelocityModifier({ drag: 0.3 }));
  ps.addModifier(new FadeModifier({ mode: "out", easing: "quadOut" }));
  ps.addModifier(new ScaleModifier({ from: 1, to: 0.3, easing: "quadOut" }));

  const emitter = new ParticleEmitter({
    system: ps,
    rate: 40,
    shape: new CircleShape({
      radius: 5,
      direction: "outward",
      speed: [200, 400],
      spread: 0.2,
    }),
    initializer: (p) => {
      p.texture = img;
      p.width = 39;
      p.height = 8;
      p.rotation = Math.atan2(p.vy, p.vx);
      p.maxLife = 2 + Math.random() * 2;
      p.life = p.maxLife;
      p.originX = 0;
      p.originY = 0.5;
    },
  });
  emitter.setPosition(w / 2, h / 2);
  emitter.start();

  return {
    label: "Arrows",
    update(dt) {
      emitter.update(dt);
      ps.update(dt);
    },
    render(ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);
      ps.render(ctx);
    },
    destroy() {
      emitter.destroy();
      ps.destroy();
    },
  };
}
