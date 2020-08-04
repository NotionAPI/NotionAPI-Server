import BlockContent from './BlockContent';

class TextItemsBlockContent extends BlockContent {
  constructor(protected children: any[]) {
    super();
  }

  static parseText = (children: any[]) =>
    children.map(it => {
      let item: TextItem;

      let bold = false;
      let italic = false;
      let underline = false;
      let strikethrough = false;
      let link: string = null;
      let textColor: string = null;
      let bgColor: string = null;

      if (it[0] == '⁍') {
        item = {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          link: null,
          textColor: null,
          bgColor: null,
          isEquation: true,
          text: it[1][0][1],
        };
      } else {
        if (it.length > 1)
          it[1].forEach(it => {
            switch (it[0]) {
              case 'b':
                bold = true;
                break;
              case 'i':
                italic = true;
                break;
              case '_':
                underline = true;
                break;
              case 's':
                strikethrough = true;
                break;
              case 'a':
                link = it[1];
                break;
              case 'h':
                const color = it[1].split('_background');
                if (color.size == 1) textColor = color[0];
                else bgColor = color[0];
                break;
            }
          });
        item = {
          bold,
          italic,
          underline,
          strikethrough,
          link,
          textColor,
          bgColor,
          isEquation: false,
          text: it[0],
        };
      }

      return item;
    });

  textItems = TextItemsBlockContent.parseText(this.children);

  export(): Record<string, any> {
    return {
      items: this.textItems,
    };
  }
}

export default TextItemsBlockContent;
