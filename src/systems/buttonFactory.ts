import { Container, FillInput, Graphics, Text, TextOptions } from 'pixi.js';
import { Button } from '../components/button';

class ButtonFactory {
  static createDefaultButton(text: string): Button {
    const base = new Container();
    base.addChild(ButtonFactory.createBackground(0xf06030, 0xf08040));
    base.addChild(ButtonFactory.createText(text));

    const hover = new Container();
    hover.addChild(ButtonFactory.createBackground(0xf08040, 0xf06030));
    hover.addChild(ButtonFactory.createText(text));

    const active = new Container();
    active.addChild(ButtonFactory.createBackground(0xf06030, 0xf04020));
    active.addChild(ButtonFactory.createText(text));

    const disabled = new Container();
    disabled.addChild(ButtonFactory.createBackground(0x808080, 0x707070));
    disabled.addChild(ButtonFactory.createText(text));

    const button = new Button({
      base: base,
      hover: hover,
      active: active,
      disabled: disabled,
    });

    return button;
  }

  static createBackground(fill: FillInput, stroke: number | string): Graphics {
    const background = new Graphics();
    background.roundRect(-50, -25, 100, 50, 10);
    background.fill(fill);
    background.stroke({ width: 2, color: stroke });
    return background;
  }

  static createText(text: string): Text {
    const textOptions: TextOptions = {
      text: text,
      style: { fontSize: 20, fill: 0xffffff, align: 'center' },
      anchor: { x: 0.5, y: 0.5 },
      resolution: 2,
    };
    return new Text(textOptions);
  }
}

export default ButtonFactory;
