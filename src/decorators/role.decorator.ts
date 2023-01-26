import { SetMetadata } from '@nestjs/common';
import { Role } from './../enums/role.enum';
//SetMetadata => cria um objecto com algum argumento ou propriedade
//NESSE CASO UM PROP CHAMADA ROLE...
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)