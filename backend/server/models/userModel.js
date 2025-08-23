import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    userId:{
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const User = model('User', UserSchema);