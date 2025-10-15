import mongoose, { Schema } from "mongoose";

export interface IPost {
    _id?: mongoose.Types.ObjectId,
    owner: mongoose.Types.ObjectId,
    username: string,
    content: string;
    likesCount: number;
    shareCount: number;
    commentCount: number;
    media?: {
        type: "image" | "video";
        url: string;
    } | null;
    createdAt: Date;
}


const postSchema = new Schema<IPost>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    username: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    shareCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    media: {
        type: {
            type: String,
            enum: ["image", "video"],
        },
        url: String,
    },
}, { timestamps: true });

const Post = mongoose.models.post || mongoose.model<IPost>("post", postSchema);

export default Post