import {
  Color,
  ColorSource,
  Container,
  Graphics,
  PointData,
  Sprite,
  Ticker,
  View,
} from 'pixi.js';

export type ParticleView = Container | Sprite | Graphics;
export type SpawnParticle = () => ParticleView;

export interface ParticleEmitterSettings {
  poolSize: number;
  maxParticles: number;
  lifetime: [number, number];
  spawnFrequency: [number, number];
  startPosition: [PointData, PointData];
  speed: [PointData, PointData];
  acceleration: [PointData, PointData];
  startRotation: [number, number];
  rotationSpeed: [number, number];
  rotationAcceleration: [number, number];
  startScale: [PointData, PointData];
  scaleSpeed: [PointData, PointData];
  scaleAcceleration: [PointData, PointData];
  startAlpha: [number, number];
  endAlpha: [number, number];
  startColor: Color[];
  endColor: Color[];
}

export interface ParticleSettings {
  lifetime: number;
  speed: PointData;
  acceleration: PointData;
  rotationSpeed: number;
  rotationAcceleration: number;
  scaleSpeed: PointData;
  scaleAcceleration: PointData;
  startAlpha: number;
  endAlpha: number;
  startColor: Color;
  endColor: Color;
}

export class Particle {
  view: ParticleView;
  active: boolean;
  currentLifetime: number;
  settings: ParticleSettings;

  constructor(view: ParticleView) {
    this.view = view;
    this.reset();
  }

  reset() {
    this.active = false;
    this.currentLifetime = 0;
    this.settings = {
      lifetime: 0,
      speed: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      rotationSpeed: 0,
      rotationAcceleration: 0,
      scaleSpeed: { x: 0, y: 0 },
      scaleAcceleration: { x: 0, y: 0 },
      startAlpha: 1,
      endAlpha: 1,
      startColor: new Color(0xffffff),
      endColor: new Color(0xffffff),
    };
  }
}

export class ParticleEmitter extends Container {
  static SPAWN_REFERENCE = 1000 / 60;

  private _isRunning: boolean = false;
  private _spawnWait: number = 0;
  private _spawnElapsed: number = 0;
  private _pool: Particle[];
  private _settings: ParticleEmitterSettings = {
    poolSize: 10, // Max number of particles creates in total, in stage or not
    maxParticles: 10, // Max number of particles on stage
    lifetime: [1000, 1000], // Time of life of a particle in ms
    spawnFrequency: [0.01, 0.01], // [1-0] Whete 1 is a spawn from SPAWN_REFERENCE
    startPosition: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    speed: [
      // Speed of the particle px/sec
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    acceleration: [
      // Acceleration of the particle px/sec^2
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    startRotation: [0, 0],
    rotationSpeed: [0, 0],
    rotationAcceleration: [0, 0],
    startScale: [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
    ],
    scaleSpeed: [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
    ],
    scaleAcceleration: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    startAlpha: [1, 1],
    endAlpha: [1, 1],
    startColor: [new Color(0xffffff)],
    endColor: [new Color(0xffffff)],
  };

  public spawnParticle: SpawnParticle;

  constructor(
    settings: Partial<ParticleEmitterSettings>,
    particle: SpawnParticle,
    ticker: Ticker
  ) {
    super();

    this._pool = [];
    this._settings = { ...this._settings, ...settings };
    this.spawnParticle = particle;

    ticker.add(this.update, this);
  }

  private _resetSpawnTimer() {
    this._spawnElapsed = 0;
    this._spawnWait =
      ParticleEmitter.SPAWN_REFERENCE /
      Math.abs(
        Math.random() *
          (this._settings.spawnFrequency[1] -
            this._settings.spawnFrequency[0]) +
          this._settings.spawnFrequency[0]
      );
  }

  private _spawn() {
    let particle: Particle;

    const hasParticleLimit =
      this.children.length >= this._settings.maxParticles;
    const hasPoolLimit = this._pool.length >= this._settings.poolSize;

    // Reached particles limit on stage?
    if (hasParticleLimit) return;

    // Reached pool limit?
    if (!hasPoolLimit) {
      particle = new Particle(this.spawnParticle());
      this._initParticle(particle);

      particle.active = true;

      this._pool.push(particle);
      this.addChild(particle.view);
      return;
    }

    // Available Particles?
    const availableParticles = this._pool.filter((p) => !p.active) || [];
    if (availableParticles.length) {
      particle =
        availableParticles[
          Math.floor(Math.random() * availableParticles.length)
        ];
      particle.reset();
      this._initParticle(particle);
      particle.active = true;
      this.addChild(particle.view);
      return;
    }
  }

  private _initParticle(particle: Particle) {
    const lifetime = Math.abs(
      Math.random() *
        (this._settings.lifetime[1] - this._settings.lifetime[0]) +
        this._settings.lifetime[0]
    );

    const position = {
      x:
        Math.random() *
          (this._settings.startPosition[1].x -
            this._settings.startPosition[0].x) +
        this._settings.startPosition[0].x,
      y:
        Math.random() *
          (this._settings.startPosition[1].y -
            this._settings.startPosition[0].y) +
        this._settings.startPosition[0].y,
    };
    const speed = {
      x:
        Math.random() *
          (this._settings.speed[1].x - this._settings.speed[0].x) +
        this._settings.speed[0].x,
      y:
        Math.random() *
          (this._settings.speed[1].y - this._settings.speed[0].y) +
        this._settings.speed[0].y,
    };
    const acceleration = {
      x:
        Math.random() *
          (this._settings.acceleration[1].x -
            this._settings.acceleration[0].x) +
        this._settings.acceleration[0].x,
      y:
        Math.random() *
          (this._settings.acceleration[1].y -
            this._settings.acceleration[0].y) +
        this._settings.acceleration[0].y,
    };

    const rotation =
      Math.random() *
        (this._settings.startRotation[1] - this._settings.startRotation[0]) +
      this._settings.startRotation[0];
    const rotationSpeed =
      Math.random() *
        (this._settings.rotationSpeed[1] - this._settings.rotationSpeed[0]) +
      this._settings.rotationSpeed[0];
    const rotationAcceleration =
      Math.random() *
        (this._settings.rotationAcceleration[1] -
          this._settings.rotationAcceleration[0]) +
      this._settings.rotationAcceleration[0];

    const scale = {
      x:
        Math.random() *
          (this._settings.startScale[1].x - this._settings.startScale[0].x) +
        this._settings.startScale[0].x,
      y:
        Math.random() *
          (this._settings.startScale[1].y - this._settings.startScale[0].y) +
        this._settings.startScale[0].y,
    };
    const scaleSpeed = {
      x:
        Math.random() *
          (this._settings.scaleSpeed[1].x - this._settings.scaleSpeed[0].x) +
        this._settings.scaleSpeed[0].x,
      y:
        Math.random() *
          (this._settings.scaleSpeed[1].y - this._settings.scaleSpeed[0].y) +
        this._settings.scaleSpeed[0].y,
    };
    const scaleAcceleration = {
      x:
        Math.random() *
          (this._settings.scaleAcceleration[1].x -
            this._settings.scaleAcceleration[0].x) +
        this._settings.scaleAcceleration[0].x,
      y:
        Math.random() *
          (this._settings.scaleAcceleration[1].y -
            this._settings.scaleAcceleration[0].y) +
        this._settings.scaleAcceleration[0].y,
    };
    const startAlpha =
      Math.random() *
        (this._settings.startAlpha[1] - this._settings.startAlpha[0]) +
      this._settings.startAlpha[0];
    const endAlpha =
      Math.random() *
        (this._settings.endAlpha[1] - this._settings.endAlpha[0]) +
      this._settings.endAlpha[0];

    const startColor =
      this._settings.startColor[
        Math.floor(Math.random() * this._settings.startColor.length)
      ];
    const endColor =
      this._settings.endColor[
        Math.floor(Math.random() * this._settings.startColor.length)
      ];

    particle.view.x = position.x;
    particle.view.y = position.y;
    particle.view.rotation = rotation;
    particle.view.scale.x = scale.x;
    particle.view.scale.y = scale.y;
    particle.view.alpha = startAlpha;
    particle.view.tint = startColor;
    particle.settings.lifetime = lifetime;
    particle.settings.speed = speed;
    particle.settings.acceleration = acceleration;
    particle.settings.rotationSpeed = rotationSpeed;
    particle.settings.rotationAcceleration = rotationAcceleration;
    particle.settings.scaleSpeed = scaleSpeed;
    particle.settings.scaleAcceleration = scaleAcceleration;
    particle.settings.startAlpha = startAlpha;
    particle.settings.endAlpha = endAlpha;
    particle.settings.startColor = startColor;
    particle.settings.endColor = endColor;
  }

  private _updateParticle(particle: Particle, elapsedTime: number) {
    const lifePercentage =
      particle.currentLifetime / particle.settings.lifetime;
    const elapsedSecs = elapsedTime / 1000;

    // Update Speed
    particle.settings.speed.x += particle.settings.acceleration.x * elapsedSecs;
    particle.settings.speed.y += particle.settings.acceleration.y * elapsedSecs;

    // Update Position
    particle.view.x += particle.settings.speed.x * elapsedSecs;
    particle.view.y += particle.settings.speed.y * elapsedSecs;

    // Update Rotation Speed
    particle.settings.rotationSpeed +=
      particle.settings.rotationAcceleration * elapsedSecs;

    // Update Rotation
    particle.view.rotation += particle.settings.rotationSpeed * elapsedSecs;

    // Update Scale Speed
    particle.settings.scaleSpeed.x +=
      particle.settings.scaleAcceleration.x * elapsedSecs;
    particle.settings.scaleSpeed.y +=
      particle.settings.scaleAcceleration.y * elapsedSecs;

    // Update Scale
    particle.view.scale.x += particle.settings.scaleSpeed.x * elapsedSecs;
    particle.view.scale.y += particle.settings.scaleSpeed.y * elapsedSecs;

    // Alpha
    particle.view.alpha =
      particle.settings.startAlpha +
      (particle.settings.endAlpha - particle.settings.startAlpha) *
        lifePercentage;

    // Update Color
    const startRGB = particle.settings.startColor.toRgb();
    const endRGB = particle.settings.endColor.toRgb();
    const colorRGB: ColorSource = [
      startRGB.r + (endRGB.r - startRGB.r) * lifePercentage,
      startRGB.g + (endRGB.g - startRGB.g) * lifePercentage,
      startRGB.b + (endRGB.b - startRGB.b) * lifePercentage,
    ];

    particle.view.tint = new Color(colorRGB).toNumber();
  }

  private _killParticle(particle: Particle) {
    particle.active = false;
    this.removeChild(particle.view);
  }

  update(ticker: Ticker) {
    if (!this._isRunning) return;

    if (this._spawnElapsed >= this._spawnWait) {
      console.log(this.children.length);
      this._spawn();
      this._resetSpawnTimer();
    } else {
      this._spawnElapsed += ticker.deltaMS;
    }

    this._pool.forEach((particle) => {
      if (particle.active) {
        particle.currentLifetime += ticker.deltaMS;
        if (particle.currentLifetime >= particle.settings.lifetime) {
          this._killParticle(particle);
        } else {
          this._updateParticle(particle, ticker.deltaMS);
        }
      }
    });
  }

  start() {
    if (this._isRunning) return;
    this._isRunning = true;
    this._resetSpawnTimer();
  }

  stop() {
    this._isRunning = false;
  }
}
