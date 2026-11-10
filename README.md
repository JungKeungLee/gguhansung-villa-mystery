# 꾸한성: 안개 속 별장 — CHAPTER 01

시청자 한 명과 꾸한성 멤버 10명이 산속 별장을 방문하는 팬게임 프로토타입입니다.

## 로컬 실행

`index.html`을 브라우저로 열거나, 정적 웹서버를 실행합니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000/`을 열면 됩니다.

## 구현 범위

- CH1 여행·대화·탐색·정전 엔딩
- 닉네임 및 자동 저장(`localStorage`)
- 꾸한성 10명별 기본/놀람/밤 복장의 게임용 WebP 30장
- 대화 상대 선택용 미니 프로필 WebP 10장
- 발화 캐릭터에 따라 대화창 이미지 자동 전환, `complete` 시 놀란 표정, `night` 장면은 야간 복장
- CH2~5, AI 질문·심문 기능은 아직 미구현

## 이미지 파일 위치

`assets/characters/<slug>/{normal,surprised,night,avatar}.webp`

각 캐릭터의 원본 PNG는 2026-11-10 업로드된 `1.zip`이며, 해당 파일로부터 투명 배경을 정리한 게임용 WebP 파생 이미지를 사용했습니다. WebP 원본을 변경하거나 새 캐릭터를 생성하지 않았습니다.

멤버 키: `kkutinyu`, `nanwoni`, `kimokdok`, `manjo`, `yappu`, `moya`, `harunotsuki`, `yuntami`, `yamuji`, `damyu`.

## 배포 및 QA

정적 파일 배포이므로 추가 프레임워크 및 환경변수가 필요하지 않습니다. `main`에 병합하면 연결된 Vercel 프로젝트가 새 커밋을 자동 배포합니다.

이미지 경로와 GIF가 아닌 WebP 40개를 검증했고, JavaScript 구문 검사(`node --check game.js`)를 통과했습니다.

모든 등장인물의 대사와 사건은 현실 인물과 관련 없는 팬게임용 허구입니다.

## 별장 실내 배경 업데이트

- `assets/backgrounds/living.webp`: 거실
- `assets/backgrounds/kitchen.webp`: 주방·식당
- `assets/backgrounds/corridor.webp`: 새 탐색 장소인 1층 복도
- `assets/backgrounds/terrace.webp`: 테라스
- 기존 별장 외관/메인 배너/캐릭터 이미지는 변경하지 않음
- 현관(기존 SVG)을 유지하고, 복도를 별도 장소로 추가
- 기존 자동 저장 키 및 대사 진행 상태 유지

이미지 최적화: 1400×788 WebP, quality 77. 정전 단계에는 CSS로 밝기를 살짝 낮춥니다.
