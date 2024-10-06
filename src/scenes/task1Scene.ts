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
  private _decksLayer: Container;
  private _backCardsLayer: Container;
  private _frontCardsLayer: Container;
  private _decksSize: { width: number; height: number };

  constructor(main: Main, info: TaskSceneInfo) {
    super(main, info);
    this._cardFlipAnimation = new CardFlipAnimation();
    this._backCardsLayer = new Container();
    this._frontCardsLayer = new Container();
    this._decksLayer = new Container();
  }

  public async init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

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

    this._decksLayer.addChild(this._decks[0]);
    this._decksLayer.addChild(this._decks[1]);
    this._decksLayer.addChild(this._backCardsLayer);
    this._decksLayer.addChild(this._frontCardsLayer);
    this.addChild(this._decksLayer);

    this._decksSize = {
      width: 2 * this._cards[0].width + this.DECKS_GAP + 2 * this.NUM_CARDS,
      height: this._cards[0].height + 2 * this.NUM_CARDS,
    };

    this._decks[0].x = this._cards[0].width / 2 + this.NUM_CARDS;
    this._decks[1].x = this._decks[0].x + this._cards[0].width + this.DECKS_GAP;
    this._decks[0].y = this._decks[1].y =
      this._cards[0].height / 2 + 2 * this.NUM_CARDS;
  }

  private async _animateACard() {
    await waitForCondition(() => this._isRunning && this._isPaused);

    if (!this._isRunning) return;

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
    if (this._isRunning) return;
    this._isRunning = true;
    this.resume();
    this._animateACard();
  }

  public stop() {
    this.reset();
  }

  public pause(): void {
    super.pause();
    this._cardFlipAnimation.pause();
  }

  public resume(): void {
    super.resume();
    this._cardFlipAnimation.resume();
  }

  public reset() {
    this._isPaused = false;
    this._isRunning = false;
    this._cardFlipAnimation.stop();
    this._resetCards();
  }

  public positionElements() {
    super.positionElements();
    if (!this._isInitialized) return;

    this._decksLayer.scale.set(1);

    const availableWidth =
      this._main.currentApp.screen.width - 2 * TaskScene.PADDING;
    const availableHeight =
      this._main.currentApp.screen.height -
      this._subtitle.y -
      this._subtitle.height / 2 -
      4 * TaskScene.PADDING;
    const scaleByWidth = availableWidth / this._decksSize.width;
    const scaleByHeight = availableHeight / this._decksSize.height;
    const scale = Math.min(scaleByWidth, scaleByHeight);
    this._decksLayer.scale.set(scale);

    const posYFromSubtitle =
      this._subtitle.y + this._subtitle.height / 2 + TaskScene.PADDING;
    const posYCenter =
      (this._main.currentApp.screen.height - this._decksSize.height * scale) /
      2;

    this._decksLayer.x =
      (this._main.currentApp.screen.width - this._decksSize.width * scale) / 2;
    this._decksLayer.y = Math.max(posYFromSubtitle, posYCenter);
  }
}
