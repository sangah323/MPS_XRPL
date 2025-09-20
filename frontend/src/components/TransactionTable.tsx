import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import { Transaction } from "../types";
import { usePagination } from "../hooks/usePagination";
import { Pagination } from "./Pagination";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  } = usePagination({
    totalItems: transactions.length,
    itemsPerPage: 5,
  });

  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Success";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const now = new Date();
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="address-avatar blue">
                      {transaction.from.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {truncateAddress(transaction.from)}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="address-avatar green">
                      {transaction.to.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {truncateAddress(transaction.to)}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {transaction.amount}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {transaction.currency}
                    </span>
                  </div>
                </td>
                <td>
                  <div className={`status-badge ${transaction.status}`}>
                    {getStatusIcon(transaction.status)}
                    {getStatusText(transaction.status)}
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-500">
                    {formatTime(transaction.timestamp)}
                  </span>
                </td>
                <td>
                  <a
                    href={`https://testnet.xrpl.org/transactions/${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors font-mono"
                  >
                    <span>
                      {transaction.hash
                        ? transaction.hash.slice(0, 8) + "..."
                        : "N/A"}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
        onFirstPage={goToFirstPage}
        onLastPage={goToLastPage}
      />

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No transactions yet
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Start settlement to see transactions
          </p>
        </div>
      )}
    </div>
  );
}
