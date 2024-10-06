import { Container, Sprite } from 'pixi.js';
import { Button } from './button';

interface TaskSelectorsOptions {
  states: [Sprite, Sprite, Sprite, Sprite][];
  gap: number;
}

export default class TaskSelectors extends Container {
  private _selectors: Button[] = [];

  constructor(options: TaskSelectorsOptions) {
    super();

    options.states.forEach((state) => {
      const button = new Button({
        base: state[0],
        hover: state[1],
        active: state[2],
        disabled: state[3],
      });
      this._selectors.push(button);
      this.addChild(button);
    });

    this._selectors.forEach((selector, index) => {
      if (index) {
        selector.x =
          this._selectors[index - 1].x +
          this._selectors[index - 1].width +
          options.gap;
      }
    });
  }

  public getSelector(index: number): Button {
    return this._selectors[index];
  }

  public set disabled(value: boolean) {
    this._selectors.forEach((selector) => {
      selector.disabled = value;
    });
  }
}
