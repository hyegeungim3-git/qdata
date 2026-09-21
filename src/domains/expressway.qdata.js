/**
 * 한국도로공사 적용 사례 — QData 신규 화면 콘텐츠
 *
 * 스키마 정본: src/admin/pages/qdata/schema.js / 작성 예시: src/domains/standard.js 의 qdata
 * 수치·식별자 정본: docs/WORLD-LEDGER-EXPRESSWAY.md (RoadQ 데모와 같은 세계관, 기준 시각 2026-09-18 08:00)
 * 이름 정합: 데이터 자산·모델·CAG 캐시 이름은 expressway.admin.js와 같은 문자열을 쓴다.
 *
 * 서사 한 줄: 도로 시계열(VDS·프로브·RWIS·교량 계측)을 AI-Ready로 만드는 중에
 *  - 경부선 VDS 결측 4.8%(임계 3.0%, VDS-0010-0247 통신 불량 3일)가 통행속도 예측 모델 드리프트(+0.9)로 번지고,
 *  - 07:31 수도권본부 엣지 단절분은 버퍼로 유실 없이 재전송됐지만 적재가 최대 4분 12초 늦어졌다(임계 3분, 당일 소명).
 *  엣지 버퍼(구간 통신 단절 대비)와 장비 자체 불량(결측으로 남음)은 다른 문제로 구분해 보여준다.
 */
const expresswayQdata = {
  orgLabel: "한국도로공사 디지털계획처",
  asOf: "2026-09-18 08:00 기준",

  overview: {
    kpis: [
      { label: "연결 커넥터", value: "13개", note: "정상 10 · 주의 3", tone: "amber" },
      { label: "교통 시계열 수집", value: "2,840만 건", note: "5분 집계 · 관측지점 2,340개소" },
      { label: "AI-Ready 데이터셋", value: "34개", note: "품질 점수 평균 91", tone: "emerald" },
      { label: "경부선 VDS 결측률", value: "4.8%", note: "관리 임계 3.0% · 3일 누적", tone: "rose" },
      { label: "적재 지연(최대)", value: "4분 12초", note: "임계 3분 · 당일 소명 대상", tone: "amber" },
      { label: "엣지 버퍼 유실", value: "0건", note: "구간 단절 3회 · 재전송 31,420건", tone: "emerald" },
    ],
    alerts: [
      { severity: "warn", title: "경부선 VDS 결측률 4.8% — 관리 임계 3.0% 초과",
        body: "VDS-0010-0247 통신 불량이 3일째입니다. 보간 한도(30분)를 넘어 결측으로 남았고, 수집장비 유지관리 매뉴얼의 출동 기한(3일)이 오늘입니다.",
        to: "qd.quality" },
      { severity: "warn", title: "적재 지연 최대 4분 12초 — 임계 3분 초과",
        body: "07:31 수도권본부 엣지 단절(2분 50초) 동안 쌓인 데이터를 재전송하면서 적재가 늦어졌습니다. 유실은 없으며 당일 소명 대상입니다.",
        to: "qd.sources" },
      { severity: "warn", title: "통행속도 예측 모델 드리프트 +0.9 — 임계 1.0 근접",
        body: "VDS 결측 구간 분포가 바뀐 것이 원인입니다. 30분 MAE는 4.7km/h로 목표(5.0 이하) 안이지만 재학습 검토가 필요합니다.",
        to: "eval.predops" },
      { severity: "info", title: "프로브 신규 링크 312개 미매핑",
        body: "구간 ID와 연결되지 않은 링크가 있어 프로브 통행속도가 표준화 단계에서 대기 중입니다.",
        to: "qd.standardize" },
    ],
  },

  sources: {
    categories: [
      { id: "structured",   label: "정형 데이터",       examples: "EXTIS 이력 DB · EXMMS · 하이패스 거래 · CSV" },
      { id: "unstructured", label: "비정형 데이터",     examples: "작업지시서·점검표 스캔 · 기안문 · 메일" },
      { id: "industrial",   label: "산업·시계열 데이터", examples: "VDS · DSRC·GPS 프로브 · RWIS · 교량 계측 · CCTV 메타" },
      { id: "knowledge",    label: "지식 데이터",       examples: "돌발상황 대응 매뉴얼 · 교통량조사 지침 · 수집장비 유지관리 매뉴얼 · 교량·터널 정밀안전점검 지침" },
    ],
    connectors: [
      { id: "c1",  name: "EXTIS 교통 이력 DB",             category: "structured",   protocol: "JDBC",              cadence: "일 1회 02:00",       status: "정상", lastSync: "09-18 02:00", volume: "237만 건/일" },
      { id: "c2",  name: "EXMMS 작업지시 이력",            category: "structured",   protocol: "REST API",          cadence: "1시간",              status: "정상", lastSync: "09-18 08:00", volume: "860건/일" },
      { id: "c3",  name: "하이패스 거래 이력",             category: "structured",   protocol: "JDBC",              cadence: "1시간",              status: "정상", lastSync: "09-18 08:00", volume: "512만 건/일" },
      { id: "c4",  name: "VDS 검지기 (EXTIS 수집)",        category: "industrial",   protocol: "장비 전용 프로토콜 변환", cadence: "30초 수집 · 5분 집계", status: "주의", lastSync: "실시간", volume: "2,390만 건/일",
        note: "VDS-0010-0247 통신 불량 3일 — 해당 지점 결측" },
      { id: "c5",  name: "DSRC·GPS 프로브 통행속도",       category: "industrial",   protocol: "REST API",          cadence: "5분",                status: "정상", lastSync: "실시간", volume: "450만 건/일" },
      { id: "c6",  name: "RWIS 노면기상",                  category: "industrial",   protocol: "MQTT·Sparkplug B",  cadence: "1분",                status: "주의", lastSync: "실시간(일부 버퍼링)", volume: "38만 건/일",
        note: "강원본부 엣지 단절 7분째 — 임시 저장 중, 유실 없음" },
      { id: "c7",  name: "교량·터널 계측 (EXAM 연계)",     category: "industrial",   protocol: "Modbus TCP",        cadence: "1분",                status: "정상", lastSync: "실시간", volume: "52만 건/일" },
      { id: "c8",  name: "CCTV 영상 이벤트 메타",          category: "industrial",   protocol: "RTSP 이벤트",       cadence: "이벤트",             status: "정상", lastSync: "09-18 07:43", volume: "1.8만 건/일" },
      { id: "c9",  name: "정비 작업지시서·점검표 스캔 (EXMMS)", category: "unstructured", protocol: "REST API",     cadence: "일 1회 01:00",       status: "주의", lastSync: "09-18 01:03", volume: "월 286건",
        note: "01:03 동기화 신규 0건 — 원천 응답 확인 중" },
      { id: "c10", name: "기안문·보고서 (EDMS)",           category: "unstructured", protocol: "WebDAV",            cadence: "실시간 동기화",       status: "정상", lastSync: "09-18 07:50", volume: "42건/일" },
      { id: "c11", name: "메일 아카이브",                  category: "unstructured", protocol: "IMAP",              cadence: "매일 03:00",          status: "정상", lastSync: "09-18 03:00", volume: "160건/일" },
      { id: "c12", name: "도로 지침·기준 문서 (EDMS)",      category: "knowledge",    protocol: "WebDAV",            cadence: "수시(변경 감지)",     status: "정상", lastSync: "09-16 17:40", volume: "누적 1,240건" },
      { id: "c13", name: "CSV 수동 업로드",                category: "structured",   protocol: "파일",              cadence: "수동",               status: "정상", lastSync: "09-16 15:20", volume: "—" },
    ],
    edge: {
      gateways: [
        { id: "gw1", name: "수도권본부 엣지 수집 서버",   site: "경부선·영동선 수도권 구간 VDS",   status: "정상",   buffered: "0건",     lastOutage: "09-18 07:31 (2분 50초)" },
        { id: "gw2", name: "강원본부 엣지 수집 서버",     site: "영동선 대관령 구간 VDS·RWIS",     status: "버퍼링", buffered: "6,140건", lastOutage: "09-18 07:53 (7분째)" },
        { id: "gw3", name: "충북본부 엣지 수집 서버",     site: "중부내륙선 · 남한강교 계측",       status: "정상",   buffered: "0건",     lastOutage: "09-15 23:10 (58초)" },
        { id: "gw4", name: "부산경남본부 엣지 수집 서버", site: "경부선 남부 구간 VDS",            status: "정상",   buffered: "0건",     lastOutage: "09-18 04:12 (1분 06초)" },
      ],
      summary: [
        { label: "금일 구간 단절", value: "3회" },
        { label: "최장 단절(진행 중)", value: "7분째", tone: "amber" },
        { label: "버퍼 재전송", value: "31,420건" },
        { label: "구간 단절 유실", value: "0건", tone: "emerald" },
      ],
      note: "지역본부·영업소 단위 엣지 수집 서버는 본사(EX-DataLake)와의 구간 통신이 끊기면 데이터를 임시 저장했다가 복구 즉시 순서대로 재전송합니다. 검지기 자체 불량(VDS-0010-0247 통신 불량 3일)은 엣지까지 데이터가 오지 않아 버퍼로 복구되지 않으며, 결측으로 남아 품질 규칙과 결측 보정 단계에서 처리합니다.",
    },
    protocols: ["MQTT·Sparkplug B", "Modbus TCP", "OPC-UA", "장비 전용 프로토콜 변환", "JDBC", "REST API", "WebDAV", "RTSP"],
  },

  pipeline: {
    stages: [
      { key: "connect",       label: "Connect",       ko: "데이터 연결", desc: "VDS·프로브·RWIS·계측과 업무 시스템을 연결해 수집",   count: "2,840만 건",   detail: "13개 커넥터 · 5분 집계 기준" },
      { key: "parse",         label: "Parse",         ko: "구조화",     desc: "기안문·메일·스캔 문서의 형식을 분석해 구조로 변환",  count: "240건",        detail: "OCR 38 · 문서 202" },
      { key: "clean",         label: "Clean",         ko: "품질관리",   desc: "중복 제거·오류 보정·결측 처리(30분 이내 보간)",     count: "41.2만 건 보정", detail: "경부선 결측 4.8% · 중복 0.2%" },
      { key: "standardize",   label: "Standardize",   ko: "표준화",     desc: "지점·구간·이정(k) ID 체계와 단위·차종 코드 통일",   count: "14,412 태그",  detail: "매핑률 97.0%" },
      { key: "contextualize", label: "Contextualize", ko: "맥락화",     desc: "노선·지역본부·시설물 맥락과 관계 부여",              count: "4,120 관계",   detail: "용어 1,140개" },
      { key: "ready",         label: "Ready",         ko: "AI-Ready",   desc: "품질·일관성·맥락을 갖춘 데이터",                     count: "34 데이터셋",  detail: "품질 점수 91" },
    ],
    datasets: [
      { id: "d1", name: "VDS 5분 집계 시계열 — 경부선",    source: "VDS 검지기 (EXTIS 수집)",           reached: 2, status: "경고", issue: "결측 4.8% — 관리 임계 3.0% 초과 (VDS-0010-0247 통신 불량 3일)" },
      { id: "d2", name: "VDS 5분 집계 시계열 — 경부선 외", source: "VDS 검지기 (EXTIS 수집)",           reached: 5, status: "완료" },
      { id: "d3", name: "프로브 통행속도",                 source: "DSRC·GPS 프로브 통행속도",          reached: 3, status: "진행", issue: "신규 링크 312개 구간 미매핑 — 표준화 대기" },
      { id: "d4", name: "RWIS 노면기상 시계열",            source: "RWIS 노면기상",                     reached: 5, status: "완료" },
      { id: "d5", name: "교량·터널 계측 시계열",           source: "교량·터널 계측 (EXAM 연계)",        reached: 5, status: "완료" },
      { id: "d6", name: "정비 작업지시서 스캔 이미지",     source: "정비 작업지시서·점검표 스캔 (EXMMS)", reached: 1, status: "진행", issue: "OCR 판독 중 — 38건" },
      { id: "d7", name: "도로 지침·기준 문서",             source: "도로 지침·기준 문서 (EDMS)",         reached: 4, status: "진행", issue: "임베딩 실패 1건(돌발상황대응매뉴얼_v3.pdf) — 재처리 큐 대기" },
      { id: "d8", name: "돌발상황 이벤트 이력",            source: "EXTIS 교통 이력 DB · CCTV 이벤트 메타", reached: 5, status: "완료" },
    ],
  },

  standardize: {
    stats: [
      { label: "수집 태그", value: "14,860개", note: "지점 채널·링크·센서" },
      { label: "표준 매핑", value: "14,412개", note: "97.0%" },
      { label: "미매핑", value: "448개", note: "프로브 신규 링크 312개 포함", tone: "amber" },
      { label: "단위·코드 변환", value: "14종" },
      { label: "용어 사전", value: "1,140개" },
      { label: "관계(맥락)", value: "4,120개" },
    ],
    tagMappings: [
      { raw: "V0010_0247_1_SP",   source: "VDS 검지기 (EXTIS 수집)",    standard: "VDS-0010-0247-L1.속도",                     unit: "km/h",  rule: "지점코드·채널 표준화",        status: "매핑" },
      { raw: "V0010_0247_R1_VOL", source: "VDS 검지기 (EXTIS 수집)",    standard: "VDS-0010-0247-R1.교통량",                   unit: "대/5분", rule: "30초 10주기 합산",           status: "매핑" },
      { raw: "2150034801",        source: "DSRC·GPS 프로브 통행속도",   standard: "경부선(0010).하행.기흥IC~수원신갈IC.통행속도", unit: "km/h",  rule: "링크→구간 매핑 (384.2k~389.6k)", status: "매핑" },
      { raw: "RW_0500_DGR_RST",   source: "RWIS 노면기상",              standard: "영동선(0500).대관령 구간.노면온도",          unit: "℃",     rule: "0.1℃ 정수 → ℃",             status: "매핑" },
      { raw: "NHG_EJ01_DISP",     source: "교량·터널 계측 (EXAM 연계)", standard: "남한강교(중부내륙선 128.6k).신축이음.변위",  unit: "mm",    rule: "μm → mm 변환",               status: "매핑" },
      { raw: "2150038902",        source: "DSRC·GPS 프로브 통행속도",   standard: "—",                                          unit: "?",     rule: "—",                          status: "미매핑" },
      { raw: "2150039014",        source: "DSRC·GPS 프로브 통행속도",   standard: "—",                                          unit: "?",     rule: "—",                          status: "미매핑" },
    ],
    unitRules: [
      { from: "m/s",          to: "km/h",           factor: "× 3.6",                          scope: "GPS 프로브 속도" },
      { from: "통과시간(초)", to: "km/h",           factor: "구간 길이(km) ÷ 통과시간 × 3,600", scope: "DSRC 구간 통행속도" },
      { from: "대/30초",      to: "대/5분",         factor: "10주기 합산",                    scope: "VDS 교통량" },
      { from: "gal",          to: "m/s²",           factor: "× 0.01",                         scope: "교량 가속도 계측" },
      { from: "μm",           to: "mm",             factor: "× 0.001",                        scope: "신축이음 변위" },
      { from: "통행료 1~5종", to: "표준 차종 코드", factor: "차종 대응표 적용",               scope: "하이패스 거래 · VDS 차종 분류" },
    ],
    glossary: [
      { term: "정체", synonyms: ["지정체", "혼잡"], definition: "구간 평균속도 40km/h 미만이 연속 2주기(10분) 유지된 상태", owner: "교통센터" },
      { term: "서행", synonyms: ["지체", "감속 운행"], definition: "구간 평균속도 40km/h 이상 60km/h 미만이 연속 2주기(10분) 유지된 상태", owner: "교통센터" },
      { term: "결측률", synonyms: ["미수신율", "검지 실패율"], definition: "5분 집계 주기에 유효 관측값이 수신되지 않은 비율 — 관리 임계 3.0%", owner: "데이터플랫폼부" },
      { term: "2차사고 위험도", synonyms: ["후속사고 위험지수"], definition: "돌발 지점 상류의 급감속 분포로 산출한 0~1 지수 — 0.70 이상이면 VMS 경보", owner: "교통센터" },
      { term: "이정", synonyms: ["거리표", "km 포스트"], definition: "노선 기점부터의 거리(k) — 지점·구간·시설물 위치를 잇는 공통 기준", owner: "도로처" },
    ],
    relations: [
      { from: "기흥IC~수원신갈IC (384.2k~389.6k)", rel: "소속 노선", to: "경부선(0010) 하행" },
      { from: "경부선(0010) 하행 384.2k~389.6k", rel: "관할", to: "수도권본부" },
      { from: "VDS-0010-0247", rel: "결측 원인 지점", to: "경부선 구간 결측률 4.8%" },
      { from: "경부선 구간 결측률 4.8%", rel: "영향", to: "ex-speed-lstm v2.3 드리프트 +0.9" },
      { from: "남한강교 (중부내륙선 128.6k)", rel: "계측 센서", to: "신축이음 변위 12.4mm · 가속도 RMS 3.4m/s²" },
      { from: "남한강교 신축이음 변위", rel: "점검 이력", to: "EX-시설처-2026-0357 정밀안전진단 요청" },
    ],
  },

  outputs: [
    { id: "knowledge", label: "Knowledge Data", engine: "RAG Ready", desc: "청크 · 임베딩 · 메타데이터 · 출처",
      metrics: [{ label: "청크", value: "104,300개" }, { label: "임베딩", value: "1,024차원" }, { label: "출처 메타", value: "100%" }],
      items: [
        { name: "도로 지침·기준 문서 청크",       size: "61,400 청크", updated: "09-16 18:10", consumer: "AI 에이전트 (RoadQ)" },
        { name: "정비 작업지시서·점검표 OCR 청크", size: "18,600 청크", updated: "09-17 01:20", consumer: "AI 에이전트 (RoadQ)" },
        { name: "기안문·보고서·메일 청크",        size: "24,300 청크", updated: "09-18 03:30", consumer: "LLM · sLLM" },
      ] },
    { id: "context", label: "Context Data", engine: "CAG Ready", desc: "도메인 맥락 · 정책 · 매뉴얼 · 규칙",
      metrics: [{ label: "컨텍스트", value: "352건" }, { label: "캐시 적중률", value: "95%" }],
      items: [
        { name: "돌발상황 대응 절차 · VMS 송출 규칙",  size: "76건",  updated: "09-02", consumer: "AI 에이전트 (RoadQ)" },
        { name: "결측 보정 · 소통 판정 규칙",         size: "48건",  updated: "09-15", consumer: "AI 에이전트 · 예측 모델" },
        { name: "도로유지관리지침 요약본",            size: "132건", updated: "09-15", consumer: "LLM · sLLM" },
        { name: "용어 사전(표준 1,140개)",            size: "96건",  updated: "09-18", consumer: "전체" },
      ] },
    { id: "structured", label: "Structured AI Data", engine: "TAG Ready", desc: "테이블 데이터셋 · 의미 스키마 · 피처",
      metrics: [{ label: "테이블", value: "34개" }, { label: "의미 스키마", value: "5개" }, { label: "피처", value: "184개" }],
      items: [
        { name: "구간 속도 5분 집계 뷰 (datalake.section_speed_5min)", size: "일 2,840만 행", updated: "09-18 07:55", consumer: "예측 모델 · AI 에이전트(TAG)" },
        { name: "돌발 이벤트 테이블 (extis.incident_log)",            size: "9.2만 건",     updated: "09-18 07:43", consumer: "AI 에이전트(TAG)" },
        { name: "교량 계측 피처셋",                                   size: "126 피처",     updated: "09-18 06:00", consumer: "예측 모델 (예지보전)" },
        { name: "노면결빙 피처셋 (RWIS)",                             size: "58 피처",      updated: "09-18 06:00", consumer: "노면결빙 예측 모델" },
      ] },
    { id: "training", label: "Training Data", engine: "학습", desc: "인스트럭션 · Q&A · 파인튜닝 데이터셋",
      metrics: [{ label: "Q&A", value: "2,600쌍" }, { label: "인스트럭션", value: "1,400건" }, { label: "시계열 학습셋", value: "30개월" }],
      items: [
        { name: "돌발상황 대응 Q&A",                    size: "2,600쌍", updated: "09-12", consumer: "sLLM 파인튜닝" },
        { name: "정비 작업지시 인스트럭션",             size: "1,400건", updated: "09-10", consumer: "sLLM 파인튜닝" },
        { name: "통행속도 학습셋 (2024-01~2026-06)",    size: "30개월",  updated: "07-02", consumer: "통행속도 예측 모델 재학습" },
      ] },
  ],

  quality: {
    summary: [
      { label: "품질 규칙", value: "22개", note: "결측 7 · 이상치 6 · 중복 3 · 형식 6" },
      { label: "금일 위반", value: "3건", tone: "amber" },
      { label: "자동 보정", value: "41.2만 건" },
      { label: "평균 품질 점수", value: "91", tone: "emerald" },
    ],
    rules: [
      { id: "q1", name: "VDS 결측률 임계",  type: "결측",   target: "VDS 5분 집계 시계열 — 경부선", condition: "구간 결측률 3.0% 이하",          result: "위반", detail: "4.8% — VDS-0010-0247 통신 불량 3일, 보간 한도(30분) 초과", auto: true },
      { id: "q2", name: "적재 지연 임계",   type: "적시성",   target: "VDS 5분 집계 시계열 — 전체",   condition: "5분 집계 적재 지연 3분 이내",     result: "위반", detail: "최대 4분 12초 — 07:31 수도권본부 엣지 단절분 재전송, 당일 소명 대상", auto: false },
      { id: "q3", name: "링크→구간 매핑",   type: "형식",   target: "프로브 통행속도",              condition: "링크 ID 전부 구간 ID에 매핑",     result: "위반", detail: "신규 링크 312개 미매핑 — 표준화 대기", auto: false },
      { id: "q4", name: "속도 범위",        type: "이상치", target: "VDS·프로브 속도",              condition: "0~200 km/h (물리 범위)",          result: "통과", detail: "범위 밖 0건 · 386.8k 급락(38km/h)은 실제 사건으로 유지", auto: true },
      { id: "q5", name: "재전송 중복 제거", type: "중복",   target: "VDS 5분 집계 시계열 — 전체",   condition: "지점·채널·시각 키 유일",          result: "통과", detail: "엣지 재전송 중복 1,284건 자동 제거", auto: true },
      { id: "q6", name: "타임스탬프 단조성", type: "형식",  target: "VDS 5분 집계 시계열 — 전체",   condition: "역전 레코드 0건",                 result: "통과", detail: "최근 24시간 0건 — 재전송분도 시각순 적재", auto: true },
    ],
  },

  apps: [
    { id: "llm", product: "LLM · sLLM", name: "상용 API와 온프레미스 소형 모델",
      desc: "도로 지침·매뉴얼 청크와 돌발 대응 기준을 근거로 답합니다. 기밀 등급 데이터는 내부 GPU의 온프레미스 모델에서만 처리합니다.",
      uses: ["knowledge", "context"] },
    { id: "agent", product: "AI 에이전트", name: "RoadQ (AgentQ 도로 특화 에디션)",
      desc: "데이터 탭 조회(TAG)·돌발상황 자동 대응·데이터 품질 이상 대응이 이 산출물을 씁니다. 07:42 경부선 386.8k 급감속 7건을 2차사고 위험도 0.78(임계 0.70)로 판정하고 근거와 함께 VMS 3기 송출안을 제시합니다.",
      uses: ["knowledge", "context", "structured"],
      link: { label: "RoadQ 서비스 데모 열기", url: "https://ex-road-ai.pages.dev/" } },
    { id: "predict", product: "예측 모델", name: "통행속도 · 노면결빙 · 교량 예지보전",
      desc: "ex-speed-lstm v2.3(30분 MAE 4.7km/h)과 노면결빙 예측 모델이 Structured AI Data 피처로 학습합니다. 결측이 드리프트(+0.9, 임계 1.0)로 번지면 재학습·검증 후 반영합니다.",
      uses: ["structured", "training"] },
    { id: "cubeon", product: "Cubeon", name: "판단을 승인과 업무 실행으로",
      desc: "VMS 송출·정비 작업지시(EXMMS)·정밀안전진단 요청(EX-시설처-2026-0357)을 승인 절차와 업무 실행으로 연결합니다.",
      uses: ["context", "structured"] },
  ],
};

export default expresswayQdata;
