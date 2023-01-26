import { IsEmail, IsString, Length, MinLength } from "class-validator";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

export class AuthLoginDTO{
  
  @IsEmail()
  email:string;
  
  @IsString()
  @MinLength(6)
  password:string
}