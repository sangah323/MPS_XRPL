const { Client, Wallet, EscrowCreate } = require("xrpl");

/**
 * XRPL Escrow를 생성하여 조건부 정산을 설정합니다.
 *
 * @param {Client} client XRPL 클라이언트
 * @param {Wallet} mpsWallet MPS 지갑 (발행자)
 * @param {Wallet} companyWallet 고객사 지갑 (수령자)
 * @param {string} amount 정산할 MPS 토큰 수량
 * @param {string} condition 조건 해시 (사용량 기준 등)
 * @param {number} finishAfter 실행 가능 시간 (초)
 * @param {number} cancelAfter 자동 취소 시간 (초)
 */
async function createEscrow(
  client,
  mpsWallet,
  companyWallet,
  amount,
  condition,
  finishAfter,
  cancelAfter
) {
  try {
    // EscrowCreate 트랜잭션 생성
    const escrowTx = {
      TransactionType: "EscrowCreate",
      Account: mpsWallet.address,
      Destination: companyWallet.address,
      Amount: {
        currency: "MPS",
        issuer: mpsWallet.address,
        value: amount,
      },
      Condition: condition, // 조건 해시
      FinishAfter: finishAfter, // 실행 가능 시간
      CancelAfter: cancelAfter, // 자동 취소 시간
      Memos: [
        {
          Memo: {
            MemoData: Buffer.from(
              `MPS Escrow Settlement - Amount: ${amount}`,
              "utf8"
            ).toString("hex"),
          },
        },
      ],
    };

    // 트랜잭션 제출
    const response = await client.submit(escrowTx, { wallet: mpsWallet });

    if (response.result.engine_result === "tesSUCCESS") {
      console.log("Escrow 생성 성공!");
      console.log("트랜잭션 해시:", response.result.tx_json.hash);
      console.log("정산 금액:", amount, "MPS");
      console.log("수령자:", companyWallet.address);
      console.log(
        "실행 가능 시간:",
        new Date(finishAfter * 1000).toISOString()
      );
      console.log(
        "자동 취소 시간:",
        new Date(cancelAfter * 1000).toISOString()
      );

      return {
        success: true,
        txHash: response.result.tx_json.hash,
        escrowSequence: response.result.tx_json.Sequence,
        amount: amount,
        destination: companyWallet.address,
        condition: condition,
        finishAfter: finishAfter,
        cancelAfter: cancelAfter,
      };
    } else {
      console.error(
        "Escrow 생성 실패:",
        response.result.engine_result_message
      );
      return {
        success: false,
        error: response.result.engine_result_message,
      };
    }
  } catch (error) {
    console.error("Escrow 생성 중 오류:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 사용량 기반 조건 해시 생성 (예시)
 * 실제 구현에서는 더 복잡한 조건을 사용할 수 있습니다.
 */
function generateUsageCondition(minUsageCount) {
  // 실제로는 복잡한 조건 해시를 생성해야 하지만,
  // 데모용으로 간단한 문자열을 사용합니다.
  const conditionData = `usage_count >= ${minUsageCount}`;
  return Buffer.from(conditionData, "utf8").toString("hex");
}

/**
 * MPS 정산용 Escrow 생성 (전체 워크플로우)
 */
async function createMPSSettlementEscrow(
  client,
  mpsWallet,
  companyWallet,
  usageCount,
  settlementAmount
) {
  // 사용량 기준 조건 생성 (10회 이상 사용 시)
  const condition = generateUsageCondition(10);

  // 현재 시간 기준으로 설정
  const now = Math.floor(Date.now() / 1000);
  const finishAfter = now + 3600; // 1시간 후 실행 가능
  const cancelAfter = now + 86400; // 24시간 후 자동 취소

  console.log("MPS 정산 Escrow 생성 시작...");
  console.log("사용량:", usageCount, "회");
  console.log("정산 금액:", settlementAmount, "MPS");
  console.log("조건: 10회 이상 사용");

  return await createEscrow(
    client,
    mpsWallet,
    companyWallet,
    settlementAmount,
    condition,
    finishAfter,
    cancelAfter
  );
}

module.exports = {
  createEscrow,
  createMPSSettlementEscrow,
  generateUsageCondition,
};
