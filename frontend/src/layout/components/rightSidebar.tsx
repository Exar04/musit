
import { FriendsActivity } from "@/components/friendsActivity";
import { Lyrics } from "@/components/lyrics";
import { Queue } from "@/components/queue";
import { SongDetails } from "@/components/songDetails";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion"

const variants = {
  enter: { opacity: 0, scale: 1.1 },   // new one comes from slightly larger
  center: { opacity: 1, scale: 1 },    // settles into place
  exit: { opacity: 0, scale: 0.8 },    // old one shrinks away
};

const transition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
  mass: 1,
};

export function RightSidebar() {
  let content = null;
  const { activeWindow } = usePlayerStore();

  switch (activeWindow) {
    case "queue":
      content = <Queue />;
      break;
    case "songDetails":
      content = <SongDetails />;
      break;
    case "lyrics":
      content = <Lyrics />;
      break;
    case "friendsList":
      content = <FriendsActivity />;
      break;
    default:
      content = null;
  }

  return (
    <div className="w-full h-full overflow-hidden relative">
      <AnimatePresence mode="sync">
        <motion.div
          key={activeWindow}
          className="w-full h-full absolute"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
