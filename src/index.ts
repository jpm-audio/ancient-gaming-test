import { Application } from 'pixi.js';
import './style.css';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import Main from './scenes/main';

(async () => {
  // Init PixiJS
  const app = new Application();
  await app.init({ background: '#000000', resizeTo: window });
  document.body.appendChild(app.canvas);

  // Init GSAP
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);

  // Init the scenes
  const main = new Main(app);
  app.stage.addChild(main);

  await main.init();
})();
