import { Server, Socket } from "socket.io";
import { Message } from "../models/messageModel.js"

export const initilizeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,   // 👈 add this

        },
    });

    const userSocket = new Map() // key is userId, value is socketId
    const userActivity = new Map() // {userId : activity}

    io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            userSocket.set(userId, socket.id)
            userActivity.set(userId, "Idle")

            // broadcast to all connected sockets that this user just logged in
            io.emit("user_connected", userId)

            socket.emit("users_onliine", Array.from(userSocket.keys()))

            io.emit("activities", Array.from(userActivity.entries()))
        })

        socket.on("update_activity", ({userId, activity}) => {
            userActivity.set(userId, activity)
            io.emit("activity_updated", {userId, activity})
        })

        socket.on("send_message", async(data) => {
            try {
                const { senderId, receiverId, content } = data
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content
                })
                // send to receiver in realtime, only if they are online
                const receiverSocketId = userSocket.get(receiverId)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message)
                }

                socket.emit("message_sent", message)
            }catch (err) {
                console.log("Message error: ", err)
            }
        })

        socket.on("disconnect", () => {
            let disconnectedUserId
            for(const [userId, socketId] of userSocket) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId
                    userSocket.delete(userId)
                    userActivity.delete(userId)
                    break
                }
            }
            if (disconnectedUserId) {
                userSocket.delete(disconnectedUserId)
                io.emit("user_disconnected", disconnectedUserId)
            }
        })
    })
}