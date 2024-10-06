import gsap from 'gsap';
import { Color, Container, Sprite, Text } from 'pixi.js';
import createRadialGradientTexture from '../utils/createRadialGradientTexture';
import Main from './main';

export interface TaskSceneInfo {
  title: string;
  subtitle: string;
}

export default class TaskScene extends Container {
  static DEFAULT_TRANSITION_TIME = 0.5;
  protected _main: Main;
  protected _isPaused: boolean = true;
  protected _isRunning: boolean = false;
  protected _isInitialized: boolean = false;
  protected _transitionTime: number;
  protected _title: Text;
  protected _subtitle: Text;
  protected _info: TaskSceneInfo;

  constructor(
    main: Main,
    info: TaskSceneInfo,
    transitionTime: number = TaskScene.DEFAULT_TRANSITION_TIME
  ) {
    super();
    this._main = main;
    this._info = info;
    this._transitionTime = transitionTime;
    this.alpha = 0;
  }

  protected _createBackgroundGradient(colorFrom: number, colorTo: number) {
    const AR =
      this._main.currentApp.screen.width / this._main.currentApp.screen.height;
    const radius = Math.hypot(
      this._main.currentApp.screen.width / 2,
      this._main.currentApp.screen.height / 2
    );

    const gradientTexture = createRadialGradientTexture(radius, [
      { color: new Color(colorFrom), stop: 0 },
      { color: new Color(colorTo), stop: 1 },
    ]);
    const background = Sprite.from(gradientTexture);
    background.anchor.set(0.5);

    if (AR > 1) {
      background.width = radius * 2;
      background.height = background.width / AR;
    } else {
      background.height = radius * 2;
      background.width = background.height * AR;
    }

    background.x = this._main.currentApp.screen.width / 2;
    background.y = this._main.currentApp.screen.height / 2;
    this.addChild(background);
  }

  protected _createTitle() {
    this._title = new Text({
      text: this._info.title,
      style: {
        fontSize: 40,
        fill: 0xffffff,
        align: 'center',
        fontFamily: 'Arial',
        fontWeight: 'bold',
      },
      anchor: { x: 0.5, y: 0.5 },
      resolution: 2,
    });
    this.addChild(this._title);

    this._subtitle = new Text({
      text: this._info.subtitle,
      style: {
        fontSize: 30,
        fill: 0xffffff,
        align: 'center',
        fontFamily: 'Arial',
      },
      anchor: { x: 0.5, y: 0.5 },
      resolution: 2,
    });
    this.addChild(this._subtitle);
  }

  public async init() {
    console.log('TaskScene::init');
    if (this._isInitialized) return;
    this._isInitialized = true;
  }

  public start() {
    console.log('TaskScene::start');
    this._isRunning = true;
  }

  public stop() {
    console.log('TaskScene::stop');
    this._isRunning = false;
    this._isPaused = false;
  }

  public pause() {
    console.log('TaskScene::pause');
    this._isPaused = true;
  }

  public resume() {
    console.log('TaskScene::resume');
    this._isPaused = false;
  }

  public reset() {
    console.log('TaskScene::reset');
    this._isRunning = false;
    this._isPaused = false;
  }

  public async open() {
    console.log('TaskScene::open1');
    await this.init();
    console.log('TaskScene::open2');
    await gsap.to(this, { duration: this._transitionTime, alpha: 1 });
    console.log('TaskScene::open3');
  }

  public async close() {
    console.log('TaskScene::close');
    await gsap.to(this, { duration: this._transitionTime, alpha: 0 });
  }

  public positionElements() {
    if (!this._isInitialized) return;
    if (this._title) {
      this._title.x = this._main.currentApp.screen.width / 2;
      this._title.y = this._main.currentApp.screen.height * 0.15;
    }
    if (this._subtitle) {
      this._subtitle.x = this._main.currentApp.screen.width / 2;
      this._subtitle.y = this._title.y + 75;
    }
  }
}
