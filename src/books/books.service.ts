import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BooksHelper } from './helpers/books.helpers';

@Injectable()
export class BooksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly booksHelper: BooksHelper,
  ) {}

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
    const book = await this.booksHelper._getBook(id);
    if (!book) {
      throw new BadRequestException('no book with such ID available');
    }

    return book;
  }

  async create(newBookInputs: Prisma.BookCreateInput) {
    const { author, book_no, description, title } = newBookInputs;
    const checkBookTitle = await this.booksHelper._doesBookExist(
      'title',
      title,
    );
    const checkBookNumber = await this.booksHelper._doesBookExist(
      'book_no',
      book_no,
    );

    if (checkBookTitle) {
      throw new BadRequestException(
        'A book with such title exists in the Database',
      );
    }

    if (checkBookNumber) {
      throw new BadRequestException(
        'A book with such book no exists in the Database',
      );
    }
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

  async update(id: number, data: Prisma.BookUpdateInput) {
    const book = await this.booksHelper._getBook(id);
    if (!book) {
      throw new BadRequestException('no book with such ID available');
    }

    if (!book.isAvailable) {
      throw new BadRequestException(
        'Book that has been borrowed cannot be edited',
      );
    }

    // we make sure that there is no other book with same ID expect only this one (by checking the ID)
    if (data.title) {
      await this.booksHelper._checkUniqueFieldExistence(
        'title',
        data.title as string,
        id,
      );
    }

    // we make sure that there is no other book with same ID expect only this one (by checking the ID)
    if (data.book_no) {
      await this.booksHelper._checkUniqueFieldExistence(
        'book_no',
        data.book_no as string,
        id,
      );
    }

    return this.databaseService.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const book = await this.booksHelper._getBook(id);
    if (!book) {
      throw new BadRequestException('no book with such ID available');
    }

    if (!book.isAvailable) {
      throw new BadRequestException(
        'Book that has been borrowed cannot be deleted',
      );
    }

    await this.databaseService.book.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Book deleted successfully',
    };
  }
}
