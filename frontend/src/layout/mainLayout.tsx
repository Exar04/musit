import { Outlet } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable";
import { LeftSidebar } from "./components/leftSidebar";
import { Topbar } from "@/components/Topbar";
import { RightSidebar } from "./components/rightSidebar";
import { AudioPlayer } from "./components/audioPlayer";
import { PlaybackControls } from "./components/playbackControls";

function MainLayout() {
  const isMobile = false
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <Topbar />
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
        <AudioPlayer />
       {/* left sidebar  */}
        <ResizablePanel defaultSize={22} minSize={isMobile? 0: 10} maxSize={30}>
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

        {/* Main Content */}
        <ResizablePanel defaultSize={isMobile ? 80: 60} >
          <Outlet />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

        {/* right sidebar  */}
        <ResizablePanel defaultSize={20} minSize={0} maxSize={30} collapsedSize={0}>
          <RightSidebar />
        </ResizablePanel>

      </ResizablePanelGroup>
      <PlaybackControls />
    </div>
  )
}

export default MainLayout;