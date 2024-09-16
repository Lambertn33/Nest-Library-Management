import { BadRequestException, Injectable, HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BooksHelper } from './helpers/books.helpers';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly booksHelper: BooksHelper,
    private readonly metricsService: MetricsService,
  ) {}

  async findAll(page = 1, limit = 10) {
    const timer = this.metricsService.startDbTimer('GET', '/books', 200);
    try {
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

      timer(); // Log the successful response time
      return {
        data: books,
        meta: {
          totalBooks,
          currentPage: page,
          totalPages: Math.ceil(totalBooks / limit),
          limit,
        },
      };
    } catch (error) {
      this.handleException(error, timer);
    }
  }

  async findOne(id: number) {
    const timer = this.metricsService.startDbTimer('GET', '/books/:id', 200);
    try {
      const book = await this.booksHelper._getBook(id);
      if (!book) {
        throw new BadRequestException('No book with such ID available');
      }
      timer(); // Log the successful response time
      return book;
    } catch (error) {
      this.handleException(error, timer);
    }
  }

  async create(newBookInputs: Prisma.BookCreateInput) {
    const timer = this.metricsService.startDbTimer('POST', '/books', 200);
    try {
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

      timer(); // Log the successful response time
      return {
        message: 'New book created successfully',
        newBook,
      };
    } catch (error) {
      this.handleException(error, timer);
    }
  }

  async update(id: number, data: Prisma.BookUpdateInput) {
    const timer = this.metricsService.startDbTimer('PUT', '/books/:id', 200);
    try {
      const book = await this.booksHelper._getBook(id);
      if (!book) {
        throw new BadRequestException('No book with such ID available');
      }

      if (!book.isAvailable) {
        throw new BadRequestException(
          'Book that has been borrowed cannot be edited',
        );
      }

      if (data.title) {
        await this.booksHelper._checkUniqueFieldExistence(
          'title',
          data.title as string,
          id,
        );
      }

      if (data.book_no) {
        await this.booksHelper._checkUniqueFieldExistence(
          'book_no',
          data.book_no as string,
          id,
        );
      }

      timer(); // Log the successful response time
      return this.databaseService.book.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleException(error, timer);
    }
  }

  async delete(id: number) {
    const timer = this.metricsService.startDbTimer('DELETE', '/books/:id', 200);
    try {
      const book = await this.booksHelper._getBook(id);
      if (!book) {
        throw new BadRequestException('No book with such ID available');
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

      timer(); // Log the successful response time
      return {
        message: 'Book deleted successfully',
      };
    } catch (error) {
      this.handleException(error, timer);
    }
  }

  private handleException(error: any, timer: () => void) {
    if (error instanceof HttpException) {
      timer();
      throw error;
    } else {
      timer();
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
