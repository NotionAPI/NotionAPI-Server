import { Test, TestingModule } from '@nestjs/testing';
import { CollectionDataService } from './collection-data.service';

describe('CollectionDataService', () => {
  let service: CollectionDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionDataService],
    }).compile();

    service = module.get<CollectionDataService>(CollectionDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
