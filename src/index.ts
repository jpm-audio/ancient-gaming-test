import { Application, Assets, Sprite } from 'pixi.js';
import './style.css';
import SceneTask1 from './scenes/task_1';

(async () => {
  const app = new Application();

  await app.init({ background: '#1099bb', resizeTo: window });

  const scene = new SceneTask1();

  await scene.init(app);

  app.stage.addChild(scene);

  document.body.appendChild(app.canvas);
})();
