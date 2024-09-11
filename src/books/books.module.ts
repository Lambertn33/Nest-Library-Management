import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksHelper } from './helpers/books.helpers';
import { BooksController } from './books.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [BooksService, BooksHelper],
  controllers: [BooksController],
  exports: [BooksHelper],
})
export class BooksModule {}
