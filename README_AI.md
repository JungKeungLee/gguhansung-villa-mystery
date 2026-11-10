# 꾸한성 — 안개 속 별장 · AI 질문/심문 (챕터 2~5)

챕터 2~5 오른쪽 아래 **AI 질문·심문** 버튼으로 자유롭게 한국어 질문을 작성할 수 있습니다. `사건 YES/NO`와 `외부인 심문` 두 모드를 제공합니다.

## Vercel Production 환경변수 등록

Vercel → `gguhansung-villa-mystery` 프로젝트 → Settings → Environment Variables:

- `OPENAI_API_KEY`: OpenAI Platform에서 발급한 **API 비밀 키**. 코드, GitHub, 클라이언트 HTML에 넣지 않습니다.
- `AI_ENABLED`: `true` (설정/요금 제한을 준비한 뒤 켜기. 기본값은 꺼짐)
- `OPENAI_MODEL`: `gpt-4o-mini` (선택. 기본값과 동일)

저장 후 Production을 재배포해야 새 환경변수가 적용됩니다. `GET /api/investigate`가 `{"ready":true}`를 반환하면 구성 준비 상태입니다. **실제 모델 호출 테스트는 API 키가 있어야 가능합니다.**

### 답변 방식

이 기능은 AI가 질문의 뜻을 **분류**하고, **고정된 사건 사실과 NPC 사전 정의 진술**을 서버가 선택합니다. 자유 생성형 대사가 아니므로 AI가 그럴듯한 새로운 증거나 범인을 지어내지 않습니다. 질문 결과는 `YES / NO / 알 수 없음 / 관련 없음 / 현재 공개 불가 / 증언` 중 해당되는 값으로 출력됩니다. 기존 챕터 2~4 오프라인 데모는 별도 기능으로 남아 있습니다.

`OPENAI_API_KEY`가 없거나 `AI_ENABLED`가 `true`가 아니면 `/api/investigate`는 HTTP 503을 반환하고, 기존 게임과 저장 데이터는 영향을 받지 않습니다.

### 비용·안전 및 현재 한계

- 질문 제한: 최대 180자, IP당 30분 동안 15회, 함수 인스턴스당 시간당 250회. 요청당 모델 호출 1번 (범인 직접 질문 등은 모델 호출 없이 거절).
- **이 제한은 서버 인스턴스 메모리 기반으로, 여러 인스턴스에 분산되면 누적되지 않습니다.** 실제 예산 상한 보장을 위해서는 Vercel WAF 혹은 Redis/Upstash를 활용한 영속적 속도 제한과 OpenAI 결제/사용량 제한도 함께 설정해야 합니다.
- 요청의 `progress`는 브라우저 `localStorage`에서 가져오며 **조작 가능합니다**. 이는 개인 플레이 편의를 위한 힌트 게이트이며, 보안 인증이나 비밀 데이터 열람 권한으로 사용해서는 안 됩니다.
- **이 저장소가 공개라면 `api/`에 넣는 데이터도 GitHub에서 보입니다.** 진범의 비공개 정답, 소설 전체 스포일러를 API 코드에 넣지 않았습니다. 실제 보안 강제 판정은 별도 서버 저장 및 서명된 게임 상태로 이전해야 합니다.
- 질문 문장은 OpenAI API 서비스로 전송됩니다. 개인정보를 입력하지 않도록 안내해야 합니다.
- 브라우저에는 API 키가 전달되지 않습니다. 서버 통신은 동일 출처 POST JSON만 허용합니다.

### 개발 검증

```
node --check api/investigate.mjs
node --check ai-client.js
node --test tests/investigate.test.mjs
```

이 기능은 별도 빌드 도구나 npm 패키지 의존성 없이 Vercel의 Node.js 서버리스 함수를 이용합니다.