import { Container, Point, PointData } from 'pixi.js';
import Card from './card';

class Deck extends Container {
  public CARD_OFFSET = { x: -1, y: -2 };
  private cards: Card[] = [];

  public get numCards() {
    return this.cards.length;
  }

  constructor(offset: PointData = { x: 0, y: 0 }) {
    super();
    this.CARD_OFFSET = offset;
  }

  addCard(card: Card) {
    this.cards.push(card);
    this.addChild(card);

    card.x = this.numCards * this.CARD_OFFSET.x;
    card.y = this.numCards * this.CARD_OFFSET.y;
  }

  getCard(index: number = this.numCards - 1) {
    const card = this.cards[index];

    if (!card) {
      throw Error(`Card ${index} not found`);
    }

    this.removeCard(card);

    return card;
  }

  removeCard(card: Card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    this.removeChild(card);
  }
}

export default Deck;
