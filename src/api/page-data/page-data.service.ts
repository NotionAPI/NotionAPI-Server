import { Injectable } from '@nestjs/common';
import Block from '../models/Block';
import TextBlockContent from '../models/block-content/TextBlockContent';
import PageBlock from '../models/PageBlock';
import BlockType from '../models/BlockType';

@Injectable()
export class PageDataService {
  public getMetadata(data: any): PageMetadata {
    const schema: {
      title: string;
      key: string;
      type: string;
      options: any;
    }[] = [];
    try {
      const collectionSchema = Object.entries(
        data['recordMap']['collection'],
      )[0][1]['value']['schema'];
      Object.entries(collectionSchema).forEach((it: [string, any]) => {
        schema.push({
          title: it[1].name,
          key: it[0],
          type: it[1].type,
          options: it[1].options,
        });
      });
    } catch (e) {}

    let createdTime: number = null;
    try {
      const firstBlock = Object.entries(data['recordMap']['block'])[0][1][
        'value'
      ];
      createdTime = parseFloat(firstBlock['created_time']);
    } catch (e) {}

    let lastEditedTime: number = null;
    try {
      const firstBlock = Object.entries(data['recordMap']['block'])[0][1][
        'value'
      ];
      lastEditedTime = parseFloat(firstBlock['last_edited_time']);
    } catch (e) {
      null;
    }

    let format: { font: string; cover: string };
    try {
      const firstBlock = Object.entries(data['recordMap']['block'])[0][1][
        'value'
      ];
      const _format = firstBlock['format'];
      format = {
        font: _format['page_font'],
        cover: _format['page_cover'],
      };
    } catch (e) {}

    return {
      schema,
      createdTime,
      lastEditedTime,
      format,
    };
  }

  public getContent(data: any, metadata: PageMetadata) {
    let title: string;
    let properties: Record<string, any>;
    let content: any[] = [];

    const blocks: [string, Block][] = [];

    Object.entries(data['recordMap']['block']).forEach(recordMapBlock => {
      try {
        const blockValue: BlockValue = recordMapBlock[1]['value'];

        switch (blockValue.type) {
          case 'page':
            if (properties == null) {
              const pageBlock = new PageBlock(blockValue, metadata);
              properties = pageBlock.properties;
              title = pageBlock.title;
            }
            break;
          case 'header':
          case 'sub_header':
          case 'sub_sub_header':
          case 'text':
            let level;
            switch (blockValue.type) {
              case 'header':
                level = 1;
                break;
              case 'sub_header':
                level = 2;
                break;
              case 'sub_sub_header':
                level = 3;
                break;
              default:
                level = 4;
                break;
            }
            blocks.push([
              recordMapBlock[0],
              {
                type: BlockType.TEXT,
                content: new TextBlockContent(
                  level,
                  blockValue.properties.title || [],
                ),
              },
            ]);
        }
      } catch (e) {}
    });

    content = blocks.map(block => ({
      id: block[0],
      type: BlockType[block[1].type],
      content: {
        type: block[1].content.constructor.name,
        ...block[1].content.export(),
      },
    }));

    return {
      title,
      properties,
      content,
    };
  }
}
