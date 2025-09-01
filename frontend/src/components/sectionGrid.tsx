import type { SongType } from "@/types"
import SectionGridSkeleton from "./skeletions/sectionGridSkeleton"
import { Button } from "./ui/button"
import { PlayButton } from "./playButton"

type SectionGridProps = {
    title: string
    songs: SongType[]
    isLoading: boolean
}
export const SectionGrid = ({title, songs, isLoading}: SectionGridProps) => {
    if (isLoading) return <SectionGridSkeleton />
    return (
        <div className=" mb-8">
            <div className=" flex items-center justify-between">
                <h2 className=" text-xl sm:text-2xl font-bold">{title}</h2>
                <Button variant="link" className="text-sm text-zinc-400 hover:text-white">
                    Show all
                </Button>
            </div>
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {songs.map((song) => (
                     <div key={song._id} className=" bg-zinc-800/50 rounded-md hover:bg-zinc-700/50 transition-all group cursor-pointer">
                        <div className=" relative mb-4">
                            <div className="rounded-md shadow-lg overflow-hidden">
                                <img src={song.imageUrl} alt= {song.title} className=" w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                            </div>
                            <PlayButton song={song}/>
                        </div>
                        <h3 className=" font-medium mb-2 truncate px-1"> {song.title} </h3>
                        <p className=" text-sm text-zinc-400 truncate px-1">{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}