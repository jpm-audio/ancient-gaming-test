import { Application, Container } from 'pixi.js';
import UIController from '../components/uiController';
import Task1Scene from './task1Scene';
import Task2Scene from './task2Scene';
import Task3Scene from './task3Scene';
import FpsDisplay from '../components/fpsDisplay';
import TaskScene from './taskScene';
import WelcomeScene from './welcomeScene';

export default class Main extends Container {
  private _currentApp: Application;
  private _fpsDisplay: FpsDisplay;
  private _uiController: UIController;
  private _scenesLayer: Container;
  private _uiLayer: Container;
  private _isInitialized: boolean = false;
  private _currentSceneIndex: number = -1;

  public get currentApp() {
    return this._currentApp;
  }

  constructor(app: Application) {
    super();
    this._currentApp = app;
  }

  public init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    // Create Layers
    this._scenesLayer = new Container();
    this._uiLayer = new Container();
    this.addChild(this._scenesLayer);
    this.addChild(this._uiLayer);

    // Create App Elements
    this._createScenes();
    this._createUI();

    this.positionElements();

    this.startScene(0);
  }

  private _createScenes() {
    const welcome = new WelcomeScene(this, {
      title: 'Welcome!',
      subtitle: 'Select a task scene you want to see',
    });
    const task1 = new Task1Scene(this, {
      title: 'Task 1 - Cards',
      subtitle: 'Press "Start" to see the cards migration',
    });
    const task2 = new Task2Scene(this, {
      title: 'Task 2 - Texts & Images',
      subtitle: '"Start" to see random texts and images in line',
    });
    const task3 = new Task3Scene(this, {
      title: 'Task 3 - Fire in the woods',
      subtitle: `Let's "Start" the fire`,
    });

    this._scenesLayer.addChild(welcome);
    this._scenesLayer.addChild(task1);
    this._scenesLayer.addChild(task2);
    this._scenesLayer.addChild(task3);
  }

  private async _createUI() {
    // Create FPS Display
    this._fpsDisplay = new FpsDisplay(this._currentApp.ticker, 100);
    this._uiLayer.addChild(this._fpsDisplay);

    // Create Scenes UI Controller
    this._uiController = new UIController({
      onStart: () => {},
      onStop: () => {},
      onPause: () => {},
      onResume: () => {},
    });
    this._uiLayer.addChild(this._uiController);
  }

  public async startScene(sceneIndex: number) {
    if (this._currentSceneIndex === sceneIndex) return;

    if (this._currentSceneIndex !== -1) {
      const closeScene: TaskScene = this._scenesLayer.getChildAt(
        this._currentSceneIndex
      );
      await closeScene.close();
    }
    this._currentSceneIndex = sceneIndex;

    const openScene: TaskScene = this._scenesLayer.getChildAt(sceneIndex);
    await openScene.open();
  }

  public positionElements() {
    if (!this._isInitialized) return;

    this._fpsDisplay.x = this._currentApp.screen.width / 2;
    this._fpsDisplay.y = 30;

    this._uiController.x = this._currentApp.screen.width / 2;
    this._uiController.y = this._currentApp.screen.height - 100;
  }
}
