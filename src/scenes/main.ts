import { Application, Container } from 'pixi.js';
import UIController from '../components/uiController';
import Task1Scene from './task1Scene';
import Task2Scene from './task2Scene';
import Task3Scene from './task3Scene';
import FpsDisplay from '../components/fpsDisplay';
import TaskScene from './taskScene';
import WelcomeScene from './welcomeScene';
import HomeButton from '../components/homeButton';
import debounce from '../utils/debounce';

export default class Main extends Container {
  private _currentApp: Application;
  private _fpsDisplay: FpsDisplay;
  private _uiController: UIController;
  private _homeButton: HomeButton;
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

    // Add resize listener
    window.addEventListener('resize', debounce(this.onResize.bind(this), 300));

    this.positionElements();

    this.openScene(0);
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
      onStart: () => this.startCurrentScene(),
      onStop: () => this.stopCurrentScene(),
      onPause: () => this.pauseCurrentScene(),
      onResume: () => this.resumeCurrentScene(),
      onPrevScene: () => this.prevScene(),
      onNextScene: () => this.nextScene(),
    });
    this._uiLayer.addChild(this._uiController);

    this._homeButton = new HomeButton({
      onpointerup: () => this.openScene(0),
    });
    this._uiLayer.addChild(this._homeButton);
  }

  public onResize() {
    this.positionElements();
  }

  public startCurrentScene() {
    const currentScene: TaskScene = this._scenesLayer.getChildAt(
      this._currentSceneIndex
    );
    currentScene.start();
  }

  public stopCurrentScene() {
    const currentScene: TaskScene = this._scenesLayer.getChildAt(
      this._currentSceneIndex
    );
    currentScene.stop();
  }

  public pauseCurrentScene() {
    const currentScene: TaskScene = this._scenesLayer.getChildAt(
      this._currentSceneIndex
    );
    currentScene.pause();
  }

  public resumeCurrentScene() {
    const currentScene: TaskScene = this._scenesLayer.getChildAt(
      this._currentSceneIndex
    );
    currentScene.resume();
  }

  public async openScene(sceneIndex: number) {
    if (this._currentSceneIndex === sceneIndex) return;

    // Disable UI
    this._uiController.disable();
    this._homeButton.disable();

    // Close current scene
    if (this._currentSceneIndex !== -1) {
      const closeScene: TaskScene = this._scenesLayer.getChildAt(
        this._currentSceneIndex
      );
      await closeScene.close();
    }
    this._currentSceneIndex = sceneIndex;

    // Open new scene
    const openScene: TaskScene = this._scenesLayer.getChildAt(sceneIndex);

    if (sceneIndex === 0) {
      await Promise.all([
        openScene.open(),
        this._uiController.hide(),
        this._homeButton.hide(),
      ]);
    } else {
      await Promise.all([
        openScene.open(),
        this._uiController.show(),
        this._homeButton.show(),
      ]);

      ///Enable/Reset UI
      this._uiController.reset();
      this._homeButton.reset();
    }
  }

  public nextScene() {
    const nextSceneIndex =
      this._currentSceneIndex === this._scenesLayer.children.length - 1
        ? 1
        : this._currentSceneIndex + 1;

    this.openScene(nextSceneIndex);
  }

  public prevScene() {
    const prevSceneIndex =
      this._currentSceneIndex === 1
        ? this._scenesLayer.children.length - 1
        : this._currentSceneIndex - 1;

    this.openScene(prevSceneIndex);
  }

  public positionElements() {
    if (!this._isInitialized) return;

    const padding = 10;

    this._fpsDisplay.x = this._currentApp.screen.width / 2;
    this._fpsDisplay.y = this._fpsDisplay.height / 2 + padding;

    this._uiController.x = this._currentApp.screen.width / 2;
    this._uiController.y = this._currentApp.screen.height - 50;

    this._homeButton.x =
      this._currentApp.screen.width - this._homeButton.width / 2 - padding;
    this._homeButton.y = this._homeButton.height / 2 + padding;

    this._scenesLayer.children.forEach((scene) => {
      const taskScene = scene as TaskScene;
      taskScene.positionElements();
    });
  }
}
