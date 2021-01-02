
import { Document, Schema, Model, model, Error } from 'mongoose';

export interface IMeme extends Document {
    owner: {
        id: Schema.Types.ObjectId,
        name: String,
        email: String
    },
    content: String,
    url: String,
    numOfLikes: Number,
    numOfComments: Number,
    comments: [
        {
            content: String,
            time: Date,
            userId: Schema.Types.ObjectId,
        }
    ],
    sharedAt: Date,
}

export const MemeSchema: Schema = new Schema({
    owner: {
        id: Schema.Types.ObjectId,
        name: String,
        email: String
    },
    content: {
        type: String,
        max: 100
    },
    url: {
        type: String,
        required: true
    },
    numOfLikes: {
        type: Number,
        default: 0,
    },
    numOfComments: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            content: String,
            time: Date,
            userId: Schema.Types.ObjectId,
        }
    ],
    sharedAt: Date,
});

export const Meme: Model<IMeme> = model<IMeme>("memes", MemeSchema);