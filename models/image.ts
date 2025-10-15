
import mongoose, { model, models, Schema } from "mongoose";

export interface IImage {
    _id?: mongoose.Types.ObjectId;
    username: string,
    title: string;
    description: string;
    imageUrl: string;
    fileId: string;
}

const imageSchema = new Schema<IImage>({
    username: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    fileId: { type: String, required: true },
}, { timestamps: true });

const Image = models?.image || model<IImage>("image", imageSchema);

export default Image;