import { RoleGuard } from './../guards/role.guard';
import { Body, Controller, Headers, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthForgetDTO } from './dto/auth-forget.dto copy';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserD } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController{

  constructor(
    private readonly authService:AuthService
  ){}
  

  @Post('login')
  async login(@Body() {email,password}:AuthLoginDTO){
    return this.authService.login(email,password)
  }

  @Post('register')
  async register(@Body() body:AuthRegisterDTO){
    return this.authService.register(body)
  }

  @Post('forget')
  async forget(@Body() {email}:AuthForgetDTO){
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() {token,password}:AuthResetDTO){
    return this.authService.reset(password,token)
  }

  @UseGuards(AuthGuard)
  @Post('me')
  //chamando o req do meu Guard
  async me(@Req() req, @UserD() user) {    
    return {
      me:"ok", 
      data:req.tokenPayload,
      user:user
    }
  }
}