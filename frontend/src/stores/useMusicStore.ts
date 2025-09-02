import { serviceApi } from '@/lib/api';
import {create} from 'zustand';
import { AxiosError } from "axios";
import type { AlbumType, SongType, Stats } from '@/types';
import toast from 'react-hot-toast';

type MusicState = {
    albums: AlbumType[];
    songs: SongType[];
    isLoadingAlbumById: boolean;
    isLoadingAlbums: boolean;
    isLoadingFeaturedSongs: boolean;
    isLoadingMadeForYouSongs: boolean;
    isLoadingTrendingSongs: boolean;
    isLoadingSongs: boolean;
    isLoadingStats: boolean;
    isDeletingSong: boolean;
    isDeletingAlbum: boolean;

    error: string | null;
    currentAlbum: AlbumType | null,
    featuredSongs: SongType[]
    madeForYouSongs: SongType[]
    trendingSongs: SongType[]
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (albumId: string) => Promise<void>

    fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;

    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;

    deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
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
    isLoadingSongs: false,
    isLoadingStats: false,
    isDeletingSong: false,
    isDeletingAlbum: false,
    error: null,
    currentAlbum: null,
    stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

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

	fetchSongs: async () => {
		set({ isLoadingSongs: true, error: null });
		try {
            // theres an error here
            // also we have to optimise here using infinite scroll functionality where only few songs are loaded initially
			const response = await serviceApi.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoadingSongs: false });
		}
	},

	fetchStats: async () => {
		set({ isLoadingStats: true, error: null });
		try {
			const response = await serviceApi.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoadingStats: false });
		}
	},

	deleteSong: async (id) => {
		set({ isDeletingSong: true, error: null });
		try {
			await serviceApi.delete(`/admin/song/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isDeletingSong: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isDeletingAlbum: true, error: null });
		try {
			await serviceApi.delete(`/admin/album/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.album === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isDeletingAlbum: false });
		}
	},

}))