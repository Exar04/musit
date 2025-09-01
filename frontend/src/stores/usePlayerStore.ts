import type { SongType } from "@/types"
import { create } from "zustand"

interface PlayerStore {
    currentSong: SongType | null
    isPlaying: boolean
    queue: SongType[]
    currentIndex: number

    initalizeQueue: (songs: SongType[]) => void
    playAlbum: (songs: SongType[], startIndex?: number) => void
    setCurrentSong: (song: SongType | null) => void
    togglePlay: () => void
    playNext: () => void
    playPrevious: () => void
    addToQueue: (song: SongType) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,

    initalizeQueue: (songs: SongType[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
        })
    },

    playAlbum: (songs: SongType[], startIndex = 0) => {
        if(songs.length === 0) return;

        const song = songs[startIndex]

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
        })
    },

    setCurrentSong: (song: SongType | null) => {
        if (!song) return;

        const songIndex = get().queue.findIndex(s => s._id === song._id)
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
        })
    },
    togglePlay: () => {
        const willStartPlaying = !get().isPlaying
        set({
            isPlaying: willStartPlaying 
        })
    },
    playNext: () => {
        const {currentIndex, queue} = get()
        const nextIndex = (currentIndex + 1)
        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex]
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            })
        }else {
            set({isPlaying : false})
        }
    },
    playPrevious: () => {
        const { currentIndex, queue } = get()
        const prevIndex = currentIndex - 1

        // if theres a previous song
        if( prevIndex >= 0) {
            const prevSong = queue[prevIndex]
            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true
            })
            set({})
        }else {
            // if theres no previous song
            set({
                isPlaying: false
            })
        }
    },

    // TODO: add to queue function
    addToQueue: (song: SongType) => {console.log(song)},
}))