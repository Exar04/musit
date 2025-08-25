import { serviceApi } from "@/lib/api";
import { AxiosError } from "axios";
import { create } from "zustand";

interface ChatStore {
    users: any[]
    fetchUsers: () => Promise<void>
    isLoading: boolean
    error: string | null
}

export const useChatStore = create<ChatStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,
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
            set({ isLoading: false })
        }
    }
}))