import { Schema, model } from 'mongoose';

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    audioUrl: {
        type: String,
        default: "",
    },
    totalListens: {
        type: Number,
        default: 0,
    },
    duration: {
        // type: Number,
        type: String,
        required: true,
    },
    albumId: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Song = model('Song', SongSchema);