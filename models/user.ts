import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    _id?: mongoose.Types.ObjectId,
    username: string,
    avatar?: string,
    email: string,
    password: string,
    postIds: mongoose.Types.ObjectId[];
    createdAt?: Date,
    updatedAt?: Date,
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    postIds: [{
        type: [Schema.Types.ObjectId],
        ref: "Post",
        default: [],
    }],
    password: {
        type: String,
        required: true,
    },

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = models?.user || model<IUser>("user", userSchema);

export default User;