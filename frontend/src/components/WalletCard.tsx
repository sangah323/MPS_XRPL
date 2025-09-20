import { motion } from "framer-motion";
import { Wallet } from "../types";
import { cn } from "../utils/cn";

interface WalletCardProps {
  wallet: Wallet;
  className?: string;
}

export function WalletCard({ wallet, className }: WalletCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "card card-hover",
        wallet.type === "mps"
          ? "border-primary-200 bg-primary-50"
          : "border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
              wallet.type === "mps" ? "bg-primary-600" : "bg-gray-600"
            )}
          >
            {wallet.type === "mps" ? "M" : wallet.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
            <p className="text-sm text-gray-500 font-mono">
              {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {wallet.balance}
          </div>
          <div className="text-sm text-gray-500">MPS</div>
        </div>
      </div>
    </motion.div>
  );
}
