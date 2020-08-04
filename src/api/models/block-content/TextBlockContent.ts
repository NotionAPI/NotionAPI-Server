import TextItemsBlockContent from './TextItemsBlockContent';

class TextBlockContent extends TextItemsBlockContent {
  constructor(private level: number, protected children: any[]) {
    super(children);
  }

  export(): Record<string, any> {
    return {
      level: this.level,
      ...super.export(),
    };
  }
}

export default TextBlockContent;
