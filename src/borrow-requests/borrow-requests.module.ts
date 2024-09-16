import { forwardRef, Module } from '@nestjs/common';
import { BorrowRequestsService } from './borrow-requests.service';
import { BorrowRequestsController } from './borrow-requests.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BorrowRequestsHelper } from './helpers/borrow-requests.helpers';
import { BorrowsModule } from 'src/borrows/borrows.module';
import { BooksModule } from 'src/books/books.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => BorrowsModule),
    BooksModule,
    MetricsModule,
  ],
  providers: [BorrowRequestsService, BorrowRequestsHelper],
  controllers: [BorrowRequestsController],
  exports: [BorrowRequestsService],
})
export class BorrowRequestsModule {}
