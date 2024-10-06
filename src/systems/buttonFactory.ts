import { Container, FillInput, Graphics, Text, TextOptions } from 'pixi.js';
import { Button } from '../components/button';

class ButtonFactory {
  static createDefaultButton(
    text: string,
    width: number = 100,
    height: number = 50,
    corner: number = 10
  ): Button {
    const base = new Container();
    base.addChild(
      ButtonFactory.createBackground(0xf06030, 0xf08040, width, height, corner)
    );
    base.addChild(ButtonFactory.createText(text));

    const hover = new Container();
    hover.addChild(
      ButtonFactory.createBackground(0xf08040, 0xf06030, width, height, corner)
    );
    hover.addChild(ButtonFactory.createText(text));

    const active = new Container();
    active.addChild(
      ButtonFactory.createBackground(0xf06030, 0xf04020, width, height, corner)
    );
    active.addChild(ButtonFactory.createText(text));

    const disabled = new Container();
    disabled.addChild(
      ButtonFactory.createBackground(0x808080, 0x707070, width, height, corner)
    );
    disabled.addChild(ButtonFactory.createText(text));

    const button = new Button({
      base: base,
      hover: hover,
      active: active,
      disabled: disabled,
    });

    return button;
  }

  static createPrimaryButton(
    text: string,
    width: number = 100,
    height: number = 50,
    corner: number = 10
  ): Button {
    const base = new Container();
    base.addChild(
      ButtonFactory.createBackground(0x00525c, 0x00727c, width, height, corner)
    );
    base.addChild(ButtonFactory.createText(text));

    const hover = new Container();
    hover.addChild(
      ButtonFactory.createBackground(0x00727c, 0x00828c, width, height, corner)
    );
    hover.addChild(ButtonFactory.createText(text));

    const active = new Container();
    active.addChild(
      ButtonFactory.createBackground(0x00828c, 0x00b2bf, width, height, corner)
    );
    active.addChild(ButtonFactory.createText(text));

    const disabled = new Container();
    disabled.addChild(
      ButtonFactory.createBackground(0x808080, 0x707070, width, height, corner)
    );
    disabled.addChild(ButtonFactory.createText(text));

    const button = new Button({
      base: base,
      hover: hover,
      active: active,
      disabled: disabled,
    });

    return button;
  }

  static createBackground(
    fill: FillInput,
    stroke: number | string,
    width: number = 100,
    height: number = 50,
    corner: number = 10
  ): Graphics {
    const background = new Graphics();
    background.roundRect(-width / 2, -height / 2, width, height, corner);
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
