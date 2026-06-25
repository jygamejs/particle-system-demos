import { Game, Scene, Input } from "jygame";
import { createConeDemo } from "./demos/cone.js";
import { createSnowDemo } from "./demos/snow.js";
import { createFireDemo } from "./demos/fire.js";
import { createArrowDemo } from "./demos/arrow.js";
import { createRainDemo } from "./demos/rain.js";
import { createFireworksDemo } from "./demos/fireworks.js";
import { createExplosionDemo } from "./demos/explosion.js";
import { createGalaxyDemo } from "./demos/spiral.js";
import { createOrbitDemo } from "./demos/orbit.js";
import { createWhirlpoolDemo } from "./demos/whirlpool.js";
import { createSmokeDemo } from "./demos/smoke.js";
import { createFirefliesDemo } from "./demos/fireflies.js";
import { createHeartDemo } from "./demos/heart.js";
import { createFountainDemo } from "./demos/fountain.js";

const demos = [
  createConeDemo,
  createSnowDemo,
  createFireDemo,
  createArrowDemo,
  createRainDemo,
  createFireworksDemo,
  createExplosionDemo,
  createGalaxyDemo,
  createOrbitDemo,
  createWhirlpoolDemo,
  createSmokeDemo,
  createFirefliesDemo,
  createHeartDemo,
  createFountainDemo,
];

class DemoManagerScene extends Scene {
  constructor() {
    super();
    this.demoIndex = 0;
    this.demo = null;
  }

  enter() {
    super.enter();
    this.startDemo(0);

    this._onResize = () => {
      this.game.canvas.width = window.innerWidth;
      this.game.canvas.height = window.innerHeight;
      this.game.width = window.innerWidth;
      this.game.height = window.innerHeight;
    };
    window.addEventListener("resize", this._onResize);
    this.cleanup(() => window.removeEventListener("resize", this._onResize));
  }

  startDemo(index) {
    if (this.demo) this.demo.destroy();
    this.demoIndex = index;
    this.demo = demos[index](
      this.game?.width ?? window.innerWidth,
      this.game?.height ?? window.innerHeight,
    );
  }

  update(dt) {
    if (Input.justPressed("RIGHT")) {
      this.startDemo((this.demoIndex + 1) % demos.length);
    } else if (Input.justPressed("LEFT")) {
      this.startDemo((this.demoIndex - 1 + demos.length) % demos.length);
    }
    this.demo?.update(dt);
  }

  render(ctx) {
    this.demo?.render(ctx);

    ctx.fillStyle = "#ffffff60";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `◄  ${this.demo?.label ?? ""}  ►`,
      this.game.width / 2,
      this.game.height - 16,
    );
  }
}

const game = new Game({
  parent: document.body,
  width: window.innerWidth,
  height: window.innerHeight,
});

game.run(new DemoManagerScene());
