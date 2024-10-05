import {
  Container,
  Sprite,
  Text,
  TextStyle,
  Texture,
  CanvasTextMetrics,
} from 'pixi.js';

export interface TextLineBlenderOptions {
  lineMaxElements?: number;
  lineMinElements?: number;
  lineTimeInterval?: number;
  images: string[];
  words: string[];
  textStyle?: TextStyle;
}

class TextLineBlender {
  private _options: TextLineBlenderOptions = {
    lineMaxElements: 6,
    lineMinElements: 2,
    lineTimeInterval: 2000,
    images: [],
    words: [],
    textStyle: new TextStyle({ fontSize: 24, fill: 0xffffff, align: 'center' }),
  };

  private _textMetrics: CanvasTextMetrics;

  constructor(options: TextLineBlenderOptions) {
    this._options = { ...this._options, ...options };
    this._textMetrics = CanvasTextMetrics.measureText(
      ' ',
      this._options.textStyle as TextStyle
    );
  }

  getRandomLine(): string[] {
    const minElements = this._options.lineMinElements as number;
    const maxElements = this._options.lineMaxElements as number;
    const numElements =
      Math.floor(Math.random() * (maxElements - minElements + 1)) + minElements;
    const line = [];

    for (let i = 0; i < numElements; i++) {
      const isImage = Math.random() < 0.5;
      const sourceList = isImage ? this._options.images : this._options.words;
      const elementIndex = Math.floor(Math.random() * sourceList.length);
      const element = sourceList[elementIndex];
      line.push(element);
    }

    return line;
  }

  buildLine(line: string[]): Container {
    const container = new Container();

    if (line.length === 0) return container;

    line.forEach((element, index) => {
      const offset = index ? this._textMetrics.width : 0;

      if (element.startsWith('<')) {
        const sprite = new Sprite(Texture.from(this.parseImageName(element)));
        sprite.height = this._textMetrics.lineHeight;
        sprite.scale.x = sprite.scale.y;
        sprite.x = offset + container.width;
        container.addChild(sprite);
      } else {
        const elementText = index > 0 ? element : this.capitalizeText(element);
        const text = new Text({
          text: elementText,
          style: this._options.textStyle,
          resolution: 2,
        });
        text.x = offset + container.width;
        container.addChild(text);
      }
    });

    return container;
  }

  parseImageName(imageName: string): string {
    return imageName.replace('<', '').replace('>', '');
  }

  capitalizeText(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

export default TextLineBlender;
