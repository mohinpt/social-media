import mongoose, { model, models, Schema } from "mongoose";


const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    username: string,
    title: string;
    description: string;
    videoUrl: string;
    fileId: string;
    thumbnailUrl?: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
    }
}

const videoSchema = new Schema<IVideo>({
    username: {
        type: String
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    fileId: { type: String, required: true },
    thumbnailUrl: {
        type: String,
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformation: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, min: 1, max: 100 }

    }
}, { timestamps: true });

const Video = models?.video || model<IVideo>("video", videoSchema);

export default Video;