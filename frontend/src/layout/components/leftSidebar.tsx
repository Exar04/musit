import PlaylistSkeleton from "@/components/skeletions/playlistSkeletion";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import { useMusicStore } from "@/stores/useMusicStore";
import { HomeIcon, Library, MessageSquareTextIcon, User } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";


export function LeftSidebar() {

    const { albums, fetchAlbums, isLoadingAlbums } = useMusicStore()

    useEffect(() => {
        fetchAlbums()
    }, [fetchAlbums])

	const popInContainerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2, // delay between each button popping
			},
		},
	}

	const popInItemVariants = {
		hidden: { opacity: 0, scale: 0.5 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring" as const,
				stiffness: 120,
				damping: 8,
			},
		},
	}

    return (
        <div className="h-full flex flex-col gap-2">
            {/* Navigation Menu */}
            <div className=" rounded-lg bg-zinc-900/80 p-4">
                <div className=" space-y-2">
                    <Link to="/"
                        className={cn(buttonVariants(
                            {
                                variant: "ghost",
                                className: "w-full justify-start hover:text-white hover:bg-zinc-800"
                            },
                        ))}
                    >
                        <HomeIcon className=" mr-2 size-5 " />
                        <span className=" hidden md:inline">Home</span>
                    </Link>
                    <Link to="/chat"
                        className={cn(buttonVariants(
                            {
                                variant: "ghost",
                                className: "w-full justify-start hover:text-white hover:bg-zinc-800"
                            },
                        ))}
                    >
                        <MessageSquareTextIcon className=" mr-2 size-5 " />
                        <span className=" hidden md:inline">Messages</span>
                    </Link>
                    <Link to="/profile"
                        className={cn(buttonVariants(
                            {
                                variant: "ghost",
                                className: "w-full justify-start hover:text-white hover:bg-zinc-800"
                            },
                        ))}
                    >
                        <User className=" mr-2 size-5 " />
                        <span className=" hidden md:inline">Profile</span>
                    </Link>
                </div>
            </div>

            {/* Library Section */}
            <div className="flex-1 rounded-lg overflow-hidden bg-zinc-900/80 p-4">
                <div className=" flex items-center justify-between mb-4">
                    <div className="flex items-center text-white px-2">
                        <Library className=" size-5 mr-2 " />
                        <span className="hidden md:inline">Playlists</span>
                    </div>
                </div>
                <ScrollArea className="h-full">
                    <div className="spacy-y-2 pb-4">
                        {isLoadingAlbums ? (
                            <PlaylistSkeleton />
                        ) : (
                            // we have to properly set the type later
                            <motion.div
                                // className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end"
                                variants={popInContainerVariants}
                                initial="hidden"
                                animate="visible">

                                {albums.map((album) => (
                                    <motion.div variants={popInItemVariants}>
                                        <Link
                                            to={`album/${album._id}`}
                                            key={album._id}
                                            className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                                        >
                                            <img src={album.imageUrl} alt="Playlist img" className=" size-12 rounded-md flex-shrink-0 object-cover " />
                                            <div className=" flex-1 min-w-0 hidden md:block">
                                                <p className="font-medium truncate">{album.title}</p>
                                                <p className=" text-sm text-zinc-400 truncate">Album  • {album.artist}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}