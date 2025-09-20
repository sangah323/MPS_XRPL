import { motion } from "framer-motion";
import { CheckCircle, XCircle, ExternalLink, Gift } from "lucide-react";
import { RewardTransaction } from "../types";

interface RewardTransactionTableProps {
  transactions: RewardTransaction[];
}

export function RewardTransactionTable({
  transactions,
}: RewardTransactionTableProps) {
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

  const truncateAddress = (address: string | undefined) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusText = (success: boolean) => {
    return success ? "Success" : "Failed";
  };

  const getStatusColor = (success: boolean) => {
    return success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            리워드 거래 내역이 없습니다
          </h3>
          <p className="text-gray-500">
            리워드 지급을 실행하면 여기에 거래 내역이 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-purple-500" />
          REWD 리워드 거래 내역
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          사용량 기준으로 지급된 REWD 토큰 거래 내역
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객사
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용량
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                리워드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주소
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                트랜잭션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(transaction.success)}
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        transaction.success
                      )}`}
                    >
                      {getStatusText(transaction.success)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.company}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {transaction.usageCount}회
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-purple-600">
                    {transaction.rewardAmount} REWD
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-mono">
                    {truncateAddress(transaction.address)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.transactionHash ? (
                    <a
                      href={`https://testnet.xrpl.org/transactions/${transaction.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
