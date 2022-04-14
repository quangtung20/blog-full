import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { BlogService } from './blog.service';

@Controller('')
export class BlogController {
    constructor(
        private blogService: BlogService
    ) { }

    @Post('blog')
    @UseGuards(RoleGuard('user'))
    createBlog(
        @GetUser() user: any,
        @Body() body: any
    ) {
        return this.blogService.createBlog(user, body);
    }

    @Get('home/blogs')
    getHomeBlog() {
        return this.blogService.getHomeBlogs();
    }

    @Get('blogs/category/:id')
    getBlogByCategory(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.blogService.getBlogsByCategory(page, limit, id);
    }

    @Get('/blogs/user/:id')
    GetBlogByUser(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.blogService.getBlogByUser(page, limit, id);
    }

    @Get('/blog/:id')
    GetBlog(@Param('id') id: string) {
        return this.blogService.getBlog(id);
    }

    @Put('/blog/:id')
    @UseGuards(RoleGuard('user'))
    UpdateBlog(
        @Param('id') id: string,
        @GetUser() user: any,
        @Body() body: any
    ) {
        return this.blogService.updateBlog(user, body, id);
    }

    @Delete('/blog/:id')
    @UseGuards(RoleGuard('user'))
    deleteBlog(
        @GetUser() user: any,
        @Param('id') id: string,
    ) {
        return this.blogService.deleteBlog(user, id);
    }

}
