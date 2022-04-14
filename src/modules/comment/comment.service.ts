import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument } from 'src/database/schemas/category.schema';
import { Model } from "mongoose";
import mongoose from 'mongoose';
import { Any } from 'typeorm';
import { Comment, CommentDocument } from 'src/database/schemas/comment.schema';
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
    ) { }

    pagination = (page, limit) => {
        let newPage = Number(page) * 1 || 1;
        let newLimit = Number(limit) * 1 || 4;
        let skip = (newPage - 1) * newLimit;
        return { page: newPage, limit: newLimit, skip };
    }

    async createComment(body: any, user: any) {
        try {
            const { content,
                blog_id,
                blog_user_id
            } = body;

            const newComment = await this.commentModel.create({
                user: user._id,
                content,
                blog_id: new mongoose.Types.ObjectId(blog_id),
                blog_user_id: new mongoose.Types.ObjectId(blog_user_id)
            })

            return newComment;
        } catch (error) {
            throw new BadRequestException({ msg: error.message });
        }
    }

    async getComments(newPage, newLimit, id) {
        const { limit, skip } = this.pagination(newPage, newLimit);
        try {
            const data = await this.commentModel.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    blog_id: new mongoose.Types.ObjectId(id),
                                    comment_root: { $exists: false },
                                    reply_user: { $exists: false }
                                }
                            },
                            {
                                $lookup: {
                                    "from": "users",
                                    "let": { user_id: "$user" },
                                    "pipeline": [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { name: 1, avatar: 1 } }
                                    ],
                                    "as": "user"
                                }
                            },
                            { $unwind: "$user" },
                            {
                                $lookup: {
                                    "from": "comments",
                                    "let": { cm_id: "$replyCM" },
                                    "pipeline": [
                                        { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                                        {
                                            $lookup: {
                                                "from": "users",
                                                "let": { user_id: "$user" },
                                                "pipeline": [
                                                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                                    { $project: { name: 1, avatar: 1 } }
                                                ],
                                                "as": "user"
                                            }
                                        },
                                        { $unwind: "$user" },
                                        {
                                            $lookup: {
                                                "from": "users",
                                                "let": { user_id: "$reply_user" },
                                                "pipeline": [
                                                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                                    { $project: { name: 1, avatar: 1 } }
                                                ],
                                                "as": "reply_user"
                                            }
                                        },
                                        { $unwind: "$reply_user" }
                                    ],
                                    "as": "replyCM"
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            {
                                $match: {
                                    blog_id: new mongoose.Types.ObjectId(id),
                                    comment_root: { $exists: false },
                                    reply_user: { $exists: false }
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

            const comments = data[0].totalData;
            const count = data[0].count;

            let total = 0;

            if (count % limit === 0) {
                total = count / limit;
            } else {
                total = Math.floor(count / limit) + 1;
            }

            return { comments, total }
        } catch (error) {
            throw new BadRequestException({ msg: error.message });
        }
    }

    async replyComment(user: any, body: any) {
        try {
            const { content, blog_id, blog_user_id, comment_root, reply_user } = body;

            const newComment = await this.commentModel.create({
                user: user._id,
                content,
                blog_id: new mongoose.Types.ObjectId(blog_id),
                blog_user_id: new mongoose.Types.ObjectId(blog_user_id),
                comment_root: new mongoose.Types.ObjectId(comment_root),
                reply_user: new mongoose.Types.ObjectId(reply_user._id),
            })


            await this.commentModel.findOneAndUpdate({ _id: comment_root }, {
                $push: { replyCM: newComment._id }
            });


            await newComment.save();

            return newComment;
        } catch (error) {
            throw new BadRequestException({ msg: error.message });
        }
    }

    async updateComment(user, id, content) {
        try {
            const comment = await this.commentModel.findOneAndUpdate(
                {
                    _id: id,
                    user: user._id
                },
                {
                    content
                }
            )

            if (!comment) {
                throw new BadRequestException({ msg: 'comment does not exist' });
            }
            return { msg: "Update Success!" }
        } catch (error) {
            throw new BadRequestException({ msg: error.message });
        }
    }

    async deleteComment(user: any, id: string) {
        try {
            const comment = await this.commentModel.findOneAndDelete({
                _id: id,
                $or: [
                    { user: user._id },
                    { blog_user_id: user._id }
                ]
            });

            if (!comment) {
                throw new BadRequestException({ msg: 'comment does not exist' });
            }

            if (comment.comment_root) {
                await this.commentModel.findByIdAndUpdate({
                    _id: comment.comment_root
                }, {
                    $pull: { replyCM: comment._id }
                })
            } else {
                await this.commentModel.deleteMany({ _id: { $in: comment.replyCM } })
            }

            return { msg: "Delete Success!" }

        } catch (error) {
            throw new BadRequestException({ msg: error.message });
        }
    }
}
