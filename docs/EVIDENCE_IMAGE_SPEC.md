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
| C10 | c10-construction-log.webp | 다른 현장, 실명 강조 (F2) | **바로 제작 가능** (`ready`) | — |
| E10 | e10-accident-report.webp | 부상·부실·실명·연도 (F3, F24) | **바로 제작 가능** (`ready`) | — |
| C04 | c04-accident-news.webp | 다른 장소·부상·부실 (F4) | **바로 제작 가능** (`ready`) | — |
| E07 | e07-ohserin-interview-recording.webp | 다른 녹음 (F7) | **바로 제작 가능** (`ready`) | — |
| E15 | e15-burned-document.webp | 다른 문서·번호 (F1) | **바로 제작 가능** (`ready`) | — (촬영 위치 A안 사용자 승인) |
| E03 | e03-nvr-wallclock-223413.webp | 윤해준 없음, 다른 거실 (F5, F22, F23) | **기준 이미지 추가 필요** (`needs-reference`) | CH-03 화각 기준 장면(남쪽 벽 포함) 1장을 먼저 만들고 승인 |
| E02 | e02-living-room-cctv-2205.webp | 다른 거실 (F22, F26) | **기준 이미지 추가 필요** (`needs-reference`) | 인물 결정(D13·D20·D21) 완료. CH-03 기준 장면이 필요하고, 확정된 E04a의 인물 배치를 따름 |
| E04a | e04a-group-photo-2212.webp | 다른 거실 (F22) | **기준 이미지 추가 필요** (`needs-reference`) | 인물 결정 완료. 사진 배경에 남쪽 벽 일부가 들어가므로 CH-03 기준 장면(남쪽 벽 디자인)을 먼저 승인 |
| E04d | e04d-group-photo-2250.webp | E04a 복제, 셀카 구도 (F6, F25) | **인물 구성 결정 필요** (`blocked:D18`) | D18. **결정 전 완성본 제작 금지**(도구도 합성을 거부함) |

P1·P2는 §3에 있습니다.

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

네 장 모두 CANON A장의 대표 거실과 CH-03 정의를 따릅니다.

| ID | 촬영 위치 → 방향 | 보이는 벽 | 실제 시각 |
|---|---|---|---|
| E02 | CH-03 북동 천장 모서리 → 남서(넓은 화각), 22:12 순간의 프레임 | 남쪽 벽(시계는 작고 **판독 불가**), 서쪽 돌 벽난로 | 22:12 (표시 22:05) |
| E04a | 같은 순간. **동쪽 벽 선반에 고정한 휴대폰의 타이머 촬영**(D20) → 서남서쪽 | 사람들 뒤로 서쪽 벽난로와 남쪽 벽 가장자리. 벽시계는 **프레임 밖** | 22:12 |
| E03 | **같은 CH-03 카메라**가 녹화한 **다른 시각(23:01)의 프레임**. 그 22:34:13 프레임을 확대 | 남쪽 벽 시계(**판독 가능** 11:01)와 그 앞의 윤해준 | 23:01 (표시 22:34:13) |
| E04d | 서쪽 벽난로 앞 → 동쪽 | 동쪽 선반 벽, 작은 소파, 왼쪽에 북쪽 창 일부. 남쪽 벽(시계)은 프레임 밖 | 22:50 |

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
- 남쪽 벽은 `living.webp`에 없는 면입니다. 시계 말고는 단순한 목재·석재 벽으로만 두고, 문이나 가구를 새로 지어내지 않습니다.

```
PROMPT (CH-03 reference, no people): High ceiling-mounted wide-angle CCTV view from the
north-east upper corner of the reference mountain villa living room, looking south-west.
Same room as the reference: rough stone fireplace on the west wall (right side of frame),
vaulted timber gable ceiling with a wrought-iron candle chandelier (top of frame), beige
fabric sofas, rectangular wooden coffee table, patterned rug, ottoman. The south wall
(center-left, not visible in the reference) is a plain timber-and-stone wall with one
battery-powered analog wall clock with a plain white face. Night, warm lamps on. Slight
fisheye, CCTV grain, muted colors. Empty corners for a UI overlay. No people.
```

#### E02 — 거실 CCTV 22:05

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E02 (챕터 2 관리실, 챕터 3 관리실) |
| 2 | 기존 경로 | `assets/evidence/e02-living-room-cctv-2205.webp` |
| 5 | 배경·장소 | CH-03 기준 장면 그대로(넓은 화각, 22:12 프레임). 벽시계는 작게 찍혀 **판독 불가**(F26). 동쪽 선반의 고정 휴대폰은 카메라 바로 아래 쪽이라 화면 왼쪽 가장자리에 살짝 걸리거나 보이지 않음 |
| 6 | 인물 | 꾸한성 멤버 10명(D20). **E04a와 같은 순간**이므로 좌석·자세·소품을 그대로 맞춤. 모두 타이머를 기다리며 동쪽 선반의 휴대폰을 봄(셀카 자세 없음). 플레이어는 넣지 않음(D13) |
| 7 | 금지 인물 | 강석훈, **윤해준**(D21. 화면에 없다는 것이 거실 부재를 뜻하지는 않음), 그 외 외부인, 플레이어 |
| 8 | 참조 | §4 `E02.refs`(대표 거실, 멤버 10명 스프라이트) + 확정된 E04a |
| 9 | 필수 내용 | NVR UI(§4 `_nvr_ui`), 멤버 10명이 E04a와 같은 배치 |
| 10 | 시각 | 표시 `22:05` → 실제 22:12(도구가 CANON 오차 규칙으로 검산) |
| 11 | 문자열 | §4 `E02` |
| 12 | 금지 | 날짜, 판독 가능한 벽시계, 대리석 거실, 다른 UI 버전·코덱, 꾸티뉴 얼굴 균열({D15} 결정 전에는 넣지 않음) |
| 13 | 퍼즐 | 챕터 2 P01·챕터 3 P01(7분 오차: E04a·E02·E01 비교) |
| 14 | 기존 수정점 | 대리석 거실 → 대표 거실, 인물 디자인을 스프라이트 기준으로(F21: 다뮤_ 귀와 윤타미 브릿지가 섞인 인물 있음) |
| 15 | 완성 후 확인 | E04a와 나란히 놓고 같은 순간인지, 10명 식별, 시계 판독 불가 |

```
PROMPT: [CH-03 reference scene as the background, same camera] Ten young friends from the
character references (match every sprite's hair, accessories and outfit) gathered on the
sofas, ottoman and rug around the coffee table, all smiling toward a phone fixed on the
east wall shelf for a self-timer shot (nobody holds the phone), so their faces turn toward
the east and the camera. The wall clock on the south wall is tiny and unreadable.
CCTV grain, slight fisheye. Empty corners for a UI overlay.
```

#### E04a — 22:12 단체 채팅 사진

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E04a (챕터 2 거실, 챕터 3) |
| 2 | 기존 경로 | `assets/evidence/e04a-group-photo-2212.webp` |
| 4 | 크기·비율 | 1448×1086. 채팅 앱의 사진 보기 화면(위쪽 머리줄 + 사진) |
| 5 | 배경·장소 | **동쪽 벽 선반에 고정한 휴대폰의 타이머 촬영**(D20). 서남서쪽을 향하므로 사람들 뒤로 서쪽 돌 벽난로와 남쪽 벽 가장자리가 보임. 벽시계는 **프레임 밖**(F26) |
| 6 | 인물 | 꾸한성 멤버 10명, E02와 같은 배치. 아무도 휴대폰을 들고 있지 않음. 휴대폰 주인·설치자·보낸 사람(코드: 난워니)의 관계는 정하지 않음. 플레이어는 넣지 않음(D13) |
| 7 | 금지 인물 | 강석훈, **윤해준**(D21. 화면 밖에 있었을 가능성을 막지 않도록, 사진이 거실 전체를 담지 않는 구도 유지), 그 외 외부인, 플레이어 |
| 8 | 참조 | §4 `E04a.refs` |
| 9 | 필수 내용 | 채팅 사진 보기 UI(보낸 사람, 보낸 시각), 밝은 분위기의 단체사진 |
| 10 | 시각 | 보낸 시각 `22:12`(E02 실제 시각과 같은 순간인지 도구가 검사) |
| 11 | 문자열 | §4 `E04a` |
| 12 | 금지 | 날짜, 판독 가능한 벽시계, 대리석 거실, 채팅방 이름 |
| 13 | 퍼즐 | 챕터 2·3 P01(7분 오차) |
| 14 | 기존 수정점 | 거실 디자인, 인물 디자인을 스프라이트 기준으로 |
| 15 | 완성 후 확인 | E02와 인물 위치·자세가 일치하는지, 10명 식별 |

```
PROMPT: Self-timer group photo from a smartphone fixed on a wall shelf (nobody holds the
phone, no selfie arm), ten young friends from the character references posing together in
the reference mountain villa living room at night. The phone faces west-south-west, so the
background shows the rough stone fireplace and only the edge of the plain south wall; no
wall clock in frame. Cheerful, warm lamps, cozy. Match every sprite exactly. Same seating
and poses as the approved E02 frame.
```

#### E03 — NVR 영상 속 벽시계

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E03 (챕터 3 관리실 「NVR 프레임 확대」, 챕터 5 자동 지급) |
| 2 | 기존 경로 | `assets/evidence/e03-nvr-wallclock-223413.webp` |
| 5 | 배경·장소 | E02와 **같은 CH-03 카메라**가 녹화한 **23:01 프레임**(표시 22:34:13)을 확대한 화면: 남쪽 벽과 벽시계, 그 앞의 소파·오토만 부근. 정전 복구 후라 조명이 켜져 있음. E02를 확대한 것이 아님 |
| 6 | 인물 | **윤해준 1명.** 시계 아래 남쪽 벽 앞에 서 있고, 확대 화질에서도 복장(CANON C-2)으로 판별 가능 |
| 7 | 금지 인물 | 강석훈, 꾸티뉴(페도라 인물과 혼동되는 구도 금지), 그 외 인물(23:01 거실 인원은 미확인) |
| 8 | 참조 | §4 `E03.refs`(대표 거실, 윤해준 스프라이트) + 승인된 CH-03 기준 장면 |
| 9 | 필수 내용 | NVR UI, 확대 표시, 윤해준, **배터리식 아날로그 벽시계**(판독 가능) |
| 10 | 시각 | 오버레이 `22:34:13`, 벽시계 **11:01**(23:01). 도구가 CANON 오차 규칙으로 검산. 바탕 그림의 시계 바늘이 틀리면 `--draw-clock`으로 정확한 시계를 합성 |
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

#### E04d — 22:50 거실 사진

| # | 항목 | 내용 |
|---|---|---|
| 1 | ID | E04d (챕터 3 거실·다뮤_, 챕터 5 시간 근거의 불인정 선택지) |
| 2 | 기존 경로 | `assets/evidence/e04d-group-photo-2250.webp` |
| 4 | 크기·비율 | 1448×1086. 채팅 앱의 사진 보기 화면 |
| 5 | 배경·장소 | 서쪽 벽난로 앞에서 동쪽을 향한 시점: 동쪽 선반 벽, 작은 소파, 왼쪽에 북쪽 창 일부(비 오는 밤). 남쪽 벽(시계)과 벽난로 쪽은 **화면 밖이므로, 사진에 없는 사람이 거실에 없었다는 뜻이 되지 않음** |
| 6 | 인물 | **{D18} 결정 대기.** 검토안은 4~6명이며, 아래 후보표를 참고 |
| 7 | 금지 인물 | 윤해준, 강석훈, 외부인 전원, 멤버 10명 전원, 회색 작업복처럼 보이는 옷 |
| 8 | 참조 | §4 `E04d.refs` + D18에서 정한 멤버 스프라이트 |
| 9 | 필수 내용 | 채팅 사진 보기 UI(보낸 사람 다뮤_, 22:50), 조명 켜진 거실, 놀라거나 불안한 표정, **셀카가 아닌 제3자 시점**(촬영자는 드러나지 않음, D10) |
| 10 | 시각 | 보낸 시각 `22:50` |
| 11 | 문자열 | §4 `E04d` |
| 12 | 금지 | 날짜, 셀카 구도, 브이 포즈, E04a의 좌석 배치, "촬영: ○○" 표기, 채팅방 이름 |
| 13 | 퍼즐 | 챕터 3 P06(보조) / 챕터 5 시간 근거의 불인정 선택지 / 복귀 22:55 소거법의 기준 |
| 14 | 기존 수정점 | E04a 복제(10명, 셀카, 대리석 거실) → 전면 재제작 |
| 15 | 완성 후 확인 | 윤해준으로 오인할 인물 없음, D18 멤버 식별, E04a와 다른 사진 |

**D18 등장 후보와 근거** (공식 설정이 아니라 결정을 돕기 위한 표)

| 후보 | 22:21 이후 위치 근거 | 22:50 거실에 있을 근거 |
|---|---|---|
| 김옥독 | 22:31 정전 중 거실을 휴대폰으로 촬영(E04b) | **가장 강함.** 정전 내내 거실에 있었던 기록 |
| 모야 | 22:46 주방에서 거실 문턱을 촬영(E04c), 23:20 주방(E06) | 약함. 4분 사이에 거실로 왔을 수는 있음 |
| 다뮤_ | 22:50 사진 공유자(촬영자·등장 여부는 미정, D10) | 정보 없음. 공유만으로 위치를 알 수 없음 |
| 야무지 | 22:27쯤 창밖의 붉은 불빛 목격(C03, 어느 방 창인지 코드에 없음) | 정보 없음 |
| 꾸티뉴, 난워니, 만조, 야뿌, 하루노츠키, 윤타미 | 22:21 거실(`MEMBER_ROOMS.night`) 이후 기록 없음 | 정보 없음(반대 근거도 없음) |
| 외부인 전원 | 각자 다른 곳이라고 진술하거나 기록이 있음(CANON C-2) | **넣지 않음** |

```
PROMPT (D18 결정 후): Candid smartphone photo taken by an unseen person standing in front
of the rough stone fireplace, looking east toward the wall shelves and the smaller beige
sofa, part of the tall rainy night windows on the left, right after a power outage ended.
[N] friends from the character references (match each sprite exactly) stand or sit apart,
looking uneasy, glancing around and talking quietly. Not a selfie, no posing, no V signs,
no man in a grey work coverall, no older man in a suit. Slight motion blur.
```

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
- **금지:** 조작자 이름(D9 미정), 날짜
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
  - `23:34 관리인 비상키(마스터키) 개문`
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

### E14 — 은닉 장비 (P2)
- **필수 요소:** 보일러실 선반 뒤 안전화, 젖은 우비, 적색 모드 헤드랜턴. **안전화 한 짝은 밑창이 보이게** 놓아 V자 마모가 확인되게 합니다.
- **금지:** 소유자 이름표
- **퍼즐:** P07, 챕터 5 경로

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

### 유지 항목 (재제작 불필요, 참고만)
- **C02** `c02-headlamp-demo.webp`: 날짜 표기가 있으면 제거만 검토합니다(D1).
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
    "template": "chat-photo", "status": "needs-reference:CH-03", "size": [1448, 1086],
    "current": "assets/evidence/e04a-group-photo-2212.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/kkutinyu/normal.webp", "assets/characters/nanwoni/normal.webp", "assets/characters/kimokdok/normal.webp", "assets/characters/manjo/normal.webp", "assets/characters/yappu/normal.webp", "assets/characters/moya/normal.webp", "assets/characters/harunotsuki/normal.webp", "assets/characters/yuntami/normal.webp", "assets/characters/yamuji/normal.webp", "assets/characters/damyu/normal.webp"],
    "same_moment_as": "E02",
    "text": { "sender": "난워니", "sent_time": "22:12" }
  },
  "E03": {
    "template": "nvr", "status": "needs-reference:CH-03", "size": [1448, 1086],
    "current": "assets/evidence/e03-nvr-wallclock-223413.webp",
    "refs": ["assets/backgrounds/living.webp", "assets/characters/yoon-haejun/normal.webp"],
    "text": { "time": "22:34:13", "zoom": "ZOOM ×2.0" },
    "wall_clock": "23:01", "wall_clock_legible": true
  },
  "E04d": {
    "template": "chat-photo", "status": "blocked:D18", "size": [1448, 1086],
    "current": "assets/evidence/e04d-group-photo-2250.webp",
    "refs": ["assets/backgrounds/living.webp"],
    "text": { "sender": "다뮤_", "sent_time": "22:50" },
    "forbidden": ["촬영"]
  }
}
```
<!-- evidence-data:end -->

---

## 5. 제작 순서 (권장)

| 순서 | 대상 | 조건 |
|---|---|---|
| 1 | C10 → E10 → C04 → E07 | 바로 가능. 바탕 그림 생성 → `render` → 미리보기 확인 → 승인 후 교체 |
| 2 | E15 | 촬영 위치 해석(§2 E15 5번) 확인 후 |
| 3 | CH-03 화각 기준 장면(인물 없음) | 승인되면 E03·E02의 공통 바탕 |
| 4 | E03 | 3번 승인 후 |
| 5 | E04a → E02 | 인물 결정(D13·D20·D21) 완료. 3번 승인 후 E04a 구도를 먼저 정하고 E02를 거기에 맞춤 |
| 6 | E04d | D18 결정 후 |

- 교체할 때마다 `evidence-audit` 절차로 검수합니다.
- 이어서 `node tests/logic-assets.test.js`와 `node tests/browser-portraits.test.js`를 실행합니다.
