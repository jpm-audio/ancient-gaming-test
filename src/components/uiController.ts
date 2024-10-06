import { Container } from 'pixi.js';
import ButtonFactory from '../systems/buttonFactory';
import { Button } from './button';
import TaskScene from '../scenes/taskScene';
import gsap from 'gsap';

interface UIControllerOptions {
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
}

class UIController extends Container {
  private _startButton: Button;
  private _stopButton: Button;
  private _pauseButton: Button;
  private _resumeButton: Button;
  private _prevSceneButton: Button;
  private _nextSceneButton: Button;

  constructor(options: UIControllerOptions) {
    super();
    const gap = 75;
    this.alpha = 0;

    this._startButton = ButtonFactory.createDefaultButton('Start');
    this._startButton.x = -gap;
    this.addChild(this._startButton);

    this._stopButton = ButtonFactory.createDefaultButton('Stop');
    this._stopButton.x = -gap;
    this.addChild(this._stopButton);

    this._pauseButton = ButtonFactory.createDefaultButton('Pause');
    this._pauseButton.x = gap;
    this.addChild(this._pauseButton);

    this._resumeButton = ButtonFactory.createDefaultButton('Resume');
    this._resumeButton.x = gap;
    this.addChild(this._resumeButton);

    this._prevSceneButton = ButtonFactory.createPrimaryButton('<', 50);
    this._prevSceneButton.x =
      this._startButton.x - this._startButton.width - 2 * gap;
    this.addChild(this._prevSceneButton);

    this._nextSceneButton = ButtonFactory.createPrimaryButton('>', 50);
    this._nextSceneButton.x =
      this._pauseButton.x + this._pauseButton.width + 2 * gap;
    this.addChild(this._nextSceneButton);

    this.reset();

    this._startButton.onpointerup = () => {
      this._stopButton.disabled = false;
      this._stopButton.visible = true;
      this._startButton.disabled = true;
      this._startButton.visible = false;
      this.disablePauseResume(false);
      options.onStart();
    };

    this._stopButton.onpointerup = () => {
      this.reset();
      options.onStop();
    };

    this._pauseButton.onpointerup = () => {
      this._resumeButton.disabled = false;
      this._resumeButton.visible = true;
      this._pauseButton.disabled = true;
      this._pauseButton.visible = false;
      options.onPause();
    };

    this._resumeButton.onpointerup = () => {
      this._resumeButton.disabled = true;
      this._resumeButton.visible = false;
      this._pauseButton.disabled = false;
      this._pauseButton.visible = true;
      options.onResume();
    };

    this._prevSceneButton.onpointerup = () => {
      options.onPrevScene();
    };

    this._nextSceneButton.onpointerup = () => {
      options.onNextScene();
    };
  }

  public disablePauseResume(value: boolean) {
    this._pauseButton.disabled = value;
    this._resumeButton.disabled = value;
  }

  public disable() {
    this._stopButton.disabled = true;
    this._pauseButton.disabled = true;
    this._startButton.disabled = true;
    this._resumeButton.disabled = true;
    this._prevSceneButton.disabled = true;
    this._nextSceneButton.disabled = true;
  }

  public reset() {
    this._stopButton.visible = false;
    this._startButton.visible = true;
    this._resumeButton.visible = false;
    this._pauseButton.visible = true;

    this._pauseButton.disabled = true;
    this._stopButton.disabled = true;
    this._startButton.disabled = false;
    this._resumeButton.disabled = true;

    this._prevSceneButton.disabled = false;
    this._nextSceneButton.disabled = false;
  }

  public async show() {
    await gsap.to(this, {
      duration: TaskScene.DEFAULT_TRANSITION_TIME,
      alpha: 1,
    });
  }

  public async hide() {
    await gsap.to(this, {
      duration: TaskScene.DEFAULT_TRANSITION_TIME,
      alpha: 0,
    });
  }
}

export default UIController;
