import { User } from "../models/userModel.js";

// this sends all users except the current user that is sending the request
export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await User.find({ _id: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAllUsers : ", error)
        return res.status(500).json({ 
            message: "Something went wrong while fetching users", 
            error: error.message 
        });
    }
}