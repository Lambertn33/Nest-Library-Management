import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BorrowRequestsService } from './borrow-requests.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { CreateBorrowRequestDto } from './dto/create.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

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

  @Get('my-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async getMyRequests(@CurrentUser() user: any) {
    return this.borrowRequestsService.getMyBorrowRequests(user.userId);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approve(@Param('id', ParseIntPipe) id: number) {
    return this.borrowRequestsService.approveBorrowRequest(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reject(@Param('id', ParseIntPipe) id: number) {
    return this.borrowRequestsService.rejectBorrowRequest(id);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.borrowRequestsService.cancelBorrowRequest(id);
  }
}
