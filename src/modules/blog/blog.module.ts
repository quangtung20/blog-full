import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/database/schemas/blog.schema';
import { AuthModule } from '../auth/auth.module';
import { Comment, CommentSchema } from 'src/database/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    AuthModule,
  ],
  providers: [BlogService],
  controllers: [BlogController]
})
export class BlogModule { }
