import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
    @Prop({
        type: String,
        required: [true, 'please add your name'],
        trim: true,
        maxLength: [20, "Your name is up to 20 chars long."]
    })
    name: string;

    @Prop({
        type: String,
        required: [true, "Please add your email or phone"],
        trim: true,
        unique: true
    })
    account: string;

    @Prop({
        type: String,
        required: [true, "Please add your password"]
    })
    password: string;


    @Prop({
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    })
    avatar: string;

    @Prop({
        type: String,
        default: 'user' // admin 
    })
    role: string;

    @Prop({
        type: String,
        default: 'register' // login
    })
    type: string;

}

export const UserSchema = SchemaFactory.createForClass(User);