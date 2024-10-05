import { Ticker } from 'pixi.js';

export default async function waitForTickerTime(time: number, ticker: Ticker) {
  return new Promise((resolve) => {
    let elapsed = 0;

    const onTick = () => {
      elapsed += ticker.deltaMS;
      if (elapsed >= time) {
        ticker.remove(onTick);
        resolve(null);
      }
    };

    ticker.add(onTick);
  });
}
