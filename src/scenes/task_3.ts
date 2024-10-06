import {
  Container,
  Application,
  Assets,
  Sprite,
  Texture,
  TilingSprite,
} from 'pixi.js';
import UIController from '../components/uiController';
import { ParticleEmitter } from '../systems/particleEmitter';
import { task3Data } from '../data/task_3_data';

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
    Assets.add({ alias: 'forestTile', src: 'assets/images/forest_tile.png' });
    await Assets.load('fireParticles');
    await Assets.load('forestTile');

    this._createBackground(app);

    this._fire = new ParticleEmitter(
      task3Data,
      () =>
        new Sprite({
          texture: Texture.from(
            `particle_fire_${Math.floor(Math.random() * 10)}.png`
          ),
          anchor: 0.5,
        }),
      app.ticker
    );

    this._fire.x = app.screen.width / 2;
    this._fire.y = app.screen.height / 2;
    this.addChild(this._fire);

    const pointerSurface = new Container();
    pointerSurface.width = app.screen.width;
    pointerSurface.height = app.screen.height;
    pointerSurface.interactive = true;
    pointerSurface.on('pointerdown', () => {
      console.log('CLICK');
    });
    this.addChild(pointerSurface);
  }

  private _createBackground(app: Application) {
    const forestTexture = Texture.from('forestTile');
    const forest = new TilingSprite({
      texture: forestTexture,
      width: app.screen.width,
      height: forestTexture.height,
    });
    forest.anchor.set(0.5);
    forest.x = app.screen.width / 2;
    forest.y = app.screen.height / 2;
    this.addChild(forest);
  }

  private async _createUI(app: Application) {
    this._UI = new UIController({
      onStart: () => {
        this.start();
      },
      onStop: () => {
        this.reset();
      },
      onPause: () => {
        this._fire.pause();
      },
      onResume: () => {
        this._fire.resume();
      },
    });
    this._UI.x = app.screen.width / 2;
    this._UI.y = app.screen.height - 100;

    this.addChild(this._UI);
  }

  public async _animate() {
    this._fire.start();
  }

  public start() {
    this._paused = false;
    this._running = true;
    this._animate();
  }

  public async reset() {
    this._paused = false;
    this._running = false;
    this._fire.stop();
  }

  public async close() {}
}

export default SceneTask3;
