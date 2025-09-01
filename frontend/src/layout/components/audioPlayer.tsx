import { usePlayerStore } from "@/stores/usePlayerStore"
import { useEffect, useRef } from "react"

export const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const prevSongRef = useRef<string | null>(null)

    const { currentSong, isPlaying, playNext} = usePlayerStore()

    // handle play/pause logic

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play()
        }else {
            audioRef.current?.pause()
        }
    }, [isPlaying])
    
    // handle song ending
    useEffect(() => {
        if (!audioRef.current || !currentSong) return
        const audio = audioRef.current
        const handleSongEnded = () => {
            playNext()
        }
        audio.addEventListener("ended", handleSongEnded)
        return () => audio.removeEventListener("ended", handleSongEnded)
    }, [currentSong ,playNext])

    useEffect(() => {
        if (!audioRef.current || !currentSong) return
        const audio = audioRef.current 
        const isSongChanged = prevSongRef.current !== currentSong?.audioUrl
        if(isSongChanged) {
            audio.src = currentSong?.audioUrl
            audio.currentTime = 0;
            prevSongRef.current = currentSong?.audioUrl

            if (isPlaying) audio.play()
        }
    },[currentSong, isPlaying])

    return <audio ref={audioRef}/>
}