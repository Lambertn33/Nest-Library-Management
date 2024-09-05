import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/enum/role.enum';
import { CreateBookDto } from './dto/create.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.booksService.findAll(page, limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() data: CreateBookDto) {
    const checkBookTitle = await this.booksService._doesBookTitleExist(
      data.title,
    );
    const checkBookNumber = await this.booksService._doesBookNumberExist(
      data.book_no,
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

    return this.booksService.create(data);
  }
}
