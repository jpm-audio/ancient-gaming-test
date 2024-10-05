import { Point } from 'pixi.js';
import Card from '../components/card';
import gsap from 'gsap';

export default class CardFlipAnimation {
  FLIP_OFFSET = { x: 0, y: -50 };
  private _currentTweens: gsap.core.Tween[] = [];

  addPlay(
    card: Card,
    from: Point,
    to: Point,
    onFlip: () => void,
    onComplete: () => void
  ) {
    const flipX = this.FLIP_OFFSET.x + from.x + (to.x - from.x) / 2;
    const flipY = this.FLIP_OFFSET.y + from.y + (to.y - from.y) / 2;

    card.x = from.x;
    card.y = from.y;

    const tween1 = gsap.to(card, {
      x: flipX,
      y: flipY,
      pixi: {
        scaleX: 0,
        scaleY: 1.15,
        skewX: -3,
        skewY: -7,
      },
      duration: 1,
      ease: 'power1.in',
    });
    tween1.pause();

    const tween2 = gsap.to(card, {
      x: to.x,
      y: to.y,
      pixi: {
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
      },
      duration: 1,
      ease: 'power1.out',
      onComplete: onComplete,
    });
    tween2.pause();

    this._currentTweens.push(tween1);

    tween1.vars.onComplete = () => {
      this._currentTweens.splice(this._currentTweens.indexOf(tween1), 1);
      this._currentTweens.push(tween2);
      card.flip();
      onFlip();
      tween2.play();
    };

    tween2.vars.onComplete = () => {
      this._currentTweens.splice(this._currentTweens.indexOf(tween2), 1);
      onComplete();
    };

    tween1.play();
  }

  pause() {
    this._currentTweens.forEach((tween) => tween.pause());
  }

  resume() {
    this._currentTweens.forEach((tween) => tween.resume());
  }

  stop() {
    this._currentTweens.forEach((tween) => tween.kill());
    this._currentTweens = [];
  }
}
