import { Container, Graphics, Text, Ticker } from 'pixi.js';

class FpsDisplay extends Container {
  private _fpsText: Text;
  private _measures: number[] = [];
  private _poolSize: number;
  constructor(ticker: Ticker, poolSize = 10) {
    super();

    const rect = new Graphics();
    rect.roundRect(-50, -20, 100, 40, 2);
    rect.fill({ color: 0x000000, alpha: 0.5 });
    rect.stroke({ color: 0xffffff, alpha: 0.5 });
    this.addChild(rect);

    this._poolSize = poolSize;
    this._fpsText = new Text({
      text: '0',
      style: {
        fontSize: 20,
        fill: 0xffffff,
      },
      anchor: { x: 0.5, y: 0.5 },
      resolution: 2,
    });
    this.addChild(this._fpsText);

    ticker.add(this.update, this);
  }

  public update(ticker: Ticker) {
    this._measures.push(ticker.FPS);
    if (this._measures.length > this._poolSize) {
      this._measures.shift();
    }

    const average =
      this._measures.reduce((a, b) => a + b, 0) / this._measures.length;

    this._fpsText.text = `${Math.round(average).toString()} fps`;
  }
}

export default FpsDisplay;
