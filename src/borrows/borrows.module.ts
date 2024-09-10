import { Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [BorrowsService, DatabaseModule],
  controllers: [BorrowsController],
  exports: [BorrowsService],
})
export class BorrowsModule {}
