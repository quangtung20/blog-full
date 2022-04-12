import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import Role from 'src/config/role.enum';
import RoleGuard from 'src/guards/role.guard';
import { DestroyFileDto } from './dto/destroy-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadService } from './upload.service';

@Controller('api')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('upload')
  @UseGuards(RoleGuard(Role.admin))
  @UseInterceptors(FilesInterceptor('image'))
  uploadFile(@UploadedFiles() file: UploadFileDto[]): Promise<{ public_id: string, url: string }> {
    return this.uploadService.uploadFile(file[0]);
  }

  @Post('destroy')
  @UseGuards(RoleGuard(Role.admin))
  destroyFile(@Body() destroyFileDto: DestroyFileDto): Promise<string> {
    return this.uploadService.destroyFile(destroyFileDto);
  }
}
