# 꾸한성: 안개 속 별장 — 프로젝트 안내

꾸한성 멤버 10명과 별장에서 사건을 추리하는 정적 웹 게임입니다. 빌드는 없습니다(HTML/CSS/바닐라 JS). Vercel `main` 브랜치에서 자동 배포됩니다.

## 주요 파일
- 챕터별 코드: `index.html` + `game.js` + `styles.css`(챕터 1), `chapterN.html/js/css`(챕터 2~5). `chapter2.css`는 챕터 2~5가 함께 씁니다.
- 이미지: `assets/characters/`(인물), `assets/backgrounds/`(배경·엔딩), `assets/evidence/`(증거)
- 질문: 선택형 Q&A(`qa-data.js` 데이터 + `qa-core.js` 처리, 챕터 2~4). AI·서버 호출 없음. PR #9(AI 질문)는 이 방식으로 대체 예정이며 병합하지 않은 상태입니다.

## 기준 문서
스포일러가 포함되어 있으며, 필요할 때 해당 부분만 읽습니다.
- 공식 설정: `docs/STORY_CANON.md` — 인물, 시간표, 결정 대기 목록(D#), 설정 충돌(F#)
- 증거 이미지 명세: `docs/EVIDENCE_IMAGE_SPEC.md`
- 이전 정밀 분석: `docs/STORY_AUDIT.md` — 이미 조사한 내용이므로 다시 분석하지 않고 ID로 인용합니다.

## 테스트
- 전체: `node tests/run-all.js` (Chrome 없이: `--no-browser`)
- 테스트별 설명: `tests/README.md`

## 증거 이미지 합성 도구
- `tools/evidence-compose/`: AI 바탕 그림 위에 정확한 글자·시각·등록번호를 합성합니다. 문자열은 SPEC §4 데이터, 등록번호는 CANON에서 읽습니다.
- `node tools/evidence-compose/compose.js check | sample | render <ID> --base <그림>` → 결과는 `output-preview/`(Git 제외). `assets/`에는 쓰지 않으며, 게임 이미지 교체는 승인 후 합니다. 자세한 사용법: 폴더의 `README.md`

## 프로젝트 전용 Skill (`.claude/skills/`)
- `story-audit`: 스토리·시간표·동선·엔딩 일관성 검토
- `evidence-audit`: 증거 이미지와 명세 대조, 제작 명세 제공
- `game-qa`: 변경 영역 테스트, 전체 회귀, 기준 결과와 비교

## 보호 규칙
- 사용자가 명시적으로 요청하지 않는 한 스토리·대사, 퍼즐 정답·필수 증거, 엔딩 판정, localStorage 저장 키·구조(`gguhansung-fog-villa-*`)를 바꾸지 않습니다.
- 기존 이미지는 승인 없이 삭제하거나 교체하지 않습니다.
- 테스트 조건을 완화하거나 삭제해서 통과시키지 않습니다.
- 커밋하지 않은 수정을 덮어쓰지 않습니다.

## Git
- commit, push, PR 생성·병합, Vercel 배포는 사용자가 승인한 경우에만 합니다.
- force push와 `main` 직접 push는 하지 않습니다. PR #9는 수정하지 않습니다.
