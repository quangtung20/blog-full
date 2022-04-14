import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose from "mongoose";
import { User } from "./user.schema";

@Schema({ timestamps: true })
export class Comment {
    @Prop({
        type: mongoose.Types.ObjectId, ref: User.name
    })
    @Type(() => User)
    user: User;

    @Prop({
        type: mongoose.Types.ObjectId
    })
    blog_id: mongoose.Types.ObjectId;

    @Prop({
        type: mongoose.Types.ObjectId
    })
    blog_user_id: mongoose.Types.ObjectId;

    @Prop({
        type: String, required: true
    })
    content: string;

    @Prop([{ type: mongoose.Types.ObjectId, ref: 'comment' }])
    replyCM: [mongoose.Types.ObjectId];

    @Prop({
        type: mongoose.Types.ObjectId, ref: 'user'
    })
    reply_user: mongoose.Types.ObjectId;

    @Prop({
        type: mongoose.Types.ObjectId, ref: 'comment'
    })
    comment_root: mongoose.Types.ObjectId
}

export const ComentSchema = SchemaFactory.createForClass(Comment);