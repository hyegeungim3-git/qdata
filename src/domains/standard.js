/**
 * 도메인 팩 — QData 표준 데모 (중립, 기본값)
 *
 * QData 제품 자체를 발주처명 없이 보여주는 기본 화면. 모든 수치·명칭의 정본은
 * docs/WORLD-LEDGER-STANDARD.md, 기능·용어의 정본은 docs/SOURCE-QDATA.md(제품 페이지 원문).
 * 발주처 적용 사례는 별도 팩(expressway.js 등)이 같은 스키마로 덮어쓴다.
 *
 * qdata 스키마 정본: src/admin/pages/qdata/schema.js
 */

const standard = {
  id: "standard",
  orgName: "데모 조직",
  orgShort: "QD",
  sectorLabel: "표준 데모",
  platformTitle: "QData 표준 데모",
  brandColor: "#0075DE",
  caseLabel: "표준 데모",
  caseNote: "발주처를 특정하지 않은 산업 데이터 샘플 사업장 기준 화면입니다.",

  qdata: {
    orgLabel: "샘플 사업장",
    asOf: "2026-09-21 09:00 기준",

    overview: {
      kpis: [
        { label: "연결 커넥터", value: "11개", note: "정상 10 · 주의 1", tone: "amber" },
        { label: "일 수집량", value: "3,120만 건", note: "시계열 2,980만 · 정형 138만" },
        { label: "AI-Ready 데이터셋", value: "48개", note: "품질 점수 평균 92", tone: "emerald" },
        { label: "태그 표준 매핑", value: "94.8%", note: "8,420개 중 7,986개" },
        { label: "엣지 버퍼 유실", value: "0건", note: "단절 2회 · 재전송 18,420건", tone: "emerald" },
        { label: "품질 규칙 위반", value: "3건", note: "규칙 24개 중", tone: "amber" },
      ],
      alerts: [
        { severity: "warn", title: "설비 PLC 라인 B 응답 지연", body: "Modbus TCP 응답이 평소보다 느립니다. 엣지 버퍼가 동작 중이며 유실은 없습니다.", to: "qd.sources" },
        { severity: "warn", title: "미매핑 태그 434개", body: "신규 설비 태그가 표준 사전에 연결되지 않았습니다. 표준화 검토가 필요합니다.", to: "qd.standardize" },
        { severity: "info", title: "품질 규칙 위반 3건", body: "결측 1 · 이상치 1 · 형식 1 — 자동 보정 대상 여부를 확인하세요.", to: "qd.quality" },
      ],
    },

    sources: {
      categories: [
        { id: "structured",   label: "정형 데이터",   examples: "ERP · MES · DB · CSV · API" },
        { id: "unstructured", label: "비정형 데이터", examples: "PDF · DOCX · PPT · 메일" },
        { id: "industrial",   label: "산업 데이터",   examples: "PLC · 센서 · 시계열 · 영상" },
        { id: "knowledge",    label: "지식 데이터",   examples: "매뉴얼 · 리포트 · 표준 · 이력" },
      ],
      connectors: [
        { id: "c1",  name: "ERP 재무·구매",          category: "structured",   protocol: "JDBC",              cadence: "일 1회 02:00", status: "정상", lastSync: "09-21 02:00", volume: "4.2만 건/일" },
        { id: "c2",  name: "MES 생산실적",           category: "structured",   protocol: "REST API",          cadence: "5분",         status: "정상", lastSync: "09-21 08:55", volume: "86만 건/일" },
        { id: "c3",  name: "품질 LIMS",              category: "structured",   protocol: "JDBC",              cadence: "1시간",       status: "정상", lastSync: "09-21 09:00", volume: "3.1만 건/일" },
        { id: "c4",  name: "설비 PLC 라인 A",         category: "industrial",   protocol: "OPC-UA",            cadence: "1초",         status: "정상", lastSync: "실시간",      volume: "1,420만 건/일" },
        { id: "c5",  name: "설비 PLC 라인 B",         category: "industrial",   protocol: "Modbus TCP",        cadence: "1초",         status: "주의", lastSync: "실시간(지연)", volume: "1,180만 건/일", note: "응답 지연 — 엣지 버퍼 동작 중" },
        { id: "c6",  name: "환경·유틸리티 센서망",     category: "industrial",   protocol: "MQTT·Sparkplug B",  cadence: "10초",        status: "정상", lastSync: "실시간",      volume: "380만 건/일" },
        { id: "c7",  name: "비전 검사 영상 메타",      category: "industrial",   protocol: "RTSP 이벤트",       cadence: "이벤트",      status: "정상", lastSync: "09-21 08:58", volume: "2.6만 건/일" },
        { id: "c8",  name: "문서함 (PDF·DOCX·PPT)",   category: "unstructured", protocol: "SMB 파일 공유",      cadence: "매시간",      status: "정상", lastSync: "09-21 09:00", volume: "1,030건/일" },
        { id: "c9",  name: "메일 아카이브",           category: "unstructured", protocol: "IMAP",              cadence: "매일",        status: "정상", lastSync: "09-21 03:00", volume: "200건/일" },
        { id: "c10", name: "작업표준서·점검일지·매뉴얼", category: "knowledge",   protocol: "문서 업로드",        cadence: "수시",        status: "정상", lastSync: "09-20 17:40", volume: "18건/일" },
        { id: "c11", name: "CSV 수동 업로드",         category: "structured",   protocol: "파일",              cadence: "수동",        status: "정상", lastSync: "09-19 14:10", volume: "—" },
      ],
      edge: {
        gateways: [
          { id: "gw1", name: "엣지 게이트웨이 GW-01", site: "라인 A", status: "정상", buffered: "0건",     lastOutage: "09-21 04:12 (2분 08초)" },
          { id: "gw2", name: "엣지 게이트웨이 GW-02", site: "라인 B", status: "버퍼링", buffered: "1,240건", lastOutage: "09-21 06:40 (7분 12초)" },
          { id: "gw3", name: "엣지 게이트웨이 GW-03", site: "유틸리티", status: "정상", buffered: "0건",   lastOutage: "없음" },
        ],
        summary: [
          { label: "금일 통신 단절", value: "2회" },
          { label: "최장 단절", value: "7분 12초" },
          { label: "버퍼 재전송", value: "18,420건" },
          { label: "데이터 유실", value: "0건", tone: "emerald" },
        ],
        note: "통신이 끊기면 엣지에 임시 저장했다가 복구 즉시 순서대로 재전송합니다.",
      },
      protocols: ["OPC-UA", "ISA-95", "MQTT·Sparkplug B", "Modbus", "JDBC", "REST API"],
    },

    pipeline: {
      stages: [
        { key: "connect",       label: "Connect",       ko: "데이터 연결", desc: "여러 소스를 연결해 수집",                count: "3,120만 건", detail: "11개 커넥터" },
        { key: "parse",         label: "Parse",         ko: "구조화",     desc: "형식을 분석해 구조로 변환",              count: "1,248건",    detail: "OCR 212 · STT 18" },
        { key: "clean",         label: "Clean",         ko: "품질관리",   desc: "중복 제거·오류 보정·결측 처리",           count: "1,920건 보정", detail: "중복 0.4% · 결측 1.8%" },
        { key: "standardize",   label: "Standardize",   ko: "표준화",     desc: "스키마 통일과 단위 표준화",              count: "7,986 태그",  detail: "매핑률 94.8%" },
        { key: "contextualize", label: "Contextualize", ko: "맥락화",     desc: "도메인·업무 맥락과 관계 부여",           count: "1,640 관계",  detail: "용어 1,280개" },
        { key: "ready",         label: "Ready",         ko: "AI-Ready",   desc: "품질·일관성·맥락을 갖춘 데이터",          count: "48 데이터셋", detail: "품질 점수 92" },
      ],
      datasets: [
        { id: "d1", name: "설비 시계열 — 라인 A",   source: "설비 PLC 라인 A",       reached: 5, status: "완료" },
        { id: "d2", name: "설비 시계열 — 라인 B",   source: "설비 PLC 라인 B",       reached: 3, status: "진행", issue: "미매핑 태그 212개 — 표준화 대기" },
        { id: "d3", name: "생산실적",              source: "MES 생산실적",          reached: 5, status: "완료" },
        { id: "d4", name: "품질검사 결과",          source: "품질 LIMS",             reached: 5, status: "완료" },
        { id: "d5", name: "점검일지 스캔",          source: "작업표준서·점검일지·매뉴얼", reached: 1, status: "진행", issue: "OCR 판독 중 — 212건" },
        { id: "d6", name: "설비 매뉴얼·작업표준서",   source: "문서함",                reached: 5, status: "완료" },
        { id: "d7", name: "회의·교대 음성 기록",      source: "문서 업로드",            reached: 1, status: "진행", issue: "STT 변환 중 — 18건" },
        { id: "d8", name: "환경·유틸리티 센서",       source: "환경·유틸리티 센서망",    reached: 2, status: "경고", issue: "결측 3.4% — 임계 3.0% 초과" },
      ],
    },

    standardize: {
      stats: [
        { label: "수집 태그", value: "8,420개" },
        { label: "표준 매핑", value: "7,986개", note: "94.8%" },
        { label: "미매핑", value: "434개", tone: "amber" },
        { label: "단위 변환 규칙", value: "36종" },
        { label: "용어 사전", value: "1,280개" },
        { label: "관계(맥락)", value: "1,640개" },
      ],
      tagMappings: [
        { raw: "L_A.TT101.PV",    source: "설비 PLC 라인 A", standard: "라인A.가열로.온도",   unit: "℃",    rule: "그대로",         status: "매핑" },
        { raw: "40011",           source: "설비 PLC 라인 B", standard: "라인B.가열로.온도",   unit: "℃",    rule: "℉→℃ 변환",      status: "매핑" },
        { raw: "LB_PRS_02_VIB",   source: "설비 PLC 라인 B", standard: "라인B.프레스2.진동", unit: "mm/s", rule: "g→mm/s 환산",   status: "매핑" },
        { raw: "ENV/UTIL/CAIR01", source: "환경·유틸리티 센서망", standard: "유틸리티.압축공기.압력", unit: "bar", rule: "psi→bar 변환", status: "매핑" },
        { raw: "LB_NEW_0412",     source: "설비 PLC 라인 B", standard: "—",               unit: "?",    rule: "—",             status: "미매핑" },
        { raw: "LB_NEW_0413",     source: "설비 PLC 라인 B", standard: "—",               unit: "?",    rule: "—",             status: "미매핑" },
      ],
      unitRules: [
        { from: "℉", to: "℃",    factor: "(x−32)×5/9", scope: "온도 태그 전체" },
        { from: "psi", to: "bar", factor: "× 0.0689",   scope: "압력 태그 전체" },
        { from: "g",   to: "mm/s", factor: "주파수 기반 환산", scope: "진동 태그" },
        { from: "kgf/cm²", to: "MPa", factor: "× 0.0981", scope: "유압 태그" },
      ],
      glossary: [
        { term: "가동률", synonyms: ["설비 가동률", "OEE 가용성"], definition: "계획 시간 대비 실제 가동 시간 비율", owner: "생산관리" },
        { term: "불량률", synonyms: ["NG율", "부적합률"],        definition: "검사 수량 대비 불합격 수량 비율",   owner: "품질" },
        { term: "사이클 타임", synonyms: ["C/T", "택트"],          definition: "제품 1개 생산에 걸리는 시간",       owner: "생산기술" },
      ],
      relations: [
        { from: "라인B.프레스2.진동", rel: "영향", to: "품질검사.치수 불량" },
        { from: "라인A.가열로.온도",   rel: "관리 기준", to: "작업표준서 WS-104 §3" },
        { from: "품질검사.치수 불량",  rel: "원인 후보", to: "점검일지.금형 마모" },
      ],
    },

    outputs: [
      { id: "knowledge", label: "Knowledge Data", engine: "RAG Ready", desc: "청크 · 임베딩 · 메타데이터 · 출처",
        metrics: [{ label: "청크", value: "184,300개" }, { label: "임베딩", value: "1,024차원" }, { label: "출처 메타", value: "100%" }],
        items: [
          { name: "설비 매뉴얼·작업표준서 청크", size: "96,400 청크", updated: "09-21 08:40", consumer: "AI 에이전트" },
          { name: "점검일지 OCR 청크",        size: "41,200 청크", updated: "09-20 18:10", consumer: "AI 에이전트" },
          { name: "메일·보고서 청크",          size: "46,700 청크", updated: "09-21 03:30", consumer: "LLM · sLLM" },
        ] },
      { id: "context", label: "Context Data", engine: "CAG Ready", desc: "도메인 맥락 · 정책 · 매뉴얼 · 규칙",
        metrics: [{ label: "컨텍스트", value: "312건" }, { label: "캐시 적중률", value: "95%" }],
        items: [
          { name: "품질 판정 기준·규칙",      size: "84건",  updated: "09-18", consumer: "AI 에이전트" },
          { name: "설비 안전 수칙",          size: "126건", updated: "09-12", consumer: "LLM · sLLM" },
          { name: "용어 사전(표준 1,280개)", size: "102건", updated: "09-21", consumer: "전체" },
        ] },
      { id: "structured", label: "Structured AI Data", engine: "TAG Ready", desc: "테이블 데이터셋 · 의미 스키마 · 피처",
        metrics: [{ label: "테이블", value: "48개" }, { label: "의미 스키마", value: "6개" }, { label: "피처", value: "620개" }],
        items: [
          { name: "설비 시계열 1분 집계",    size: "2.1억 행", updated: "09-21 09:00", consumer: "예측 모델" },
          { name: "생산실적×품질 조인 뷰",   size: "4,800만 행", updated: "09-21 08:55", consumer: "AI 에이전트(TAG)" },
          { name: "설비 이상 감지 피처셋",   size: "620 피처", updated: "09-20", consumer: "예측 모델" },
        ] },
      { id: "training", label: "Training Data", engine: "학습", desc: "인스트럭션 · Q&A · 파인튜닝 데이터셋",
        metrics: [{ label: "Q&A", value: "6,400쌍" }, { label: "인스트럭션", value: "2,100건" }],
        items: [
          { name: "설비 정비 Q&A",           size: "3,800쌍", updated: "09-15", consumer: "sLLM 파인튜닝" },
          { name: "품질 판정 인스트럭션",    size: "2,100건", updated: "09-10", consumer: "sLLM 파인튜닝" },
        ] },
    ],

    quality: {
      summary: [
        { label: "품질 규칙", value: "24개", note: "결측 8 · 이상치 6 · 중복 4 · 형식 6" },
        { label: "금일 위반", value: "3건", tone: "amber" },
        { label: "자동 보정", value: "1,920건" },
        { label: "평균 품질 점수", value: "92", tone: "emerald" },
      ],
      rules: [
        { id: "q1", name: "센서 결측률 임계",  type: "결측",   target: "환경·유틸리티 센서", condition: "결측률 3.0% 이하",      result: "위반", detail: "3.4% — 센서 2개 신호 간헐 단절", auto: true },
        { id: "q2", name: "진동 이상치 검출",  type: "이상치", target: "설비 시계열 — 라인 B", condition: "3σ 초과값 격리",        result: "위반", detail: "프레스2 진동 스파이크 14건 격리", auto: true },
        { id: "q3", name: "태그 단위 표기",   type: "형식",   target: "설비 시계열 — 라인 B", condition: "표준 단위 사전 준수",    result: "위반", detail: "미매핑 태그 212개 단위 미상", auto: false },
        { id: "q4", name: "생산실적 중복",    type: "중복",   target: "생산실적",           condition: "작업지시번호 유일",      result: "통과", detail: "중복 0.4% 자동 제거", auto: true },
        { id: "q5", name: "타임스탬프 단조성", type: "형식",   target: "설비 시계열 — 라인 A", condition: "역전 레코드 0건",        result: "통과", detail: "최근 24시간 0건", auto: true },
        { id: "q6", name: "검사값 범위",      type: "이상치", target: "품질검사 결과",       condition: "규격 상하한 내",        result: "통과", detail: "범위 밖 0건", auto: true },
      ],
    },

    apps: [
      { id: "llm",      product: "LLM · sLLM",  name: "상용 API와 온프레미스 소형 모델", desc: "Knowledge·Context Data를 근거로 답변을 생성합니다.", uses: ["knowledge", "context"] },
      { id: "agent",    product: "AI 에이전트", name: "AgentQ",                         desc: "근거를 붙여 답하고, 조회(TAG)와 실행까지 이어갑니다.", uses: ["knowledge", "context", "structured"] },
      { id: "predict",  product: "예측 모델",   name: "이상 감지 · 수요 · 품질 예측",     desc: "Structured AI Data의 피처로 학습하고, 드리프트가 생기면 재학습합니다.", uses: ["structured", "training"] },
      { id: "cubeon",   product: "Cubeon",      name: "판단을 승인과 업무 실행으로",       desc: "AI 판단 결과를 승인 절차와 업무 실행으로 연결합니다.", uses: ["context", "structured"] },
    ],
  },
};

export default standard;
