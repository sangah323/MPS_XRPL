import { motion } from "framer-motion";
import {
  Gift,
  Play,
  RotateCcw,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { RewardCriteria } from "../types";

interface RewardControlPanelProps {
  isProcessing: boolean;
  onInitialize: () => void;
  onDistributeRewards: (criteria: RewardCriteria) => void;
  onReset: () => void;
  totalRewardsDistributed: number;
  rewardTransactions: any[];
}

export function RewardControlPanel({
  isProcessing,
  onInitialize,
  onDistributeRewards,
  onReset,
  totalRewardsDistributed,
  rewardTransactions,
}: RewardControlPanelProps) {
  const defaultCriteria: RewardCriteria = {
    minUsageCount: 10,
    rewardAmount: "50",
    reason: "usage-10-count",
  };

  const handleDistributeRewards = () => {
    onDistributeRewards(defaultCriteria);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              REWD 리워드 시스템
            </h2>
            <p className="text-sm text-gray-600">
              사용량 기준 리워드 토큰 지급 시스템
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {totalRewardsDistributed}
          </div>
          <div className="text-sm text-gray-600">총 지급된 REWD</div>
        </div>
      </div>

      {/* 리워드 기준 표시 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          현재 리워드 기준
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">최소 사용량:</span>
            <span className="ml-2 font-medium">
              {defaultCriteria.minUsageCount}회
            </span>
          </div>
          <div>
            <span className="text-gray-600">리워드 금액:</span>
            <span className="ml-2 font-medium">
              {defaultCriteria.rewardAmount} REWD
            </span>
          </div>
          <div>
            <span className="text-gray-600">지급 사유:</span>
            <span className="ml-2 font-medium">{defaultCriteria.reason}</span>
          </div>
        </div>
      </div>

      {/* 처리 상태 표시 */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                리워드 지급 처리 중...
              </h4>
              <p className="text-sm text-blue-700">
                XRPL 트랜잭션을 실행하고 있습니다
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 시스템 상태 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-green-900">
                시스템 상태
              </div>
              <div className="text-sm text-green-700">
                {rewardTransactions && rewardTransactions.length > 0
                  ? "활성화됨"
                  : "대기 중"}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-blue-900">거래 내역</div>
              <div className="text-sm text-blue-700">
                {rewardTransactions.length}건
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onInitialize}
          disabled={isProcessing}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Settings className="w-4 h-4" />
          <span>시스템 초기화</span>
        </button>

        <button
          onClick={handleDistributeRewards}
          disabled={isProcessing}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>리워드 지급</span>
        </button>

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="flex-1 btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          <span>초기화</span>
        </button>
      </div>

      {/* 설명 텍스트 */}
      <div className="mt-6 text-sm text-gray-600">
        <p className="mb-2">
          <strong>시스템 초기화:</strong> REWD 토큰 발행 및 Trust Line 설정
        </p>
        <p className="mb-2">
          <strong>리워드 지급:</strong> 사용량 10회 이상인 고객사에게 50 REWD
          지급
        </p>
        <p>
          <strong>초기화:</strong> 모든 리워드 거래 내역 삭제
        </p>
      </div>
    </div>
  );
}
