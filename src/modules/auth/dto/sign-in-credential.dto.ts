import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInCredentialsDto {

    email: string;

    password: string;
}