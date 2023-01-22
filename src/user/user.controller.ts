import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from 'src/interceptors/log.interceptors';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePartialDTO } from './dto/update-patch.dto';
import { UpdatePutDTO } from './dto/update-put.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/param-id.decorators';

@Controller('users')
export class UserController {

  constructor(private userService: UserService) { }

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.createUser(data)
  }

  @Get()
  async list() {
    return this.userService.listAll()
  }

  @Get(':id')
  async findById(@ParamId() id: number) {
    console.log(`controller ${id}`);
    
    return this.userService.findOne(id)
  }


  @Put(':id')
  async update(@Body() data: UpdatePutDTO, @Param('id', ParseIntPipe) id: number) {
    return this.userService.update(id, data)
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePartialDTO, @Param('id', ParseIntPipe) id: number) {
    console.log(data);

    return this.userService.updatePartial(id, data)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }


}