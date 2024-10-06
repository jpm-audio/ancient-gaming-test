import { Container } from 'pixi.js';
import TaskScene from '../scenes/taskScene';
import gsap from 'gsap';
import { Button } from './button';
import ButtonFactory from '../systems/buttonFactory';

interface HomeButtonOptions {
  onpointerup: () => void;
}

export default class HomeButton extends Container {
  private _button: Button;
  constructor(options: HomeButtonOptions) {
    super();

    this._button = ButtonFactory.createPrimaryButton('Home');
    this.addChild(this._button);

    this._button.onpointerup = () => {
      options.onpointerup();
    };

    this.alpha = 0;
  }

  public disable() {
    this._button.disabled = true;
  }

  public reset() {
    this._button.disabled = false;
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
