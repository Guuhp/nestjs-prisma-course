import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from './../auth/auth.service';
import { UserService } from 'src/user/user.service';
import { umask } from 'process';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { userInfo } from 'os';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext) {
    //para ter acesso, e saber se o controller possui um role, e preciso usar uma 
    //estrategia chamada Reflector, onde voce reflete a estrutura do objeto e vendo
    //como ele foi construido, PARA DESCOBRIR SE FOI APLICADO ALGUM DECORATOR NA ROTA
    //==========================================================
    //[context.getHandler(),context.getClass()] -> é onde o decorator foi aplicado, nesse caso o hadle pega o metodo e o class caso seja aplicado globalmente
    const requiredRoles = this.reflector
      .getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest();
    console.log(user);


    const roleFilted = requiredRoles.filter(role => role === user.role)
    console.log(roleFilted);

    console.log(roleFilted.length > 0);
    return roleFilted.length > 0
  }
}