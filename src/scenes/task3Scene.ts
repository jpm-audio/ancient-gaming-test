import { Assets, Sprite, Texture, TilingSprite } from 'pixi.js';
import { ParticleEmitter } from '../systems/particleEmitter';
import { task3Data } from '../data/task_3_data';
import TaskScene, { TaskSceneInfo } from './taskScene';
import Main from './main';

export default class Task3Scene extends TaskScene {
  private _fire: ParticleEmitter;
  private _background: TilingSprite;

  constructor(main: Main, info: TaskSceneInfo) {
    super(main, info);
  }
  public async init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    Assets.add({ alias: 'fireParticles', src: 'assets/sprites/task_3_0.json' });
    Assets.add({ alias: 'forestTile', src: 'assets/images/forest_tile.png' });
    await Assets.load('fireParticles');
    await Assets.load('forestTile');

    this._createBackground();

    this._fire = new ParticleEmitter(
      task3Data,
      () =>
        new Sprite({
          texture: Texture.from(
            `particle_fire_${Math.floor(Math.random() * 10)}.png`
          ),
          anchor: 0.5,
        }),
      this._main.currentApp.ticker
    );

    this._fire.x = this._main.currentApp.screen.width / 2;
    this._fire.y = this._main.currentApp.screen.height / 2;
    this.addChild(this._fire);

    this._background.interactive = true;
    this._background.on('pointerdown', (e) => {
      this._fire.x = e.client.x;
      this._fire.y = e.client.y;
    });

    this._createTitle();
    this.positionElements();
  }

  private _createBackground() {
    const forestTexture = Texture.from('forestTile');
    this._background = new TilingSprite({
      texture: forestTexture,
      width: this._main.currentApp.screen.width,
      height: forestTexture.height,
    });
    this._background.anchor.set(0.5);
    this._background.x = this._main.currentApp.screen.width / 2;
    this._background.y = this._main.currentApp.screen.height / 2;
    this.addChild(this._background);
  }

  public async _animate() {
    this._fire.start();
  }

  public start() {
    if (this._isRunning) return;
    this._isPaused = false;
    this._isRunning = true;
    this._animate();
  }

  public stop() {
    this.reset();
  }

  public pause(): void {
    super.pause();
    this._fire.pause();
  }

  public resume(): void {
    super.resume();
    this._fire.resume();
  }

  public async reset() {
    this._isPaused = false;
    this._isRunning = false;
    this._fire.stop();
  }

  public positionElements() {
    super.positionElements();
    if (!this._isInitialized) return;
    this._fire.x = this._main.currentApp.screen.width / 2;
    this._fire.y = this._main.currentApp.screen.height / 2;
  }
}
