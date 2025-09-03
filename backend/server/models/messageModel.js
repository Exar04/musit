import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: { type: String, required: true }, // _id from authDB
		receiverId: { type: String, required: true }, // _id from authDB 
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);