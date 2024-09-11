import { forwardRef, Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BorrowRequestsModule } from 'src/borrow-requests/borrow-requests.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => BorrowRequestsModule)],
  providers: [BorrowsService],
  controllers: [BorrowsController],
  exports: [BorrowsService],
})
export class BorrowsModule {}
