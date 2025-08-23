import { Song } from "../models/songModel.js";
import { Album } from "../models/albumModel.js";
import path from "path";

export async function createSong(req, res) {
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const songFile = req.files['song'] ? req.files['song'][0] : null;
    if (imageFile == null) return res.status(400).json({ message: 'Image file is required' });
    if (songFile == null) return res.status(400).json({ message: 'Song file is required' });

    const { title, artist, duration, albumId} = req.body
    const imageUrl = path.join("/uploads/images", imageFile.filename);
    const audioUrl = path.join("/uploads/songs", songFile.filename);

    const song = new Song({
        title,
        artist,
        duration,
        imageUrl,
        audioUrl,
        albumId: albumId || null
    }) 

    await song.save()

    // if song belongs to an album then it gets added to an album here  
    if (albumId) {
        await Album.findByIdAndUpdate(albumId, {
            $push: { songs: song._id}
        })
    }

    res.status(200).json({
        message: 'Song Successfully uploaded',
        songId: song._id
    });
};

export async function deleteSong(req, res){
    try {
        const { id } = req.params

        const song = await Song.findById(id)

        // if song belongs to an album, update the albu's song array
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                // pull function removes the element from array
                $pull: { songs: song._id }
            })
        }
        await song.deleteOne();

        return res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log("erroe in deleting song", error)
        return res.status(500).json({ 
            message: "Something went wrong while deleting the song", 
            error: error.message 
        });
    }
}

export async function createAlbum(req, res) {
    try {

        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        // const songFile = req.files['song'] ? req.files['song'][0] : null;
        if (imageFile == null) return res.status(400).json({ message: 'Image file is required' });
        // if (songFile == null) return res.status(400).json({ message: 'Song file is required' });

        const { title, artist, releaseYear } = req.body
        const imageUrl = path.join("/uploads/images", imageFile.filename);
        // const audioUrl = path.join("/uploads/songs", songFile.filename);

        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl,
        })

        await album.save()
        res.status(200).json({
            message: 'Album Successfully Created',
            album: album
        });
    } catch (error){
        console.log("Error in createAlbum", error)
        return res.status(500).json({ 
            message: "Something went wrong while creating the album", 
            error: error.message 
        });
    }
};


export async function deleteAlbum(req, res){
    try {
        const { id } = req.params

        const album = await Album.findById(id)

        await album.deleteOne();

        return res.status(200).json({ message: "album deleted successfully" });
    } catch (error) {
        console.log("erroe in deleting song", error)
        return res.status(500).json({ 
            message: "Something went wrong while deleting the album", 
            error: error.message 
        });
    }
}

export async function checkAdmin (req, res) {
    res.status(200).json({ admin: true})
}