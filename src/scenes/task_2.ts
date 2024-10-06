import { Application, Assets, Container, Sprite, Text, Texture } from 'pixi.js';
import { task2Data } from '../data/task_2_data';
import TextLineBlender from '../systems/textLineBlender';
import waitForTickerTime from '../utils/waitForTickerTime';
import gsap from 'gsap';
import waitForCondition from '../utils/waitForCondition';
import UIController from '../components/uiController';

class SceneTask2 extends Container {
  private _paused: boolean = true;
  private _running: boolean = false;
  private _textLayer: Container;
  private _UI: UIController;
  textLineBlender: TextLineBlender;

  constructor() {
    super();

    this.textLineBlender = new TextLineBlender(task2Data);
    this._textLayer = new Container();
    this.addChild(this._textLayer);
  }

  public async init(app: Application) {
    Assets.add({ alias: 'animals', src: 'assets/sprites/task_2_0.json' });
    await Assets.load('animals');

    //this.start(app);
    this._createUI(app);
  }

  private async _animate(app: Application) {
    await waitForCondition(() => this._running && this._paused);

    if (this._textLayer.children.length > 0) {
      await gsap.to(this._textLayer.children[0], {
        duration: 0.5,
        ease: 'power1.in',
        pixi: { alpha: 0 },
        onComplete: () => {
          this._textLayer.removeChildren();
        },
      });
    }

    if (!this._running) return;

    const randomLine = this.textLineBlender.getRandomLine();
    const lineContainer = this.textLineBlender.buildLine(randomLine);
    lineContainer.x = (app.screen.width - lineContainer.width) / 2;
    lineContainer.y = (app.screen.height - lineContainer.height) / 2;
    lineContainer.alpha = 0;
    this._textLayer.addChild(lineContainer);

    await gsap.to(lineContainer, {
      duration: 0.5,
      ease: 'power1.in',
      pixi: { alpha: 1 },
    });

    await waitForTickerTime(1000, app.ticker);

    this._animate(app);
  }

  private _createUI(app: Application) {
    this._UI = new UIController({
      onStart: () => {
        this.start(app);
      },
      onStop: () => {
        this.reset();
      },
      onPause: () => {
        this._paused = true;
        //this._cardFlipAnimation.pause();
      },
      onResume: () => {
        this._paused = false;
        //this._cardFlipAnimation.resume();
      },
    });
    this._UI.x = app.screen.width / 2;
    this._UI.y = app.screen.height - 100;

    this.addChild(this._UI);
  }

  public start(app: Application) {
    this._paused = false;
    this._running = true;
    this._animate(app);
  }

  public async reset() {
    this._paused = false;
    this._running = false;
  }

  public async close() {}
}

export default SceneTask2;
