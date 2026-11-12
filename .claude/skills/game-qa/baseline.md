# game-qa 기준 결과

- 기준 시점: 2026-11-12
- 브랜치: `fix/ch3-ux-and-ai-review` (main `01bdee7` + 미커밋 챕터 2~4 UI 수정)
- 명령: `node tests/run-all.js` → 종료 코드 0

| 테스트 | 통과 |
|---|---|
| JS 문법 검사 | 21개 파일 |
| logic-regression | 49 |
| logic-assets | 46 |
| logic-guide | 43 |
| logic-ch2-board | 56 |
| browser-portraits | 94 |
| browser-guide | 78 |
| browser-ch1-scene | 176 |
| browser-ch2-board | 236 |
| browser-ch3-flow | 252 |
| browser-playthrough | 332 |
| **합계** | **1,362** |
