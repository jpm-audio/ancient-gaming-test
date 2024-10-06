import { Container } from 'pixi.js';
import ButtonFactory from '../systems/buttonFactory';
import { Button } from './button';
import TaskScene from '../scenes/taskScene';

interface UIControllerOptions {
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

class UIController extends Container {
  private _startButton: Button;
  private _resetButton: Button;
  private _pauseButton: Button;
  private _resumeButton: Button;

  constructor(options: UIControllerOptions) {
    super();

    this.alpha = 0;

    this._startButton = ButtonFactory.createDefaultButton('Start');
    this._startButton.x = -100;
    this.addChild(this._startButton);

    this._resetButton = ButtonFactory.createDefaultButton('Reset');
    this._resetButton.x = -100;
    this.addChild(this._resetButton);

    this._pauseButton = ButtonFactory.createDefaultButton('Pause');
    this._pauseButton.x = 100;
    this.addChild(this._pauseButton);

    this._resumeButton = ButtonFactory.createDefaultButton('Resume');
    this._resumeButton.x = 100;
    this.addChild(this._resumeButton);

    this.reset();

    this._startButton.onpointerup = () => {
      this._resetButton.disabled = false;
      this._resetButton.visible = true;
      this._startButton.disabled = true;
      this._startButton.visible = false;
      this.disablePauseResume(false);
      options.onStart();
    };

    this._resetButton.onpointerup = () => {
      this._resetButton.disabled = true;
      this._resetButton.visible = false;
      this._startButton.disabled = false;
      this._startButton.visible = true;
      this.disablePauseResume(true);
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
  }

  public disablePauseResume(value: boolean) {
    this._pauseButton.disabled = value;
    this._resumeButton.disabled = value;
  }

  public reset() {
    this._resetButton.disabled = true;
    this._resetButton.visible = false;
    this._startButton.visible = true;
    this._startButton.disabled = false;
    this._resumeButton.disabled = true;
    this._resumeButton.visible = false;
    this._pauseButton.visible = true;
    this._pauseButton.disabled = true;
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
