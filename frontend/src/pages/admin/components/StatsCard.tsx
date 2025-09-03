import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
}

const StatsCard = ({ bgColor, icon: Icon, iconColor, label, value }: StatsCardProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5 });
    return controls.stop;
  }, [value, count]);

  return (
    <Card className="bg-zinc-800/50 border-zinc-900 hover:bg-zinc-800/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-zinc-400">{label}</p>
            <motion.p className="text-2xl text-white font-bold">
              {rounded}
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;