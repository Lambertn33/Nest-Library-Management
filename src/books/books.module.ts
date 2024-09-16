import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksHelper } from './helpers/books.helpers';
import { BooksController } from './books.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [DatabaseModule, MetricsModule],
  providers: [BooksService, BooksHelper],
  controllers: [BooksController],
  exports: [BooksHelper],
})
export class BooksModule {}
