import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const take = +limit;
    const totalBooks = await this.databaseService.book.count();
    const books = await this.databaseService.book.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: books,
      meta: {
        totalBooks,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        limit,
      },
    };
  }
  async findOne(id: number) {
    const book = await this._getBook(id);
    if (!book) {
      throw new BadRequestException('no book with such ID available');
    }

    return book;
  }

  async create(newBookInputs: Prisma.BookCreateInput) {
    const { author, book_no, description, title } = newBookInputs;
    const newBook = await this.databaseService.book.create({
      data: {
        author,
        book_no,
        description,
        title,
      },
    });

    return {
      message: 'new book created successfully',
      newBook,
    };
  }

  async update(id: number, data: Prisma.BookUpdateInput) {}

  async delete(id: number) {}

  async _isBookBorrowed(id: number) {}

  // check if book title has not been taken before
  async _doesBookTitleExist(title: string) {
    const book = await this.databaseService.book.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
    });

    return !!book;
  }

  //check if book number has not been taken before
  async _doesBookNumberExist(bookNo: string) {
    const book = await this.databaseService.book.findFirst({
      where: {
        book_no: {
          equals: bookNo,
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
}
