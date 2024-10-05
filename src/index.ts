import { Application, Assets, Sprite } from 'pixi.js';
import './style.css';
import SceneTask1 from './scenes/task_1';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import SceneTask2 from './scenes/task_2';
import FpsDisplay from './components/fpsDisplay';

(async () => {
  // Init PixiJS
  const app = new Application();
  await app.init({ background: '#1099bb', resizeTo: window });
  document.body.appendChild(app.canvas);

  // Init GSAP
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);

  // Init the scene
  const scene1 = new SceneTask1();
  await scene1.init(app);
  app.stage.addChild(scene1);
  //scene1.visible = false;
  //scene1.renderable = false;

  //const scene2 = new SceneTask2();
  //await scene2.init(app);
  //app.stage.addChild(scene2);
  const fpsDisplay = new FpsDisplay(app.ticker, 100);
  fpsDisplay.x = app.screen.width - 60;
  fpsDisplay.y = 30;
  app.stage.addChild(fpsDisplay);
})();
