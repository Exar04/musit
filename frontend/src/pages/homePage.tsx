import { FeaturedSection } from "@/components/featuredSection"
import { SectionGrid } from "@/components/sectionGrid"
import { useMusicStore } from "@/stores/useMusicStore"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect } from "react"
import { usePlayerStore } from "@/stores/usePlayerStore"

export const HomePage = () => {
    const { 
        fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs,
        isLoadingMadeForYouSongs, isLoadingTrendingSongs,
        madeForYouSongs, trendingSongs, featuredSongs
    } = useMusicStore()

    const { initalizeQueue } = usePlayerStore()

    useEffect(() => {
        fetchFeaturedSongs()
        fetchMadeForYouSongs()
        fetchTrendingSongs()
    },[ fetchFeaturedSongs, fetchTrendingSongs, fetchMadeForYouSongs])

    useEffect(() => {
        if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0 ){
            const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs]
            initalizeQueue(allSongs)
        }
    }, [madeForYouSongs, trendingSongs, featuredSongs, initalizeQueue])

    return (
        <main className="h-full rounded-lg bg-gradient-to-b from-zinc-900 to bg-zinc-950">
            <ScrollArea className="h-full" >
                <div className=" p-4 sm:p-6">
                    <h1 className=" text-2xl sm:text-3xl font-bold mb-6">
                        Good afternoon
                    </h1>
                    <FeaturedSection />
                </div>
                <div className=" space-y-8 px-6">
                    <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoadingMadeForYouSongs} />
                    <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoadingTrendingSongs} />
                </div>
            </ScrollArea>
        </main>
    )
}