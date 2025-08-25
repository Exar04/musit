import { Album } from "../models/albumModel.js";

export const getAllAlbums = async (req, res) => {
    try {
        const albums = await Album.find();
        // we are waiting here for 2 sec just so showcase some of our features
        await new Promise(resolve => setTimeout(resolve, 2000));
        res.status(200).json(albums)
    } catch (error) {
        console.log("Error in getAllAlbums : ", error)
        return res.status(500).json({ 
            message: "Something went wrong while fetching Albums", 
            error: error.message 
        });
    }
}

export const getAlbumsById = async (req, res) => {
    try {
        const { albumId } = req.params
        const album = await Album.findById(albumId).populate("songs")

        if (!album){
            return res.status(404).json({message: "Album not found"})
        }
        res.status(200).json(album);

    }catch (error){
        console.log("Error in getAlbumById : ", error)
        return res.status(500).json({ 
            message: "Something went wrong while fetching Album", 
            error: error.message 
        });
    }
}