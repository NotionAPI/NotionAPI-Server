import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLGuard } from '../jwt/graphql.guard';
import { APIService } from './api.service';

@Resolver()
export class APIResolver {
  constructor(private apiService: APIService) {}

  @UseGuards(GraphQLGuard)
  @Query('page')
  public async fetchPage(@Context() ctx: any, @Args('pageId') pageId: string) {
    const token = ctx.req.headers.token;
    return await this.apiService.fetchPage(token, pageId);
  }

  @UseGuards(GraphQLGuard)
  @Query('collection')
  public async fetchCollection(
    @Context() ctx,
    @Args('collectionId') collectionId: string,
    @Args('collectionViewId') collectionViewId: string,
  ) {
    const token = ctx.req.headers.token;
    return await this.apiService.fetchCollection(token, {
      collectionId,
      collectionViewId,
    });
  }
}
