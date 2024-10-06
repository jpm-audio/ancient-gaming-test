import { Assets, Container } from 'pixi.js';
import { task2Data } from '../data/task_2_data';
import TextLineBlender from '../systems/textLineBlender';
import waitForTickerTime from '../utils/waitForTickerTime';
import gsap from 'gsap';
import waitForCondition from '../utils/waitForCondition';
import TaskScene, { TaskSceneInfo } from './taskScene';
import Main from './main';

export default class Task2Scene extends TaskScene {
  private _textLayer: Container;
  private _currentLine: Container;
  public textLineBlender: TextLineBlender;

  constructor(main: Main, info: TaskSceneInfo) {
    super(main, info);
  }

  public async init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

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
    await waitForCondition(() => this._isRunning && this._isPaused);

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

    if (!this._isRunning) return;

    const randomLine = this.textLineBlender.getRandomLine();
    this._currentLine = this.textLineBlender.buildLine(randomLine);
    this._currentLine.alpha = 0;
    this._textLayer.addChild(this._currentLine);

    this.positionElements();

    await gsap.to(this._currentLine, {
      duration: 0.5,
      ease: 'power1.in',
      pixi: { alpha: 1 },
    });

    await waitForTickerTime(1000, this._main.currentApp.ticker);

    this._animate();
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
  }

  public resume(): void {
    super.resume();
  }

  public async reset() {
    this._isPaused = false;
    this._isRunning = false;
  }

  public positionElements() {
    super.positionElements();
    if (!this._isInitialized || !this._currentLine) return;
    this._currentLine.x =
      (this._main.currentApp.screen.width - this._currentLine.width) / 2;
    this._currentLine.y =
      (this._main.currentApp.screen.height - this._currentLine.height) / 2;
  }
}
