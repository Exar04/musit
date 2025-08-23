import { Song } from "../models/songModel.js";

export const getAllSongs = async (req, res) => {
    try {
        // Sort by createdAt ( newest ones will be at the top )
        const songs = await Song.find().sort({ createdAt: -1 });
    }catch (error) {
        console.log("Error in getAllSongs : ", error)
        return res.status(500).json({ 
            message: "Something went wrong while fetching Songs", 
            error: error.message 
        });
    }
}

// This idealy should be done via machine learning
// But for now we will just send random songs
export const getFeaturedSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 6 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                }
            }
        ]);
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getFeaturedSongs : ", error)
        return res.status(500).json({ 
            message: "Something went wrong while fetching Featured Songs", 
            error: error.message 
        });
    }
}

// This idealy should be done via machine learning
// But for now we will just send random songs
export const getMadeForYouSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                }
            }
        ]);
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getMadeForYouSongs : ", error)
        return res.status(500).json({ 
            message: "Something went wrong while fetching Made For You Songs", 
            error: error.message 
        });
    }
}

export const getTrendingSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                }
            }
        ]);
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getTrendingSongs : ", error)
        return res.status(500).json({
            message: "Something went wrong while fetching Trending Songs",
            error: error.message
        });
    }
}