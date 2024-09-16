import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BorrowRequestsHelper } from './helpers/borrow-requests.helpers';
import { BorrowRequestStatus } from './enum/borrow-requests.enum';
import { CreateBorrowRequestDto } from './dto/create.dto';
import { BorrowsService } from 'src/borrows/borrows.service';
import { BooksHelper } from 'src/books/helpers/books.helpers';
import { MetricsService } from 'src/metrics/metrics.service';
import { MetricsHelper } from 'src/metrics/metrics.helpers';

@Injectable()
export class BorrowRequestsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly borrowRequestsHelper: BorrowRequestsHelper,
    private readonly borrowsService: BorrowsService,
    private readonly booksHelper: BooksHelper,
    private readonly metricsService: MetricsService,
    private readonly metricsHelper: MetricsHelper,
  ) {}

  // for admin
  async getAllBorrowRequests() {
    const timer = this.metricsService.startDbTimer(
      'GET',
      '/borrow-requests',
      200,
    );
    try {
      timer();
      return this.databaseService.borrowRequest.findMany({
        where: {
          status: BorrowRequestStatus.PENDING,
        },
        include: {
          user: {
            select: {
              names: true,
              email: true,
              id: true,
            },
          },
          book: {
            select: {
              id: true,
              author: true,
              title: true,
              description: true,
            },
          },
        },
      });
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  // for admin
  async getSingleBorrowRequest(id: number) {
    const timer = this.metricsService.startDbTimer(
      'GET',
      '/borrow-requests/:id',
      200,
    );
    try {
      const check = await this.borrowRequestsHelper._getBorrowRequest(id);
      if (!check) {
        throw new NotFoundException('no request with such ID in the database');
      }
      timer();
      return this.databaseService.borrowRequest.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              names: true,
              email: true,
              id: true,
            },
          },
          book: {
            select: {
              id: true,
              author: true,
              title: true,
              description: true,
            },
          },
        },
      });
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  // for user
  async getMyBorrowRequests(userId: number) {
    const timer = this.metricsService.startDbTimer(
      'GET',
      '/borrow-requests/my-requests',
      200,
    );

    try {
      timer();
      return this.databaseService.borrowRequest.findMany({
        where: { userId },
        include: {
          book: {
            select: {
              author: true,
              book_no: true,
              id: true,
              title: true,
            },
          },
        },
      });
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  // for user
  async makeBorrowRequest(
    bookId: number,
    userId: number,
    data: CreateBorrowRequestDto,
  ) {
    const timer = this.metricsService.startDbTimer(
      'POST',
      '/borrow-requests/',
      200,
    );
    try {
      const checkIfBookIsBorrowed =
        await this.booksHelper._hasBookBeenBorrowed(bookId);
      if (checkIfBookIsBorrowed) {
        throw new BadRequestException(
          'The book you are trying to borrow has been borrowed',
        );
      }

      const { reason } = data;
      const newBorrowRequest = await this.databaseService.borrowRequest.create({
        data: {
          reason,
          bookId,
          userId,
          requestedAt: new Date(),
        },
      });

      timer();
      return {
        message:
          'Thank you for making a book borrow request, you will be answered soon',
        newBorrowRequest,
      };
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  // for admin
  async approveBorrowRequest(id: number) {
    const timer = this.metricsService.startDbTimer(
      'POST',
      '/borrow-requests/:id/approve',
      200,
    );
    try {
      await this.borrowsService.createBorrow(id);
      timer();
      return await this.borrowRequestsHelper._updateBorrowRequestStatus(
        id,
        BorrowRequestStatus.ACCEPTED,
        'Borrow request approved successfully',
      );
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  // for admin
  async rejectBorrowRequest(id: number) {
    const timer = this.metricsService.startDbTimer(
      'POST',
      '/borrow-requests/:id/reject',
      200,
    );
    try {
      timer();
      return await this.borrowRequestsHelper._updateBorrowRequestStatus(
        id,
        BorrowRequestStatus.REJECTED,
        'Borrow request rejected successfully',
      );
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }

  // for user
  async cancelBorrowRequest(id: number) {
    const timer = this.metricsService.startDbTimer(
      'POST',
      '/borrow-requests/:id/cancel',
      200,
    );
    try {
      timer();
      return await this.borrowRequestsHelper._updateBorrowRequestStatus(
        id,
        BorrowRequestStatus.CANCELED,
        'You have canceled your request successfully',
      );
    } catch (error) {
      this.metricsHelper.handleException(error, timer);
    }
  }
}
