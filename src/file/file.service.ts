import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";
import { join } from "path";

@Injectable()
export class FileService {

  async upload(id: number, photo: Express.Multer.File) {
    //definindo o diretorio para armazenar o arquivo no STORAGE
    return await writeFile(join(__dirname, '..', '..', 'storage', 'photos', `photo-${id}.jpg`), photo.buffer)
  }
}