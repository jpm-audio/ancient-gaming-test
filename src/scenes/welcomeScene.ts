import { Assets, Sprite, Texture } from 'pixi.js';
import TaskScene, { TaskSceneInfo } from './taskScene';
import TaskSelectors from '../components/taskSelectors';
import Main from './main';

export default class WelcomeScene extends TaskScene {
  private _taskSelectors: TaskSelectors;

  constructor(main: Main, info: TaskSceneInfo) {
    super(main, info);
  }

  public async init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    Assets.add({ alias: 'main', src: 'assets/sprites/main_0.json' });
    await Assets.load('main');

    this._createBackgroundGradient(0x00727c, 0x00525c);
    this._createTitle();
    this._createSelectors();
    this.positionElements();
  }

  private _createSelectors() {
    const imageTask1Base = new Sprite(Texture.from('select_task_1.jpg'));
    const imageTask2Base = new Sprite(Texture.from('select_task_2.jpg'));
    const imageTask3Base = new Sprite(Texture.from('select_task_3.jpg'));
    const imageTask1Hover = new Sprite(Texture.from('select_task_1.jpg'));
    const imageTask2Hover = new Sprite(Texture.from('select_task_2.jpg'));
    const imageTask3Hover = new Sprite(Texture.from('select_task_3.jpg'));
    const imageTask1Active = new Sprite(Texture.from('select_task_1.jpg'));
    const imageTask2Active = new Sprite(Texture.from('select_task_2.jpg'));
    const imageTask3Active = new Sprite(Texture.from('select_task_3.jpg'));
    const imageTask1Disabled = new Sprite(Texture.from('select_task_1.jpg'));
    const imageTask2Disabled = new Sprite(Texture.from('select_task_2.jpg'));
    const imageTask3Disabled = new Sprite(Texture.from('select_task_3.jpg'));

    imageTask1Base.blendMode = 'screen';
    imageTask2Base.blendMode = 'screen';
    imageTask3Base.blendMode = 'screen';
    imageTask1Disabled.alpha = 0.25;
    imageTask2Disabled.alpha = 0.25;
    imageTask3Disabled.alpha = 0.25;

    this._taskSelectors = new TaskSelectors({
      states: [
        [imageTask1Base, imageTask1Hover, imageTask1Active, imageTask1Disabled],
        [imageTask2Base, imageTask2Hover, imageTask2Active, imageTask2Disabled],
        [imageTask3Base, imageTask3Hover, imageTask3Active, imageTask3Disabled],
      ],
      gap: 100,
    });

    this._taskSelectors.getSelector(0).onpointerup = () => {
      this._main.openScene(1);
    };

    this._taskSelectors.getSelector(1).onpointerup = () => {
      this._main.openScene(2);
    };

    this._taskSelectors.getSelector(2).onpointerup = () => {
      this._main.openScene(3);
    };

    this.addChild(this._taskSelectors);
  }

  public async open() {
    await super.open();
    this._taskSelectors.disabled = false;
  }

  public async close() {
    const s = super.close();
    this._taskSelectors.disabled = true;
    return s;
  }

  public positionElements() {
    super.positionElements();

    this._taskSelectors.x =
      (this._main.currentApp.screen.width - this._taskSelectors.width) / 2;
    this._taskSelectors.y =
      (this._main.currentApp.screen.height - this._taskSelectors.height) / 2;
  }
}
