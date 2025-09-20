# MPS XRPL Settlement System

XRPL 기반 자동 정산 시스템으로 음악 데이터 API 제공 및 투명한 정산 서비스를 제공합니다.

## 🎯 프로젝트 개요

MPS (Music Platform Service)는 XRPL 블록체인을 활용한 자동 정산 시스템입니다. 고객사들이 음악 API를 사용할 때 발생하는 사용량을 실시간으로 추적하고, XRPL 네트워크를 통해 투명하고 자동화된 정산을 수행합니다.

## ✨ 주요 기능

### 1. 자동 정산 시스템
- **실시간 사용량 추적**: 고객사의 음악 API 사용량을 실시간으로 모니터링
- **XRPL 기반 정산**: XRPL Devnet을 통한 투명한 정산 처리
- **IOU 토큰 시스템**: MPS 토큰을 통한 정산 및 리워드 지급

### 2. 리워드 시스템
- **사용량 기반 리워드**: 10회 이상 사용 시 50 REWD 토큰 지급
- **자동화된 지급**: 기준 충족 시 자동으로 리워드 토큰 전송
- **투명한 기록**: 모든 리워드 지급 내역이 XRPL에 기록

### 3. 실시간 대시보드
- **지갑 잔액 모니터링**: 실시간 XRP 및 IOU 토큰 잔액 확인
- **거래 내역 추적**: 모든 정산 및 리워드 거래 내역 표시
- **사용량 통계**: 고객사별 음악 사용량 및 정산 현황

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Company A     │    │   Company B     │    │   MPS Server    │
│                 │    │                 │    │                 │
│ Music Usage     │    │ Music Usage     │    │ Usage Tracking  │
│ API Calls       │    │ API Calls       │    │ Settlement      │
│                 │    │                 │    │ XRPL Proxy      │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    XRPL Devnet       │
                    │                      │
                    │ • MPS IOU Token      │
                    │ • Trust Lines        │
                    │ • Payment Transactions│
                    │ • Transparent Records│
                    └──────────────────────┘
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/mps-settlement.git
cd mps-settlement
```

### 2. 의존성 설치
```bash
# 루트 디렉토리
npm install

# 백엔드
cd backend
npm install

# 프론트엔드
cd ../frontend
npm install
```

### 3. 환경변수 설정
```bash
# .env 파일 생성
touch .env

# 환경변수 설정
MPS_WALLET_SEED=your_mps_wallet_seed
COMPANY_A_WALLET_SEED=your_company_a_seed
COMPANY_B_WALLET_SEED=your_company_b_seed
```

### 4. 서버 실행
```bash
# 백엔드 서버 (터미널 1)
cd backend
npm start

# 프론트엔드 서버 (터미널 2)
cd frontend
npm run dev
```

### 5. 접속
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3002

## 📋 API 엔드포인트

### 정산 관련
- `GET /api/real-balances` - 실시간 잔액 조회
- `POST /api/process-settlement` - 정산 처리

### 리워드 관련
- `POST /api/issue-reward-token` - REWD 토큰 발행
- `POST /api/setup-reward-trustlines` - Trust Line 설정
- `POST /api/distribute-rewards` - 리워드 지급

## 🎬 데모 사용법

### 1. 정산 시스템 데모
1. **"Start Settlement"** 버튼 클릭
2. 고객사들의 음악 사용량 시뮬레이션
3. XRPL 트랜잭션을 통한 자동 정산 처리
4. 거래 내역 및 통계 확인

### 2. 리워드 시스템 데모
1. **"시스템 초기화"** 버튼 클릭 (REWD 토큰 발행)
2. **"리워드 지급"** 버튼 클릭
3. 사용량 기준 리워드 자동 지급
4. 리워드 거래 내역 확인

## 🔧 기술 스택

### Frontend
- **React 18** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션

### Backend
- **Node.js** - 런타임 환경
- **Express** - 웹 프레임워크
- **XRPL.js** - XRPL 블록체인 연동
- **CORS** - 크로스 오리진 요청 처리

### Blockchain
- **XRPL Devnet** - 테스트 네트워크
- **IOU 토큰** - MPS, REWD 토큰
- **Trust Lines** - 토큰 신뢰 관계
- **Payment** - 토큰 전송

## 📊 주요 특징

### 투명성
- 모든 정산 내역이 XRPL 블록체인에 기록
- XRPL Explorer에서 실시간 확인 가능
- 감사 추적 완벽 지원

### 자동화
- API 사용량 기반 자동 정산
- 1분 이상 재생된 곡만 카운트
- 수동 개입 최소화

### 확장성
- 다중 고객사 지원
- IOU 토큰 기반 유연한 정산
- Web2 + Web3 하이브리드 구조

## 🔗 XRPL Explorer

모든 트랜잭션을 실시간으로 확인할 수 있습니다:
- **Testnet Explorer**: https://testnet.xrpl.org/

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**MPS XRPL Settlement System** - 음악 산업의 투명한 정산을 위한 블록체인 솔루션 🎵✨