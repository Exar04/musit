import { Message } from "../models/messageModel.js";
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

export const getMessages = async(req, res) => {
    try {
        const myId = req.user.userId.toString();
        const {userId} = req.params

        const message = await Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 })

        res.status(200).json(message)
    }catch(err) {
        console.log("Error in messages : ", err)
        return res.status(500).json({ 
            message: "Something went wrong while fetching messages", 
            error: err.message 
        });
    }
}