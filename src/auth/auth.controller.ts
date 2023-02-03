import { RoleGuard } from './../guards/role.guard';
import { Body, Controller, FileTypeValidator, Headers, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthForgetDTO } from './dto/auth-forget.dto copy';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserD } from 'src/decorators/user.decorator';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { writeFile } from "fs/promises";
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) { }


  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body)
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() { token, password }: AuthResetDTO) {
    return this.authService.reset(password, token)
  }

  @UseGuards(AuthGuard)
  @Post('me')
  //chamando o req do meu Guard
  async me(@Req() req, @UserD() user) {
    return {
      me: "ok",
      data: req.tokenPayload,
      user: user
    }
  }

  //interceptar para pegar o arquivo
  //e informar o nome do campo da req que tera a imagem
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('upload')
  //utilizar o upload file para receber a imagem
  //e definir o tipo que vem do file do multer
  async uploadPhoto(
    @UserD() user,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 1024 * 626}),
        new FileTypeValidator({fileType:'image/png'})
      ]
    }))
    photo: Express.Multer.File) {
    return this.fileService.upload(user.id, photo)
  }


  //MULTIPLOS FILES
  //mudar para FilesInterceptor
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('uploads')
  //@UploadedFiles()
  async uploadPhotos(@UserD() user, @UploadedFiles() files: Express.Multer.File[]) {
    return files
  }

  //MULTIPLOS FILES
  //mudar para FilesInterceptor
  @UseInterceptors(FileFieldsInterceptor(
    [
      {
        name: 'photo',
        maxCount: 1
      },
      {
        name: 'documento',
        maxCount: 2
      }
    ]
  ))
  @UseGuards(AuthGuard)
  @Post('file-fields')
  //@UploadedFiles()
  async uploadFileFields(@UserD() user, @UploadedFiles()
  files: {
    photo: Express.Multer.File,
    documento: Express.Multer.File[]
  }) {
    console.log(files);
    return files
  }
}