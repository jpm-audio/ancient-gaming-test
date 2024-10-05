import { Container, Sprite, Texture } from 'pixi.js';

class Card extends Container {
  back: Sprite;
  front: Sprite;
  constructor(frame: Texture, front: Texture, back: Texture) {
    super();

    const frameSprite = Sprite.from(frame);
    this.front = Sprite.from(front);
    this.back = Sprite.from(back);

    frameSprite.anchor.set(0.5, 0.5);
    this.front.anchor.set(0.5, 0.5);
    this.back.anchor.set(0.5, 0.5);

    this.addChild(frameSprite);
    this.addChild(this.front);
    this.addChild(this.back);

    this.reset();
  }

  flip() {
    this.back.visible = !this.back.visible;
    this.front.visible = !this.front.visible;
  }

  reset() {
    this.back.visible = true;
    this.front.visible = false;
    this.x = 0;
    this.y = 0;
    this.scale.set(1);
    this.skew.set(0);
  }
}

export default Card;
