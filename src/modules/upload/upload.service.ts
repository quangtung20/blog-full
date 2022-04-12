import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 } from 'cloudinary';
import { Image } from 'src/database/entities/image.entity';
import { DestroyFileDto } from './dto/destroy-file.dto';
import { ImageDto } from './dto/image.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { removeTmp } from './upload.provider';
import { UploadRepository } from './upload.repository';


@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadRepository)
    private readonly uploadRepository: UploadRepository
  ) { }

  async uploadFile(uploadFileDto: UploadFileDto): Promise<Image> {
    try {
      if (!uploadFileDto) {
        throw new BadRequestException('No files were uploaded.');
      }
      if (uploadFileDto.size > 1024 * 1024 * 5) {
        removeTmp(uploadFileDto.path);
        throw new BadRequestException('Size too large.');
      }

      if (uploadFileDto.mimetype !== 'image/jpeg' && uploadFileDto.mimetype !== 'image/png') {
        removeTmp(uploadFileDto.path);
        throw new BadRequestException('File format is incorrect.');
      }
      const result = await v2.uploader.upload(uploadFileDto.path, { folder: "test" }, async (err, result) => {
        removeTmp(uploadFileDto.path);

        if (err) throw new InternalServerErrorException(err.message);

        return result;
      });

      const image: ImageDto = { public_id: result.public_id, url: result.secure_url };
      return await this.uploadRepository.save(image);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async destroyFile(destroyFileDto: DestroyFileDto): Promise<string> {

    if (!destroyFileDto.public_id) throw new BadRequestException('No images Selected');

    try {
      await v2.uploader.destroy(destroyFileDto.public_id);
      await this.uploadRepository.delete({ public_id: destroyFileDto.public_id });
      return 'Deleted Image'
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}
