import { Module } from '@nestjs/common';
import { BorrowRequestsService } from './borrow-requests.service';
import { BorrowRequestsController } from './borrow-requests.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BorrowRequestsHelper } from './helpers/borrow-requests.helpers';

@Module({
  imports: [DatabaseModule],
  providers: [BorrowRequestsService, BorrowRequestsHelper],
  controllers: [BorrowRequestsController],
})
export class BorrowRequestsModule {}
