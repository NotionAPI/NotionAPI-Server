import { Injectable } from '@nestjs/common';
import { dashifyId, makeNotionBackendRequest } from '../api.service';
import TextItemsBlockContent from '../models/block-content/TextItemsBlockContent';

@Injectable()
export class CollectionDataService {
  public createFilter(
    filter: FilterInput,
    metadata: PageMetadata,
  ): FilterQuery {
    const property = metadata['properties'][filter.property]['key'];
    let filterValue: any;
    switch (filter.value) {
      case 'true':
      case 'false':
        filterValue = filter.value === 'true';
        break;
      default:
        if (filter.value) {
          if (filter.operator == 'relation_contains')
            filterValue = dashifyId(filter.value);
          else filterValue = filter.value;
        }
    }
    return {
      property,
      filter: {
        operator: filter.operator,
        value: {
          type: 'exact',
          value: filterValue,
        },
      },
    };
  }

  public createSort(sort: SortInput, metadata: PageMetadata): SortQuery {
    const property = metadata['properties'][sort.property]['key'];
    return {
      property,
      direction: sort.direction,
    };
  }

  public queryCollection(
    token: string,
    data: {
      collectionId: string;
      collectionViewId: string;
      filters: FilterQuery[];
      sort?: SortQuery;
    },
  ) {
    const { collectionId, collectionViewId, filters, sort } = data;
    return makeNotionBackendRequest('queryCollection', token, {
      collectionId: dashifyId(collectionId),
      collectionViewId: dashifyId(collectionViewId),
      loader: {
        type: 'table',
        limit: Number.MAX_SAFE_INTEGER,
        loadContentCover: true,
      },
      query: {
        ...(() =>
          filters && filters.length > 0
            ? { filter: { operator: 'and', filters } }
            : {})(),
        ...(() => (sort ? { sort: [sort] } : {}))(),
      },
    });
  }

  public getInformation(data: any) {
    const collection = (Object.entries(data.recordMap.collection)[0][1] as any)
      .value;
    const title = collection.name[0][0];
    const description = TextItemsBlockContent.parseText(collection.description);
    return { title, description };
  }
}
