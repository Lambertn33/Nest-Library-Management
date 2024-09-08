import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BorrowRequestsService } from './borrow-requests.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { CreateBorrowRequestDto } from './dto/create.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from '@prisma/client';

@Controller('borrow-requests')
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.borrowRequestsService.getAllBorrowRequests();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowRequestsService.getSingleBorrowRequest(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async create(@Body() data: CreateBorrowRequestDto, @CurrentUser() user: any) {
    return this.borrowRequestsService.makeBorrowRequest(
      +data.bookId,
      user.userId,
      data,
    );
  }
}
