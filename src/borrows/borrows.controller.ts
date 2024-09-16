import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { BorrowStatus } from './enum/borrow-status.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Get()
  async findAll(@Query('status') status?: BorrowStatus) {
    return this.borrowsService.getAllBorrows(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.getSingleBorrow(id);
  }

  @Patch(':id/returnBook')
  async confirmBookReturned(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.returnBook(id);
  }
}
