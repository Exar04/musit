import { LayoutDashboardIcon, LogOutIcon, MusicIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export function Topbar() {
    const { logout, user } = useAuth();
    const {isAdmin} = useAuthStore()
    console.log("admin : ", isAdmin)
    return (
        <div className="flex p-2 mx-2 mt-1 items-center justify-between sticky top-0 bgzy-900
      backdrop-blur-md z-10 font-mono bg-zinc-900/80 border  border-zinc-800 rounded-lg">
            <div className="text-white text-xl font-semibold flex gap-1 items-center"> <MusicIcon color="black" className="bg-zinc-200  rounded-full p-1 w-10"/> Musit</div>
            <div className="flex items-center gap-3">
                <div className="text-white  font-bold">Welcome {user}</div>
                {isAdmin &&
                    <Button variant={"secondary"} className="text-sm p-2 h-8">
                        <Link to={"/admin"} className="flex items-center">
                            <LayoutDashboardIcon className="size-4 mr-2" />
                            Admin DashBoard
                        </Link>
                    </Button>
                }
                <Button onClick={logout} variant={"secondary"} className="border-zinc-200 h-8">
                    <LogOutIcon />
                    Logout
                </Button>
            </div>
        </div>
    )
}