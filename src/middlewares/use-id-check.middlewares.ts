import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddlewares implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //EX: verificar todas as rotas que tem ID

    if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
      throw new BadRequestException(`ID invalido`)
    }

    next()
  }

}