import { Container, Point, PointData, Text } from 'pixi.js';
import Card from './card';

type CardCounterPosition = 'top' | 'bottom';

class Deck extends Container {
  public ADD_CARD_OFFSET = { x: -1, y: -2 };
  public COUNTER_GAP = 20;
  private _cardsContainer: Container;
  private _counter: Text;
  private _counterPosition: CardCounterPosition;

  public get numCards() {
    return this._cardsContainer.children.length;
  }

  public get counter() {
    return this._counter;
  }

  public set counterGap(value: number) {
    this.COUNTER_GAP = value;
    this._positionCounter();
  }

  constructor(
    addCardOffset: PointData = { x: 0, y: 0 },
    CounterPosition: CardCounterPosition = 'top'
  ) {
    super();
    this.ADD_CARD_OFFSET = addCardOffset;
    this._counterPosition = CounterPosition;

    this._cardsContainer = new Container();
    this.addChild(this._cardsContainer);

    this._counter = new Text({
      text: '0',
      resolution: 1,
      roundPixels: true,
      anchor: 0.5,
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: 0xffffff,
        align: 'center',
      },
    });
    this._counter.visible = false;
    this.addChild(this._counter);
  }

  private _positionCounter() {
    if (this._counter.visible) {
      const cardHeight = this._cardsContainer.children.length
        ? this._cardsContainer.getChildAt(0).height
        : 0;
      const direction = this._counterPosition === 'top' ? -1 : 1;
      this._counter.y =
        direction *
        (this.COUNTER_GAP + (this._counter.height + cardHeight) / 2);
    }
  }

  getTheoricalWidth() {
    return this.width + this.numCards * Math.abs(this.ADD_CARD_OFFSET.x);
  }

  getTheoricalHeight() {
    return this.height + this.numCards * Math.abs(this.ADD_CARD_OFFSET.y);
  }

  updateCounter() {
    this._counter.visible = this.numCards > 0;

    if (this._counter.visible) {
      this._counter.text = this.numCards.toString();
      this._positionCounter();
    }
  }

  addCard(card: Card) {
    this._cardsContainer.addChild(card);

    card.x = this.numCards * this.ADD_CARD_OFFSET.x;
    card.y = this.numCards * this.ADD_CARD_OFFSET.y;

    this.updateCounter();
  }

  getCard(index: number = this.numCards - 1): Card | null {
    if (this.numCards === 0) return null;

    const card = this._cardsContainer.removeChildAt<Card>(index);
    this.updateCounter();
    return card;
  }

  getNextCardCoordinates(offset: number = 0): Point {
    return new Point(
      (this.numCards + offset) * this.ADD_CARD_OFFSET.x,
      (this.numCards + offset) * this.ADD_CARD_OFFSET.y
    );
  }

  reset() {
    this._cardsContainer.removeChildren();
    this.updateCounter();
  }
}

export default Deck;
