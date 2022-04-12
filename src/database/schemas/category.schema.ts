import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Category {
    @Prop({
        type: String,
        required: [true, "Please add your category"],
        trim: true,
        unique: true,
        maxLength: [50, "Name is up to 50 chars long."]
    })
    name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);