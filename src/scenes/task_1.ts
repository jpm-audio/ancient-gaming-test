import { Application, Assets, Container, Point, Sprite } from 'pixi.js';
import Deck from '../components/deck';
import Card from '../components/card';
import CardFlipAnimation from '../systems/cardFlipAnimation';
import waitForTickerTime from '../utils/waitForTickerTime';

class SceneTask1 extends Container {
  private NUM_CARDS = 144;
  private DECKS_GAP = 100;
  private _decks: Deck[] = [];
  private _cardFlipAnimation: CardFlipAnimation;
  private _backCardsLayer: Container;
  private _frontCardsLayer: Container;

  constructor() {
    super();

    this._cardFlipAnimation = new CardFlipAnimation();
    this._backCardsLayer = new Container();
    this._frontCardsLayer = new Container();
  }

  public async init(app: Application) {
    // Load the assets
    const sheet = await Assets.load('assets/sprites/task_1_0.json');

    // Create the _decks of cards
    this._decks.push(new Deck({ x: -1, y: -2 }, 'bottom'));
    this._decks.push(new Deck({ x: 1, y: -2 }, 'bottom'));

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
      this._decks[0].addCard(card);
    }

    this._decks[0].x =
      (app.screen.width - cardFrameTexture.width - this.DECKS_GAP) / 2;
    this._decks[1].x =
      (app.screen.width + cardFrameTexture.width + this.DECKS_GAP) / 2;
    this._decks[0].y = this._decks[1].y = app.screen.height / 2;

    this.addChild(this._decks[0]);
    this.addChild(this._decks[1]);
    this.addChild(this._backCardsLayer);
    this.addChild(this._frontCardsLayer);

    this._moveCard(app);
  }

  private async _moveCard(app: Application) {
    const card = this._decks[0].getCard();

    if (!card) return;

    const numCardsAnimated =
      this._frontCardsLayer.children.length +
      this._backCardsLayer.children.length;
    const deck1Coords = this._decks[0].getNextCardCoordinates(1);
    const deck2Coords = this._decks[1].getNextCardCoordinates(
      1 + numCardsAnimated
    );
    card.x = this._decks[0].x + deck1Coords.x;
    card.y = this._decks[0].y + deck1Coords.y;

    this._cardFlipAnimation.addPlay(
      card,
      new Point(
        this._decks[0].x + deck1Coords.x,
        this._decks[0].y + deck1Coords.y
      ),
      new Point(
        this._decks[1].x + deck2Coords.x,
        this._decks[1].y + deck2Coords.y
      ),
      () => {
        this._backCardsLayer.removeChild(card);
        this._frontCardsLayer.addChildAt(
          card,
          this._frontCardsLayer.children.length
        );
      },
      () => {
        this._frontCardsLayer.removeChild(card);
        this._decks[1].addCard(card);
      }
    );

    this._backCardsLayer.addChildAt(card, 0);

    await waitForTickerTime(1000, app.ticker);
    this._moveCard(app);
  }

  public async close() {}
}

export default SceneTask1;
