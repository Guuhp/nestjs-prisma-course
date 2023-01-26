import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from 'src/interceptors/log.interceptors';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePartialDTO } from './dto/update-patch.dto';
import { UpdatePutDTO } from './dto/update-put.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard,RoleGuard)
@Controller('users')
export class UserController {

  constructor(private userService: UserService) { }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.createUser(data)
  }

  @Roles(Role.Admin,Role.User)
  @Get()
  async list() {
    return this.userService.listAll()
  }

  //@Roles(Role.Admin)
  @Get(':id')
  async findById(@ParamId() id: number) {
    console.log(`controller ${id}`);

    return this.userService.findOne(id)
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() data: UpdatePutDTO, @Param('id', ParseIntPipe) id: number) {
    return this.userService.update(id, data)
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@Body() data: UpdatePartialDTO, @Param('id', ParseIntPipe) id: number) {
    console.log(data);

    return this.userService.updatePartial(id, data)
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }


}