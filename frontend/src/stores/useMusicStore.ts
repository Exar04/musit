import { serviceApi } from '@/lib/api';
import {create} from 'zustand';
import { AxiosError } from "axios";
import type { AlbumType, SongType } from '@/types';

type MusicState = {
    albums: AlbumType[];
    songs: SongType[];
    isLoadingAlbumById: boolean;
    isLoadingAlbums: boolean;
    isLoadingFeaturedSongs: boolean;
    isLoadingMadeForYouSongs: boolean;
    isLoadingTrendingSongs: boolean;
    error: string | null;
    currentAlbum: AlbumType | null,
    featuredSongs: SongType[]
    madeForYouSongs: SongType[]
    trendingSongs: SongType[]

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (albumId: string) => Promise<void>

    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicState>((set) => ({
    albums : [],
    songs :[],
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    isLoadingAlbums: false,
    isLoadingAlbumById: false,
    isLoadingFeaturedSongs: false,
    isLoadingMadeForYouSongs: false,
    isLoadingTrendingSongs: false,
    error: null,
    currentAlbum: null,

    fetchAlbums: async () => {
        set({ isLoadingAlbums: true, error: null })

        try {
            const response = await serviceApi.get("album/getAllAlbums");
            set({albums: response.data})
        } catch (err) {
            if (err instanceof AxiosError) {
                set({ error: err.response?.data?.message ?? "Something went wrong while fetching all albums" });
            } else {
                set({ error: "Unexpected error" });
            }
        } finally {
            set({ isLoadingAlbums: false })
        }
    },

    fetchAlbumById: async (albumId : string) => {
        set({isLoadingAlbumById: true, error: null})
        try{
            const response = await serviceApi.get(`album/${albumId}`)
            set({currentAlbum: response.data})
        }catch(err) {
            if (err instanceof AxiosError) {
                set({ error: err.response?.data?.message ?? "Something went wrong while fetching album by id" });
            } else {
                set({ error: "Unexpected error" });
            }
        }finally {
            set({ isLoadingAlbumById: false })
        }
    },

    fetchFeaturedSongs: async() => {
        set({isLoadingFeaturedSongs: true, error: null})
        try {
            const response = await serviceApi.get("/songs/featured")
            set({featuredSongs: response.data})
        }catch(err){
            if (err instanceof AxiosError) {
                set({ error: err.response?.data?.message ?? "Something went wrong whie fetching featured songs" });
            } else {
                set({ error: "Unexpected error" });
            }
        }finally{
            set({isLoadingFeaturedSongs: false})
        }
    },
    fetchMadeForYouSongs: async() => {
        set({isLoadingMadeForYouSongs: true, error: null})
        try {
            const response = await serviceApi.get("/songs/made-for-you")
            set({madeForYouSongs: response.data})
        }catch(err){
            if (err instanceof AxiosError) {
                set({ error: err.response?.data?.message ?? "Something went wrong whie fetching made for you songs" });
            } else {
                set({ error: "Unexpected error" });
            }
        }finally{
            set({isLoadingMadeForYouSongs: false})
        }
    },
    fetchTrendingSongs: async() => {
        set({isLoadingTrendingSongs: true, error: null})
        try {
            const response = await serviceApi.get("/songs/trending")
            set({trendingSongs: response.data})
        }catch(err){
            if (err instanceof AxiosError) {
                set({ error: err.response?.data?.message ?? "Something went wrong whie fetching trending songs" });
            } else {
                set({ error: "Unexpected error" });
            }
        }finally{
            set({isLoadingTrendingSongs: false})
        }
    },
}))