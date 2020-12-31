
import { Document, Schema, Model, model, Error } from 'mongoose';

export interface IUser extends Document {
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    profilePicUrl: String
}

export const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    profilePicUrl: {
        type: String
    }
});

export const User: Model<IUser> = model<IUser>("accounts", UserSchema);