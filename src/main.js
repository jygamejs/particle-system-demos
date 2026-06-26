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
    this._recording = false;
    this._recorder = null;
    this._chunks = [];
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

  _toggleRecording() {
    if (this._recording) {
      this._recorder.stop();
    } else {
      this._chunks = [];
      const stream = this.game.canvas.captureStream(60);
      this._recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 50_000_000,
      });
      this._recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this._chunks.push(e.data);
      };
      this._recorder.onstop = () => {
        const blob = new Blob(this._chunks, { type: "video/webm" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${this.demo?.label ?? "particles"}-demo.webm`;
        a.click();
        this._recorder = null;
      };
      this._recorder.start();
    }
    this._recording = !this._recording;
  }

  update(dt) {
    if (Input.justPressed("RIGHT")) {
      this.startDemo((this.demoIndex + 1) % demos.length);
    } else if (Input.justPressed("LEFT")) {
      this.startDemo((this.demoIndex - 1 + demos.length) % demos.length);
    } else if (Input.justPressed("r")) {
      this._toggleRecording();
    }
    this.demo?.update(dt);
  }

  render(ctx) {
    this.demo?.render(ctx);

    ctx.font = "14px monospace";
    ctx.textAlign = "center";

    if (this._recording) {
      ctx.fillStyle = "#ff000080";
      ctx.beginPath();
      ctx.arc(20, 20, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff60";
    ctx.fillText(
      `◄  ${this.demo?.label ?? ""}  ►`,
      this.game.width / 2,
      this.game.height - 16,
    );

    ctx.textAlign = "right";
    ctx.fillStyle = this._recording ? "#ff666660" : "#ffffff40";
    ctx.fillText(this._recording ? "● REC" : "[R] record", this.game.width - 12, 24);
  }
}

const game = new Game({
  parent: document.body,
  width: window.innerWidth,
  height: window.innerHeight,
});

game.run(new DemoManagerScene());
