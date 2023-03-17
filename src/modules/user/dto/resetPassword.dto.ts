import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  confirmPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string;
}
