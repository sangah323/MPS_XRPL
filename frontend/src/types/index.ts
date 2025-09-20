export interface Wallet {
  address: string;
  name: string;
  balance: number;
  type: "mps" | "company";
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  hash?: string;
  timestamp: Date | string;
}

export interface Settlement {
  companyId: string;
  companyName: string;
  usageCount: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  transaction?: Transaction;
}

export interface UsageRecord {
  id: string;
  companyId: string;
  company: string;
  trackId: string;
  trackName: string;
  duration: number;
  playCount: number;
  isCounted: boolean;
  timestamp: Date | string;
}

export interface RewardTransaction {
  id: string;
  company: string;
  address: string;
  usageCount: number;
  rewardAmount: string;
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface RewardCriteria {
  minUsageCount: number;
  rewardAmount: string;
  reason: string;
}

export interface DashboardState {
  wallets: Wallet[];
  settlements: Settlement[];
  transactions: Transaction[];
  usageRecords: UsageRecord[];
  isProcessing: boolean;
  totalSettled: number;
  currentStep: "before" | "processing" | "after";
  // 리워드 시스템 관련
  rewardTransactions: RewardTransaction[];
  totalRewardsDistributed: number;
  isRewardProcessing: boolean;
}
