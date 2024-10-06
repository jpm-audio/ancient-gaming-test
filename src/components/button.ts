import { Container } from 'pixi.js';

interface ButtonOptions {
  base: Container;
  hover?: Container;
  active?: Container;
  disabled?: Container;
}

export class Button extends Container {
  private _content = {
    base: new Container(),
    hover: new Container(),
    active: new Container(),
    disabled: new Container(),
  };

  public get disabled() {
    return !this.isInteractive();
  }

  public set disabled(value: boolean) {
    if (value === this.interactive) {
      this.interactive = !value;
      this.removeChildren();
      if (value) {
        this.addChild(this._content.disabled);
      } else {
        this.addChild(this._content.base);
      }
    }
  }

  constructor(options: ButtonOptions) {
    super();

    this._content.base = options.base;
    this._content.hover = options.hover || this._content.base;
    this._content.active = options.active || this._content.base;
    this._content.disabled = options.disabled || this._content.base;

    this.interactive = true;
    this.addChild(this._content.base);

    this.setupEvents();
  }

  private setupEvents() {
    this.on('pointerdown', () => {
      this.onPointerDown();
    });

    this.on('pointerup', () => {
      this.onPointerUp();
    });

    this.on('pointerover', () => {
      this.onPointerOver();
    });

    this.on('pointerout', () => {
      this.onPointerOut();
    });
  }

  private onPointerDown() {
    this.removeChildren();
    this.addChild(this._content.active);
  }

  // Handle pointer up event
  private onPointerUp() {
    this.removeChildren();
    this.addChild(this._content.hover);
  }

  // Handle pointer over event
  private onPointerOver() {
    this.removeChildren();
    this.addChild(this._content.hover);
  }

  // Handle pointer out event
  private onPointerOut() {
    this.removeChildren();
    this.addChild(this._content.base);
  }
}
