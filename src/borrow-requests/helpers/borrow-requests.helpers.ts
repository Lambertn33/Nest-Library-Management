import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BorrowRequestStatus } from '../enum/borrow-requests.enum';

@Injectable()
export class BorrowRequestsHelper {
  constructor(private readonly databaseService: DatabaseService) {}

  async _getBorrowRequest(id: number) {
    const borrowRequest = this.databaseService.borrowRequest.findUnique({
      where: { id },
    });

    return borrowRequest ? borrowRequest : null;
  }

  // update to CANCELED/APPROVED/REJECTED.
  async _updateBorrowRequestStatus(
    id: number,
    status: BorrowRequestStatus,
    message: string,
  ) {
    const borrowRequest = this._getBorrowRequest(id);
    if (!borrowRequest) {
      throw new NotFoundException('no borrow request with such ID available');
    }
    await this.databaseService.borrowRequest.update({
      where: { id },
      data: {
        status,
      },
    });

    // TODO: ADD LOGIC TO SEND EMAIL TO USER THAT HIS/HER REQUEST HAS BEEN APPROVED
    return {
      message,
    };
  }
}
