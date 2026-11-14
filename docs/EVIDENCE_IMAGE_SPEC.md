# 증거 이미지 제작 명세서 (EVIDENCE IMAGE SPEC)

> 스포일러를 포함합니다.
> - **공식 설정은 `docs/STORY_CANON.md`(이하 CANON)에서만 관리합니다.** 이 문서는 CANON을 가리키고, 이미지 제작에 필요한 구도·금지 요소·문자열만 담습니다.
> - 현재 이미지 문제의 근거: `docs/STORY_AUDIT.md` 8장
> - 파일 경로는 저장소 루트 기준입니다.
> - `{D#}` 표기는 CANON E-2장의 **결정 대기** 항목입니다. 값이 정해지기 전에는 그 요소를 화면에 넣지 않거나, 해당 이미지 제작을 미룹니다.
> - 정확한 문자열·시각·참조 자료는 **§4 데이터 블록**이 유일한 원본입니다. 합성 도구(`tools/evidence-compose/`)가 이 블록을 직접 읽습니다.

## 0. 공통 규칙

1. **인물:** CANON C장의 기준 스프라이트와 구별 포인트를 따릅니다. 장면 그림은 기준이 아닙니다.
   - 특히 윤해준↔꾸티뉴, 다뮤_↔윤타미를 주의합니다.
   - 강석훈은 {D12}가 정해지기 전에는 얼굴이 식별되지 않게 그립니다.
2. **날짜:** CANON E-1 D1·D2를 따라 날짜·연도·요일을 넣지 않습니다.
   - 늦가을 밤 장면에 눈이나 낮 하늘을 넣지 않습니다.
   - 문서·기사의 날짜 칸은 두지 않거나, 숫자가 하나도 읽히지 않게 합니다.
3. **이름:** CANON D3을 따라 빌라명, 고유명칭, 지명, 주소, 현장명을 넣지 않습니다.
4. **거실:** CANON A장의 「대표 거실」, 「거실 방위」, 「거실 벽시계 위치」, 「거실 CCTV CH-03」 행을 따릅니다(D11·D16).
   - 대리석 벽난로와 원형 대리석 테이블은 쓰지 않습니다.
   - 밤 장면의 창밖은 어둡고 비가 내리는 모습으로 그립니다. `living.webp`의 노을 하늘을 그대로 쓰지 않습니다.
5. **NVR 화면 UI:** §4 `_nvr_ui` 문자열과 합성 도구의 `nvr` 템플릿 하나로 E02와 E03을 같게 만듭니다. 기준은 현재 E02의 배치입니다.
6. **정답 직접 노출 금지:** 범인 실명, "피의자", 이름 강조 표시를 넣지 않습니다. 등록번호를 어디에 얼마나 보일지는 CANON B장의 **등록번호 표시 범위 표**를 따릅니다.
7. **실존 정보 금지:** 실제 주소, 전화번호, 도메인, 회사명, 신문사명을 쓰지 않습니다. 필요하면 `010-0000-0000`, `example.com` 형식을 씁니다.
8. **라벨:** 새 이미지에는 증거 라벨("E11 | …")을 넣지 않습니다.
9. **형식:** WebP, 1448×1086(4:3), 기존 파일명으로 교체합니다. 게임은 `object-fit:contain`으로 표시합니다(`chapter3~5.css`).
10. **글자:** 이미지 속 글자, 숫자, UI 문구는 AI로 그리지 않습니다. AI는 **글자 없는 바탕 그림**만 만들고, 글자는 합성 도구로 넣습니다(§4).

**프롬프트 공통 규칙**
- 프롬프트는 영어로 씁니다(이미지 생성 모델의 정확도 때문).
- 각 ID의 참조 이미지(§4 `refs`)를 함께 넣습니다. 목록은 `node tools/evidence-compose/compose.js refs <ID>`로 확인합니다.
- 모든 프롬프트 끝에 아래 공통 금지어를 붙입니다.

```
NEGATIVE (common): any text, letters, numbers, captions, watermark, logo, signature, date,
calendar, snow, daytime sky at night, real brand names, red highlight boxes, extra people
not listed, marble fireplace, round marble coffee table
```

---

## 1. P0 대상 9장과 제작 가능 상태

D17 확정으로 E02·E04a가 추가되어 **9장**입니다. `상태`는 §4 데이터의 `status`와 같습니다.

| ID | 파일 | 핵심 문제 (CANON F#) | 제작 가능 상태 | 남은 조건 |
|---|---|---|---|---|
| C10 | c10-construction-log.webp | 다른 현장, 실명 강조 (F2) | **적용 완료** (PR #12) | — |
| E10 | e10-accident-report.webp | 부상·부실·실명·연도 (F3, F24) | **적용 완료** (PR #12) | — |
| C04 | c04-accident-news.webp | 다른 장소·부상·부실 (F4) | **적용 완료** (PR #12) | — |
| E07 | e07-ohserin-interview-recording.webp | 다른 녹음 (F7) | **적용 완료** (PR #12) | — |
| E15 | e15-burned-document.webp | 다른 문서·번호 (F1) | **적용 완료** (PR #12) | — (촬영 위치 A안) |
| E03 | e03-nvr-wallclock-223413.webp | 윤해준 없음, 다른 거실 (F5, F22, F23) | **적용 완료** (2026-11-14, E02 비교 통과: 밝기 2.5%·채도 4.6%·구조 약 12px) | E02 완성 후 같은 CCTV·거실로 보이는지 최종 비교. 게임 미교체 |
| E02 | e02-living-room-cctv-2205.webp | 다른 거실 (F22, F26) | **v3 적용(2026-11-14), 알려진 문제 있음**: 만조·하루노츠키·꾸티뉴 외형이 E04a와 다름 | CH-03 v2 + 확정된 E04a(셀카)와 같은 순간. 준비물 `work/e02/v2/`. 최종 이미지 생성은 별도 승인 |
| E04a | e04a-group-photo-2212.webp | — | **원본 확정** (2026-11-13, `final-original`) | 현재 게임 이미지(SHA-256 `bd6fc9e4…`)를 그대로 사용. 재생성·AI 수정·합성 금지 |
| E04d | e04d-group-photo-2250.webp | E04a 복제, 셀카 구도 (F6, F25) | **바로 제작 가능** (`ready`) | D18 확정(2026-11-13): 김옥독·만조·윤타미·난워니·야무지. CH-03 기준 장면은 필요 없음(시점이 다름) |

P1·P2는 §3에 있습니다. 2차 대상(새 증거 E17·E18·C11, 재제작 C02·E14)은 §2-3과 §3에 있고, 전체 제작 순서는 §5에 있습니다.

---

## 2. P0 상세 명세 (15항목)

공통으로 3번 「새 파일명」은 **같은 파일명으로 교체**, 4번 「크기·비율」은 **1448×1086, 4:3, WebP**입니다. 다른 경우만 적었습니다.

### 2-1. 문서·기록형

#### C10 — 과거 공사 일지

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | C10 (챕터 4 창고) |
| 2 | 기존 경로 | `assets/evidence/c10-construction-log.webp` |
| 5 | 배경·장소 | 창고 선반 위에 펼쳐진 낡은 공사 일지 한 페이지. 물 얼룩이 있고 **날짜 칸은 번져서 판독 불가**(D2) |
| 6·7 | 인물 / 금지 | 없음 / 모든 인물 |
| 8 | 참조 | §4 `C10.refs`(창고 배경) |
| 9 | 필수 내용 | 머리말, 공사명, 표(날짜·작업 내용·확인). 다른 줄은 모두 번진 흐린 글씨이고, **한 줄만 또렷함**: 옹벽 구간 안전점검과 검사 담당 기술자 등록번호(전체), 그 옆에 판독 불가 서명 |
| 10 | 시각 | 없음 |
| 11 | 문자열 | §4 `C10` |
| 12 | 금지 | 날짜·연도, 인쇄된 실명, 빨간 박스·밑줄, 리조트 등 다른 현장명, 지역명, 회사명 |
| 13 | 퍼즐 | 챕터 4 P10(`required`) / 챕터 5 동기 근거(인정) / 반박 3(C01과 대조) |
| 14 | 기존 수정점 | "백운산 리조트 신축공사, 강원도 화천군, (주)대현건설" 삭제, 윤해준 실명과 빨간 박스 삭제. 번호 값은 유지 |
| 15 | 완성 후 확인 | 도구 자동 검사 + 번진 줄이 정말 읽히지 않는지(사람 확인) |

```
PROMPT: An old hard-cover construction site logbook lying open on a wooden shelf in a dim
storeroom (match the reference storeroom), one ruled page facing the camera, seen almost
straight on. The page is a clean table grid with three columns. Most cells contain faded,
water-stained, completely illegible blurred handwriting only. Leave the header area and
the fourth row clean and blank for later text. Water stain rings, foxing, worn corners.
```

#### E10 — 사고 보고서 사본

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E10 (챕터 4 거실·이유나, 챕터 5) |
| 2 | 기존 경로 | `assets/evidence/e10-accident-report.webp` |
| 5 | 배경·장소 | 어두운 나무 탁자 위의 흑백 복사지 한 장. **아래쪽은 복사 범위 밖으로 잘림**(코드: "원문 전체는 공개되지 않았다") |
| 6·7 | 인물 / 금지 | 없음 / 모든 인물, 서류를 든 손 |
| 8 | 참조 | 없음. 번호 글꼴은 C10 결과와 비교 |
| 9 | 필수 내용 | 제목, 공사명, 사고 구분, 피해, 공식 원인, 현장 책임자(이름 **검게 가림**), 안전점검 실무 확인(**등록번호 전체**), 판독 불가 서명, `사본` 도장 |
| 10 | 시각 | **없음.** 발생일·보고일 칸을 두지 않음 |
| 11 | 문자열 | §4 `E10` |
| 12 | 금지 | 날짜·연도, 사망자 수, "부상", "부실", 실명, 고유명칭·주소, 이름 강조, "협박"·"은폐"(D7), 강석훈의 직함(D6) |
| 13 | 퍼즐 | 챕터 4 P10, P11(이유나) / 챕터 5 동기 근거(**단독으로 인정되므로 번호가 온전해야 함**) |
| 14 | 기존 수정점 | 실명 2회 가림, "1명 부상" → "작업자 사망", 부실 원인 → 폭우, 보고일 2015-07-21 삭제(F24), "청명산 별장" 삭제 |
| 15 | 완성 후 확인 | 도구 자동 검사 + 가림 칸 아래 글자가 비치지 않는지(사람 확인) |

```
PROMPT: Top-down photo of a single photocopied report sheet lying on a dark wooden table,
slightly grey photocopy texture and toner speckles, the bottom of the page running off the
frame. The sheet is completely blank (text added later). Soft warm lamp light, gentle
shadow at the paper edge.
```

#### E15 — 벽난로 서류 잔해 사진

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E15 (챕터 4 서재 앞 복도·현장 사진, 챕터 5) |
| 2 | 기존 경로 | `assets/evidence/e15-burned-document.webp` (**505×506 정사각형 → 1448×1086으로 변경**) |
| 5 | 배경·장소 | 서재 벽난로 안 재 위의 반쯤 탄 종이 조각들. **촬영 위치는 사용자 확인 대기**(아래 「E15 촬영 위치 검토」). 제작안 A 기준으로는 약간 먼 시점, 확대 화질, 플래시 |
| 6·7 | 인물 / 금지 | 없음 / 모든 인물, 손, 장갑 |
| 8 | 참조 | §4 `E15.refs`(E16 서재 벽난로, 챕터 5 서재 배경, 복도 배경) |
| 9 | 필수 내용 | 가장자리가 검게 탄 종이 조각들. 한 조각에 제목 일부, 다른 조각에 **번호 일부** |
| 10 | 시각 | 없음 |
| 11 | 문자열 | §4 `E15` (번호 일부는 CANON 공식 번호의 일부여야 함. 도구가 검사) |
| 12 | 금지 | 번호 전체, "소유권", "이전 등록", `2023-0478`, 날짜, 이름, 부지깽이 클로즈업(수법 정답은 E16 몫), 혈흔 |
| 13 | 퍼즐 | 챕터 4 P10(`required`) / 챕터 5 동기 근거의 **불인정 선택지**(번호 일부라 단독으로 특정할 수 없음 → 정답 구조 유지) |
| 14 | 기존 수정점 | 소유권 이전 등록 문서 → 사고 보고서 조각, 번호 → D4 번호의 일부, 저해상도 정사각형 → 4:3 |
| 15 | 완성 후 확인 | 도구 자동 검사 + 탄 자국 경계가 자연스러운지, 번호 전체가 보이지 않는지(사람 확인) |

```
PROMPT: Slightly distant zoomed phone-flash photo taken from a study doorway, looking into
a soot-blackened stone study fireplace (match the reference fireplace). Several half-burned
paper fragments rest on grey ash, edges charred black and curled. Two larger fragments in
the center have clean blank white areas near the burnt edge (text added later). No poker,
no tools, no hands, no blood. Late night, harsh flash, deep shadows, slight zoom blur.
```

**E15 촬영 위치 검토** (A안 사용자 승인 → `ready`)

코드 근거:
- E15 설명: "경찰에 전달하기 전 **복도에서 촬영한** 현장 사진 속, 불탄 서류의 가장자리에 보고서 등록번호 일부가 보인다. **물건은 만지지 않았다.**"
- 획득 장소: 챕터 4 「서재 앞 복도」의 「벽난로 현장 사진」. 같은 묶음에 E11 「서재 현장 사진」(문 안쪽 발자국)이 있음
- 서류가 탄 곳은 서재 벽난로(E16 「서재 벽난로 확대」, 챕터 5 수법)

| 안 | 내용 | 코드와의 관계 |
|---|---|---|
| **A (제작 권장)** | 서재 정문 문턱의 복도 쪽에 서서, 안으로 들어가지 않고 벽난로를 **확대 촬영**한 사진. 문틀 가장자리가 화면 한쪽에 살짝 걸려 "밖에서 찍었다"는 것이 보임 | "복도에서 촬영", "만지지 않았다", E16의 서재 벽난로 모두와 맞음 |
| B | 벽난로 바로 앞에서 근접 촬영 | "복도에서 촬영"과 어긋남 → 비권장 |
| C | 서류가 복도로 옮겨져 있었음 | "만지지 않았다", E16과 모순 → 불가 |

- 누가 찍었는지는 코드에 없으므로 화면에 드러내지 않습니다.
- 제작안 A가 승인되면 `status`를 `ready`로 바꿉니다.

#### C04 — 8년 전 사고 기사

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | C04 (챕터 4 창고) |
| 2 | 기존 경로 | `assets/evidence/c04-accident-news.webp` |
| 5 | 배경·장소 | 창고 상자 위의 누렇게 바랜 신문 스크랩. **신문 이름과 날짜가 있는 윗부분은 잘려 나감** |
| 6·7 | 인물 / 금지 | 없음(기사 사진은 무너진 옹벽 현장만) / 모든 인물 |
| 8 | 참조 | §4 `C04.refs`(창고 배경) |
| 9 | 필수 내용 | 제목, 부제, 본문 두세 줄, 흑백 현장 사진(비에 젖은 무너진 옹벽, 비계) |
| 10 | 시각 | 없음 |
| 11 | 문자열 | §4 `C04` |
| 12 | 금지 | 날짜·연도, 신문사명, **등록번호**(도구가 차단), 실명, 지명, "부상", 사망자 수, "부실" |
| 13 | 퍼즐 | 챕터 4 P10(사고 사실), P11(오세린이 유족) |
| 14 | 기존 수정점 | 서울 은평구 빌라 → 산속 별장, 2명 부상 → 작업자 사망, 부실 → 폭우, 등록번호 삭제 |
| 15 | 완성 후 확인 | 도구 자동 검사 + 기사 사진에 사람·간판 글자가 없는지(사람 확인) |

```
PROMPT: An old yellowed newspaper clipping cut out by hand, the masthead and date strip cut
away, lying on a dusty wooden storage box in a dim storeroom. Blank headline area and blank
text columns (text added later), plus one black-and-white news photo of a collapsed
concrete retaining wall at a hillside construction site in heavy rain, scaffolding and mud,
no people, no signs. Paper creases and stains.
```

#### E07 — 오세린의 면담 녹음

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E07 (챕터 3 심문 후 제공, 챕터 4 거실, 챕터 5) |
| 2 | 기존 경로 | `assets/evidence/e07-ohserin-interview-recording.webp` |
| 5 | 배경·장소 | **휴대폰 녹음 앱 재생 화면**(D19 확정). 휴대폰은 어두운 탁자 위에 있고 장소는 특정하지 않음. 녹음 앱 화면은 도구가 통째로 그림 |
| 6·7 | 인물 / 금지 | 없음 / 모든 인물 |
| 8 | 참조 | 없음 |
| 9 | 필수 내용 | 녹음 항목(제목, 시작 시각, 길이), 파형, 진행 바, 재생 위치, 일시정지 버튼 |
| 10 | 시각 | 시작 22:07, 길이 09:04 → 22:16대 종료(CANON D장 22:07~22:16과 도구가 대조). 상태바 시각·날짜 없음 |
| 11 | 문자열 | §4 `E07` |
| 12 | 금지 | 날짜, "면담 대상: 오세린", "CH3", `16:20`, `24:18`, `07:36`, 녹음 대사 자막, 인물 이름 |
| 13 | 퍼즐 | 챕터 3 P05(22:16 생존), 시간표 22:16 / 챕터 4 P11(오세린) / 챕터 5 22:30 약속 근거 |
| 14 | 기존 수정점 | 면담 대상, 날짜(3/15), 시각(16:20), 길이(24:18) 모두 제거 |
| 15 | 완성 후 확인 | 도구 자동 검사로 대부분 확인됨. 휴대폰 모서리와 화면 위치가 자연스러운지만 사람이 확인 |

```
PROMPT: A modern black smartphone lying flat on a dark wooden table, seen from directly
above, screen completely black and blank (the app screen is added later). Dim warm room
light, subtle reflections on the glass. No hands, no people.
```

### 2-2. 거실·CCTV·사진형

이 절의 이미지는 모두 CANON A장의 대표 거실·CH-03·거실-복도 문(N2-a) 정의를 따릅니다.

| ID | 촬영 위치 → 방향 | 보이는 벽 | 실제 시각 |
|---|---|---|---|
| E02 | CH-03 북동 천장 모서리 → 남서(넓은 화각), 22:12 순간의 프레임 | 남쪽 벽(시계는 작고 **판독 불가**), 서쪽 돌 벽난로 | 22:12 (표시 22:05) |
| E04a | 같은 순간. **꾸티뉴가 난워니의 휴대폰으로 찍은 단체 셀카**(D20, 2026-11-13 변경) → 북서쪽(전면 카메라라 좌우 반전 저장으로 해석) | 사람들 뒤로 서쪽 벽난로와 남쪽 벽 가장자리. 벽시계와 **복도 문(남쪽 벽 동쪽 끝, 휴대폰 뒤쪽)**은 **프레임 밖** | 22:12 |
| E03 | **같은 CH-03 카메라**가 녹화한 **다른 시각(23:01)의 프레임**. 그 22:34:13 프레임을 확대 | 남쪽 벽 시계(**판독 가능** 11:01)와 그 앞의 윤해준 | 23:01 (표시 22:34:13) |
| E04d | 서쪽 벽난로 앞 → 동쪽 | 동쪽 선반 벽, 작은 소파, 왼쪽에 북쪽 창 일부. 남쪽 벽(시계·복도 문)은 프레임 밖 — **오른쪽 끝을 남동 모서리 전에서 자름** | 22:50 |
| E17 | CH-03, 22:21 순간 프레임의 **복도 문 쪽 2배 확대** | 남쪽 벽 동쪽 끝의 복도 문, 그 앞의 윤해준(나가는 중). 벽시계는 확대 화면 밖 | 22:21 (표시 22:14) |
| E18 | CH-03, 22:55 순간 프레임의 **복도 문 쪽 2배 확대**(E17과 같은 확대 영역) | 복도 문으로 들어오는 윤해준. 벽시계는 확대 화면 밖 | 22:55 (표시 22:28:13) |

**E02와 E03의 관계**
- 같은 고정 카메라(CH-03)이므로 거실 구조와 화각이 같습니다. 녹화된 시각은 서로 다릅니다.
  - E02: 22:12의 넓은 프레임
  - E03: 23:01의 프레임(표시 22:34:13)을 확대한 화면
- **E03은 E02를 확대한 것이 아닙니다.** 같은 기준 장면에서 인물과 시각만 다른 두 프레임을 만들고, E03은 그중 23:01 프레임의 남쪽 벽 부분을 확대합니다.
- **E02 벽시계 판독 불가 (진행 순서로 재검토, CANON F26)**
  - 챕터 2 관리실에서 E02를 얻고 P01(7분 오차)을 풉니다.
  - 챕터 3 관리실의 E03 「NVR 프레임 확대」는 P04·P05를 푼 뒤에만 열립니다.
  - E02에서 10시 12분이 읽히면 P01이 비교 없이 바로 풀리고, 챕터 3에서 잠가 둔 "영상 속 벽시계" 수법이 챕터 2에서 먼저 드러납니다.
  - 그래서 E02는 넓은 화각 때문에 시계가 작게 찍혀 **읽히지 않게** 합니다. 인위적으로 흐리게 하기보다는 크기와 화질로 처리합니다.

**CH-03 화각 기준 장면 (먼저 만들 것):** 인물 없는 CH-03 빈 거실 장면을 한 장 먼저 만들어 승인받습니다. 그 뒤 E02(22:12 프레임)와 E03(23:01 프레임의 확대)을 이 장면에서 만듭니다.
- 남쪽 벽은 `living.webp`에 없는 면입니다. 단순한 목재·석재 벽에 **벽시계(가운데~서쪽)**와 **복도로 나가는 나무 문(동쪽 끝, CANON N2-a)** 두 가지만 둡니다. 그 밖의 가구·장식은 새로 지어내지 않습니다. (이전 규칙 "문을 지어내지 않음"은 N2-a로 대체)
- **화각 검증 (N2-a, 승인 전 필수)**
  - 카메라 위치: 북동쪽 천장 모서리(창 벽과 선반 벽이 만나는 곳) → 남서쪽
  - 화면 왼쪽 = 남쪽 벽 동쪽 끝(복도 문)과 멀어지는 동쪽 선반 벽 일부 / 가운데 = 남서 모서리·벽시계 / 오른쪽 = 서쪽 돌 벽난로, 끝에 북서쪽 식당 통로 일부
  - 남동 모서리는 시선 중심에서 약 45° 왼쪽 → **가로 시야각 90° 이상 광각**이어야 문이 화면에 들어옴. 문은 남동 모서리에서 문 한 폭쯤 떨어뜨려 화면 왼쪽 가장자리 **안쪽**에 오게 함
  - 카메라 바로 아래 북동쪽 구석은 사각(D21)
  - `living.webp`와 같은 요소(돌 벽난로, 박공 천장, 샹들리에, 베이지 소파, 나무 커피 테이블, 러그, 오토만)가 같은 위치 관계로 보여야 함
  - 확인 항목: ① 문이 왼쪽 가장자리 안에 온전히 보임 ② 벽시계와 문이 겹치지 않음 ③ 벽난로가 오른쪽 ④ 대리석 벽난로·원형 테이블 없음

```
PROMPT (CH-03 reference, no people): High ceiling-mounted wide-angle CCTV view from the
north-east upper corner of the reference mountain villa living room, looking south-west.
Same room as the reference: rough stone fireplace on the west wall (right side of frame),
vaulted timber gable ceiling with a wrought-iron candle chandelier (top of frame), beige
fabric sofas, rectangular wooden coffee table, patterned rug, ottoman. The south wall
(center-left, not visible in the reference) is a plain timber-and-stone wall with one
battery-powered analog wall clock with a plain white face (center of the south wall) and,
at the far east end of the south wall (left edge of the frame, one door-width away from the
south-east corner), a closed plain wooden interior door leading to the corridor. Wide-angle
lens (90+ degrees horizontal) so the door stays inside the left edge. Night, warm lamps on.
Slight fisheye, CCTV grain, muted colors. Empty corners for a UI overlay. No people.
```

**CH-03 승인 기록 (2026-11-13, v2)**

- 파일: `tools/evidence-compose/work/ch03/CH-03_living_CCTV_base_v2.webp` (Git 제외 폴더, 1448×1086, 4:3)
- 원본 SHA-256: `d059d2eac94ea4ebe76a9e2296e4909c9478a9e78835f0817f248e6dc87fec27`. **다시 생성하지 않고 이 파일을 모든 CH-03 프레임의 공통 바탕으로 씀**
- 허용한 차이: 벽난로 도구 걸이가 단의 북쪽(대표 거실은 남쪽), 혼천의가 책장에 있음
- 측정 위치(기준 이미지 좌표)

| 요소 | 위치 |
|---|---|
| 복도 문(문틀 포함) | x 143~313, y 335~650 |
| 벽시계 | x 798~856, y 333~394 (중심 827, 363 / 지름 약 58). 바늘이 약 10:08로 그려져 있으므로 **항상 합성 시계로 덮음** |
| 남서 모서리(남쪽 벽과 벽난로 벽이 만나는 선) | x 약 965 |
| 샹들리에 아래 끝 | y 약 245 |

- 확대 영역(승인)

| 용도 | 잘라낼 영역(기준 이미지) | 배율 | 확대 결과(1448×1086)에서 | 합성 시계 |
|---|---|---|---|---|
| E02 | 전체 | 1.0 | 시계 중심 (827, 363) | x 796, y 331, 지름 62, **판독 불가** |
| E03 | x 465~1189, y 230~773 | 2.0 | 시계 중심 (724, 266). 문 없음 | x 649, y 191, 지름 **150**(휴대폰 약 35px), **11:01 판독 가능** |
| E17·E18 | x 0~724, y 250~793 | 2.0 | 문 x 286~626, y 170~800. 시계·샹들리에 없음 | 없음 |

- E03 확대 바탕(준비 완료): `tools/evidence-compose/work/ch03/E03_bg_crop_x465-1189_y230-773_2x.png`. 인물 없이 도구로 시험 합성한 결과 시계가 원래 바늘을 완전히 덮고 자동 검사 통과(`work/ch03/trial/E03_trial_no-person.webp`, 게임용 아님)

#### E02 — 거실 CCTV 22:05

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E02 (챕터 2 관리실, 챕터 3 관리실) |
| 2 | 기존 경로 | `assets/evidence/e02-living-room-cctv-2205.webp` |
| 5 | 배경·장소 | CH-03 v2 원본 그대로(넓은 화각, 22:12 프레임). 벽시계는 작게 찍혀 **판독 불가**(F26). **복도 문은 닫혀 있고 앞에 아무도 없음**. 테이블의 랜턴·수국·책·찻주전자는 그대로(E03·E17과 같은 상태) |
| 6 | 인물 | 꾸한성 멤버 10명(D20). **E04a와 정확히 같은 순간**. 큰 소파 쪽에 모여 꾸티뉴가 팔을 뻗어 든 휴대폰(남동쪽)을 봄 → CH-03에는 **뒷·옆모습**(셀카 구도 복사 금지). 차림은 **E04a 기준**(CANON C-1 "E04a 속 차림"). 소파·테이블에 의한 가림 허용. 플레이어는 넣지 않음(D13). 자리는 아래 "E02 v2 제작 준비" |
| 7 | 금지 인물 | 강석훈, **윤해준**(D21. 화면에 없다는 것이 거실 부재를 뜻하지는 않음), 그 외 외부인, 플레이어 |
| 8 | 참조 | 확정된 E04a(인물 차림의 기준) + §4 `E02.refs` |
| 9 | 필수 내용 | NVR UI(§4 `_nvr_ui`), E04a와 같은 10명·같은 자리 관계·같은 차림, 테이블 앞쪽의 둥근 검은 쟁반과 간식 |
| 10 | 시각 | 표시 `22:05` → 실제 22:12(도구가 CANON 오차 규칙으로 검산) |
| 11 | 문자열 | §4 `E02` |
| 12 | 금지 | 날짜, 판독 가능한 벽시계, 대리석 거실, 다른 UI 버전·코덱, 꾸티뉴 얼굴 균열({D15} 결정 전에는 넣지 않음) |
| 13 | 퍼즐 | 챕터 2 P01·챕터 3 P01(7분 오차: E04a·E02·E01 비교) |
| 14 | 기존 수정점 | 대리석 거실 → 대표 거실(CH-03 v2), 인물 차림을 E04a 기준으로 |
| 15 | 완성 후 확인 | E04a와 나란히 놓고 같은 순간인지, 체크리스트 10명 각 1번(중복·누락 없음), 윤해준·강석훈 없음, 시계 판독 불가, 문 닫힘, 마스크 밖 보존 |

```
PROMPT (v2, 2026-11-13): [Keep the CH-03 base image exactly; edit only inside the mask] The same
ten friends as the reference group selfie (match each person's hair colour, hats, ears and
outfit from the selfie) crowd around the big foreground sofa, seen from the fixed ceiling
CCTV mostly from behind and the side: four lean over the sofa back, two sit on the sofa, three
sit on the floor between the sofa and the coffee table, and the man in the white fedora at the
west corner of the table holds a phone out at arm's length toward the south-east for a group
selfie; everyone looks toward that phone. A round black tray with a strawberry tart, a
chocolate cake, mugs and glass candle holders on the near edge of the coffee table. Keep the
lantern, hydrangeas, book and teapot, the closed corridor door and the tiny wall clock
unchanged. No other people. CCTV grain, slight fisheye.
```

#### E04a — 22:12 단체 채팅 사진

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E04a (챕터 2 거실, 챕터 3) |
| 2 | 기존 경로 | `assets/evidence/e04a-group-photo-2212.webp` |
| 4 | 크기·비율 | 1448×1086 원본 그대로(오른쪽 아래 `22:12` 표시 포함). 채팅 UI 합성 안 함 |
| 5 | 배경·장소 | **꾸티뉴가 난워니의 휴대폰으로 찍은 단체 셀카**(D20, 2026-11-13 변경). 큰 소파 쪽, 뒤로 북쪽 창과 벽난로(전면 카메라 좌우 반전으로 해석). 벽시계는 **프레임 밖**(F26) |
| 6 | 인물 | 꾸한성 멤버 10명(대응은 `work/e02/v2/E02v2_character_checklist.png`). 꾸티뉴가 휴대폰을 듦, 휴대폰 주인·보낸 사람 = 난워니. 플레이어는 넣지 않음(D13) |
| 7 | 금지 인물 | 강석훈, **윤해준**(D21. 화면 밖에 있었을 가능성을 막지 않도록, 사진이 거실 전체를 담지 않는 구도 유지), 그 외 외부인, 플레이어 |
| 8 | 참조 | §4 `E04a.refs` |
| 9 | 필수 내용 | 채팅 사진 보기 UI(보낸 사람, 보낸 시각), 밝은 분위기의 단체사진 |
| 10 | 시각 | 보낸 시각 `22:12`(E02 실제 시각과 같은 순간인지 도구가 검사) |
| 11 | 문자열 | §4 `E04a` |
| 12 | 금지 | 날짜, 판독 가능한 벽시계, 대리석 거실, 채팅방 이름 |
| 13 | 퍼즐 | 챕터 2·3 P01(7분 오차) |
| 14 | 기존 수정점 | 거실 디자인, 인물 디자인을 스프라이트 기준으로 |
| 15 | 완성 후 확인 | **원본 확정(2026-11-13)**: 챕터 3 확대 창 PC 606×455·모바일 326×245에서 잘림 없음, `22:12` 판독, 전체 테스트 통과. 이미지 수정 금지 |

```
(폐기 2026-11-13: E04a는 원본 확정, 생성 지시문 사용 안 함)
```

**E02 v2 제작 준비 (2026-11-13, E04a 원본 확정 후 재설계)**

- 준비물 `tools/evidence-compose/work/e02/v2/` (Git 제외)
  - `E02v2_people_guide.png`: CH-03 v2 위 10명 머리 위치·꾸티뉴의 휴대폰·쟁반 위치. **참고용(생성 입력에 넣지 않음)**
  - `E02v2_people_mask.png`: 흰색 = 편집 허용(인물·쟁반). 다각형 (520,690)-(800,560)-(990,560)-(1330,640)-(1330,1086)-(560,1086)-(520,930). 문·벽시계·벽난로·책장·천장 제외
  - `E02v2_character_checklist.png`: E04a에서 자른 10명 얼굴 + 표식 + E02 자리 + 체크 칸(중복·누락 검수)
  - 바탕은 기존 `work/e02/E02_bg_CH-03_v2.webp`(CH-03 v2 원본 사본)
- 위치 해석: 전면 카메라 셀카라 좌우 반전 저장 → 휴대폰은 무리의 남동쪽에서 북서쪽을 향함(뒤로 북쪽 창·서쪽 벽난로). 무리는 북쪽 큰 소파(CH-03 앞쪽 소파) 주변. E04a 왼쪽 = 실제 동쪽 = CH-03 화면 왼쪽
- 자리(CH-03 화면, 왼쪽→오른쪽): 뒤(소파 뒤에서 등받이에 기댐) 1 난워니 · 2 김옥독 · 3 다뮤_ · 4 만조 / 가운데(소파 앉음) 5 야무지 · 6 모야 / 앞(소파와 테이블 사이 바닥) 7 야뿌 · 8 윤타미 · 9 하루노츠키 / 10 꾸티뉴 = 테이블 서쪽 모서리, 남동쪽으로 팔을 뻗어 휴대폰을 듦
- **테이블 불일치 해결:** CH-03의 직사각형 나무 테이블은 그대로 두고, E04a의 "둥근 어두운 테이블"을 **테이블 위 둥근 검은 쟁반(금색 테두리)과 같은 간식**(딸기 타르트·초콜릿 케이크·머그·유리 촛불)으로 해석. 셀카 근접 화면에서는 쟁반이 둥근 상판처럼 보임. 쟁반은 테이블 **앞쪽 가장자리(화면 y 800 이상, 중심 약 600,834)**에 둠 → E17(22:21) 확대 영역(y 793까지)과 E03(23:01) 확대 영역(y 773까지) **밖**이라 두 증거와 충돌 없음. 테이블 위 랜턴·수국·책·찻주전자는 유지(E03·E17에 보임)
- 남는 차이: E04a 벽난로 테두리가 어둡게 보임(CH-03은 돌), 소파 색이 회색 쪽(CH-03은 베이지). 근접·조명 차이로 수용. 이미지 변경 없음
- 게임 문구 2건(E02 "같은 사람들이 같은 자리·같은 차림", E04a "자리와 차림, 테이블 위 간식이 일치")은 **E02 완성본과 대조한 뒤 확정**
- 아래 v1 준비 기록과 `work/e02/` 최상위의 `E02_people_mask.png`·`E02_people_guide.png`·`E02_E04a_seating_plan.png`는 **폐기**(`work/e02/OBSOLETE_v1_README.txt`). 벽시계 처리·좌표 적용 기록은 유효

- **이름 임시 라벨(2026-11-13):** 흰 베레모+파란 브릿지 = `다뮤_ (임시)`, 빨간 브릿지+검은 고양이 귀 = `윤타미 (임시)`, 파란 긴 머리 = `야뿌 (임시)`. 자리·외형 분류·체크리스트 구조는 고정, 매핑 확정 시 이름 글자만 수정

**E02 최종 생성 계획 (2026-11-13, 생성 직전 준비)**

- 입력: ① 바탕 `work/e02/E02_bg_CH-03_v2.webp`(편집 대상) ② 마스크 `work/e02/v2/E02v2_people_mask.png` ③ 인물 참조 `assets/evidence/e04a-group-photo-2212.webp`(읽기 전용). 안내 이미지·체크리스트는 **생성 입력에 넣지 않음**(글자·번호가 그림에 섞일 수 있음)
- 순서: 생성(마스크 안만) → 받은 파일을 `work/e02/v2/E02_bg_with_people.webp`로 복사 → 마스크 밖 보존 검사 → 배경이 다시 그려졌으면 마스크 안만 페더 합성 → 검수 기준표 판정 → 합격 시 `render E02 --draw-clock --cctv-filter` → E03 비교 → 게임 문구 2건 대조
- 합성 도구: E02 배치(NVR, 시계 x 796·y 331·지름 62, 판독 불가 강화) 이미 적용. 표시 22:05 → 실제 22:12 검산 통과

```
PROMPT (E02 final, inpaint inside mask only):
Edit only the white masked area of this fixed ceiling CCTV frame of a mountain-villa living room.
Keep everything outside the mask pixel-identical: camera angle, wide-angle distortion, lighting,
the closed wooden corridor door, the tiny wall clock, the stone fireplace, bookshelves, ceiling.
Add exactly ten young friends, the same people and outfits as in the reference group selfie
(match each one's hair colour, hat, ears and clothes), at 22:12 at night, seen from the CCTV
mostly from behind and the side, all looking toward a phone held out to the south-east:
- leaning over the back of the big foreground sofa, left to right: black hair in two buns with a
  yellow ribbon and black hoodie; mint-green hair with striped shirt; white beret with black hair
  and blue streaks; backwards white-and-navy cap with headphones around the neck
- sitting on the sofa: long dark-brown hair with a crescent hair clip; short blonde hair with a
  green clover clip and brown jacket
- sitting on the floor between the sofa and the coffee table: long blue hair with grey cardigan;
  black hair with red streaks and black cat-ear accessory; white hair with white cat ears and
  frilly white blouse
- at the west corner of the coffee table near the ottoman: a young man in a white fedora with a
  black band and dark jacket, holding a smartphone out at arm's length to take a group selfie
On the near edge of the rectangular wooden coffee table: a round black tray with a gold rim
holding a strawberry tart, a chocolate cake, two or three mugs and small glass candle holders.
Keep the lantern, blue hydrangeas, open book and teapot on the table unchanged.
Natural occlusion by the sofa back and table is fine, but every one of the ten heads must be
visible. No eleventh person, no duplicate person, no man in a dark-grey work coverall, no
middle-aged man, no text, no date. Muted CCTV colours, slight grain, slight fisheye.
```

**E02 v3 레이어 합성 준비 (2026-11-13, 사용자 승인 — 전체 재생성 방식 폐기)**

- 1·2차 전체 재생성본은 불합격(11명, 마스크 밖 인물, 배경 재생성 22.7, 휴대폰 방향). 배경 변경 예외(B)는 승인 안 됨. 이후 E02는 **원본 CH-03 v2 + 인물·소품 레이어 합성**
- 준비물 `tools/evidence-compose/work/e02/v3/` (Git 제외)
  - `E02v3_mask_extended.png`: 레이어 허용 영역. 꾸티뉴·휴대폰을 위해 왼쪽으로 x 340까지 확장(1인 소파·램프 제외). 다각형 (340,560)-(1000,560)-(1330,640)-(1330,1086)-(560,1086)-(520,930)-(440,890)-(340,880)
  - `E02v3_sofa_matte.png`: 원본 픽셀 그대로 자른 앞 소파(바깥 등받이 판·등받이 쿠션·베개·팔걸이) + 1인 소파, 나머지 투명. 모든 인물 위에 덮음. 확인용 `E02v3_sofa_matte_check.png`
  - `E02v3_layout_guide_all.png` + 레이어별 `E02v3_guide_L1~L5_*.png`: 목표 상자·머리 위치(지름 약 52px)·방향
  - `PROMPTS_E02v3_layers.txt`: 레이어별 생성 지시문(투명 PNG 우선, 초록 #00FF00 대체)
- 높은 천장 시점이라 앞 소파의 등받이·쿠션·베개가 인물보다 카메라에 가까움 → "소파 뒤 4명"(E04a의 맨 뒤 줄)은 **소파 좌석 깊숙이** 앉아 등받이 위로 머리·어깨가 보이는 자리로 둠(E04a 기준 맨 뒤 유지)
- 레이어와 목표 상자(CH-03 px): ① 소파 깊숙이 4명(난워니·김옥독·다뮤_ (임시)·만조) x 590~1240, y 620~930 / ② 소파 앞쪽 2명(야무지·모야) x 660~990, y 610~860 / ③ 바닥 3명(야뿌 (임시)·윤타미 (임시)·하루노츠키) x 860~1120, y 580~820 / ④ 꾸티뉴 x 350~540, y 570~830, 오른팔을 화면 왼쪽 위(복도 문 쪽)로 뻗어 휴대폰 약 (370,600) / ⑤ 소품 x 490~615, y 808~852
- 쌓는 순서: 바탕 → ⑤ → ④ → ③ → ② → ① → 소파 매트. 모든 레이어는 확장 마스크로 잘라서 마스크 밖 원본 픽셀 차이 0을 보장
- 휴대폰 방향 검증: 휴대폰이 무리의 남동쪽에서 북서쪽을 향하면 셀카 화각(약 75~80°) 양 끝에 북쪽 창(약 349°)과 서쪽 벽난로(약 277°)가 들어오고, 전면 카메라 좌우 반전으로 창 왼쪽·벽난로 오른쪽 = E04a와 같음. 벽시계(약 219°)·복도 문은 화면 밖
- 소품 ⑤는 E17(y 793까지)·E03(y 773까지) 확대 영역 밖. 테이블 위 랜턴·수국·책·찻주전자와 겹치지 않음. 인물은 22:12 장면이라 확대 영역에 들어가도 무방

**E02 v3 최종 후보 (2026-11-14, 게임 미적용)**

- `work/e02/v3/final/E02v3_final_candidate.webp`(합성 바탕, SHA-256 `66969b35…`), `E02v3_final_nvr_candidate.webp`(NVR 22:05, `82bec566…`). 인물 `work/e02/v3/people1/` 10장 + L5 + 소파 매트. 마스크 밖 차이 0.000
- E03 비교: 밝기 차 2.5%, 채도 차 4.6%, 구조 이동 E03 화면 기준 (4, -12)px → 통과
- **게임 적용(2026-11-14, 사용자 결정, 알려진 문제 유지):** `assets/evidence/e02-living-room-cctv-2205.webp` = `E02v3_final_nvr_candidate.webp`(이전 파일 백업 `work/e02/v3/final/BACKUP_old_e02-living-room-cctv-2205.webp`). 전체 테스트 12묶음 통과, 챕터 3 확대 창 PC 606×455·모바일 326×245 잘림 없음. **아래 외형 불일치는 해결되지 않음**
- **알려진 문제(미해결):** P04 만조(긴 연갈색 머리·캡 방향), P09 하루노츠키(후드·긴 머리·그림체), P10 꾸티뉴(CCTV 응시·곧은 머리)가 E04a와 다름 → 같은 순간 판단(P01)에 영향 가능. 재생성 지시 `work/e02/v3/PROMPTS_E02v3_people_rev3.txt`

**E02 완성본 검수 기준표**

| # | 항목 | 합격 기준 | 확인 방법 |
|---|---|---|---|
| 1 | 총 인원 | 정확히 10명(머리 10개) | 확대 보며 머리 수 세기 |
| 2 | 중복·누락 | 체크리스트 10칸이 각각 정확히 1번 대응. 같은 표식 2명 = 불합격 | `E02v2_character_checklist.png` 체크 |
| 3 | 꾸티뉴 위치 | 흰 페도라 인물이 테이블 서쪽 모서리(오토만 쪽)에서 팔을 뻗어 휴대폰을 듦. 휴대폰을 든 사람은 1명뿐 | 배치도 10번 위치와 비교 |
| 4 | 난워니 휴대폰 해석 | 화면이 반박하지 않을 것: 난워니(노란 리본)가 별도 휴대폰을 들어 촬영하는 모습이 아님, 휴대폰은 꾸티뉴 손의 1대. 주인은 화면으로 증명하지 않음(D20 설정) | 육안 |
| 5 | 같은 순간 | E04a와 같은 10명·같은 차림·같은 자리 관계(뒤 4 / 소파 2 / 바닥 3 / 촬영자 1), 모두 휴대폰 쪽을 봄. 셀카 구도 복사(카메라를 정면으로 보는 얼굴들) 아님 | E04a와 나란히 비교 |
| 6 | 소품 대응 | 둥근 검은 쟁반(금색 테두리) + 딸기 타르트·초콜릿 케이크·머그·유리 촛불이 테이블 앞쪽 가장자리에 보임 | 확대 비교 |
| 7 | CCTV 시점 | 고정 천장 광각 그대로(원근·왜곡·색감이 바탕과 같음), 인물 크기가 위치 깊이와 맞음, 떠 있는 사람 없음 | 육안, 전체·확대 |
| 8 | 가림 정도 | 10명 모두 머리·대표 표식(모자·머리색·귀)이 보임. 몸은 소파·테이블에 가려도 됨 | 체크리스트 표식 확인 |
| 9 | 배경 핵심 구조 | 복도 문 닫힘·비어 있음, 벽시계 위치·크기 그대로(합성 후 판독 불가), 랜턴·수국·책·찻주전자 유지. 마스크 밖 평균 차이 3.0 이하, 차이 40 초과 1% 이하 | 픽셀 비교(마스크 밖), 합성 후 시계 확대 |
| 10 | E03·E17·E18 충돌 | 쟁반·인물이 E17·E18 확대 영역(x 0~724, y 250~793)과 E03 확대 영역(x 465~1189, y 230~773)에 새 소품을 남기지 않음(인물은 시각이 달라 무관). 윤해준·강석훈 없음 | 쟁반 위치 좌표 확인 |
| 11 | 자동 검사 | `render E02` 자동 검사 통과(22:05, 금지 문구, 모바일 글자 크기) | 도구 |
| 12 | E03 비교 | 구조 차이 25px 이하, CCTV 필터 후 밝기·채도 차이 10% 이하 | 비교 계획(아래 v1 기록의 비교 계획과 같음) |
| 13 | 게임 문구 대조 | "같은 사람들이 같은 자리·같은 차림" / "자리와 차림, 테이블 위 간식이 일치"가 완성본에서 사실일 때만 문구 반영 | 1~6 합격 여부 |

**[폐기] E02·E04a 제작 준비 v1 (2026-11-13, 고정 휴대폰 가정)**

- 작업 폴더: `tools/evidence-compose/work/e02/` (Git 제외)
  - `E02_bg_CH-03_v2.webp`: CH-03 v2 승인 원본 사본(SHA-256 `d059d2ea…`, 같은 파일). E02는 전체 프레임(1.0배)
  - `E02_people_mask.png`: 흰색 = 인물 편집 허용. 다각형 x 320~1060, y 430~(앞 소파 등받이 선 y 790~892). 복도 문(x 143~313)·벽시계(x 780~875, y 318~410)·천장·샹들리에·앞 소파는 제외
  - `E02_people_guide.png`: 10명 머리 위치(번호)와 이름·표식. **참고용(생성 입력에 넣지 않음)**
  - `E02_E04a_seating_plan.png`: 두 이미지 공통 평면 배치도(CH-03·휴대폰 시야, 벽시계·복도 문 위치)
- 촬영 위치 확인: CH-03 v2는 `living.webp`(남쪽에서 북쪽을 본 장면)와 가구 관계가 맞음 — 북쪽 창 앞 큰 소파가 CH-03에서는 등받이가 보이는 앞쪽, 동쪽 1인 소파가 왼쪽 아래, 오토만은 벽난로 쪽. E04a 휴대폰은 동쪽 선반(카메라 아래쪽, 높이 약 1.2m)에서 **벽난로 중심(방위 약 258°)**을 향하고 일반 화각(가로 65° 이하)이어야 벽시계(방위 약 220°)와 복도 문이 프레임 밖
- 인물 배치(모두 앉거나 무릎 — 서 있는 사람 없음 → 머리가 벽시계를 가리지 않음, 모두 동쪽 휴대폰 쪽을 봄)
  - 뒤(오토만): 1 꾸티뉴(흰 페도라) · 2 모야(산타 모자) · 3 만조(흰·남색 캡+헤드폰) — 흰 모자 둘 사이에 빨간 모자
  - 가운데(테이블과 남쪽 벽 사이, 무릎): 4 야뿌(파란 머리+남색 베레모) · 5 하루노츠키(고양이 귀 후드) · 6 김옥독(민트 트윈테일) · 7 야무지(갈색 웨이브+초승달 핀)
  - 앞(테이블 동쪽 바닥, 휴대폰과 가장 가까움): 8 다뮤_(파란 브릿지+검은 고양이 귀) · 9 난워니(노란 리본+노란 줄 후디) · 10 윤타미(빨간 브릿지, 귀 없음) — 헷갈리는 다뮤_·윤타미 사이에 난워니
  - 식별: E04a에서 얼굴·표식으로 10명 식별. E02(CCTV 원거리)는 모자·머리색·귀 실루엣으로 E04a와 같은 자리에 대응되면 됨
- 같은 순간 검증: E04a 보낸 시각 22:12 = E02 표시 22:05의 실제 시각(22:05 + 7분, 오후 정전 오차만 적용 — 22:24:18 이전) ✓. 도구 검사 `same_moment_as` 통과. 화면 조건: 좌석·자세·옷·소품이 같고, E04a에 없는 사람이 E02에 없을 것(윤해준·강석훈 없음, D21)
- 벽시계: E02 합성 시계 x 796, y 331, 지름 62(원본 시계 덮음). **현재 도구의 판독 불가 설정(흐림 2.2px)은 4배 확대 시 약 10:10으로 읽힘** → 바늘 대비 낮춤 + 흐림 3.5px + 유리 반사 하이라이트 시안(D)에서 바늘이 거의 사라짐(시험 이미지 `E02_clock_trial_*_zoom4x.png`). 도구 변경 승인 필요. `layouts.js` E02 시계 좌표도 승인 측정값으로 갱신 필요(현재 x 520, y 210, 지름 60은 옛 샘플 값)
  - **적용(2026-11-13, 사용자 승인):** `templates.js` 판독 불가 처리 = 낮은 대비 바늘·눈금 + 흐림 3.5px + 유리 반사 + 불투명(기존 투명도 0.8에서 원본 10:08 바늘이 비쳐 보여 1로 변경). `layouts.js` E02 시계 x 796, y 331, 지름 62. 인물 없는 시험 합성 `work/e02/trial-no-people/` 자동 검사 통과, 9.6배 확대에서도 바늘 안 보임(`E02_clock_trial_applied_zoom9x.png`). E03(판독 가능)은 결과 해시가 그대로
- 제작 순서: ① E04a(휴대폰 사진, 새 시점이라 전체 생성, 배치도 따름) → ② E02(CH-03 v2 원본 + 마스크 안 인물만, E04a를 인물 참조로) → ③ 마스크 밖 보존 검사(평균 3.0 이하, 40 초과 1% 이하) → ④ E03과 비교
- **E03·E02 비교 계획:** E02 완성 후 E03 확대 영역(x 465~1189, y 230~773)을 E02에서 잘라 2배 확대해 E03 바탕과 나란히 놓음. ① 구조: 벽시계 중심·벽난로 아치·돌 띠 윗선·장작 바구니·오토만 위치 차이 25px 이하(E03은 약 20~25px 위로 이동 수용분) ② 색감: CCTV 필터 적용 후 평균 밝기·채도 차이 10% 이하 ③ 육안: 같은 카메라·거실로 보임. 실패 시 E03을 마스크 밖 보존 방식으로 다시 만듦(E03 조건부 승인 조건)

#### E03 — NVR 영상 속 벽시계

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E03 (챕터 3 관리실 「NVR 프레임 확대」, 챕터 5 자동 지급) |
| 2 | 기존 경로 | `assets/evidence/e03-nvr-wallclock-223413.webp` |
| 5 | 배경·장소 | E02와 **같은 CH-03 카메라**가 녹화한 **23:01 프레임**(표시 22:34:13)을 확대한 화면: 남쪽 벽과 벽시계, 그 앞의 소파·오토만 부근. 정전 복구 후라 조명이 켜져 있음. E02를 확대한 것이 아님. **확대 영역은 벽시계 중심이라 복도 문은 화면 밖**(E17·E18과 확대 영역이 다름) |
| 6 | 인물 | **윤해준 1명.** 시계 아래 남쪽 벽 앞에 서 있고, 확대 화질에서도 복장(CANON C-2)으로 판별 가능 |
| 7 | 금지 인물 | 강석훈, 꾸티뉴(페도라 인물과 혼동되는 구도 금지), 그 외 인물(23:01 거실 인원은 미확인) |
| 8 | 참조 | §4 `E03.refs`(대표 거실, 윤해준 스프라이트) + 승인된 CH-03 기준 장면 |
| 9 | 필수 내용 | NVR UI, 확대 표시, 윤해준, **배터리식 아날로그 벽시계**(판독 가능) |
| 10 | 시각 | 오버레이 `22:34:13`, 벽시계 **11:01**(23:01). 시계는 CH-03 승인 기록의 E03 위치(x 649, y 191, 지름 150)에 합성. 도구가 CANON 오차 규칙으로 검산. 바탕 그림의 시계 바늘이 틀리면 `--draw-clock`으로 정확한 시계를 합성 |
| 11 | 문자열 | §4 `E03` |
| 12 | 금지 | 날짜, 디지털 시계, 대리석 거실, 우비·헤드랜턴·안전화 강조(E14와 겹침), 젖은 옷 강조(코드에 없는 단서), 빨간 표시 |
| 13 | 퍼즐 | 챕터 3 P06(누적 오차), 시간표 23:01 / 챕터 5 시간 근거(인정), 반박 1의 정답 |
| 14 | 기존 수정점 | 빈 거실 → 윤해준 추가, 대리석 거실 → 대표 거실, 날짜 2026-01-16 삭제, UI v2.8.7·H.265 → `_nvr_ui`. **시계 11:01은 유지** |
| 15 | 완성 후 확인 | 윤해준 판별, 시계 바늘 정확, CH-03 기준 장면과 같은 공간 |

```
PROMPT: [CH-03 reference scene at a later moment (23:01), digitally zoomed about 2x toward
the south wall] The plain
south wall with the battery-powered analog wall clock clearly readable, hands at 11:01
(hour hand just past 11, minute hand on the 1-minute mark). One man from the character
reference stands in front of the wall near the sofa: dark grey work coverall, towel around
the neck, tool pouch on the belt, no hat. Lights on, CCTV grain, slight zoom softness.
Empty corners for a UI overlay. No other people.
```

**E03 인물 삽입 요청서 (2026-11-13)**

- 입력: `work/ch03/E03_bg_crop_x465-1189_y230-773_2x.png` (승인 바탕을 2배 확대한 것). **배경 픽셀은 바꾸지 않고 인물 영역만 편집**
- 참조: `assets/characters/yoon-haejun/normal.webp`(외형 기준). 스프라이트는 애니메이션풍이므로 **붙여 넣지 않고 같은 특징의 실사 인물로** 그림
- 위치: 시계의 **왼쪽**, 남쪽 벽 앞 바닥(대략 x 330~600, 발 y 약 840, 머리 위 y 약 310). **시계 합성 영역(x 649~799, y 191~341)과 겹치지 않게** 함. 커피 테이블·오토만보다 뒤(벽 쪽)
- 외형: 진회색 작업 재킷과 바지, 목에 두른 회색 수건, 오른쪽 허리 공구 파우치, 모자 없음, 짧은 검은 머리. 얼굴은 카메라 쪽 반측면(CCTV 화질에서 특징 식별 가능)
- 신발: **흙 묻은 작업화·안전화 금지**(안전화는 보일러실에 숨긴 뒤, E14). 평범한 어두운 실내화 또는 발이 가구에 가려짐
- 금지: 우비, 헤드랜턴, 젖은 옷·머리 강조, 다른 인물, 빨간 표시, 글자
- 조명: 바탕과 같은 따뜻한 실내 조명(복구 후), 약한 확대 흐림

```
PROMPT (inpaint on the approved crop, keep everything else unchanged): A man standing on the
wooden floor in front of the plain timber south wall, to the left of the wall clock, not
overlapping the clock: dark charcoal-grey work jacket and trousers, a grey towel around the
neck, a tool pouch on the right hip, no hat, short dark hair, face turned three-quarters
toward the ceiling camera. Plain dark indoor shoes, no boots, no raincoat, no headlamp, not
wet. Same warm lamp lighting and perspective as the room, slight digital-zoom softness.
```

**E03 조건부 승인 기록 (2026-11-13)**

- 상태: **조건부 최종 후보** (게임 `assets/` 미교체). 조건: 아래 "E02와 최종 비교" 통과
- 최종 후보: `tools/evidence-compose/work/ch03/approved/E03_conditional_candidate_e03-nvr-wallclock-223413.webp` (작업본 `work/ch03/final-candidate/`와 동일)
  - SHA-256 `9dfaec7350d1f8800acca81ac6527e720ee8625ac5fbfe476f8bacd51ceb42bb`. 관련 해시 전체는 `work/ch03/approved/SHA256SUMS.txt`
- 합성: 바탕 `work/ch03/E03_bg_with_haejun_1448x1086.png`(전달본 `E03_bg_with_haejun.webp` 1447×1087을 1448×1086으로 맞춤) + `render E03 --draw-clock --cctv-filter`. 시계 x 649, y 191, d 150, 11:01. NVR 22:34:13
- 자동 검사 20개 통과(경고 1: 제작 상태). 육안: 윤해준 외형 일치, 시계와 겹침 없음, 단화(작업화 아님), 우비·헤드랜턴 없음, 원본 시계 바늘 완전히 가림, 휴대폰 326px에서 11:01 판독
- **배경 변경(수용, E03 한정):** 인물 영역만이 아니라 배경 전체가 다시 그려짐. 승인 확대 바탕 대비 마스크 밖 **평균 차이 17.5**(0~255), **차이 40 초과 픽셀 11.4%**, 장면 전체가 위로 약 20~25px 이동. 구조·배치·조명은 CH-03과 같아 공간 일관성은 유지된다고 판단
- **남은 확인 — E02와 최종 비교:** E02(CH-03 v2 원본 사용)를 만든 뒤 둘을 나란히 놓고 ① 같은 카메라·같은 거실로 보이는지 ② 남쪽 벽 나무결·돌 띠, 벽난로 아치, 장작 바구니, 오토만의 모양이 크게 다르지 않은지 ③ CCTV 색감이 같은지 확인. 실패하면 E03을 마스크 밖 보존 방식으로 다시 만듦
- 이 예외는 E03에만 적용. **E17·E18은 CH-03 v2 원본을 쓰고 배경 재생성을 허용하지 않음**(아래 합격 기준)

#### E04d — 22:50 거실 사진

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E04d (챕터 3 거실·다뮤_, 챕터 5 시간 근거의 불인정 선택지) |
| 2 | 기존 경로 | `assets/evidence/e04d-group-photo-2250.webp` |
| 4 | 크기·비율 | 1448×1086. 채팅 앱의 사진 보기 화면 |
| 5 | 배경·장소 | 서쪽 벽난로 앞에서 동쪽을 향한 시점: 동쪽 선반 벽, 작은 소파, 왼쪽에 북쪽 창 일부(비 오는 밤). 남쪽 벽(시계)과 벽난로 쪽은 **화면 밖이므로, 사진에 없는 사람이 거실에 없었다는 뜻이 되지 않음** |
| 6 | 인물 | **김옥독·만조·윤타미·난워니·야무지 5명**(D18 확정). 각자 스프라이트 구별 포인트로 식별 가능해야 함. 촬영자는 화면 밖이며 정하지 않음(D10) |
| 7 | 금지 인물 | 윤해준, 강석훈, 외부인 전원, **다뮤_**(공유자, D10), **모야**(22:46 주방, E04c), 꾸티뉴·야뿌·하루노츠키(사진 밖, 위치 미확인), 회색 작업복처럼 보이는 옷 |
| 8 | 참조 | §4 `E04d.refs`(대표 거실 + 5명 스프라이트) |
| 9 | 필수 내용 | 채팅 사진 보기 UI(보낸 사람 다뮤_, 22:50), 조명 켜진 거실, 놀라거나 불안한 표정, **셀카가 아닌 제3자 시점**(촬영자는 드러나지 않음, D10) |
| 10 | 시각 | 보낸 시각 `22:50` |
| 11 | 문자열 | §4 `E04d` |
| 12 | 금지 | 날짜, 셀카 구도, 브이 포즈, E04a의 좌석 배치, "촬영: ○○" 표기, 채팅방 이름 |
| 13 | 퍼즐 | 챕터 3 P06(보조) / 챕터 5 시간 근거의 불인정 선택지 / 복귀 22:55 소거법의 기준 |
| 14 | 기존 수정점 | E04a 복제(10명, 셀카, 대리석 거실) → 전면 재제작 |
| 15 | 완성 후 확인 | 윤해준으로 오인할 인물 없음, 5명 식별(다뮤_↔윤타미 혼동 주의), E04a와 다른 사진, 오른쪽 끝에 복도 문 없음 |

**D18 결정 근거** (2026-11-13 확정: 김옥독·만조·윤타미·난워니·야무지. 아래는 결정 당시의 근거 기록)

| 후보 | 22:21 이후 위치 근거 | 22:50 거실에 있을 근거 |
|---|---|---|
| 김옥독 | 22:31 정전 중 거실을 휴대폰으로 촬영(E04b) | **가장 강함.** 정전 내내 거실에 있었던 기록 |
| 모야 | 22:46 주방에서 거실 문턱을 촬영(E04c), 23:20 주방(E06) | 약함. 4분 사이에 거실로 왔을 수는 있음 |
| 다뮤_ | 22:50 사진 공유자(촬영자·등장 여부는 미정, D10) | 정보 없음. 공유만으로 위치를 알 수 없음 |
| 야무지 | 22:27쯤 창밖의 붉은 불빛 목격(C03, 어느 방 창인지 코드에 없음) | 정보 없음 |
| 꾸티뉴, 난워니, 만조, 야뿌, 하루노츠키, 윤타미 | 22:21 거실(`MEMBER_ROOMS.night`) 이후 기록 없음 | 정보 없음(반대 근거도 없음) |
| 외부인 전원 | 각자 다른 곳이라고 진술하거나 기록이 있음(CANON C-2) | **넣지 않음** |

```
PROMPT: Candid smartphone photo taken by an unseen person standing in front of the rough
stone fireplace, looking east toward the wall shelves and the smaller beige sofa, part of
the tall rainy night windows on the left, right after a power outage ended. The right edge
stops before the south-east corner (no door in frame). Exactly five friends from the
character references, matching each sprite exactly: kimokdok, manjo, yuntami, nanwoni,
yamuji. They stand or sit apart, looking uneasy, glancing around and talking quietly.
Not a selfie, no posing, no V signs, no man in a grey work coverall, no older man in a
suit, nobody else.
```

### 2-3. 새 증거 (2차, 2026-11-13 명세 확정 · 코드 미구현)

공통: CH-03 기준 장면을 바탕으로 한 **복도 문 쪽 2배 확대 프레임**. E17과 E18은 **같은 확대 영역**(문과 그 주변 벽, 소파 끝 일부)이어야 대조가 됩니다. 벽시계는 확대 화면 밖(E03의 "영상 속 벽시계" 단서를 앞당기지 않음). NVR UI는 §4 `_nvr_ui`와 E03의 확대 표시를 그대로 씁니다. 문자열은 §4-3(구현 때 데이터 블록으로 옮김).

#### E17 — NVR 22:14 퇴장 프레임 (N2)

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E17 (챕터 3 관리실에서 E02와 함께 획득 예정, 챕터 5 시간표 22:21 근거) |
| 2 | 새 경로 | `assets/evidence/e17-nvr-hallway-exit-2214.webp` (가칭) |
| 5 | 배경·장소 | CH-03 22:21 프레임의 복도 문 쪽 확대. 정전 전이라 조명 켜짐. 문이 열려 있거나 막 열리는 중 |
| 6 | 인물 | **윤해준 1명**: 문 쪽으로 걸어 나가는 옆모습·뒷모습이지만 스프라이트 구별 포인트(진회색 작업복, 목 수건, 공구 파우치, 모자 없음)로 판별 가능 |
| 7 | 금지 | 우비·안전화·헤드랜턴(아직 착용 전, E14 단서를 앞당기지 않음), 다른 인물의 얼굴(10명의 위치를 이 프레임으로 정하지 않음 — 화면 가장자리에 소파 끝만 허용), 날짜, 판독 가능한 벽시계 |
| 10 | 시각 | 표시 `22:14` → 실제 22:21:00 (도구 검산 확인: CANON 오차 7분) |
| 13 | 퍼즐 | 챕터 5 시간표 「윤해준이 거실을 떠남」 22:21 (현재 힌트는 챕터 1 장면을 가리킴 → 구현 시 이 증거로 교체) |
| 15 | 완성 후 확인 | 윤해준 판별, E18과 같은 확대 영역, 시계 없음, 문 위치가 CH-03 기준 장면과 같음 |

**E17 제작 준비 (2026-11-13, 실제 제작 전)**

- 바탕: `tools/evidence-compose/work/ch03/E17_bg_crop_x0-724_y250-793_2x.png` — **CH-03 v2 원본**(SHA-256 `d059d2ea…`)의 x 0~724, y 250~793을 2배 확대. 시계·샹들리에 없음
- 확대 결과 좌표: 복도 문틀 x 286~626, y 170~800 / 문턱 y≈800 / 왼쪽은 동쪽 책장(혼천의·스탠드), 오른쪽 아래는 러그와 커피 테이블 끝
- 편집 마스크: `work/ch03/E17_person_mask.png` (흰색 = 편집 허용 x 260~680, y 150~830: **문짝을 여는 것 + 문턱에서 나가는 인물만**). 위치 확인용: `E17_person_guide.png`
- 장면: 문은 복도 쪽으로 열림(거실 쪽 배경을 가리지 않게). 열린 틈으로 어두운 복도. 윤해준은 문턱에서 복도로 걸어 나가는 옆·뒷모습, 키는 문 높이의 약 85%(머리 위 y≈265, 발 y≈795)
- **배경 보존 합격 기준(E17·E18 공통):** 결과 크기 정확히 1448×1086, 마스크 밖 평균 차이 **3.0 이하**, 차이 40 초과 픽셀 **1% 이하**. 넘으면 E03처럼 수용하지 않고 마스크 밖 보존으로 다시 생성. 판정은 E03과 같은 비교 방식(승인 바탕 대비 픽셀 비교)
- E18은 **E17 결과물**을 바탕으로 인물만 바꿈(문·복도 상태 유지)
- 구현 때 할 일: §4-3의 E17 데이터를 데이터 블록으로 옮기고 `layouts.js`에 E17 배치(NVR, 시계 없음) 추가 → **완료(2026-11-13)**

**E17 최종 후보 기록 (2026-11-13, 게임 `assets/` 미교체)**

- 바탕 `work/ch03/E17_bg_final_v3.png` (SHA-256 `bcdc031d…`): 승인 확대 바탕 + 문·인물(전달본 `E17_bg_with_haejun.webp`) + 바닥 불빛 확장(x 360~680, y 830~960) + 신발(`E17_bg_shoefix_v3.webp`, x 375~545, y 730~840)을 각각 영역만 페더 합성
- 신발: 낮은 검정 슬립온(밑창 무늬·안전화 형태 없음). 작업화·우비·헤드랜턴 없음. 신발 수정 전달본은 배경 전체가 미세하게 다시 그려져(마스크 밖 평균 4.24) 신발 영역만 사용
- 배경 보존: 확장 마스크(x 260~680, y 150~830 + x 360~680, y 830~960) 밖 평균 차이 **0.003**, 40 초과 **0.000%** → 합격
- 최종 후보 `work/ch03/e17-final/e17-nvr-hallway-exit-2214.webp` (보관 `work/ch03/approved/E17_final_candidate_e17-nvr-hallway-exit-2214.webp`, SHA-256 `fa5714d961453a25b18955de4ca2fd9cbd1a2e9f977af543037d7873ec93ac9e`). `render E17 --cctv-filter`, 벽시계 없음. 자동 검사 통과(경고: 새 증거라 게임 파일 없음 — 데이터에 `new_evidence: true`)
- E18 바탕은 `E17_bg_final_v3.png`

```
PROMPT: [CH-03 reference scene, same camera, a moment at 22:21, digitally zoomed about 2x
toward the plain wooden corridor door at the east end of the south wall] One man from the
character reference walks out through the open door into the dim corridor: dark grey work
coverall, towel around the neck, tool pouch on the belt, no hat, seen from the side and
back. Lights on. Only the end of a beige sofa at the frame edge, no other faces. No wall
clock in view. CCTV grain, slight zoom softness. Empty corners for a UI overlay.
```

#### E18 — NVR 22:28:13 입실 프레임 (N1)

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E18 (챕터 5 시작 때 지급 예정, 시간표 22:55 근거) |
| 2 | 새 경로 | `assets/evidence/e18-nvr-hallway-return-222813.webp` (가칭) |
| 5 | 배경·장소 | E17과 **같은 확대 영역**. 정전 복구 뒤라 조명 켜짐 |
| 6 | 인물 | **윤해준 1명**이 복도에서 거실로 들어오는 모습(얼굴이 보이는 정면~반측면) |
| 7 | 금지 | 우비·헤드랜턴·안전화(보일러실에 숨긴 뒤, E14), **젖은 옷 강조**(코드에 없는 단서), 다른 인물(22:55 거실 인원을 이 프레임으로 정하지 않음), 날짜, 판독 가능한 벽시계 |
| 10 | 시각 | 표시 `22:28:13` → 실제 22:55:00 (도구 검산 확인: CANON 오차 26분 47초). 7분만 보정하면 22:35:13 = 녹화 정지 시간(22:24:18~22:44:05) → 모순이 드러나도록 설계 |
| 13 | 퍼즐 | 챕터 5 시간표 「윤해준 거실 복귀」 22:55 |
| 15 | 완성 후 확인 | 윤해준 판별, E17과 문·벽·소파 끝 위치 일치, 우비 등 없음 |

```
PROMPT: [Same zoomed area as the approved E17 frame, a later moment at 22:55] The same man
(dark grey work coverall, towel around the neck, tool pouch, no hat) steps in from the dim
corridor through the wooden door into the lit living room, face visible. No raincoat, no
headlamp, no boots emphasis, not visibly soaked. No other people. No wall clock in view.
CCTV grain, slight zoom softness. Empty corners for a UI overlay.
```

**E18 제작 준비 (2026-11-13, 인물 생성 전)**

- 바탕: `work/ch03/E18_bg_base_from_E17_final_v3.png` = 승인된 E17 바탕 `E17_bg_final_v3.png` 사본(SHA-256 `bcdc031d…`, 같은 파일). 문은 E17처럼 복도 쪽으로 열린 상태, 복도 벽등·바닥 불빛 유지
- 편집 마스크: `work/ch03/E18_person_mask.png` (흰색 = 편집 허용). **A** x 300~650, y 180~850(문 안쪽·문짝·인물) + **B** x 340~660, y 850~940(앞발과 발밑 그림자). 위치 안내: `E18_person_guide.png`
- 마스크 안에서 할 일: ① E17 인물(대략 x 385~575, y 250~842)을 완전히 지움 ② 문짝은 E17과 같은 열림 각도 유지 ③ 윤해준 1명을 넣음
- 인물 위치·자세: 복도에서 거실로 **문턱을 막 넘는** 순간. 뒷발은 문턱(y≈800), 앞발은 거실 바닥(y≈848). 몸 중심 x≈470, 머리 위 y≈245(E17보다 조금 가까워 키 약 600px). 얼굴은 카메라(화면 오른쪽 위) 쪽 정면~반측면. 양손은 몸 옆(문을 잡지 않음 → 문짝 변경 최소화)
- 외형: E03·E17과 같은 진회색 작업복, 목 수건, 공구 파우치, 모자 없음, **낮은 검정 슬립온**(E17과 같은 신발). 금지는 위 표 7번
- 일관성(E17 대비): 마스크 밖은 같은 파일이므로 문틀·책장·바닥·조명·러그·테이블이 픽셀 단위로 같음. 22:21과 22:55 모두 정전 전·복구 후라 조명 켜짐 상태가 같아 그대로 써도 모순 없음. 확대 영역도 같음(x 0~724, y 250~793, 2배)
- 시각 검산(도구 `nvrToReal`): 표시 `22:28:13` → 실제 **22:55:00** ✓. 7분만 보정하면 22:35:13(녹화 정지 22:24:18~22:44:05 사이) → 의도한 모순 유지
- **합격 기준:** 크기 1448×1086 / 마스크 밖 평균 차이 **3.0 이하**, 차이 40 초과 **1% 이하**(비교 대상 `E18_bg_base_from_E17_final_v3.png`) / E17 인물 흔적 없음 / 윤해준 얼굴 식별 / 우비·헤드랜턴·작업화·젖은 옷 강조·다른 인물 없음 / 문틀과 문짝 각도가 E17과 같음 / 발·그림자와 바닥 이음매 자연스러움. 배경 전체가 다시 그려져 오면 E17처럼 마스크 영역만 합성해 판정

**E18 최종 후보 기록 (2026-11-13, 게임 `assets/` 미교체)**

- 전달본 `work/ch03/E18_bg_with_haejun.webp`(1448×1086, SHA-256 `36110dfe…`): 마스크 밖 평균 차이 **9.60**, 40 초과 0.02% → 배경 전체가 다시 그려져 그대로는 불합격
- 마스크 안(A·B)만 페더 합성한 `work/ch03/E18_bg_final_v1.png`(`d879dd4e…`): 마스크 밖 평균 **0.003**, 40 초과 **0.000%** → 합격. 문틀 오른쪽 벽·돌 띠, 발밑 바닥 경계에 이음매 없음
- 인물: 윤해준 1명, 얼굴 반측면으로 식별 가능. 진회색 작업복·회색 목 수건·공구 파우치·모자 없음·낮은 검정 슬립온. 우비·헤드랜턴·작업화·젖은 옷 없음. E17 인물 잔상 없음. 문짝 열림 각도 E17과 같음
- 최종 후보 `work/ch03/e18-final/e18-nvr-hallway-return-222813.webp` (보관 `work/ch03/approved/E18_final_candidate_e18-nvr-hallway-return-222813.webp`, SHA-256 `9387ad09ca7cee9d4b5af6e145e83224286efa801758ef02d636f50095622dfe`). `render E18 --cctv-filter`, 벽시계 없음. 자동 검사 통과(경고: 새 증거)

---

## 3. P1·P2 및 유지 항목

### E13 — 분전반 독립 로그 (P1)
- **챕터:** 4·5
- **의미:** 22:24:18 수동 OFF, 22:44:05 수동 ON. NVR과는 독립된 시계입니다.
- **필수 문자열**
  - `분전반 조작 로그 (독립 배터리 시계)`
  - `22:24:18  메인 차단기  수동 OFF`
  - `22:44:05  메인 차단기  수동 ON`
  - 날짜 열은 두지 않습니다(D1).
- **오후 기록:** 넣을 경우 `15:41:xx OFF` / `15:48:xx ON`. 17:03은 **금지**
- **금지:** 조작자 이름(기록 장치는 사람을 알지 못함. 조작자는 D9 정답 설정이지만 이미지에 쓰지 않음), 날짜
- **퍼즐:** P09, 챕터 5 시간 근거
- **현재 문제:** 오후 복구 17:03:11
- **재제작:** 필요

### E12 — 차량 블랙박스 (P1)
- **챕터:** 3·4·5
- **의미:** 독립 배터리 시각 22:27쯤(챕터 4는 22:42쯤도) 외부 통로에서 작은 붉은 불빛이 이동합니다. 얼굴은 식별할 수 없습니다.
- **필수 요소**
  - 오버레이 `22:27:xx`(날짜 없음)
  - 비 오는 밤
  - **별장 창문·문주 조명 모두 꺼짐**(정전)
  - 붉은 점 불빛과 형체만 보이는 실루엣
- **금지:** 얼굴 식별, 켜진 조명, 빌라명(현재 "서헌 빌라" 삭제, D3), 날짜
- **퍼즐:** P08, P11(장도윤)
- **재제작:** 필요

### E06 — 주방 경과 타이머 (P1)
- **챕터:** 3·4·5
- **의미:** 23:20에 표시 00:36(정전 후 00:00부터 다시 시작) → 복구 약 22:44
- **필수 요소:** 주방(D14), 디지털 타이머 `00:36`, **창밖은 비 오는 밤**
- **금지:** 낮 하늘, 눈
- **퍼즐:** P06(보조), 챕터 5
- **재제작:** 필요

### E04b / E04c — 정전 중·복구 직후 휴대폰 영상 (P1)
- **E04b:** 대표 거실(D11), 조명 꺼짐, 휴대폰 녹화 UI, 상태바 `22:31`. 윤해준은 화면에 없습니다.
- **E04c:** **주방에서 거실 문턱 쪽을 본 시점**, 조명 켜짐, 상태바 `22:46`
- **두 영상의 녹화 카운터와 배터리 값은 서로 다르게** 합니다. 날짜는 넣지 않습니다.
- **퍼즐:** P04, P05
- **현재 문제:** 같은 프레임(현재 거실은 `living.webp`과 비슷한 디자인)
- **재제작:** 필요

### E05 — 스마트워치 마지막 활동 (P1)
- **필수 요소**
  - `마지막 활동 22:41`
  - 활동 종류는 걷기 기록이 아닌 것(예: `심박 기록 마지막 측정 22:41`)
  - 현장 사진 구도(바닥이나 손목 근처. 장갑 낀 손은 가능)
- **금지:** "실내 걷기 32분 2.4km", 날짜
- **퍼즐:** P05
- **재제작:** 필요

### E08 — 서재 출입 기록 (P1)
- **필수 문자열**
  - `22:01 강석훈 입실`
  - `22:07 오세린 입실`
  - `22:16 오세린 퇴실`
  - `23:34 관리인 비상키 개문` (게임 텍스트도 "비상키"로 통일, 2026-11-13)
- **날짜:** 넣지 않습니다(D1).
- **시스템명:** 빌라명 없이 `서재 출입 기록`만 씁니다(현재 "청안 빌라" 삭제, D3).
- **금지:** 2025-03-14, "3장 사건일" 같은 제작용 메모
- **챕터 4 메모 흔적("22:30 테라스 약속"):** 이 이미지에 넣는다면 포스트잇 메모 형태로 작게 넣습니다.
- **퍼즐:** P02, 반박, 챕터 5
- **재제작:** 날짜와 이름만 수정하면 됨

### E01 — 오후 정전 기록 (P2)
- **결정:** 아래 둘 중 하나를 고릅니다.
  1. 하루노츠키 휴대폰 영상(15:41~15:48, 상태바 시각, 조명이 꺼졌다 켜짐)으로 다시 만들기
  2. 현재 NVR 화면을 유지하고 E01 설명을 고치기(코드 텍스트 변경)
- **공통 조건:** 날짜 없음(현재 04-17 삭제), 낮 창밖은 허용(오후), 거실이 나오면 D11
- **퍼즐:** P01, P00
- **현재 문제:** 형식 불일치, 날짜 04-17

### E09 — 20:41 바비큐 사진 (P2)
- **필수 요소**
  - **야뿌 시점**(야뿌는 화면 밖), 테라스 야외 바비큐, 멤버 일부
  - 배경에서 강석훈({D12})이 이유나(`lee-yuna/normal.webp`)에게 **서류 봉투**를 건넴
  - 오른쪽 아래 `20:41`
- **금지:** 실내 소파, 야뿌가 사진 안에 있는 셀카 구도, 날짜
- **퍼즐:** P03, P11

### E11 — 테라스 문 안쪽 발자국 (P2)
- **필수 요소:** **서재 실내 바닥**(테라스 문 안쪽), 젖은 붉은 황토의 안전화 자국, 뒤꿈치 V자 마모
- **금지:** 야외 데크, 크기만으로 특정하는 표기
- **퍼즐:** P02, P07, 반박 2

### E14 — 은닉 장비 (P2 → 2차 재제작, N10)
- **필수 요소:** 보일러실 선반 뒤 안전화, 젖은 우비, 적색 모드 헤드랜턴. **안전화 한 짝은 밑창이 보이게** 놓아 V자 마모가 확인되게 합니다.
- **헤드랜턴 표식 (N10, C02와 동일):** **검은 끈**, 버클 옆에 **노란 절연테이프 한 줄**(폭은 손가락 한 마디, 끈을 한 바퀴 감음). 램프 몸체는 검은 사각형, 적색 모드 켜짐. 테이프가 보이게 끈을 펼쳐 놓음
- **형식:** 1448×1086(4:3), 증거 라벨("E14 | …") 없음, 플래시 현장 기록 사진
- **금지:** 소유자 이름표, **붉은 끈**(현재 이미지), 다른 색·위치의 테이프, 라벨·날짜
- **퍼즐:** P07, 챕터 5 경로
- **현재 문제:** 끈이 붉은색이라 C02와 대조 불가, 라벨이 그림에 박힘, 정사각형
- **재제작:** 필요 (C02에서 확정한 헤드랜턴 디자인으로 이어서 제작)

### C09 — 마모 비교 (P2)
- **필수 요소:** 왼쪽은 은닉 안전화 밑창, 오른쪽은 **E11 서재 족적 사진**. 같은 위치의 V자 마모
- **문구:** `은닉 안전화 밑창` / `서재 테라스 문 안쪽 족적`
- **금지:** "피의자", "창고 입구"
- **퍼즐:** P07

### C06 — 옹벽 균열 점검서 (P2)
- **필수 요소:** 옹벽 균열 점검 결과 `균열 진행, 보수 필요`, 의뢰인 `소유자 박태성`, 새 종이(최근 문서로 보이게)
- **날짜:** 넣지 않습니다(D1). 오래된 사고 문서와는 종이 상태와 제목(`매매 전 구조 점검`)으로 구별합니다.
- **금지:** 2015년 등 연도, "현장소장", 사고 당시 문서처럼 보이는 표기
- **퍼즐:** P11(박태성), 챕터 5 숨은 진실

### E16 — 서재 벽난로 확대 (P2)
- **필수 요소:** 그을린 벽난로, 재와 탄 종이(E15와 같은 조각), **부지깽이의 위치**, 창밖은 비 오는 밤
- **금지:** 설경, 혈흔 클로즈업
- **퍼즐:** 챕터 5 수법(poker)

### C01 — 윤해준 명함 (P2)
- **필수 문자열**
  - 이름 `윤해준` (명함이므로 실명이 정상)
  - 직함 {D5}
  - `기술자 등록번호 {registration}` (값은 CANON B장, 현재 이미지와 같음. 다시 만들 때 §4 데이터에 C01 항목을 추가)
  - 가상 회사명, `010-0000-0000`, `example.com`
- **금지:** 실존 주소(국제금융로 10 등), 실재할 수 있는 번호·도메인
- **퍼즐:** P10, 반박 3
- **현재 문제:** 실존 주소, 직함 불일치

### C02 — 헤드랜턴 시연 사진 (2차 재제작, N10)
- **장면:** 오후, 별장 실내, 윤해준이 머리에 쓴 헤드랜턴의 **적색 모드**를 켜 보이는 사진. 다뮤_가 받아 둔 사진이지만 다뮤_는 화면에 넣지 않음
- **인물:** 윤해준 1명, **스프라이트 기준**(진회색 작업복, 목 수건, 공구 파우치, 모자 없음). 현재 이미지는 검은 재킷 차림이라 기준과 다름
- **헤드랜턴 표식 (N10, E14와 동일):** 검은 끈, 버클 옆 노란 절연테이프 한 줄이 **화면에서 식별 가능**한 각도(옆머리 쪽 버클이 보이게). 이 이미지에서 헤드랜턴 디자인을 먼저 확정하고 E14가 따름
- **형식:** 1448×1086(4:3), 라벨·날짜 없음(현재 "2023. 10. 14. 14:27" 삭제, D1)
- **금지:** 날짜, 라벨, 붉은 끈, 다른 인물의 얼굴
- **퍼즐:** P08, 챕터 5 경로(표식 대조 문구는 구현 단계에서 C02·E14 설명에 추가)

```
PROMPT: Indoor afternoon snapshot inside the mountain villa. One man from the character
reference (dark grey work coverall, towel around the neck, tool pouch, no hat) demonstrates
a headlamp on his forehead with the red mode switched on. The headlamp has a black elastic
strap with one wrap of yellow electrical tape right next to the side buckle, clearly
visible from a three-quarter angle. Natural light, casual phone photo. No other people.
```

### C11(가칭) — 분전반 레버의 황토 자국 (2차 새 증거, D9)
- **챕터:** 4 지하 보일러실(획득 조건·설명 문구는 구현 단계에서 결정), 챕터 5 근거 후보
- **장면:** C05와 **같은 분전반**(회색 금속 함, 열린 커버, 차단기 두 줄)의 **메인 차단기 레버 근접 사진**. 레버는 **ON(올린) 위치**이고, 레버를 올리는 손가락이 닿는 면에 **젖은 붉은 황토**(C08·E11과 같은 색) 자국. 플래시 현장 기록
- **표현 한계:** 지문처럼 사람을 특정할 수 있는 무늬는 넣지 않음(번진 자국만). 시각 표시 없음
- **금지:** 이름, 화살표·동그라미 강조, "범인" 표기, 판독 가능한 차단기 라벨 글자(빈 라벨 또는 흐림), 날짜
- **C05 정합성:** 현재 C05에는 메인 레버가 따로 구별되지 않음 → 근접 사진에서 **두 줄 차단기 위쪽의 큰 레버 1개**를 메인으로 둠. C05를 재제작할 경우 같은 배치로 맞춤(C05 재제작은 선택)
- **증거의 한계:** CANON E-4 표(혼자서는 조작자를 특정하지 않음)

```
PROMPT: Close-up evidence photo with harsh flash of the same grey metal breaker panel as
the reference (open cover, two rows of small breakers). Above the two rows, one larger
main breaker lever in the UP (on) position. Wet reddish-brown clay smeared on the face of
the lever where a finger pushes it up, slightly dripping, no fingerprint pattern. Breaker
labels blank or blurred. Dim basement, concrete wall. No hands, no people, no arrows.
```

### 유지 항목 (재제작 불필요, 참고만)
- **C05, C07, C08:** 설명과 일치합니다. C07과 C08의 흰 여백은 다듬기만 하면 됩니다.
- **ch5-timeline-board, ch5-suspect-board:** 정답 시각은 노출되지 않습니다. 시간표 보드는 6칸 중 2칸이 윤해준 이동이라 범인을 암시하는데, 이는 게임 데이터 문제라 코드 결정이 필요합니다.
- **C03:** 이미지 없음(목격 증언).

---

## 4. 글자 합성 도구와 공식 문자열 데이터

### 4-1. 도구
`tools/evidence-compose/`에 있습니다. 사용법은 그 폴더의 `README.md`를 봅니다.

- **방식:** AI가 만든 글자 없는 바탕 그림 위에 HTML/CSS 템플릿으로 글자를 얹습니다.
  - 기존 테스트 도구의 헤드리스 Chrome(`tests/lib/browser.js`)으로 1448×1086 WebP를 찍습니다.
  - 외부 패키지는 쓰지 않습니다.
- **값의 출처**
  - 문자열·시각·참조 자료: 아래 4-2 블록
  - 등록번호, NVR 오차 규칙, 녹음 구간: CANON에서 직접 읽음
  - 도구 안에는 이야기 문자열이 없습니다(좌표만 `layouts.js`에 있음).
- **보호:** 게임 폴더(`assets/`)에는 쓰지 않습니다. 결과는 `output-preview/`에 저장되고 Git에서 제외됩니다. `blocked` 상태 ID는 완성본을 만들지 않습니다.
- **자동 검사**
  - 필수 문자열이 모두 있는지
  - 금지 문구, 날짜 형식, 공식 번호와 다른 등록번호가 없는지
  - NVR 시각과 벽시계 시각이 맞는지, 같은 순간(E02↔E04a)인지, 녹음 시작·길이·종료가 맞는지
  - 출력 크기·비율·형식이 맞고, 입력 원본 해시가 그대로인지
  - 한글 글꼴이 실제로 있는지, 모바일 표시 폭(340px)에서 글자 크기가 충분한지, 글자가 넘치지 않는지
- **자동으로 확인할 수 없는 것:** 바탕 그림에 AI가 만든 가짜 글자가 있는지, 인물 식별, 시계 바늘 등은 미리보기의 「사람이 확인할 항목」에 표시됩니다.

### 4-2. 공식 문자열 데이터 (유일한 원본)

- `{registration}`은 CANON B장 「등록번호 값」으로 바뀝니다.
- `{"redact":true}`는 검게 가림, `{"signature":true}`는 판독 불가 서명입니다.
- `status`는 §1 표의 상태입니다. `needs-*`는 경고, `blocked`는 완성본 합성 금지입니다.
- `wall_clock`은 영상 속 벽시계의 **실제 시각**이고 `text.time`은 NVR **표시 시각**입니다. 둘은 별개이며, 도구가 CANON의 오차 규칙으로 서로 맞는지 검산합니다.

<!-- evidence-data:start -->
```json
{
  "_nvr_ui": {
    "title": "VILLA CCTV / NVR v2.7",
    "channel": "● CH-03  Living Room (Main)",
    "rec": "● REC",
    "codec": "H.264   1920×1080   25FPS"
  },
  "_forbidden": {
    "patterns": [
      "(?:19|20)\\d{2}\\s*[-./]\\s*\\d{1,2}\\s*[-./]\\s*\\d{1,2}",
      "(?:19|20)\\d{2}\\s*년",
      "\\d{1,2}\\s*월\\s*\\d{1,2}\\s*일",
      "(?<![\\d:])\\d{1,2}/\\d{1,2}(?![\\d:])",
      "[월화수목금토일]요일",
      "\\([월화수목금토일]\\)"
    ],
    "words": ["피의자", "범인", "청안 빌라", "서헌 빌라", "청명산", "백운산", "2023-0478", "소유권"]
  },
  "C10": {
    "template": "document", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/c10-construction-log.webp",
    "refs": ["assets/backgrounds/storage-room.webp"],
    "requires_registration": true,
    "text": {
      "header": "현장공사일지",
      "project": "공사명: 별장 증축 공사",
      "columns": ["날짜", "작업 내용", "확인"],
      "legible_row": "옹벽 구간 안전점검 — 검사 담당 기술자 등록번호 {registration}"
    },
    "forbidden": ["윤해준", "리조트", "화천", "건설"]
  },
  "E10": {
    "template": "document", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/e10-accident-report.webp",
    "refs": [],
    "requires_registration": true,
    "text": {
      "title": "사고 보고서 (사본)",
      "rows": [
        ["공사명", "별장 증축 공사"],
        ["사고 구분", "옹벽 붕괴"],
        ["피해", "작업자 사망"],
        ["원인(공식 발표)", "폭우"],
        ["현장 책임자", {"redact": true}],
        ["안전점검 실무 확인", "점검 기술자 등록번호 {registration}"],
        ["서명", {"signature": true}]
      ],
      "stamp": "사본"
    },
    "forbidden": ["윤해준", "강석훈", "부상", "부실", "1명", "2명", "협박", "은폐"]
  },
  "E15": {
    "template": "fragments", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/e15-burned-document.webp",
    "refs": ["assets/evidence/e16-study-fireplace-closeup.webp", "assets/backgrounds/ch5-culprit-confrontation-study.webp", "assets/backgrounds/corridor.webp"],
    "partial_registration": "fragment_number",
    "text": { "fragment_title": "…고 보고서", "fragment_number": "…015-03…" },
    "forbidden": ["이전 등록"]
  },
  "C04": {
    "template": "document", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/c04-accident-news.webp",
    "refs": ["assets/backgrounds/storage-room.webp"],
    "no_registration": true,
    "text": {
      "headline": "별장 증축 현장 옹벽 붕괴… 작업자 숨져",
      "subhead": "당국 \"폭우가 원인\"",
      "body": "산속 별장의 증축 공사 현장에서 옹벽이 무너져 작업 중이던 작업자가 숨졌다. 당국은 당시 쏟아진 폭우를 사고 원인으로 발표했다."
    },
    "forbidden": ["부상", "부실", "서울", "은평", "1명", "2명", "윤해준", "오세린"]
  },
  "E07": {
    "template": "phone-recorder", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/e07-ohserin-interview-recording.webp",
    "refs": [],
    "text": { "app": "녹음", "title": "면담 녹음", "start": "22:07", "length": "09:04", "position": "03:12" },
    "forbidden": ["면담 대상", "CH3", "16:20", "24:18", "07:36", "오세린", "강석훈"]
  },
  "E02": {
    "template": "nvr", "status": "needs-reference:CH-03", "size": [1448, 1086],
    "current": "assets/evidence/e02-living-room-cctv-2205.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/kkutinyu/normal.webp", "assets/characters/nanwoni/normal.webp", "assets/characters/kimokdok/normal.webp", "assets/characters/manjo/normal.webp", "assets/characters/yappu/normal.webp", "assets/characters/moya/normal.webp", "assets/characters/harunotsuki/normal.webp", "assets/characters/yuntami/normal.webp", "assets/characters/yamuji/normal.webp", "assets/characters/damyu/normal.webp"],
    "text": { "time": "22:05" },
    "wall_clock": "22:12", "wall_clock_legible": false
  },
  "E04a": {
    "template": "chat-photo", "status": "final-original", "size": [1448, 1086],
    "current": "assets/evidence/e04a-group-photo-2212.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/kkutinyu/normal.webp", "assets/characters/nanwoni/normal.webp", "assets/characters/kimokdok/normal.webp", "assets/characters/manjo/normal.webp", "assets/characters/yappu/normal.webp", "assets/characters/moya/normal.webp", "assets/characters/harunotsuki/normal.webp", "assets/characters/yuntami/normal.webp", "assets/characters/yamuji/normal.webp", "assets/characters/damyu/normal.webp"],
    "same_moment_as": "E02",
    "text": { "sender": "난워니", "sent_time": "22:12" }
  },
  "E03": {
    "template": "nvr", "status": "applied", "size": [1448, 1086],
    "current": "assets/evidence/e03-nvr-wallclock-223413.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/yoon-haejun/normal.webp"],
    "text": { "time": "22:34:13", "zoom": "ZOOM ×2.0" },
    "wall_clock": "23:01", "wall_clock_legible": true
  },
  "E17": {
    "template": "nvr", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/e17-nvr-hallway-exit-2214.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/yoon-haejun/normal.webp"],
    "text": { "time": "22:14", "zoom": "ZOOM ×2.0" },
    "wall_clock": "22:21", "wall_clock_legible": false
  },
  "E18": {
    "template": "nvr", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/e18-nvr-hallway-return-222813.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/yoon-haejun/normal.webp"],
    "text": { "time": "22:28:13", "zoom": "ZOOM ×2.0" },
    "wall_clock": "22:55", "wall_clock_legible": false
  },
  "E04d": {
    "template": "chat-photo", "status": "ready", "size": [1448, 1086],
    "current": "assets/evidence/e04d-group-photo-2250.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/kimokdok/normal.webp", "assets/characters/manjo/normal.webp", "assets/characters/yuntami/normal.webp", "assets/characters/nanwoni/normal.webp", "assets/characters/yamuji/normal.webp"],
    "text": { "sender": "다뮤_", "sent_time": "22:50" },
    "forbidden": ["촬영"]
  }
}
```
<!-- evidence-data:end -->

### 4-3. 대기 데이터 (구현 때 위 데이터 블록으로 옮김)

현재 대기 항목 없음. E17·E18은 2026-11-13 배치(`layouts.js`)와 함께 위 데이터 블록으로 옮김(`new_evidence: true`). C02·E14·C11은 합성 글자가 없는 사진이라 데이터가 필요 없습니다.

- 검산(2026-11-13, 도구의 `nvrToReal` + CANON 오차 규칙): `22:14` → 22:21:00, `22:28:13` → 22:55:00. 벽시계는 두 프레임 모두 화면 밖이므로 `wall_clock`은 검산용 값입니다.

---

## 5. 제작 순서 (권장)

| 순서 | 대상 | 선행 조건 | 상태 |
|---|---|---|---|
| 1 | C10 → E10 → C04 → E07 → E15 | — | **적용 완료**(PR #12) |
| 2 | **CH-03 화각 기준 장면**(인물 없음, 벽시계 + 복도 문) | — | 첫 작업. **화각 검증(§2-2) 통과 후 승인** |
| 3 | E03 (23:01, 윤해준, 시계 확대) | 2 | **조건부 최종 후보**(배경 재생성 수용, E02 비교 대기). 윤해준 CCTV 외형 기준 |
| 4 | E17 (22:14, 문 쪽 확대) | 2, 3 | **최종 후보**(2026-11-13, 배경 보존 합격). 게임 미교체 |
| 5 | E18 (22:28:13, E17과 같은 확대 영역) | 4 | **최종 후보**(2026-11-13, 배경 보존 합격). 게임 미교체 |
| 6 | E04a → E02 (22:12 같은 순간, 10명) | 2(남쪽 벽 디자인) | E04a 구도를 먼저 정하고 E02를 맞춤 |
| 7 | E04d (22:50, 5명) | D18 확정(완료) | CH-03과 무관해 2~6과 병행 가능 |
| 8 | C02 → E14 (헤드랜턴 표식 N10) | C02에서 헤드랜턴 디자인(검은 끈 + 노란 테이프) 확정 | CH-03과 무관, 병행 가능 |
| 9 | C11(가칭) 분전반 레버 | C05(분전반 디자인) 참조 | CH-03과 무관, 병행 가능 |

- **코드 구현은 이미지 승인 뒤**: E17·E18·C11 증거 항목, C02·E14 설명의 표식 문구, 챕터 5 시간표 힌트 교체, 데이터 블록 이동(§4-3)과 `layouts.js` 배치.

- 교체할 때마다 `evidence-audit` 절차로 검수합니다.
- 이어서 `node tests/logic-assets.test.js`와 `node tests/browser-portraits.test.js`를 실행합니다.
