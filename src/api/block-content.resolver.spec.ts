import { Test, TestingModule } from '@nestjs/testing';
import { BlockContentResolver } from './block-content.resolver';

describe('BlockContentResolver', () => {
  let resolver: BlockContentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockContentResolver],
    }).compile();

    resolver = module.get<BlockContentResolver>(BlockContentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
