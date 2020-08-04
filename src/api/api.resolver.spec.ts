import { Test, TestingModule } from '@nestjs/testing';
import { APIResolver } from './api.resolver';

describe('GraphqlResolver', () => {
  let resolver: APIResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [APIResolver],
    }).compile();

    resolver = module.get<APIResolver>(APIResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
