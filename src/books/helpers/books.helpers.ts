import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BooksHelper {
  constructor(private readonly databaseService: DatabaseService) {}

  // check if book title / number has not been taken before
  async _doesBookExist(fieldName: string, fieldValue: string) {
    const book = await this.databaseService.book.findFirst({
      where: {
        [fieldName]: {
          equals: fieldValue,
          mode: 'insensitive',
        },
      },
    });

    return !!book;
  }

  async _getBook(id: number) {
    const book = this.databaseService.book.findUnique({
      where: {
        id,
      },
    });

    return book ? book : null;
  }

  async _checkUniqueFieldExistence(
    fieldName: string,
    fieldValue: string,
    bookId: number,
  ) {
    const existingBook = await this.databaseService.book.findFirst({
      where: {
        [fieldName]: {
          equals: fieldValue,
          mode: 'insensitive', // For case-insensitive comparison
        },
        NOT: { id: bookId }, // Exclude the current book
      },
    });

    if (existingBook) {
      throw new BadRequestException(
        `Another book with this ${fieldName} already exists`,
      );
    }
  }
}
