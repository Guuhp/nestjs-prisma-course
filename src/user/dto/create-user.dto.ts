import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, Length, MinLength } from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  birthAt: string;

  @IsOptional()
  @IsEnum(Role)
  role:number

  
}