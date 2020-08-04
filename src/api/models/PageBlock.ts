class PageBlock {
  title: string;
  properties: Record<string, any> = {};

  constructor(blockValue: BlockValue, metadata: PageMetadata) {
    Object.entries(blockValue.properties).forEach(blockProperty => {
      try {
        const property = metadata['schema'].find(
          prop => prop['key'] == blockProperty[0],
        );
        switch (property.type) {
          case 'relation':
            this.properties[property.title] = blockProperty[1].map(
              it => it[1][0][1],
            );
            break;
          case 'text':
          case 'select':
            this.properties[property.title] = blockProperty[1][0][0];
            break;
          case 'title':
            this.title = blockProperty[1][0][0];
            break;
          case 'checkbox':
            this.properties[property.title] = blockProperty[1][0][0] === 'Yes';
            break;
          case 'date':
            const data = blockProperty[1][0][1][0][1];
            this.properties[property.title] = {
              type: data['type'],
              start_date: data['start_date'],
            };
            break;
          case 'file':
            this.properties[property.title] = blockProperty[1].map(it => ({
              name: it[0],
              url: it[1][0][1],
            }));
            break;
        }
      } catch (e) {}
    });
  }
}

export default PageBlock;
