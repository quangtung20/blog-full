import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './upload.provider';
import { UploadRepository } from './upload.repository';
import { UploadService } from './upload.service';
@Module({
  imports: [
    ConfigModule,
    AuthModule,
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([UploadRepository])
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService, CloudinaryProvider],
})
export class UploadModule { }
