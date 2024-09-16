import { forwardRef, Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BorrowRequestsModule } from 'src/borrow-requests/borrow-requests.module';
import { BooksHelper } from 'src/books/helpers/books.helpers';

@Module({
  imports: [DatabaseModule, forwardRef(() => BorrowRequestsModule)],
  providers: [BorrowsService, BooksHelper],
  controllers: [BorrowsController],
  exports: [BorrowsService],
})
export class BorrowsModule {}
