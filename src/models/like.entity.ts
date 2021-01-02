
import { Document, Schema, Model, model, Error } from 'mongoose';

export interface ILike extends Document {
    userId: String,
    memeId: String,
    alreadyLiked: Boolean
}

export const LikeSchema: Schema = new Schema({
    userId: String,
    memeId: String,
    alreadyLiked: {
        type: Boolean,
        default: false
    }
});

export const Like: Model<ILike> = model<ILike>("likes", LikeSchema);