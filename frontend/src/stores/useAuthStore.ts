import { serviceApi } from '@/lib/api'
import { AxiosError } from 'axios'
import { create } from 'zustand'

interface AuthStore {
    isAdmin: boolean 
    isLoading: boolean
    error: string | null

    checkAdminStatus: () => Promise<void>
    reset: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,
    checkAdminStatus: async () => {
            set({isLoading: true, error: null}) 
        try {
            const response = await serviceApi.get('admin/check')
            console.log("d admin: ", response.data.admin)
            set({isAdmin: response.data.admin})
        } catch (err ) {
            if (err instanceof AxiosError) {
                set({isAdmin:false, error: err.response?.data?.message})
            }
        } finally {
            set({ isLoading: false })
        }
    },
    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null})
    }
}))