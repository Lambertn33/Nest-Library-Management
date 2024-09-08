import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBorrowRequestDto {
  @IsNotEmpty({ message: 'Provide the reason for borrowing the book' })
  reason: string;
}
