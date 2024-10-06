import { Assets, Container, Point } from 'pixi.js';
import Deck from '../components/deck';
import Card from '../components/card';
import CardFlipAnimation from '../systems/cardFlipAnimation';
import waitForTickerTime from '../utils/waitForTickerTime';
import waitForCondition from '../utils/waitForCondition';
import TaskScene, { TaskSceneInfo } from './taskScene';
import Main from './main';

export default class Task1Scene extends TaskScene {
  private NUM_CARDS = 144;
  private DECKS_GAP = 100;
  private _decks: Deck[] = [];
  private _cards: Card[] = [];
  private _cardFlipAnimation: CardFlipAnimation;
  private _backCardsLayer: Container;
  private _frontCardsLayer: Container;
  private _paused: boolean = true;
  private _running: boolean = false;

  constructor(main: Main, info: TaskSceneInfo) {
    super(main, info);
    this._cardFlipAnimation = new CardFlipAnimation();
    this._backCardsLayer = new Container();
    this._frontCardsLayer = new Container();
  }

  public async init() {
    await super.init();
    this._createBackgroundGradient(0x00512c, 0x001e10);
    await this._createDecks();
    this._createTitle();
    this._resetCards();

    this.positionElements();
  }

  private async _createCards() {
    const sheet = await Assets.load('assets/sprites/task_1_0.json');
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
      this._cards.push(card);
    }
  }

  private async _createDecks() {
    // Create the _decks of cards
    this._decks.push(new Deck({ x: -1, y: -2 }, 'bottom'));
    this._decks.push(new Deck({ x: 1, y: -2 }, 'bottom'));

    await this._createCards();

    this._decks[0].x =
      (this._main.currentApp.screen.width -
        this._cards[0].width -
        this.DECKS_GAP) /
      2;
    this._decks[1].x =
      (this._main.currentApp.screen.width +
        this._cards[0].width +
        this.DECKS_GAP) /
      2;
    this._decks[0].y = this._decks[1].y =
      this._main.currentApp.screen.height / 2;

    this.addChild(this._decks[0]);
    this.addChild(this._decks[1]);
    this.addChild(this._backCardsLayer);
    this.addChild(this._frontCardsLayer);
  }

  private async _animateACard() {
    await waitForCondition(() => this._running && this._paused);

    if (!this._running) return;

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

    await waitForTickerTime(1000, this._main.currentApp.ticker);
    this._animateACard();
  }

  private _resetCards() {
    this._decks.forEach((deck) => {
      deck.reset();
    });

    this._cards.forEach((card) => {
      if (card.parent) {
        card.parent.removeChild(card);
      }
      card.reset();
      this._decks[0].addCard(card);
    });
  }

  public start() {
    this._paused = false;
    this._running = true;
    this._animateACard();
  }

  public reset() {
    this._paused = true;
    this._running = false;
    this._cardFlipAnimation.stop();
    this._resetCards();
  }
}
