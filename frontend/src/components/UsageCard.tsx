import { motion } from "framer-motion";
import { Music, Clock } from "lucide-react";
import { UsageRecord } from "../types";
import { cn } from "../utils/cn";

interface UsageCardProps {
  usage: UsageRecord;
}

export function UsageCard({ usage }: UsageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "usage-card flex items-center justify-between p-4 bg-white rounded-lg border", // CSS 클래스 적용
        usage.isCounted ? "border-success-200 bg-success-50" : "border-gray-200"
      )}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <Music className="w-5 h-5 text-green-400 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="track-name font-medium text-gray-900">
            {usage.trackName}
          </p>
          <p className="company-info text-sm text-gray-500">
            {usage.companyId} • {usage.playCount}회 재생
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{usage.duration}s</span>
        </div>

        <div className="text-right w-20">
          <div className="text-sm font-medium text-gray-900">
            {usage.isCounted ? `${usage.playCount} MPS` : "0 MPS"}
          </div>
          <div className="text-xs text-gray-500">
            {usage.isCounted ? "정산됨" : "미정산"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
