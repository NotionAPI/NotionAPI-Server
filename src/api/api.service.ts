import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import got from 'got';
import { PageDataService } from './page-data/page-data.service';
import { CollectionDataService } from './collection-data/collection-data.service';

const DASH_ID_LENGTH_VALID = 36;
const DASH_ID_CLEAN_LENGTH_VALID = 32;

const isValidId = (id: string) => {
  if (id.length != DASH_ID_LENGTH_VALID) return false;

  const parts = id.split('-');
  return parts.length == 5;
};

export const dashifyId = (id: string) => {
  if (isValidId(id)) return id;

  const clean = id.replace(/-/g, '');
  if (clean.length != DASH_ID_CLEAN_LENGTH_VALID)
    throw new Error(`Incorrect id format: ${id}`);

  return [
    clean.substring(0, 8),
    '-',
    clean.substring(8, 12),
    '-',
    clean.substring(12, 16),
    '-',
    clean.substring(16, 20),
    '-',
    clean.substring(20, 32),
  ].reduce((acc: string, element) => `${acc}${element}`);
};

export async function makeNotionBackendRequest(
  path: string,
  token: string,
  data: any,
): Promise<any> {
  return got
    .post(`https://www.notion.so/api/v3/${path}`, {
      json: data,
      headers: {
        cookie: `token_v2=${token}`,
        'content-type': 'application/json',
      },
    })
    .json();
}

@Injectable()
export class APIService {
  constructor(
    private pageDataService: PageDataService,
    private collectionDataService: CollectionDataService,
  ) {}

  public async fetchPage(token: string, pageId: string) {
    let data: any;
    try {
      data = await makeNotionBackendRequest('loadPageChunk', token, {
        pageId: dashifyId(pageId),
        limit: Number.MAX_SAFE_INTEGER,
        chunkNumber: 0,
        verticalColumns: false,
      });
    } catch (e) {
      throw new ServiceUnavailableException(e);
    }

    const metadata = this.pageDataService.getMetadata(data);
    const content = this.pageDataService.getContent(data, metadata);

    return {
      metadata,
      ...content,
    };
  }

  public async fetchCollection(
    token: string,
    data: {
      collectionId: string;
      collectionViewId: string;
      filters?: FilterInput[];
      sort?: SortInput;
      cursor?: string;
      limit?: number;
    },
  ) {
    let key: string | undefined;
    let pageChunk: Record<string, any> | undefined;
    try {
      pageChunk = await makeNotionBackendRequest('loadPageChunk', token, {
        pageId: dashifyId(data.collectionId),
        limit: Number.MAX_SAFE_INTEGER,
        chunkNumber: 0,
        verticalColumns: false,
      });
      key = Object.entries(pageChunk['recordMap'].collection)[0][0];
      if (key == null) throw new InternalServerErrorException();
    } catch (e) {
      throw new ServiceUnavailableException(e);
    }

    const metadata = this.pageDataService.getMetadata(pageChunk);

    const filters = data.filters?.map(it =>
      this.collectionDataService.createFilter(it, metadata),
    );
    const sort = data.sort
      ? this.collectionDataService.createSort(data.sort, metadata)
      : undefined;

    let blockIds: string[] = [];
    try {
      const collectionData = await this.collectionDataService.queryCollection(
        token,
        {
          collectionId: key,
          collectionViewId: data.collectionViewId,
          filters,
          sort,
        },
      );
      blockIds = collectionData['result']['blockIds'] || [];
    } catch (e) {
      throw new ServiceUnavailableException(e);
    }

    const pages = await Promise.all(
      blockIds
        .slice(
          data.cursor
            ? blockIds.indexOf(data.cursor) < 0
              ? blockIds.length
              : blockIds.indexOf(data.cursor)
            : 0,
        )
        .filter(
          (v, i, a) =>
            i < Math.min(a.length, data.limit || Number.MAX_SAFE_INTEGER),
        )
        .map(it => this.fetchPage(token, it)),
    );

    const info = this.collectionDataService.getInformation(pageChunk);

    console.log(metadata.schema);

    return {
      ...info,
      schema: metadata.schema,
      pages,
    };
  }
}
