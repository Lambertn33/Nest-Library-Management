import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BorrowRequestsHelper } from './helpers/borrow-requests.helpers';
import { BorrowRequestStatus } from './enum/borrow-requests.enum';

@Injectable()
export class BorrowRequestsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly borrowRequestsHelper: BorrowRequestsHelper,
  ) {}

  // for admin
  async getAllBorrowRequests() {
    return this.databaseService.borrowRequest.findMany({
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
  }

  // for admin
  async getSingleBorrowRequest(id: number) {
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
  }

  // for user
  async getMyBorrowRequests(userId: number) {
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
  }

  // for user
  async makeBorrowRequest(
    bookId: number,
    userId: number,
    data: Prisma.BorrowRequestCreateInput,
  ) {
    const { reason } = data;
    const newBorrowRequest = await this.databaseService.borrowRequest.create({
      data: {
        reason,
        bookId,
        userId,
        requestedAt: new Date(),
      },
    });

    return {
      message:
        'Thank you for making a book borrow request, you will be answered soon',
      newBorrowRequest,
    };
  }

  // for admin
  async approveBorrowRequest(id: number) {
    return this.borrowRequestsHelper._updateBorrowRequestStatus(
      id,
      BorrowRequestStatus.ACCEPTED,
      'Borrow request approved successfully',
    );
  }

  // for admin
  async rejectBorrowRequest(id: number) {
    return this.borrowRequestsHelper._updateBorrowRequestStatus(
      id,
      BorrowRequestStatus.CANCELED,
      'Borrow request approved successfully',
    );
  }

  // for user
  async cancelBorrowRequest(id: number) {
    return this.borrowRequestsHelper._updateBorrowRequestStatus(
      id,
      BorrowRequestStatus.ACCEPTED,
      'You have canceled your request successfully',
    );
  }
}
