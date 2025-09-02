import { Song } from '../models/songModel.js';
import { User } from '../models/userModel.js';
import { Album } from '../models/albumModel.js';

export const getStats = async (req, res) => {
    try {
        // in this fetch each thing one by one
        // const totalSongs = await Song.countDocuments();
        // const totalUsers = await User.countDocuments();
        // const totalAlbums = await Album.countDocuments();

        // Using Promise.all to run all three queries in parallel
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),
            // this will collect all unique artists from songs collection
            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    },
                },
                {
                    $group: {
                        _id: "$artist",
                    }
                },
                { 
                    $count: "count", 
                }
            ])
        ]);
        res.status(200).json({ totalSongs, totalAlbums, totalUsers, totalArtists: uniqueArtists[0]?.count || 0 });

    } catch (error) {
        console.log("Error in stats route: ", error)
        return res.status(500).json({
            message: "Something went wrong while fetching stats",
            error: error.message
        });
    }
}