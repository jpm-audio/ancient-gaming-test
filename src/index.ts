import { Application, Assets, Sprite } from 'pixi.js';
import './style.css';
import SceneTask1 from './scenes/task_1';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';

(async () => {
  // Init PixiJS
  const app = new Application();
  await app.init({ background: '#1099bb', resizeTo: window });
  document.body.appendChild(app.canvas);

  // Init GSAP
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);

  // Init the scene
  const scene = new SceneTask1();
  await scene.init(app);
  app.stage.addChild(scene);
})();
