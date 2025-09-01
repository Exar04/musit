import { useMusicStore } from "@/stores/useMusicStore"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ColorThief from "colorthief";
import { Button } from "@/components/ui/button";
import { Clock, Music, Pause, Play } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds %60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function AlbumPage() {
    const {albumId} = useParams()
    const { fetchAlbumById, currentAlbum, isLoadingAlbumById} = useMusicStore()
    const [bgColor, setBgColor] = useState<string>("");

    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore()

    useEffect(() => {
        if (albumId) fetchAlbumById(albumId) 
    }, [fetchAlbumById, albumId])

    const handlePlayAlbum = () => {
        if (!currentAlbum) return
        const isCurrentAlbumPlaying = currentAlbum?.songs.some(song => song._id === currentSong?._id)
        if (isCurrentAlbumPlaying) {
            togglePlay()
        }else {
            playAlbum(currentAlbum?.songs, 0)
        }

    }
    const handlePlaySong = (index: number) => {
        if (!currentAlbum) return
        playAlbum(currentAlbum?.songs, index)
    }

    // this handles the ambient background color change
    useEffect(() => {
        if (!currentAlbum?.imageUrl) return;

        const img = new Image();
        img.crossOrigin = "anonymous"; // important for external images
        img.src = currentAlbum.imageUrl;

        img.onload = () => {
            const colorThief = new ColorThief();
            const [r, g, b] = colorThief.getColor(img); // dominant color
            setBgColor(`rgb(${r}, ${g}, ${b})`);
        };
    }, [currentAlbum?.imageUrl])
    if (isLoadingAlbumById) return null

    return (
        <div className="h-full">
            <ScrollArea className="h-full">
                {/* Main Content */}
                <div className=" relative min-h-full">
                    {/* bg gradient */}
                    {/* Solid + glowing top color */}
                    <div
                        className="absolute inset-0 rounded-lg animate-[pulseAmbient_6s_ease-in-out_infinite]"
                        style={{
                            background: `linear-gradient(to bottom, var(--from) 0%, transparent 50%)`,
                            "--from": bgColor ?? "rgb(80,56,160)",
                        } as React.CSSProperties}
                        aria-hidden="true"
                    />

                    {/* Stable dark overlay */}
                    <div
                        className="absolute inset-0 rounded-lg bg-zinc-900/40 pointer-events-none"
                        aria-hidden="true"
                    />
                    <style>
                        {`
                            @keyframes pulseAmbient {
                                0%, 100% { opacity: 0.7; filter: brightness(0.9); }
                                50% { opacity: 1; filter: brightness(1.5); }
                            }
                        `}
                    </style>
                    {/* //////////////////////////// */}

                    {/* Content  */}
                    <div className=" relative z-10 ">
                        <div className="flex p-6 gap-6 pb-8">
                            <img
                                src={currentAlbum?.imageUrl}
                                alt={currentAlbum?.title}
                                className="w-[240px] h-[240px] shadow-xl rounded"
                            />
                            <div className=" flex flex-col justify-end">
                                <p className="text-sm font-medium">
                                    Album
                                </p>
                                <h1 className="text-7xl font-bold my-4">{currentAlbum?.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-zinc-100">
                                    <span className="font-medium text-white">{currentAlbum?.artist}</span>
                                    <span>• {currentAlbum?.songs.length} songs</span>
                                    <span>• {currentAlbum?.releaseYear}</span>
                                </div>
                            </div>
                        </div>
                        {/* play button */}
                        <div className=" px-6 pb-4 flex items-center gap-6">
                            <Button onClick={() => handlePlayAlbum() } className={` w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all`}>
                                {isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                                    <Pause size={32} className="text-emerald-900" />
                                ):(
                                    <Play className="text-emerald-900" />
                                )
                                }
                            </Button>
                        </div>

                        {/* Table section */}
                        <div className=" bg-black/20">
                            {/* table header */}
                            <div className=" grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                                <div>#</div>
                                <div>Title</div>
                                <div>Released Date</div>
                                <div>
                                    <Clock className="h-4 w-4"/>
                                </div>
                            </div>
                            {/* song list */}
                            <div className=" px-6">
                                <div className=" space-y-2 py-4">
                                    {currentAlbum?.songs.map((song, index) => {
                                        const isCurrentSong = currentSong?._id === song._id
                                        return(
                                        <div
                                            key={song._id}
                                            onClick={() => handlePlaySong(index)}
                                            className=" grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                                        >
                                            <div className=" flex items-center justify-center">
                                                {isCurrentSong && isPlaying ? (
                                                    <Music className=" text-green-400"/>
                                                ):(
                                                    <span className=" group-hover:hidden">{index + 1}</span> 
                                                )}
                                                {!isCurrentSong && (
                                                    <Play className=" h-4 w-4 hidden group-hover:block" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <img src={song.imageUrl} alt={song.title} className="size-10 rounded-sm" />
                                                <div>
                                                    <div className=" font-medium text-white">{song.title}</div>
                                                    <div>{song.artist}</div>
                                                </div>
                                            </div>
                                            <div className=" flex items-center">{song.createdAt.split("T")[0]}</div>
                                            <div className=" flex items-center">{formatDuration(song.duration)}</div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </ScrollArea>
        </div>
    )
}