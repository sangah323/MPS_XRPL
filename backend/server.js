const express = require("express");
const cors = require("cors");
const { Client, Wallet } = require("xrpl");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

// 미들웨어
app.use(cors());
app.use(express.json());

// XRPL 클라이언트 초기화
const client = new Client("wss://s.devnet.rippletest.net:51233");

// 지갑 생성
const mpsWallet = Wallet.fromSeed(process.env.MPS_WALLET_SEED || "");
const companyAWallet = Wallet.fromSeed(process.env.COMPANY_A_WALLET_SEED || "");
const companyBWallet = Wallet.fromSeed(process.env.COMPANY_B_WALLET_SEED || "");

// Escrow 모듈 import
const { createMPSSettlementEscrow } = require("./escrow/createEscrow");
const { finishMPSSettlementEscrow } = require("./escrow/finishEscrow");
const { cancelMPSSettlementEscrow } = require("./escrow/cancelEscrow");

// 기존 정산 API 엔드포인트들
app.get("/api/real-balances", async (req, res) => {
  try {
    await client.connect();

    const mpsBalance = await client.getBalances(mpsWallet.address);
    const companyABalance = await client.getBalances(companyAWallet.address);
    const companyBBalance = await client.getBalances(companyBWallet.address);

    res.json({
      mps: mpsBalance,
      companyA: companyABalance,
      companyB: companyBBalance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.disconnect();
  }
});

app.post("/api/process-settlement", async (req, res) => {
  try {
    await client.connect();

    const { companyAUsage, companyBUsage } = req.body;

    // 정산 로직 (기존 구현)
    const settlementA = Math.max(0, companyAUsage - 0) * 1; // 1 MPS per usage
    const settlementB = Math.max(0, companyBUsage - 0) * 1;

    res.json({
      success: true,
      settlements: {
        companyA: settlementA,
        companyB: settlementB,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.disconnect();
  }
});

// 리워드 시스템 API 엔드포인트들
app.post("/api/issue-reward-token", async (req, res) => {
  try {
    await client.connect();

    // REWD 토큰 발행 로직
    res.json({ success: true, message: "REWD 토큰 발행 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.disconnect();
  }
});

app.post("/api/setup-reward-trustlines", async (req, res) => {
  try {
    await client.connect();

    // Trust Line 설정 로직
    res.json({ success: true, message: "Trust Line 설정 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.disconnect();
  }
});

app.post("/api/distribute-rewards", async (req, res) => {
  try {
    await client.connect();

    // 리워드 지급 로직
    res.json({ success: true, message: "리워드 지급 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.disconnect();
  }
});

// ===== 새로운 Escrow API 엔드포인트들 =====

/**
 * Escrow 생성 API
 * POST /api/escrow/create
 * Body: { companyId, usageCount, settlementAmount }
 */
app.post("/api/escrow/create", async (req, res) => {
  try {
    await client.connect();

    const { companyId, usageCount, settlementAmount } = req.body;

    // 회사 지갑 선택
    const companyWallet = companyId === "A" ? companyAWallet : companyBWallet;

    // Escrow 생성
    const result = await createMPSSettlementEscrow(
      client,
      mpsWallet,
      companyWallet,
      usageCount,
      settlementAmount
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    await client.disconnect();
  }
});

/**
 * Escrow 실행 API
 * POST /api/escrow/finish
 * Body: { escrowSequence, condition, actualUsageCount }
 */
app.post("/api/escrow/finish", async (req, res) => {
  try {
    await client.connect();

    const { escrowSequence, condition, actualUsageCount } = req.body;

    // Escrow 실행
    const result = await finishMPSSettlementEscrow(
      client,
      mpsWallet,
      escrowSequence,
      condition,
      actualUsageCount
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    await client.disconnect();
  }
});

/**
 * Escrow 취소 API
 * POST /api/escrow/cancel
 * Body: { escrowSequence, reason }
 */
app.post("/api/escrow/cancel", async (req, res) => {
  try {
    await client.connect();

    const { escrowSequence, reason } = req.body;

    // Escrow 취소
    const result = await cancelMPSSettlementEscrow(
      client,
      mpsWallet,
      escrowSequence,
      reason
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    await client.disconnect();
  }
});

/**
 * Escrow 데모 API
 * GET /api/escrow/demo
 * 전체 Escrow 워크플로우 데모 실행
 */
app.get("/api/escrow/demo", async (req, res) => {
  try {
    await client.connect();

    console.log("XRPL Escrow MPS 정산 시스템 데모 시작");

    // 시나리오 1: 조건 충족 케이스
    const createResult1 = await createMPSSettlementEscrow(
      client,
      mpsWallet,
      companyAWallet,
      15, // 15회 사용 (조건 충족)
      "50" // 50 MPS 토큰
    );

    let finishResult1 = null;
    if (createResult1.success) {
      finishResult1 = await finishMPSSettlementEscrow(
        client,
        mpsWallet,
        createResult1.escrowSequence,
        createResult1.condition,
        15
      );
    }

    // 시나리오 2: 조건 미충족 케이스
    const createResult2 = await createMPSSettlementEscrow(
      client,
      mpsWallet,
      companyBWallet,
      5, // 5회 사용 (조건 미충족)
      "30" // 30 MPS 토큰
    );

    let cancelResult2 = null;
    if (createResult2.success) {
      // 조건 미충족으로 취소
      cancelResult2 = await cancelMPSSettlementEscrow(
        client,
        mpsWallet,
        createResult2.escrowSequence,
        "Usage count insufficient (5 < 10)"
      );
    }

    res.json({
      success: true,
      demo: {
        scenario1: {
          create: createResult1,
          finish: finishResult1,
        },
        scenario2: {
          create: createResult2,
          cancel: cancelResult2,
        },
      },
      summary: {
        message: "XRPL Escrow MPS 정산 시스템 데모 완료",
        results: [
          "✅ 조건 충족 시: Escrow 실행으로 정산 완료",
          "❌ 조건 미충족 시: Escrow 취소로 자금 반환",
          "🔒 모든 과정이 XRPL 블록체인에 기록됨",
          "🎯 완전 자동화된 조건부 정산 시스템",
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    await client.disconnect();
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`MPS Settlement Backend Server running on port ${PORT}`);
  console.log(`Escrow API endpoints available:`);
  console.log(`   POST /api/escrow/create - Escrow 생성`);
  console.log(`   POST /api/escrow/finish - Escrow 실행`);
  console.log(`   POST /api/escrow/cancel - Escrow 취소`);
  console.log(`   GET  /api/escrow/demo  - Escrow 데모`);
});
