import { useState } from "react";
import { RewardTransaction, RewardCriteria } from "../types";

export function useRewardSystem() {
  const [rewardTransactions, setRewardTransactions] = useState<
    RewardTransaction[]
  >([]);
  const [totalRewardsDistributed, setTotalRewardsDistributed] = useState(0);
  const [isRewardProcessing, setIsRewardProcessing] = useState(false);

  // REWD 토큰 발행
  const issueRewardToken = async () => {
    try {
      console.log("🎁 REWD 토큰 발행");

      const result = {
        success: true,
        message: "REWD 토큰 발행 완료",
        txHash: `rewd_issue_${Math.random().toString(36).substr(2, 16)}`,
      };

      console.log("✅ REWD 토큰 발행 성공:", result);
      return { success: true, data: result };
    } catch (error) {
      console.log("❌ REWD 토큰 발행 중 오류:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Trust Line 설정
  const setupTrustLines = async () => {
    try {
      console.log("🔗 REWD Trust Line 설정");

      const result = {
        success: true,
        message: "Trust Line 설정 완료",
        trustLines: [
          {
            company: "Company A",
            txHash: `trust_a_${Math.random().toString(36).substr(2, 16)}`,
          },
          {
            company: "Company B",
            txHash: `trust_b_${Math.random().toString(36).substr(2, 16)}`,
          },
        ],
      };

      console.log("✅ Trust Line 설정 성공:", result);
      return { success: true, data: result };
    } catch (error) {
      console.log("❌ Trust Line 설정 중 오류:", error);
      return { success: false, error: "Network error" };
    }
  };

  // 리워드 지급
  const distributeRewards = async (
    companyUsages: any[],
    criteria: RewardCriteria
  ) => {
    try {
      setIsRewardProcessing(true);
      console.log("🎁 리워드 지급 시작");
      console.log("📊 기준:", criteria);
      console.log("👥 고객사 사용량:", companyUsages);

      // 기준 충족 고객사 필터링
      const eligibleCompanies = companyUsages.filter(
        (company) => company.usageCount >= criteria.minUsageCount
      );

      console.log(`✅ 기준 충족 고객사: ${eligibleCompanies.length}개`);

      // 리워드 트랜잭션 생성
      const newRewardTransactions: RewardTransaction[] = eligibleCompanies.map(
        (company, index) => {
          const txHash = `reward_${Date.now()}_${index}`;
          const rewardAmount = parseInt(criteria.rewardAmount);

          console.log(`🎁 ${company.companyName}에게 리워드 지급 중...`);
          console.log(
            `💸 Payment: MPS → ${company.companyName} ${rewardAmount} REWD`
          );
          console.log(`🔗 트랜잭션 해시: ${txHash}`);

          return {
            id: txHash,
            company: company.companyName,
            address: company.address || `address_${index}`,
            usageCount: company.usageCount,
            rewardAmount: criteria.rewardAmount,
            success: true,
            transactionHash: txHash,
          };
        }
      );

      // 상태 업데이트
      setRewardTransactions((prev) => [...prev, ...newRewardTransactions]);
      setTotalRewardsDistributed(
        (prev) =>
          prev + eligibleCompanies.length * parseInt(criteria.rewardAmount)
      );

      console.log(
        `📊 리워드 지급 완료: ${eligibleCompanies.length}/${eligibleCompanies.length} 성공`
      );
      console.log(
        `💰 총 지급된 REWD: ${
          eligibleCompanies.length * parseInt(criteria.rewardAmount)
        }`
      );

      setIsRewardProcessing(false);

      return {
        success: true,
        message: "리워드 지급 완료",
        distributedCount: eligibleCompanies.length,
        totalAmount: eligibleCompanies.length * parseInt(criteria.rewardAmount),
      };
    } catch (error) {
      console.log("❌ 리워드 지급 중 오류:", error);
      setIsRewardProcessing(false);
      return { success: false, error: "Network error" };
    }
  };

  // 리워드 시스템 리셋
  const resetRewardSystem = () => {
    setRewardTransactions([]);
    setTotalRewardsDistributed(0);
    setIsRewardProcessing(false);
  };

  return {
    rewardTransactions,
    totalRewardsDistributed,
    isRewardProcessing,
    issueRewardToken,
    setupTrustLines,
    distributeRewards,
    resetRewardSystem,
  };
}
