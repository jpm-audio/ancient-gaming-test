import { Application, Assets, Container, Sprite, Text, Texture } from 'pixi.js';
import { task2Data } from '../data/task_2_data';
import TextLineBlender from '../systems/textLineBlender';

class SceneTask2 extends Container {
  textLineBlender: TextLineBlender;

  constructor() {
    super();

    this.textLineBlender = new TextLineBlender(task2Data);
  }

  public async init(app: Application) {
    Assets.add({ alias: 'animals', src: 'assets/sprites/task_2_0.json' });
    await Assets.load('animals');

    const randomLine = this.textLineBlender.getRandomLine();
    const lineContainer = this.textLineBlender.buildLine(randomLine);
    this.addChild(lineContainer);
  }
}

export default SceneTask2;
