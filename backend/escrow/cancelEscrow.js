const { Client, Wallet, EscrowCancel } = require("xrpl");

/**
 * XRPL Escrow를 취소하여 락업된 자금을 되돌립니다.
 *
 * @param {Client} client XRPL 클라이언트
 * @param {Wallet} mpsWallet MPS 지갑 (발행자)
 * @param {number} escrowSequence Escrow 시퀀스 번호
 */
async function cancelEscrow(client, mpsWallet, escrowSequence) {
  try {
    // EscrowCancel 트랜잭션 생성
    const escrowTx = {
      TransactionType: "EscrowCancel",
      Account: mpsWallet.address,
      Owner: mpsWallet.address, // Escrow 소유자
      OfferSequence: escrowSequence, // Escrow 시퀀스
      Memos: [
        {
          Memo: {
            MemoData: Buffer.from(
              "MPS Escrow Settlement Cancelled",
              "utf8"
            ).toString("hex"),
          },
        },
      ],
    };

    // 트랜잭션 제출
    const response = await client.submit(escrowTx, { wallet: mpsWallet });

    if (response.result.engine_result === "tesSUCCESS") {
      console.log("Escrow 취소 성공!");
      console.log("트랜잭션 해시:", response.result.tx_json.hash);
      console.log("락업된 자금이 되돌려졌습니다");

      return {
        success: true,
        txHash: response.result.tx_json.hash,
        escrowSequence: escrowSequence,
      };
    } else {
      console.error(
        "Escrow 취소 실패:",
        response.result.engine_result_message
      );
      return {
        success: false,
        error: response.result.engine_result_message,
      };
    }
  } catch (error) {
    console.error("Escrow 취소 중 오류:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * MPS 정산용 Escrow 취소 (전체 워크플로우)
 */
async function cancelMPSSettlementEscrow(
  client,
  mpsWallet,
  escrowSequence,
  reason = "Conditions not met"
) {
  console.log("MPS 정산 Escrow 취소 시작...");
  console.log("취소 사유:", reason);
  console.log("Escrow 시퀀스:", escrowSequence);

  return await cancelEscrow(client, mpsWallet, escrowSequence);
}

module.exports = {
  cancelEscrow,
  cancelMPSSettlementEscrow,
};
