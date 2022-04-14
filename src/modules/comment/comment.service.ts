import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument } from 'src/database/schemas/category.schema';
import { Model } from "mongoose";
import mongoose from 'mongoose';
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<CategoryDocument>
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
                blog_id,
                blog_user_id
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


}
