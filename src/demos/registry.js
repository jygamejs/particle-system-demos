import { ConeDemo } from "./cone.js";
import { SnowDemo } from "./snow.js";
import { FireDemo } from "./fire.js";
import { ArrowDemo } from "./arrow.js";
import { RainDemo } from "./rain.js";
import { FireworksDemo } from "./fireworks.js";
import { ExplosionDemo } from "./explosion.js";
import { SpiralDemo } from "./spiral.js";
import { OrbitDemo } from "./orbit.js";
import { WhirlpoolDemo } from "./whirlpool.js";
import { SmokeDemo } from "./smoke.js";
import { FirefliesDemo } from "./fireflies.js";
import { HeartDemo } from "./heart.js";
import { FountainDemo } from "./fountain.js";
import { FlockingDemo } from "./flocking.js";
import { BoidsDemo } from "./boids.js";

export const DEMOS = [
  ConeDemo,
  SnowDemo,
  FireDemo,
  ArrowDemo,
  RainDemo,
  FireworksDemo,
  ExplosionDemo,
  SpiralDemo,
  OrbitDemo,
  WhirlpoolDemo,
  SmokeDemo,
  FirefliesDemo,
  HeartDemo,
  FountainDemo,
  FlockingDemo,
  BoidsDemo,
];

export function getNextScene(current, dir) {
  const idx = DEMOS.findIndex((C) => current instanceof C);
  const next = (idx + dir + DEMOS.length) % DEMOS.length;
  return new DEMOS[next]();
}
