import { serviceApi } from "@/lib/api";
import type { MessageType, UserType } from "@/types";
import { AxiosError } from "axios";
import { create } from "zustand";
import {io} from "socket.io-client"

interface ChatStore {
    users: any[]
    isLoadingUsers: boolean
    isLoadingMessages: boolean
    error: string | null
    socket: any
    isConnected: boolean
    onlineUsers: Set<string>
    userActivities: Map<string, string>
    messages: MessageType[]
    selectedUser : UserType | null

    fetchUsers: () => Promise<void>
    initSocket: (userId: string) => void
    disconnectSocket: () => void
    sendMessage: (receiverId: string, senderId: string ,content: string) => void
    fetchMessages(userId: string): Promise<void>
    setSelectedUser: (user: UserType | null) => void
}

// later we should get this url via .env 
// as we will be running our servers in docker
// we will probably need to pass in image name instead of localhost
// like serviceServer:8085 --x localhost:8085
const baseUrl = "http://localhost:8085"
const socket = io(
    baseUrl,
    {
        autoConnect: false, // only connect when user is authenticated
        withCredentials: true,
    }
)

export const useChatStore = create<ChatStore>((set,get) => ({
    users: [],
    isLoadingUsers: false,
    isLoadingMessages: false, 
    error: null,
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,
    fetchUsers: async() => {
        try {
            const response = await serviceApi.get("/users/getAllUsers")
            set({users: response.data})
        } catch (err) {
            if (err instanceof AxiosError) {
                set({ error: err.response?.data?.message ?? "Something went wrong" });
            } else {
                set({ error: "Unexpected error" });
            }
        } finally {
            set({ isLoadingUsers: false })
        }
    },
    initSocket: (userId: string) => {
        if(!get().isConnected) {
            socket.auth = {userId}
            socket.connect()
            socket.emit("user_connected", userId)

            socket.on("user_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) })
            })
            
            socket.on("activities", (activities: [string, string][]) => {
                set({ userActivities: new Map(activities) })
            })

            socket.on("user_connected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId])
                }))
            })

            socket.on("user_disconnected", (userId: string) => {
                set((state) => {
                    const newOnlineUsers = new Set(state.onlineUsers)
                    newOnlineUsers.delete(userId)
                    return { onlineUsers: newOnlineUsers }
                })
            })
            
            socket.on("receive_message", (message: MessageType) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })

            socket.on("message_sent", (message: MessageType) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })

            socket.on("activity_updated", ({userId, activity}) => {
                set((state) => {
                    const newUserActivities = new Map(state.userActivities)
                    newUserActivities.set(userId, activity)
                    return { userActivities: newUserActivities }
                })
            })

            set({ socket, isConnected: true })
        }
    },
    disconnectSocket: () => {
        if (get().isConnected) {
            socket.disconnect()
            set({ isConnected: false })
        }
    },
    sendMessage: async (receiverId, senderId, content) => {
        const socket = get().socket
        if (!socket) return
        socket.emit("send_message", {receiverId, senderId, content})
    },

    fetchMessages: async (userId) => {
        set({isLoadingMessages: true})
        try {
            const response = await serviceApi.get(`users/messages/${userId}`)
            set({messages: response.data}) 
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoadingMessages: false})
        }
    },

    setSelectedUser: (user) => set({selectedUser: user}),
}))