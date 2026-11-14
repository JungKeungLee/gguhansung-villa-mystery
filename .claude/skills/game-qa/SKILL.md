---
name: game-qa
description: 꾸한성 별장 게임의 QA(변경된 챕터 중심 테스트, 저장 데이터 호환, PC·모바일 UI, 전체 회귀, 콘솔 오류·이미지 404)와 변경 전후 결과 비교. 사용자가 테스트·검증·QA를 요청할 때만 사용한다.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git status*)
  - Bash(git diff*)
  - Bash(node --check *)
  - Bash(node tests/*)
---

# game-qa

테스트 구성 설명은 `tests/README.md`에 있습니다. 브라우저 테스트에는 Chrome 또는 Edge가 필요합니다(`CHROME_PATH`로 지정 가능).

## 1. 범위 파악
`git status --short`와 `git diff --stat`으로 바뀐 파일을 확인한 뒤, 아래 표에서 **해당 테스트만 먼저** 실행합니다.

| 바뀐 파일 | 먼저 실행할 테스트 |
|---|---|
| `game.js`, `styles.css` | `node tests/logic-guide.test.js` → `node tests/browser-ch1-scene.test.js` |
| `chapter2.js`, `chapter2.css`(챕터 2~5 공통 CSS) | `node tests/logic-ch2-board.test.js` → `node tests/browser-ch2-board.test.js` → `node tests/browser-ch3-flow.test.js` |
| `chapter3.js`, `chapter3.css` | `node tests/browser-ch3-flow.test.js` |
| `chapter4.js`, `chapter4.css` | `node tests/logic-regression.test.js` → `node tests/browser-ch3-flow.test.js` |
| `chapter5.js`, `chapter5.css` | `node tests/logic-regression.test.js` |
| `assets/` 이미지, 이미지 매핑 | `node tests/logic-assets.test.js` → `node tests/browser-portraits.test.js` |
| `tests/` 자체 | 바뀐 테스트 파일 |

모든 JS는 `node --check`로 문법을 먼저 확인합니다.

## 2. 전체 회귀
대상 테스트가 통과하면 마지막에 **한 번** `node tests/run-all.js`를 실행합니다. 이 실행은 다음을 포함합니다.
- 챕터 1~5 전체 플레이(PC 1365, 모바일 390)
- 낮은 PC·태블릿 화면 검사
- 콘솔 오류·이미지 404 검사
- 새로고침 복원과 저장 호환 검사

## 3. 전후 비교
- `baseline.md`(이 폴더)의 테스트별 통과 수와 비교해 **증가, 감소, 실패**를 보고합니다.
- 실패하면 원인(게임 코드인지 테스트 환경인지)을 밝힙니다. **테스트 조건을 완화하거나 삭제하지 않습니다.**
- 전체 통과 후에만 `baseline.md`를 새 결과로 갱신합니다(테스트 개수가 바뀐 경우).

## 금지
- 게임 코드, 이미지, 저장 키를 수정하지 않습니다.
- commit, push, PR, Vercel 배포를 하지 않습니다.
