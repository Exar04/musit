import { usePlayerStore } from "@/stores/usePlayerStore";

export function SongDetails() {
  	const { currentSong } = usePlayerStore();
    return (
        <div className=" w-full h-full flex items-center justify-center text-2xl font-mono text-zinc-400 bg-zinc-900/80 rounded-lg">
            {currentSong?.title}
        </div>
    )
}