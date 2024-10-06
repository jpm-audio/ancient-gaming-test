import { Color } from 'pixi.js';
import { ParticleEmitterSettings } from '../systems/particleEmitter';

export const task3Data: ParticleEmitterSettings = {
  poolSize: 50, // Max number of particles creates in total, in stage or not. The bigger the more variety of particles are created.
  maxParticles: 10, // Max number of particles on stage
  lifetime: [750, 1000], // Time of life of a particle in ms
  spawnFrequency: [0.3, 0.3], // [1-0] Whete 1 is a spawn from SPAWN_REFERENCE
  startPosition: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  speed: [
    { x: -15, y: -50 },
    { x: 15, y: -100 },
  ],
  acceleration: [
    { x: -50, y: 25 },
    { x: -50, y: 50 },
  ],
  startRotation: [-Math.PI, Math.PI],
  rotationSpeed: [-2, 2],
  rotationAcceleration: [-2, 2],
  startScale: [
    { x: 0.05, y: 0.05 },
    { x: 0.1, y: 0.1 },
  ],
  scaleSpeed: [
    { x: 0.25, y: 0.25 },
    { x: 0.5, y: 0.5 },
  ],
  scaleAcceleration: [
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
  ],
  startAlpha: [1, 1],
  endAlpha: [0, 0],
  startColor: [new Color(0xffcc66)],
  endColor: [new Color(0xff0000)],
};
