import { Container, Application, Assets, Sprite, Texture } from 'pixi.js';
import UIController from '../components/uiController';
import ParticleEmitter from '../systems/particleEmitter';

class SceneTask3 extends Container {
  private _UI: UIController;
  private _paused: boolean = true;
  private _running: boolean = false;
  private _fire: ParticleEmitter;

  constructor() {
    super();
  }
  public async init(app: Application) {
    await this._createUI(app);

    Assets.add({ alias: 'fireParticles', src: 'assets/sprites/task_3_0.json' });
    await Assets.load('fireParticles');

    this._fire = new ParticleEmitter(
      {},
      () =>
        new Sprite(
          Texture.from(`particle_fire_${Math.floor(Math.random() * 10)}.png`)
        ),
      app.ticker
    );

    this._fire.x = app.screen.width / 2;
    this._fire.y = app.screen.height / 2;
    this.addChild(this._fire);
  }

  private async _createUI(app: Application) {
    this._UI = new UIController({
      onStart: () => {
        this.start(app);
      },
      onStop: () => {
        this.reset();
      },
      onPause: () => {
        this._paused = true;
      },
      onResume: () => {
        this._paused = false;
      },
    });
    this._UI.x = app.screen.width / 2;
    this._UI.y = app.screen.height - 100;

    this.addChild(this._UI);
  }

  public async _animate(app: Application) {
    this._fire.start();
  }

  public start(app: Application) {
    this._paused = false;
    this._running = true;
    this._animate(app);
  }

  public async reset() {
    this._paused = false;
    this._running = false;
    this._fire.stop();
  }

  public async close() {}
}

export default SceneTask3;
