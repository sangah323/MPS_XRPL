import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  ExternalLink,
  Music,
  Zap,
  Shield,
  BarChart3,
  DollarSign,
  Users,
  Activity,
  Gift,
} from "lucide-react";
import { useSettlement } from "./hooks/useSettlement";
import { useRewardSystem } from "./hooks/useRewardSystem";
import { usePagination } from "./hooks/usePagination";
import { WalletCard } from "./components/WalletCard";
import { TransactionTable } from "./components/TransactionTable";
import { UsageCard } from "./components/UsageCard";
import { ProcessingAnimation } from "./components/ProcessingAnimation";
import { StatsCard } from "./components/StatsCard";
import { Pagination } from "./components/Pagination";
import { RewardControlPanel } from "./components/RewardControlPanel";
import { RewardTransactionTable } from "./components/RewardTransactionTable";

function App() {
  const {
    wallets,
    settlements,
    transactions,
    usageRecords,
    isProcessing,
    totalSettled,
    currentStep,
    simulateSettlement,
    resetSettlement,
    totalPlayCount,
  } = useSettlement();

  const {
    rewardTransactions,
    totalRewardsDistributed,
    isRewardProcessing,
    issueRewardToken,
    setupTrustLines,
    distributeRewards,
    resetRewardSystem,
  } = useRewardSystem();

  const companyWallets = wallets.filter((w) => w.type === "company");
  const countedUsage = usageRecords.filter((u) => u.isCounted);

  // Usage Records pagination
  const usagePagination = usePagination({
    totalItems: usageRecords.length,
    itemsPerPage: 6,
  });

  const paginatedUsageRecords = usageRecords.slice(
    usagePagination.startIndex,
    usagePagination.endIndex
  );

  // 리워드 지급 함수
  const handleDistributeRewards = async (criteria: any) => {
    const companyUsages = companyWallets.map((wallet, index) => ({
      companyId: `COMPANY_${String.fromCharCode(65 + index)}`,
      companyName: wallet.name,
      address: wallet.address,
      usageCount: Math.floor(Math.random() * 20) + 5, // 테스트용 랜덤 사용량
    }));

    await distributeRewards(companyUsages, criteria);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Music className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MPS</h1>
                <p className="text-gray-300">XRPL 기반 자동 정산 시스템</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://testnet.xrpl.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors bg-white bg-opacity-10 px-3 py-2 rounded-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>XRPL Explorer</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MPS Dashboard */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                🎵 MPS Dashboard
              </h2>
              <p className="text-gray-600">
                음악 데이터 API 제공 및 XRPL 기반 자동 정산 서비스
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {wallets.find((w) => w.type === "mps")?.balance || 0}
                </div>
                <div className="text-sm text-gray-600">MPS 잔액</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalSettled}
                </div>
                <div className="text-sm text-gray-600">총 수익 (MPS)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {companyWallets.length}
                </div>
                <div className="text-sm text-gray-600">활성 고객사</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {totalPlayCount}
                </div>
                <div className="text-sm text-gray-600">총 재생 수</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Settled"
            value={`${totalSettled} MPS`}
            icon={<DollarSign className="w-6 h-6" />}
            color="success"
          />
          <StatsCard
            title="Companies"
            value={companyWallets.length}
            icon={<Users className="w-6 h-6" />}
            color="primary"
          />
          <StatsCard
            title="Total Plays"
            value={totalPlayCount}
            icon={<Music className="w-6 h-6" />}
            color="warning"
          />
          <StatsCard
            title="Transactions"
            value={transactions.length}
            icon={<Activity className="w-6 h-6" />}
            color="gray"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Customer Wallets Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Customer Wallets
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              MPS 서비스를 사용하는 고객사들의 지갑 잔액
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              {/* Company A, B만 */}
              {companyWallets.map((wallet) => (
                <WalletCard key={wallet.address} wallet={wallet} />
              ))}
            </div>
          </div>

          {/* Demo Control Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Demo Control
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              XRPL 기반 자동 정산 시스템 데모를 위한 컨트롤 패널입니다. 실제
              운영에서는 고객사의 음악 사용량이 자동으로 수집되어 정산됩니다.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Demo control panel for XRPL-based automated settlement system. In
              actual operation, customer music usage is automatically collected
              and settled.
            </p>
            <ProcessingAnimation currentStep={currentStep} />

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={simulateSettlement}
                disabled={isProcessing || currentStep === "processing"}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Start Settlement</span>
              </button>
              <button
                onClick={resetSettlement}
                disabled={isProcessing}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Transactions Section - Full Width */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              XRPL Transactions
            </h2>
            <TransactionTable transactions={transactions} />
          </div>

          {/* Reward System Section */}
          <div className="min-h-[400px]">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-purple-500" />
              REWD Reward System
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              사용량 기준 리워드 지급 시스템 (10회 이상 사용 시 50 REWD 지급)
            </p>
            <RewardControlPanel
              onDistributeRewards={handleDistributeRewards}
              isProcessing={isRewardProcessing}
              totalRewardsDistributed={totalRewardsDistributed}
              rewardTransactions={rewardTransactions}
              onInitialize={() => {}}
              onReset={resetRewardSystem}
            />
            <RewardTransactionTable transactions={rewardTransactions} />
          </div>

          {/* Usage Records Section */}
          <div className="min-h-[400px]">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Music className="w-5 h-5 mr-2 text-green-500" />
              Music Usage Records
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              고객사들의 음악 사용 기록 (1분 이상 재생 시 MPS 토큰으로 정산)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[250px]">
              {" "}
              {/* Company A, B만 */}
              {paginatedUsageRecords.length > 0 ? (
                paginatedUsageRecords.map((usage, index) => (
                  <UsageCard key={index} usage={usage} />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-[250px] text-gray-500">
                  <div className="text-center">
                    <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      음악 사용 기록이 없습니다
                    </p>
                    <p className="text-sm">
                      Start Settlement 버튼을 눌러 정산을 시작하세요
                    </p>
                  </div>
                </div>
              )}
            </div>
            {paginatedUsageRecords.length > 0 && (
              <Pagination
                currentPage={usagePagination.currentPage}
                totalPages={usagePagination.totalPages}
                onPageChange={usagePagination.goToPage}
                onNextPage={usagePagination.goToNextPage}
                onPreviousPage={usagePagination.goToPreviousPage}
                onFirstPage={usagePagination.goToFirstPage}
                onLastPage={usagePagination.goToLastPage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
