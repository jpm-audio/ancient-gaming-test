import { Application, Text } from 'pixi.js';
import './style.css';

(async () => {
  const app = new Application();

  await app.init({ background: '#1099bb', resizeTo: window });

  const greet = new Text({
    text: 'Hello World!',
    style: {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: '#ffffff',
    },
    anchor: {
      x: 0.5,
      y: 0.5,
    },
    position: {
      x: app.screen.width / 2,
      y: app.screen.height / 2,
    },
  });

  app.stage.addChild(greet);

  document.body.appendChild(app.canvas);
})();
