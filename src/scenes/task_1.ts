import { Application, Assets, Container, Sprite } from 'pixi.js';
import Deck from '../components/deck';
import Card from '../components/card';

class SceneTask1 extends Container {
  private NUM_CARDS = 144;
  private DECKS_GAP = 50;
  private decks: Deck[] = [];

  constructor() {
    super();
  }

  public async init(app: Application) {
    // Load the assets
    const sheet = await Assets.load('assets/sprites/task_1_0.json');

    // Create the deck of cards
    this.decks.push(new Deck({ x: -1, y: -2 }));
    this.decks.push(new Deck({ x: 1, y: 2 }));

    // Add the cards to the deck
    const cardFrameTexture = sheet.textures['card.png'];
    const cardBackTexture = sheet.textures['card_back_image.png'];
    for (let i = 0; i < this.NUM_CARDS; i++) {
      const cardFrontTexture = sheet.textures[`genericItem_color_${i + 1}.png`];
      const card = new Card(
        cardFrameTexture,
        cardFrontTexture,
        cardBackTexture
      );
      card.flip();
      this.decks[0].addCard(card);
    }

    this.decks[0].x =
      (app.screen.width - cardFrameTexture.width - this.DECKS_GAP) / 2;
    this.decks[1].x =
      (app.screen.width + cardFrameTexture.width + this.DECKS_GAP) / 2;
    this.decks[0].y = this.decks[1].y = app.screen.height / 2;

    app.stage.addChild(this.decks[0]);
    app.stage.addChild(this.decks[1]);

    const card = this.decks[0].getCard();
    card.flip();

    setTimeout(() => {
      this.decks[1].addCard(card);
    }, 1000);
  }

  public async close() {}
}

export default SceneTask1;
