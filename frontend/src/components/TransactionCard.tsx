import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";
import { Transaction } from "../types";
import { cn } from "../utils/cn";

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

export function TransactionCard({
  transaction,
  className,
}: TransactionCardProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-warning-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "success":
        return "status-success";
      case "pending":
        return "status-warning";
      case "failed":
        return "status-error";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("card", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">
              {transaction.from.slice(0, 8)}...{transaction.from.slice(-8)} →{" "}
              {transaction.to.slice(0, 8)}...{transaction.to.slice(-8)}
            </h3>
            <p className="text-sm text-gray-500">
              {transaction.amount} {transaction.currency}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getStatusColor()
          )}
        >
          {transaction.status}
        </div>
      </div>

      {transaction.hash && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transaction Hash</p>
              <p className="font-mono text-sm text-gray-900 break-all">
                {transaction.hash}
              </p>
            </div>
            <a
              href={`https://testnet.xrpl.org/transactions/${transaction.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
