import { forwardRef, Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BorrowRequestsModule } from 'src/borrow-requests/borrow-requests.module';
import { BooksHelper } from 'src/books/helpers/books.helpers';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => BorrowRequestsModule),
    MetricsModule,
  ],
  providers: [BorrowsService, BooksHelper],
  controllers: [BorrowsController],
  exports: [BorrowsService],
})
export class BorrowsModule {}
