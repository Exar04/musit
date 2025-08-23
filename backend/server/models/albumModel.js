import { Schema, model } from 'mongoose';

const AlbumSchema = new Schema({
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
    releaseYear: {
        type: Number,
        required: true,
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Album = model('Album', AlbumSchema);