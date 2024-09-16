import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BorrowStatus } from './enum/borrow-status.enum';
import { BooksHelper } from 'src/books/helpers/books.helpers';
import { MetricsHelper } from 'src/metrics/metrics.helpers';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class BorrowsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly booksHelper: BooksHelper,
    private readonly metricsHelper: MetricsHelper,
    private readonly metricsService: MetricsService,
  ) {}

  async getAllBorrows(status?: BorrowStatus) {
    const timer = this.metricsService.startDbTimer('GET', '/borrows', 200);
    try {
      timer();
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
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }
  async getSingleBorrow(id: number) {
    const timer = this.metricsService.startDbTimer('GET', '/borrows/:id', 200);
    try {
      timer();
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
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  async createBorrow(borrowRequestId: number) {
    const timer = this.metricsService.startDbTimer('POST', '/borrows', 201);
    try {
      const borrowRequest = await this.databaseService.borrowRequest.findUnique(
        {
          where: { id: borrowRequestId },
          include: {
            user: {
              select: {
                names: true,
              },
            },
            book: {
              select: {
                title: true,
              },
            },
          },
        },
      );

      // after accepting a borrow request, create the corresponding borrow
      await this.databaseService.borrowing.create({
        data: {
          reason: borrowRequest.reason,
          bookId: borrowRequest.bookId,
          userId: borrowRequest.userId,
          borrowed_date: borrowRequest.requestedAt,
        },
      });

      // update the book to show that it is not available(it has been borrowed)
      await this.booksHelper._changeBookAvailability(
        borrowRequest.bookId,
        false,
      );
      timer();
      return {
        message:
          'Book marked as returned successfully and ready to be borrowed again',
      };
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  async returnBook(id: number) {
    const timer = this.metricsService.startDbTimer(
      'PATCH',
      '/borrows/:id/returnBook',
      200,
    );
    try {
      const borrowData = await this.databaseService.borrowing.findUnique({
        where: {
          id,
        },
      });
      await this.booksHelper._changeBookAvailability(borrowData.bookId, true);
      await this.databaseService.borrowing.update({
        where: { id },
        data: {
          returned_date: new Date(),
        },
      });
      timer();

      return {
        message:
          'Book marked as returned successfully and ready to be borrowed again',
      };
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }
}
