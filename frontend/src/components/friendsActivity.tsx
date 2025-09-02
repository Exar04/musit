import { useAuth } from "@/context/authContext"
import { useChatStore } from "@/stores/useChatStore"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Music, PlusIcon, Users } from "lucide-react"
import { useEffect } from "react"
import { Avatar } from "./ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"


function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate an HSL color for consistency
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 40%)`; // tweak saturation/lightness as needed
}

export const FriendsActivity = () => {
    const { users, fetchUsers } = useChatStore()
    const {user} = useAuth() 

    useEffect(() => {
        if (user) fetchUsers()
    }, [fetchUsers, user])

    const isPlaying = true

    return (
        <div className="w-full h-full bg-zinc-900/80 rounded-lg flex flex-col">
            <div className=" p-4 flex justify-between items-center bg-zinc-800/70 rounded-t-lg">
                <div className=" flex items-center gap-2 justify-between w-full">
                    <div className=" flex items-center gap-2">
                        <Users className="size-5 shrink-0" />
                        <h2 className=" font-extralight font-mono text-xs">Friends listening to</h2>
                    </div>
                    <div className=" bg-white/50 hover:bg-white rounded-md hover:scale-115 hover:rotate-180 duration-150">
                        <PlusIcon className=" text-zinc-700 size-6 hover:rotate-180 duration-300"/>
                    </div>
                    {/* we will use this icon when we implement qr feature */}
                    {/* <QrCode className=" text-zinc-500 h-5 w-5 hover:text-white"/> */}
                </div>
            </div>
            {!user && <LoginPrompt />}
            <ScrollArea className=" flex-1">
                <div className=" p-1 space-y-4">
                    {users.map((user) => {
                        const firstLetter = user.username?.[0]?.toUpperCase() ?? "?";
                        const bgColor = !user.imageUrl ? stringToColor(firstLetter) : undefined;

                        return (
                        <div  key={user._id} className=" cursor-pointer hover:bg-zinc-800/50 p-1 px-2 rounded-md transition-colors group">
                            <div className=" flex items-start gap-3">
                                <div className=" relative">
                                    <Avatar style={{ backgroundColor: bgColor }} className=" size-10 border border-zinc-700 bg-zinc-800">
                                        <AvatarImage src={user.imageUrl} alt={user.username}/>
                                        <AvatarFallback className="flex items-center justify-center w-full text-xl font-mono ">{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className=" absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-500" aria-hidden="true"/>
                                </div>
                                <div className=" flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-white">
                                            {user.username}
                                        </span>
                                        {isPlaying && <Music className="size-3.5 text-emerald-400 shrink-0"/>} 
                                    </div>
                                    {isPlaying ? (
                                        <div className="mt-1">
                                            <div className=" mt-1 text-sm text-white font-medium truncate">
                                                Cardigan
                                            </div>
                                            <div className=" text-xs text-zinc-400 truncate">by Taylor Swift</div>
                                        </div>
                                    ) : (
                                        <div className="mt-1 text-xs text-zinc-400">Idle</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </ScrollArea>
        </div>
    )
}

const LoginPrompt = () => {
    return (
        <div className="h-full w-full flex justify-center font-bold text-xl font-sans items-center">
            Please Login First
        </div>
    )
}