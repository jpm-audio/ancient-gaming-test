import {
  Color,
  Container,
  Graphics,
  PointData,
  Sprite,
  Ticker,
  View,
} from 'pixi.js';

type ParticleView = Container | Sprite | Graphics;
type SpawnParticle = () => ParticleView;

interface ParticleEmitterSettings {
  poolSize: number;
  maxParticles: number;
  lifetime: [number, number];
  spawnFrequency: [number, number];
  speed: [PointData, PointData];
  acceleration: [PointData, PointData];
  startRotation: [number, number];
  rotationSpeed: [number, number];
  rotationAcceleration: [number, number];
  startScale: [PointData, PointData];
  scaleSpeed: [PointData, PointData];
  scaleAcceleration: [PointData, PointData];
  startColor: Color[];
  endColor: Color[];
}

interface ParticleSettings {
  lifetime: number;
  speed: PointData;
  acceleration: PointData;
  rotationSpeed: number;
  rotationAcceleration: number;
  scaleSpeed: PointData;
  scaleAcceleration: PointData;
  startColor: Color;
  endColor: Color;
}

class Particle {
  view: ParticleView;
  active: boolean;
  currentLifetime: number;
  settings: ParticleSettings;
}

class ParticleEmitter extends Container {
  static SPAWN_REFERENCE = 1000 / 60;

  private _isRunning: boolean = false;
  private _spawnWait: number = 0;
  private _spawnElapsed: number = 0;
  private _pool: Particle[];
  private _settings: ParticleEmitterSettings = {
    poolSize: 50,
    maxParticles: 100,
    lifetime: [1000, 1000],
    spawnFrequency: [0.01, 0.01], // [1-0] Whete 1 is a spawn from SPAWN_REFERENCE
    speed: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    acceleration: [
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

    // Particles limit
    if (hasParticleLimit) return;

    // No available particles and pool limit
    const availableParticles = this._pool.filter((p) => !p.active) || [];
    if (!availableParticles.length && hasPoolLimit) return;

    if (availableParticles.length) {
      particle =
        availableParticles[
          Math.floor(Math.random() * availableParticles.length)
        ];
    } else {
      particle = this._createParticle();
      this._pool.push(particle);
    }

    console.log('SPAWN');

    particle.active = true;
    this.addChild(particle.view);
  }

  private _createParticle() {
    const lifetime = Math.abs(
      Math.random() *
        (this._settings.lifetime[1] - this._settings.lifetime[0]) +
        this._settings.lifetime[0]
    );
    const speed = {
      x: Math.abs(
        Math.random() *
          (this._settings.speed[1].x - this._settings.speed[0].x) +
          this._settings.speed[0].x
      ),
      y: Math.abs(
        Math.random() *
          (this._settings.speed[1].y - this._settings.speed[0].y) +
          this._settings.speed[0].y
      ),
    };
    const acceleration = {
      x: Math.abs(
        Math.random() *
          (this._settings.acceleration[1].x -
            this._settings.acceleration[0].x) +
          this._settings.acceleration[0].x
      ),
      y: Math.abs(
        Math.random() *
          (this._settings.acceleration[1].y -
            this._settings.acceleration[0].y) +
          this._settings.acceleration[0].y
      ),
    };
    const rotationSpeed = Math.abs(
      Math.random() *
        (this._settings.rotationSpeed[1] - this._settings.rotationSpeed[0]) +
        this._settings.rotationSpeed[0]
    );
    const rotationAcceleration = Math.abs(
      Math.random() *
        (this._settings.rotationAcceleration[1] -
          this._settings.rotationAcceleration[0]) +
        this._settings.rotationAcceleration[0]
    );
    const scaleSpeed = {
      x: Math.abs(
        Math.random() *
          (this._settings.scaleSpeed[1].x - this._settings.scaleSpeed[0].x) +
          this._settings.scaleSpeed[0].x
      ),
      y: Math.abs(
        Math.random() *
          (this._settings.scaleSpeed[1].y - this._settings.scaleSpeed[0].y) +
          this._settings.scaleSpeed[0].y
      ),
    };
    const scaleAcceleration = {
      x: Math.abs(
        Math.random() *
          (this._settings.scaleAcceleration[1].x -
            this._settings.scaleAcceleration[0].x) +
          this._settings.scaleAcceleration[0].x
      ),
      y: Math.abs(
        Math.random() *
          (this._settings.scaleAcceleration[1].y -
            this._settings.scaleAcceleration[0].y) +
          this._settings.scaleAcceleration[0].y
      ),
    };

    return {
      view: this.spawnParticle(),
      active: false,
      currentLifetime: this._settings.lifetime[0],
      settings: {
        lifetime,
        speed,
        acceleration,
        rotationSpeed,
        rotationAcceleration,
        scaleSpeed,
        scaleAcceleration,
        startColor:
          this._settings.startColor[
            Math.floor(Math.random() * this._settings.startColor.length)
          ],
        endColor:
          this._settings.endColor[
            Math.floor(Math.random() * this._settings.startColor.length)
          ],
      },
    };
  }

  private _updateParticle(particle: Particle, elapsedTime: number) {
    const lifePercentage =
      particle.currentLifetime / particle.settings.lifetime;

    // Update Speed
    particle.settings.speed.x += particle.settings.acceleration.x * elapsedTime;
    particle.settings.speed.y += particle.settings.acceleration.y * elapsedTime;

    // Update Position
    particle.view.x += particle.settings.speed.x * elapsedTime;
    particle.view.y += particle.settings.speed.y * elapsedTime;

    // Update Rotation Speed
    particle.settings.rotationSpeed +=
      particle.settings.rotationAcceleration * elapsedTime;

    // Update Rotation
    particle.view.rotation += particle.settings.rotationSpeed * elapsedTime;

    // Update Scale Speed
    particle.settings.scaleSpeed.x +=
      particle.settings.scaleAcceleration.x * elapsedTime;
    particle.settings.scaleSpeed.y +=
      particle.settings.scaleAcceleration.y * elapsedTime;

    // Update Scale
    particle.view.scale.x += particle.settings.scaleSpeed.x * elapsedTime;
    particle.view.scale.y += particle.settings.scaleSpeed.y * elapsedTime;

    // Update Color
    const startRGB = particle.settings.startColor.toRgb();
    const endRGB = particle.settings.endColor.toRgb();
    const colorRGB = {
      r: startRGB.r + (endRGB.r - startRGB.r) * lifePercentage,
      g: startRGB.g + (endRGB.g - startRGB.g) * lifePercentage,
      b: startRGB.b + (endRGB.b - startRGB.b) * lifePercentage,
    };
    particle.view.tint = new Color(colorRGB).toHex();
  }

  private _killParticle(particle: Particle) {
    particle.active = false;
    this.removeChild(particle.view);
  }

  update(ticker: Ticker) {
    if (!this._isRunning) return;

    console.log(this._spawnElapsed, this._spawnWait);

    if (this._spawnElapsed >= this._spawnWait) {
      this._spawn();
      this._resetSpawnTimer();
    } else {
      this._spawnElapsed += ticker.deltaMS;
    }
    /*
    this._pool.forEach((particle) => {
      if (particle.active) {
        particle.currentLifetime += ticker.deltaMS;

        if (particle.currentLifetime >= particle.settings.lifetime) {
          this._killParticle(particle);
        } else {
          this._updateParticle(particle, ticker.deltaMS);
        }
      }
    });*/
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

export default ParticleEmitter;
