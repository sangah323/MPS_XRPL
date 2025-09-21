const { Client, Wallet, EscrowFinish } = require("xrpl");

/**
 * XRPL Escrow를 실행하여 조건부 정산을 완료합니다.
 *
 * @param {Client} client XRPL 클라이언트
 * @param {Wallet} mpsWallet MPS 지갑 (발행자)
 * @param {number} escrowSequence Escrow 시퀀스 번호
 * @param {string} condition 조건 해시
 * @param {string} fulfillment 조건 충족 증명
 */
async function finishEscrow(
  client,
  mpsWallet,
  escrowSequence,
  condition,
  fulfillment
) {
  try {
    // EscrowFinish 트랜잭션 생성
    const escrowTx = {
      TransactionType: "EscrowFinish",
      Account: mpsWallet.address,
      Owner: mpsWallet.address, // Escrow 소유자
      OfferSequence: escrowSequence, // Escrow 시퀀스
      Condition: condition, // 원본 조건
      Fulfillment: fulfillment, // 조건 충족 증명
      Memos: [
        {
          Memo: {
            MemoData: Buffer.from(
              "MPS Escrow Settlement Completed",
              "utf8"
            ).toString("hex"),
          },
        },
      ],
    };

    // 트랜잭션 제출
    const response = await client.submit(escrowTx, { wallet: mpsWallet });

    if (response.result.engine_result === "tesSUCCESS") {
      console.log("Escrow 실행 성공!");
      console.log("트랜잭션 해시:", response.result.tx_json.hash);
      console.log("조건 충족 증명 완료");
      console.log("정산 완료");

      return {
        success: true,
        txHash: response.result.tx_json.hash,
        escrowSequence: escrowSequence,
        condition: condition,
        fulfillment: fulfillment,
      };
    } else {
      console.error(
        "Escrow 실행 실패:",
        response.result.engine_result_message
      );
      return {
        success: false,
        error: response.result.engine_result_message,
      };
    }
  } catch (error) {
    console.error("Escrow 실행 중 오류:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 사용량 조건 충족 증명 생성 (예시)
 * 실제 구현에서는 더 복잡한 증명을 사용할 수 있습니다.
 */
function generateUsageFulfillment(actualUsageCount) {
  // 실제로는 복잡한 조건 충족 증명을 생성해야 하지만,
  // 데모용으로 간단한 문자열을 사용합니다.
  const fulfillmentData = `usage_count: ${actualUsageCount}`;
  return Buffer.from(fulfillmentData, "utf8").toString("hex");
}

/**
 * MPS 정산용 Escrow 실행 (전체 워크플로우)
 */
async function finishMPSSettlementEscrow(
  client,
  mpsWallet,
  escrowSequence,
  condition,
  actualUsageCount
) {
  // 사용량 조건 충족 증명 생성
  const fulfillment = generateUsageFulfillment(actualUsageCount);

  console.log("MPS 정산 Escrow 실행 시작...");
  console.log("실제 사용량:", actualUsageCount, "회");
  console.log(
    "조건 충족 여부:",
    actualUsageCount >= 10 ? "충족" : "미충족"
  );

  if (actualUsageCount < 10) {
    console.log("사용량이 부족하여 Escrow를 실행할 수 없습니다.");
    return {
      success: false,
      error: "Usage count insufficient (minimum 10 required)",
    };
  }

  return await finishEscrow(
    client,
    mpsWallet,
    escrowSequence,
    condition,
    fulfillment
  );
}

module.exports = {
  finishEscrow,
  finishMPSSettlementEscrow,
  generateUsageFulfillment,
};
