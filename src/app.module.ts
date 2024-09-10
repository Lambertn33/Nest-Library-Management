import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BorrowsModule } from './borrows/borrows.module';

@Module({
  imports: [DatabaseModule, AuthModule, BooksModule, BorrowRequestsModule, BorrowsModule],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
