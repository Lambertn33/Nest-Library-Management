import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BorrowStatus } from './enum/borrow-status.enum';

@Injectable()
export class BorrowsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllBorrows(status?: BorrowStatus) {
    return this.databaseService.borrowing.findMany({
      where: {
        ...(status === BorrowStatus.RETURNED && {
          returned_date: { not: null },
        }),
        ...(status === BorrowStatus.NOT_RETURNED && { returned_date: null }),
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            names: true,
            email: true,
          },
        },
      },
    });
  }
  async getSingleBorrow(id: number) {
    return this.databaseService.borrowing.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            names: true,
            email: true,
          },
        },
      },
    });
  }

  async createBorrow(borrowRequestId: number) {
    const borrowRequest = await this.databaseService.borrowRequest.findUnique({
      where: { id: borrowRequestId },
    });

    await this.databaseService.borrowing.create({
      data: {
        reason: borrowRequest.reason,
        bookId: borrowRequest.bookId,
        userId: borrowRequest.userId,
        borrowed_date: borrowRequest.requestedAt,
      },
    });
  }
}
