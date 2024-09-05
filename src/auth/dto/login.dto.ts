import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'The Email field cannot be empty' })
  email: string;

  @IsNotEmpty({ message: 'The Password field cannot be empty' })
  @Length(6, 10, {
    message: 'The password field should have 6 to 10 characters',
  })
  password: string;
}
