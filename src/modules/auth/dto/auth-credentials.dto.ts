import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import Sex from 'src/config/sex.enum';
import Role from '../../../config/role.enum';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  // @IsString()
  // @MinLength(6)
  // @MaxLength(32)
  // confirmPassword: string;

  @IsEmail()
  @MinLength(4)
  @MaxLength(40)
  account: string;

  // phone: string;

  // sex?: Sex

  role?: string;
}
