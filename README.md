# 꾸한성: 안개 속 별장

시청자 한 명이 꾸한성 멤버 10명과 산속 별장을 여행하다 사건을 마주하고, 증거를 직접 연결해 진실을 밝히는 팬 추리 게임입니다.
모든 등장인물의 대사와 사건은 현실 인물과 관련 없는 팬게임용 허구입니다.

## 구현 상태

| 챕터 | 페이지 | 내용 | 상태 |
|---|---|---|---|
| 1 | `index.html` | 여행·대화·탐색, 22:24 정전으로 마무리 | ✅ 완료 |
| 2 | `chapter2.html` | 사건 발생·신고, 증거 연결 퍼즐 P01~P03 (2개 이상 해결 시 완료) | ✅ 완료 |
| 3 | `chapter3.html` | 진술 반박, 시간 퍼즐 P04~P06, 사건 시간표 | ✅ 완료 |
| 4 | `chapter4.html` | 장소 7곳 조사, 퍼즐 P07~P10, 거짓말 이유 분류 P11 | ✅ 완료 |
| 5 | `chapter5.html` | 시간표 6칸 → 8칸 재구성 → 3개 반박 → **BAD / NORMAL / TRUE END** | ✅ 완료 (챕터 4 완료 후 진입) |

- 기술: 프레임워크·빌드 없는 정적 HTML/CSS/바닐라 JavaScript. 챕터마다 `chapterN.html/js/css` 한 세트.
- 진행 기록은 브라우저 `localStorage`에 자동 저장되며, 다음 챕터는 이전 챕터 기록(닉네임·증거)을 읽어 이어 갑니다.
- 챕터 5 엔딩마다 전용 일러스트를 사용합니다: `assets/backgrounds/ch5-bad-ending.webp`(좌절), `ch5-normal-ending.webp`(남은 의문), `ch5-true-ending.webp`(함께 귀가).

### AI 질문 기능 상태

- **챕터 2**: 질문 탭이 Vercel 서버리스 함수 `api/gemini-chat.js`(Gemini API)에 연결되어 있습니다. 서버에 `GEMINI_API_KEY` 환경변수가 없거나 호출이 실패하면 자동으로 **오프라인 규칙 답변**으로 대체되어 게임 진행에는 영향이 없습니다. **운영 환경에서 실제 Gemini 응답·사용량 제한·비용은 별도로 검증해야 합니다.**
- **챕터 3~5**: 질문 기능은 서버 호출이 없는 오프라인 규칙 데모입니다.

### 알려진 제한

- 정답 판정이 공개 JavaScript 안에 있어 개발자 도구로 소스를 보면 결말을 미리 알 수 있습니다(서버 판정으로 옮기기 전까지 기술적으로 숨길 수 없음).
- 챕터 2~5에는 진행 초기화 버튼이 없습니다. 초기화하려면 브라우저 개발자 도구 → Application → Local Storage에서 아래 키를 삭제합니다.

| 저장 키 | 챕터 |
|---|---|
| `gguhansung-fog-villa-save-v2` | 1 |
| `gguhansung-fog-villa-ch2-v1` ~ `gguhansung-fog-villa-ch5-v1` | 2 ~ 5 |

## 로컬 실행

정적 웹서버로 프로젝트 폴더를 열어 주세요(`file://`로 직접 열기보다 저장 동작이 안정적입니다).

```bash
python -m http.server 8000
# 또는: npx serve .
```

브라우저에서 `http://localhost:8000/` 을 엽니다. 로컬 정적 서버에서는 `/api/gemini-chat`이 없으므로 챕터 2 질문은 오프라인 답변으로 동작합니다.
AI 질문까지 로컬에서 확인하려면 Vercel CLI(`vercel dev`)와 `GEMINI_API_KEY` 환경변수가 필요합니다.

## 자동화 테스트

외부 패키지 없이 **Node.js 22 이상**으로 실행합니다. 브라우저 테스트에는 Chrome 또는 Edge가 필요합니다(`CHROME_PATH`로 경로 지정 가능).

```bash
node tests/run-all.js              # JS 문법 검사 + 로직 테스트 + 브라우저 테스트(PC 1365px·모바일 390px)
node tests/run-all.js --no-browser # 브라우저 없이 문법·로직 테스트만
```

- 로직 테스트: 챕터 5 엔딩 판정, 저장 호환, 이미지 매핑·경로(대소문자 포함) 검사
- 브라우저 테스트: 빈 저장 상태에서 챕터 1 → 5 엔딩(BAD·NORMAL·TRUE)까지 실제 플레이, 새로고침 복원, 오답 처리, 초상화·증거 이미지, 콘솔 오류·404 검사
- 자세한 내용: [tests/README.md](tests/README.md) — 테스트 파일에는 정답(스포일러)이 들어 있습니다.

## 배포

`main`에 병합하면 연결된 Vercel 프로젝트가 자동 배포합니다(`vercel.json`: `cleanUrls`).
정적 게임은 환경변수 없이 동작하며, 챕터 2 Gemini 질문을 사용하려면 Vercel 프로젝트에 `GEMINI_API_KEY`를 설정해야 합니다.

## 이미지 파일 위치

- 멤버: `assets/characters/<slug>/{normal,surprised,night,avatar}.webp`
  멤버 키: `kkutinyu`, `nanwoni`, `kimokdok`, `manjo`, `yappu`, `moya`, `harunotsuki`, `yuntami`, `yamuji`, `damyu`
- 외부인(표정별): `assets/characters/{lee-yuna,jang-doyun,yoon-haejun}/{normal,night,surprised}.webp`
  night·surprised 원본은 상반신 이미지라 대화창에서 CSS로 확대·정렬합니다(`chapter2.css` 하단).
- 외부인(1장): `assets/characters/guests/{taesung,dosik,serin}.webp` — [README_GUESTS.md](README_GUESTS.md)
- 배경: `assets/backgrounds/`, 증거 사진: `assets/evidence/`

각 캐릭터의 원본 PNG는 2026-11-10 업로드된 `1.zip`이며, 해당 파일로부터 투명 배경을 정리한 게임용 WebP 파생 이미지를 사용했습니다.

## 변경 이력

### 버그 수정·이미지 개선·QA (2026-11-11)
- 챕터 5: 반박 단계에서 최종 추리 답(범인·증거·숨은 진실)을 바꾸면 최종 추리를 다시 검증받도록 수정. 엔딩 판정 규칙은 그대로.
- 챕터 1: 완료 후 '타이틀로 돌아가기' 동작 수정. 저장 기록이 있을 때 '여행 시작'은 초기화 확인창을 먼저 표시. 이미 기록한 단서를 다시 볼 때 설명문을 플레이어 대사가 아닌 내레이션으로 표시.
- 챕터 3: 기록 탭 '보기'에서도 증거 이미지 표시.
- 챕터 4: E13(분전반 로그)은 C07 확인 후 최도식에게 요청해야 열리도록 순서 수정(이미 획득한 저장 데이터는 유지).
- 챕터 2·3: 이유나·장도윤·윤해준 초상화 연결, 관리실 장면에 `management.webp` 배경 적용.
- 챕터 5: 엔딩 3종 전용 이미지 적용, 이미지 전체 구도가 잘리지 않도록 배치 변경.
- 외부인 night·surprised 초상화가 대화창에서 작게 보이던 문제를 CSS로 보정(원본 이미지 변경 없음).
- `tests/` 자동화 테스트 추가.

### 별장 실내 배경 업데이트
- `assets/backgrounds/living.webp`(거실), `kitchen.webp`(주방·식당), `corridor.webp`(1층 복도), `terrace.webp`(테라스)
- 현관(기존 SVG)을 유지하고, 복도를 별도 장소로 추가. 기존 자동 저장 키 및 대사 진행 상태 유지
- 이미지 최적화: 1400×788 WebP, quality 77. 정전 단계에는 CSS로 밝기를 살짝 낮춥니다.

### 캐릭터 대화·장소 연출 개선 (v1.4)
- 멤버 이미지 뒤 장식 글자 제거
- 캐릭터 이미지를 미리 불러오고 디코딩한 뒤 대사와 함께 출력
- 나레이션은 이름과 이미지 없는 텍스트 전용 대화창
- 시간대별 멤버 장소 배치 및 화면 내 캐릭터 버튼, 친구 찾기 위치 안내와 이동

### CHAPTER 03 — 엇갈리는 증언
- 오세린 서재 진술 모순 지적, 정전 지속 시간(P04), 사건 시간대(P05), 두 번째 CCTV 오차(P06)를 증거로 검증합니다.
- 이전 챕터의 7분 오차를 검증하지 않았다면 P00에서 다시 확인할 수 있습니다.
- 다섯 사건의 시간표를 직접 완성하고 저장할 수 있습니다.

### CHAPTER 04 · 05
- 챕터 4: [README_CH4.md](README_CH4.md)
- 챕터 5: **6개 사건 시간표**, **8칸 범행 재구성**, **시간·경로·동기 증거 3축**, **3개의 최종 반박**. BAD END 이후 재시도 가능. [README_CH5.md](README_CH5.md)
