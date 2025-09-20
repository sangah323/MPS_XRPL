import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "gray";
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  className,
}: StatsCardProps) {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50 border-primary-200",
    success: "text-success-600 bg-success-50 border-success-200",
    warning: "text-warning-600 bg-warning-50 border-warning-200",
    gray: "text-gray-600 bg-gray-50 border-gray-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
