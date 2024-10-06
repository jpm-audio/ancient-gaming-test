import { Assets, Container } from 'pixi.js';
import { task2Data } from '../data/task_2_data';
import TextLineBlender from '../systems/textLineBlender';
import waitForTickerTime from '../utils/waitForTickerTime';
import gsap from 'gsap';
import waitForCondition from '../utils/waitForCondition';
import UIController from '../components/uiController';
import TaskScene, { TaskSceneInfo } from './taskScene';
import Main from './main';

export default class Task2Scene extends TaskScene {
  private _paused: boolean = true;
  private _running: boolean = false;
  private _textLayer: Container;
  private _UI: UIController;
  textLineBlender: TextLineBlender;

  constructor(main: Main, info: TaskSceneInfo) {
    super(main, info);
  }

  public async init() {
    await super.init();

    Assets.add({ alias: 'animals', src: 'assets/sprites/task_2_0.json' });

    await Assets.load('animals');

    this._createBackgroundGradient(0x222222, 0x090909);

    this.textLineBlender = new TextLineBlender(task2Data);
    this._textLayer = new Container();
    this.addChild(this._textLayer);

    this._createTitle();
    this.positionElements();
  }

  private async _animate() {
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
    lineContainer.x =
      (this._main.currentApp.screen.width - lineContainer.width) / 2;
    lineContainer.y =
      (this._main.currentApp.screen.height - lineContainer.height) / 2;
    lineContainer.alpha = 0;
    this._textLayer.addChild(lineContainer);

    await gsap.to(lineContainer, {
      duration: 0.5,
      ease: 'power1.in',
      pixi: { alpha: 1 },
    });

    await waitForTickerTime(1000, this._main.currentApp.ticker);

    this._animate();
  }

  public start() {
    this._paused = false;
    this._running = true;
    this._animate();
  }

  public async reset() {
    this._paused = false;
    this._running = false;
  }

  public async close() {}
}
