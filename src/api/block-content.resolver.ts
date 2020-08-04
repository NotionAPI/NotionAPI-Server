import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('BlockContent')
export class BlockContentResolver {
  @ResolveField()
  __resolveType(value) {
    return value.type;
  }
}
