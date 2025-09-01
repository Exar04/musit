import { usePlayerStore } from "@/stores/usePlayerStore";
import type { SongType } from "@/types";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

export const PlayButton = ({ song }: { song: SongType }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = () => {
		if (isCurrentSong) togglePlay();
		else setCurrentSong(song);
	};

	return (
		<Button
			size={"sm"}
			onClick={handlePlay}
			className={`absolute rounded-md bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className='size-4 text-emerald-900' />
			) : (
				<Play className='size-4 text-emerald-900' />
			)}
		</Button>
	);
};