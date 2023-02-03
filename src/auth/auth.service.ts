import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mail: MailerService,
  ) { }

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          //a quem pertence o token
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          //quem ta emitindo o token
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'login',
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    console.log(user);

    if (!user) {
      throw new UnauthorizedException(
        'user not found, check email and password',
      );
    }
    //informação e eu quero comparar / a que esta em hash
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        'user not found, check email and password',
      );
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('email incorrect');
    }
    const token = await this.jwtService.sign(
      {
        //a quem pertence o token
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        //quem ta emitindo o token
        issuer: 'forget',
        audience: 'users',
      },
    );
    //enviar o email
    await this.mail.sendMail({
      subject: 'recuperação de senha',
      to: email,
      template: 'forget',
      //variaveis do templete
      context: {
        name: user.name,
        token: token,
      },
    });
    return true;
  }

  async reset(password: string, token: string) {
    try {
      //todo se validar o token
      const data = await this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });
      console.log(data);

      if (isNaN(Number(data.id))) {
        throw new BadRequestException("o token é invalido")
      }
      const salt = await bcrypt.genSalt()
      password = await bcrypt.hash(password, salt)
      //troca a senha do user
      const user = await this.prisma.user.update({
        where: {
          id: Number(data.id),
        },
        data: {
          password,
        },
      });
      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.createUser(data);
    return this.createToken(user);
  }
}
