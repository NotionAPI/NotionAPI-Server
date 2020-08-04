import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { APIResolver } from './api.resolver';
import { BlockContentResolver } from './block-content.resolver';
import { APIService } from './api.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '../jwt/jwt.module';
import { PageDataService } from './page-data/page-data.service';
import { CollectionDataService } from './collection-data/collection-data.service';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
    }),
  ],

  providers: [APIResolver, BlockContentResolver, APIService, PageDataService, CollectionDataService],
})
export class APIModule {}
