import {
  MinLength,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
