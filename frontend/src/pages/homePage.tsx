import { FeaturedSection } from "@/components/featuredSection"
import { SectionGrid } from "@/components/sectionGrid"
import { useMusicStore } from "@/stores/useMusicStore"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect } from "react"

export const HomePage = () => {
    const { 
        fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs,
        isLoadingFeaturedSongs, isLoadingMadeForYouSongs, isLoadingTrendingSongs,
        featuredSongs, madeForYouSongs, trendingSongs
    } = useMusicStore()

    useEffect(() => {
        fetchFeaturedSongs()
        fetchMadeForYouSongs()
        fetchTrendingSongs()
    },[ fetchFeaturedSongs, fetchTrendingSongs, fetchMadeForYouSongs])

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