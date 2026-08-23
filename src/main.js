import { Game } from "jygame";
import { DEMOS } from "./demos/registry.js";

const game = new Game({
  parent: document.body,
  width: window.innerWidth,
  height: window.innerHeight,
});

window.addEventListener("resize", () => {
  game.resize(window.innerWidth, window.innerHeight);
});

game.run(new DEMOS[0]());
