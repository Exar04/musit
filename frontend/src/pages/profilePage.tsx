import { useAuth } from "@/context/authContext";

export function ProfilePage() {
    const { user } = useAuth();
    return (
        <div className=" w-full h-full flex items-center justify-center text-2xl font-mono">
            { user }
        </div>
    )
}