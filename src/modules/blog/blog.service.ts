import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from "mongoose";
import { Blog, BlogDocument } from 'src/database/schemas/blog.schema';
import { Comment, CommentDocument } from 'src/database/schemas/comment.schema';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
    ) { }

    pagination = (page, limit) => {
        let newPage = Number(page) * 1 || 1;
        let newLimit = Number(limit) * 1 || 4;
        let skip = (newPage - 1) * newLimit;
        return { page: newPage, limit: newLimit, skip };
    }

    async createBlog(user: any, body: any) {
        try {
            const { title, content, description, thumbnail, category } = body

            const newBlog = await this.blogModel.create({
                user: user._id,
                title: title.toLowerCase(),
                content,
                description,
                thumbnail,
                category: new mongoose.Types.ObjectId(category)
            });

            return { newBlog }

        } catch (error) {
            throw new BadRequestException({ msg: error.message });
        }
    }

    async getHomeBlogs() {
        try {
            const blogs = await this.blogModel.aggregate([
                // User
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: "$user" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { password: 0 } }
                        ],
                        as: "user"
                    }
                },
                // array -> object
                { $unwind: "$user" },
                // Category
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                    }
                },
                // array -> object
                { $unwind: "$category" },
                // Sorting
                { $sort: { "createdAt": -1 } },
                // Group by category
                {
                    $group: {
                        _id: "$category._id",
                        name: { $first: "$category.name" },
                        blogs: { $push: "$$ROOT" },
                        count: { $sum: 1 }
                    }
                },
                // Pagination for blogs
                {
                    $project: {
                        blogs: {
                            $slice: ['$blogs', 0, 4]
                        },
                        count: 1,
                        name: 1
                    }
                }
            ]);
            return blogs;
        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }

    async getBlogsByCategory(newPage, newLimit, id) {
        const { limit, skip } = this.pagination(newPage, newLimit);
        try {
            const Data = await this.blogModel.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    category: new mongoose.Types.ObjectId(id)
                                }
                            },
                            // User
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { password: 0 } }
                                    ],
                                    as: "user"
                                }
                            },
                            // array -> object
                            { $unwind: "$user" },
                            // Sorting
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            {
                                $match: {
                                    category: new mongoose.Types.ObjectId(id)
                                }
                            },
                            { $count: 'count' }
                        ]
                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ])


            const blogs = Data[0].totalData;
            const count = Data[0].count;

            let total = 0;

            if (count % limit === 0) {
                total = count / limit;
            } else {
                total = Math.floor(count / limit) + 1;
            }

            return { blogs, total }
        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }

    async getBlogByUser(newPage, newLimit, id) {
        const { limit, skip } = this.pagination(newPage, newLimit);
        try {
            const Data = await this.blogModel.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    user: new mongoose.Types.ObjectId(id)
                                }
                            },
                            // User
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { password: 0 } }
                                    ],
                                    as: "user"
                                }
                            },
                            // array -> object
                            { $unwind: "$user" },
                            // Sorting
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            {
                                $match: {
                                    user: new mongoose.Types.ObjectId(id)
                                }
                            },
                            { $count: 'count' }
                        ]
                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ])

            const blogs = Data[0].totalData;
            const count = Data[0].count;

            // Pagination
            let total = 0;

            if (count % limit === 0) {
                total = count / limit;
            } else {
                total = Math.floor(count / limit) + 1;
            }

            return { blogs, total }
        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }

    async getBlog(id) {
        try {
            const blog = await this.blogModel.findById(id)
                .populate("user", "-password")

            if (!blog) {
                throw new BadRequestException({ msg: "Blog does not exist." })
            }
            return blog

        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }

    async updateBlog(user: any, body: any, id: string) {
        try {
            console.log(body);
            const blog = await this.blogModel.findOneAndUpdate({
                _id: id, user: user._id
            },
                {
                    title: body.title,
                    content: body.content,
                    description: body.description,
                    thumbnail: body.thumbnail,
                    category: new mongoose.Types.ObjectId(body.category)
                }
            )

            if (!blog) {
                throw new BadRequestException({ msg: 'Invalid Authentication.' });
            }

            return { msg: 'Update Success!', blog };

        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }

    async deleteBlog(user: any, id: string) {
        try {
            const blog = await this.blogModel.findOneAndDelete({
                _id: id,
                user: user._id,
            })

            if (!blog) {
                throw new BadRequestException({ msg: 'Invalid Authentication.' });
            }

            await this.commentModel.deleteMany({
                blog_id: blog._id
            });

            return { msg: 'Delete Success!' }

        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }
}
