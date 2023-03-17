import {
  MinLength,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Role } from 'src/modules/roles/enums/roles';

export class CreateByRoleUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @MinLength(4)
  role: Role;
}
