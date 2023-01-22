import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from "@nestjs/common";
import { async } from 'rxjs';
import { UpdatePutDTO } from './dto/update-put.dto';
import { UpdatePartialDTO } from './dto/update-patch.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async createUser(data: CreateUserDTO) {
    return this.prisma.user.create({
      data
    })
  }

  async listAll() {
    return this.prisma.user.findMany()
  }

  async findOne(id: number) {
    await this.existsUser(id)
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: number, { email, name, password, birthAt }: UpdatePutDTO) {
    console.log({ email, name, password });
    await this.existsUser(id)

    return this.prisma.user.update({
      data:
        { email, name, password, birthAt: birthAt ? new Date(birthAt) : null },
      where: {
        id
      }
    })
  }

  async updatePartial(id: number, { email, name, password, birthAt }: UpdatePartialDTO) {
    await this.existsUser(id)

    const data: any = {}
    if (birthAt) {
      data.birthAt = new Date(birthAt)
    }

    if (email) {
      data.email = email
    }
    if (name) {
      data.name = name
    }
    if (password) {
      data.password = password
    }
    return this.prisma.user.update({
      data,
      where: {
        id
      }
    })
  }

  async delete(id: number) {
    await this.existsUser(id)
    return this.prisma.user.delete({
      where: { id }
    })
  }

  async existsUser(id: number) {
    if (!(await this.prisma.user.count({
      where: {
        id
      }
    }))) {
      throw new NotFoundException(`o usuario ${id} não existe`)
    }
  }











}