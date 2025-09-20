import { useState, useEffect } from "react";
import { DashboardState } from "../types";

const MOCK_DATA = {
  wallets: [
    {
      address: "rNepkZxadM2nmsPS3F1cFP52y3zHDrMdSP",
      name: "MPS Wallet",
      balance: 8000,
      type: "mps" as const,
    },
    {
      address: "rBDpD6kiPPJqmLaJL2d3ZVpPDhebBjQ62Y",
      name: "Company A",
      balance: 8000,
      type: "company" as const,
    },
    {
      address: "rMHUw6UsTscxf3StFF2QjJDstQt5aj6z6E",
      name: "Company B",
      balance: 8000,
      type: "company" as const,
    },
  ],
  settlements: [],
  transactions: [],
  usageRecords: [],
};

export function useSettlement() {
  const [state, setState] = useState<DashboardState>({
    wallets: MOCK_DATA.wallets,
    settlements: MOCK_DATA.settlements,
    transactions: MOCK_DATA.transactions,
    usageRecords: MOCK_DATA.usageRecords,
    totalSettled: 0,
    isProcessing: false,
    currentStep: "before",
  });

  // 실제 XRPL 잔액 조회
  const fetchRealBalances = async () => {
    try {
      console.log("🔄 잔액 조회 시작");
      const response = await fetch("http://localhost:3002/api/real-balances");
      console.log("📡 잔액 조회 응답:", response.status, response.ok);

      if (response.ok) {
        const balances = await response.json();
        console.log("✅ 잔액 조회 성공:", balances);

        if (balances.success && balances.balances) {
          setState((prev) => ({
            ...prev,
            wallets: prev.wallets.map((wallet) => {
              const realBalance = balances.balances.find(
                (b: any) => b.address === wallet.address
              );
              return {
                ...wallet,
                balance: realBalance
                  ? parseFloat(realBalance.xrpBalance)
                  : wallet.balance,
              };
            }),
          }));
        }
      } else {
        console.log("❌ 잔액 조회 실패:", response.status);
      }
    } catch (error) {
      console.log("❌ 잔액 조회 에러:", error);
    }
  };

  // 컴포넌트 마운트 시 잔액 조회
  useEffect(() => {
    fetchRealBalances();
  }, []);

  // 정산 시뮬레이션
  const simulateSettlement = async () => {
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      currentStep: "processing",
    }));

    // 1. 음악 사용량 시뮬레이션
    const newUsageRecords = [
      {
        id: `usage_${Date.now()}_1`,
        companyId: "COMPANY_A",
        companyName: "Company A",
        songTitle: "Song A1",
        duration: 120, // 2분 (카운트됨)
        timestamp: new Date(),
        isCounted: true,
      },
      {
        id: `usage_${Date.now()}_2`,
        companyId: "COMPANY_A",
        companyName: "Company A",
        songTitle: "Song A2",
        duration: 45, // 45초 (카운트 안됨)
        timestamp: new Date(),
        isCounted: false,
      },
      {
        id: `usage_${Date.now()}_3`,
        companyId: "COMPANY_A",
        companyName: "Company A",
        songTitle: "Song A3",
        duration: 90, // 1.5분 (카운트됨)
        timestamp: new Date(),
        isCounted: true,
      },
      {
        id: `usage_${Date.now()}_4`,
        companyId: "COMPANY_B",
        companyName: "Company B",
        songTitle: "Song B1",
        duration: 180, // 3분 (카운트됨)
        timestamp: new Date(),
        isCounted: true,
      },
      {
        id: `usage_${Date.now()}_5`,
        companyId: "COMPANY_B",
        companyName: "Company B",
        songTitle: "Song B2",
        duration: 30, // 30초 (카운트 안됨)
        timestamp: new Date(),
        isCounted: false,
      },
      {
        id: `usage_${Date.now()}_6`,
        companyId: "COMPANY_B",
        companyName: "Company B",
        songTitle: "Song B3",
        duration: 95, // 1.5분 (카운트됨)
        timestamp: new Date(),
        isCounted: true,
      },
    ];

    // 2. 정산 데이터 생성
    const newSettlements = [
      {
        id: `settlement_${Date.now()}_1`,
        from: "Company A",
        to: "MPS",
        amount: "3",
        currency: "MPS",
        timestamp: new Date().toISOString(),
        status: "completed",
      },
      {
        id: `settlement_${Date.now()}_2`,
        from: "Company B",
        to: "MPS",
        amount: "5",
        currency: "MPS",
        timestamp: new Date().toISOString(),
        status: "completed",
      },
    ];

    // 3. 트랜잭션 데이터 생성
    const processedTransactions = [
      {
        id: `tx_${Date.now()}_1`,
        from: "Company A",
        to: "MPS",
        amount: "5",
        currency: "MPS",
        timestamp: new Date().toISOString(),
        status: "completed",
        hash: `tx_${Math.random().toString(36).substr(2, 64)}`,
      },
      {
        id: `tx_${Date.now()}_2`,
        from: "Company B",
        to: "MPS",
        amount: "6",
        currency: "MPS",
        timestamp: new Date().toISOString(),
        status: "completed",
        hash: `tx_${Math.random().toString(36).substr(2, 64)}`,
      },
    ];

    // 4. 상태 업데이트
    setState((prev) => ({
      ...prev,
      usageRecords: newUsageRecords,
      transactions: [...prev.transactions, ...processedTransactions],
      settlements: [...prev.settlements, ...newSettlements],
      totalSettled: prev.totalSettled + 11,
      wallets: prev.wallets.map((wallet) => {
        if (wallet.type === "mps") {
          return { ...wallet, balance: wallet.balance + 11 };
        }
        return wallet;
      }),
      isProcessing: false,
      currentStep: "completed",
    }));

    // 5. 잔액 다시 조회
    setTimeout(() => {
      fetchRealBalances();
    }, 1000);
  };

  // 정산 리셋
  const resetSettlement = () => {
    setState((prev) => ({
      ...prev,
      settlements: [],
      transactions: [],
      usageRecords: [],
      totalSettled: 0,
      isProcessing: false,
      currentStep: "before",
    }));

    // 잔액 다시 조회
    setTimeout(() => {
      fetchRealBalances();
    }, 500);
  };

  return {
    ...state,
    simulateSettlement,
    resetSettlement,
    fetchRealBalances,
  };
}
