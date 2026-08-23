import { Scene, Input } from "jygame";
import { getNextScene } from "./registry.js";

export class DemoScene extends Scene {
  input = {
    next: "ArrowRight",
    prev: "ArrowLeft",
  };

  get w() {
    return this.game.width;
  }

  get h() {
    return this.game.height;
  }

  get center() {
    return { x: this.w / 2, y: this.h / 2 };
  }

  update(dt) {
    if (Input.pressed("next")) {
      this.switchScene(getNextScene(this, 1));
      return;
    }
    if (Input.pressed("prev")) {
      this.switchScene(getNextScene(this, -1));
      return;
    }
  }

  render(ctx) {
    ctx.fillStyle = "#ffffff60";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `◄  ${this.constructor.demoLabel ?? ""}  ►`,
      this.w / 2,
      this.h - 16,
    );
  }
}
