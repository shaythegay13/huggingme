import { motion } from "framer-motion";

interface EnergyBarProps {
  level: number;
  maxLevel?: number;
  size?: "sm" | "md";
}

const EnergyBar = ({ level, maxLevel = 10, size = "md" }: EnergyBarProps) => {
  const percentage = (level / maxLevel) * 100;
  const height = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 overflow-hidden rounded-full bg-secondary ${height}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`gradient-primary ${height} rounded-full`}
        />
      </div>
      <span className="text-xs font-semibold text-primary">{level}/{maxLevel}</span>
    </div>
  );
};

export default EnergyBar;
