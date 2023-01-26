import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from './../auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      const data = this.authService.checkToken((authorization ?? '').split(' ')[1])
      //criando uma chava chamada token que não existe
      //no request e atribundo o valor do token
      //NO CONTROLLER DE AUTH EU PEGO ESSES DADOS POR MEIO DO DECORATOR
      //@REQ OU @REQUEST
      request.tokenPayload = data
      request.user = await this.userService.findOne(data.id)
      return true
    } catch {
      return false;
    }
  }
}