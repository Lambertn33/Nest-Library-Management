import { IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty({ message: 'The names field are required' })
  names: string;
}
