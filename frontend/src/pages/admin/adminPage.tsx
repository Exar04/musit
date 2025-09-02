import { useAuthStore } from "@/stores/useAuthStore";
import DashboardStats from "./components/DashboardStats.tsx";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent.tsx";
import AlbumsTabContent from "./components/AlbumsTabContent.tsx";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Topbar } from "@/components/Topbar.tsx";

export const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div className='min-h-screen bg-zinc-900/20 text-zinc-100'>
			<Topbar />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6 p-2'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 text-white'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 text-white'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs' >
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};