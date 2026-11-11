# 테스트

외부 패키지 설치 없이 **Node.js 22 이상**만으로 실행합니다(내장 `fetch`·`WebSocket`·`http` 사용).
브라우저 테스트는 설치된 **Chrome 또는 Edge**를 헤드리스로 실행합니다.

```bash
node tests/run-all.js              # 문법 검사 + 로직 테스트 + 브라우저 테스트 전체
node tests/run-all.js --no-browser # Chrome 없이 문법·로직 테스트만
```

> ⚠️ 테스트 코드와 `tests/lib/saves.js`에는 퍼즐·엔딩 정답이 들어 있습니다(스포일러).

## 구성

| 파일 | 내용 | 브라우저 |
|---|---|---|
| `logic-regression.test.js` | 1차 버그 수정 회귀 검사: 챕터 5 엔딩 판정·반박 단계 재검증, 챕터 1 타이틀 버튼·저장 보호, 챕터 3 기록 탭 증거 이미지, 챕터 4 E13 획득 순서 | 불필요 |
| `logic-assets.test.js` | 2차 작업 검사: 외부인 초상화 매핑, 관리실 배경, 챕터 5 엔딩 이미지 구조, 참조 이미지 경로의 존재·대소문자 정확 일치 | 불필요 |
| `browser-portraits.test.js` | 대화창 초상화 실측(PC 1365px·모바일 390px): 외부인 night/surprised 상반신 크기·잘림, 멤버·normal 이미지 기존 방식 유지 | 필요 |
| `browser-playthrough.test.js` | 빈 저장 상태에서 챕터 1 → 5 엔딩(BAD → NORMAL → TRUE)까지 실제 버튼 조작으로 플레이. 챕터마다 새로고침 복원, 오답 처리, 대화·증거 창, 이미지 로드, 다음 챕터 진입, 가로 스크롤, 콘솔 오류·404 검사 | 필요 |
| `tools/portrait-bounds.js` | (분석 도구) 캐릭터 WebP의 실제 인물 영역·투명 여백 측정 | 필요 |
| `lib/browser.js` | Chrome DevTools Protocol 도우미 + 정적 서버(대소문자 구분, Vercel/Linux와 동일) | |
| `lib/fake-dom.js` | 브라우저 없이 챕터 스크립트를 실행하는 가짜 DOM | |
| `lib/saves.js` | 테스트용 저장 데이터와 정답 | |

## 옵션

- 브라우저 경로 지정: 환경변수 `CHROME_PATH` (없으면 OS 기본 설치 경로에서 Chrome → Edge 순으로 찾음)
- 스크린샷 저장: `node tests/browser-playthrough.test.js --shots <폴더>` (`browser-portraits.test.js`도 동일)
- 한 화면만: `node tests/browser-playthrough.test.js --only pc` 또는 `--only mobile`

브라우저 테스트는 임시 폴더에 별도 브라우저 프로필을 만들고 끝나면 삭제하므로, 평소 쓰는 브라우저의 저장 데이터에는 영향이 없습니다.

## 한계

- 버튼은 `element.click()`으로 누릅니다. 클릭 로직과 화면 결과는 검증하지만, 손가락 터치 영역 크기 같은 실제 조작감은 확인하지 않습니다.
- 챕터 2의 AI 질문(`/api/gemini-chat`)은 Vercel 함수가 필요하므로 테스트하지 않습니다(로컬에서는 오프라인 답변으로 대체됨).
