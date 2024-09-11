import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BorrowRequestsHelper } from './helpers/borrow-requests.helpers';
import { BorrowRequestStatus } from './enum/borrow-requests.enum';
import { CreateBorrowRequestDto } from './dto/create.dto';
import { BorrowsService } from 'src/borrows/borrows.service';

@Injectable()
export class BorrowRequestsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly borrowRequestsHelper: BorrowRequestsHelper,
    private readonly borrowsService: BorrowsService,
  ) {}

  // for admin
  async getAllBorrowRequests() {
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
  }

  // for admin
  async getSingleBorrowRequest(id: number) {
    const check = await this.borrowRequestsHelper._getBorrowRequest(id);
    if (!check) {
      throw new NotFoundException('no request with such ID in the database');
    }

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
    data: CreateBorrowRequestDto,
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
    await this.borrowsService.createBorrow(id);
    return await this.borrowRequestsHelper._updateBorrowRequestStatus(
      id,
      BorrowRequestStatus.ACCEPTED,
      'Borrow request approved successfully',
    );
  }

  // for admin
  async rejectBorrowRequest(id: number) {
    return await this.borrowRequestsHelper._updateBorrowRequestStatus(
      id,
      BorrowRequestStatus.REJECTED,
      'Borrow request rejected successfully',
    );
  }

  // for user
  async cancelBorrowRequest(id: number) {
    return await this.borrowRequestsHelper._updateBorrowRequestStatus(
      id,
      BorrowRequestStatus.CANCELED,
      'You have canceled your request successfully',
    );
  }
}
