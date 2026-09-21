# 원문 정리 — QData 제품 페이지 (제안서·데모의 근거)

> 수집일 2026-09-21. 두 페이지를 브라우저로 직접 열람해 본문을 정리했다.
> **기준 원문은 v2**(더 다듬어진 판). 제안서·데모 문구가 원문과 다르면 이 문서를 근거로 판정한다.
>
> - 공식: https://www.ocube.co.kr/ko/solution-dataq — 탭 제목 `QData · AI-Ready Data Platform | 오큐브(주)`
> - v2: https://ocube-homepage-next-v2.pages.dev/solution-dataq — 탭 제목 `QData 산업 데이터 플랫폼 — 오큐브`
>
> 제품명은 **QData**(URL 슬러그만 `dataq`).

## 1. 두 판의 차이 (v2 기준으로 쓸 것)

| 위치 | 공식 사이트 | v2 | 판정 |
|---|---|---|---|
| §04 부제 | "하나의 데이터 기반에서 목적별로 생성" (§03과 중복) | "그대로 가져다 쓰는 산출물" | **공식 사이트 오류** → v2 |
| §04 Knowledge Data 설명 | "검색·근거 중심 데이터" (RAG Ready와 중복) | "청크 · 임베딩 · 메타데이터 · 출처" | **공식 사이트 오류** → v2 |
| 히어로 4기둥 | 제목 + 설명 | 소제목 추가(아래 §2) | v2 |
| Features | 한글 제목만 | 영문 분류 추가(Pipeline·Chunking·Embedding·Recovery·Governance) | v2 |
| Standards | 설명 카드만 | 표준 칩 추가(OPC-UA · ISA-95 · MQTT·Sparkplug B · Modbus · 데이터 카탈로그 · 데이터 변경 이력) | v2 |

## 2. 구조 요약 (원문 순서)

**정의**: AI-Ready Data Platform. 정형·비정형·시계열·문서 데이터를 연결하고 RAG·CAG·TAG 기반 AI가 바로 활용할 수 있는 데이터로 가공.

**4대 기둥 (Hero)**
| 기둥 | v2 소제목 | 핵심 |
|---|---|---|
| 파이프라인 | 수집부터 활용까지 한 흐름으로 | 표준 커넥터 연결, 통신 단절 시 **엣지 임시 저장으로 유실 방지** |
| 비정형 처리 | 문서·이미지·음성까지 | 표·도면 섞인 문서를 의미 단위로 정리, **OCR·STT** |
| 의미 기반 지식화 | 검색을 넘어 추론까지 | 공통 형식·용어 체계로 이름·단위 통일, 관계·의미 기반 검색 |
| 데이터·모델 운영 | 품질과 성능을 함께 | 품질·변경 이력 확인, 변화 시 **재학습·검증 후 반영** |

**Overview — 4단계 흐름**: 데이터 수집 및 연계(PLC·센서·MES·ERP) → 형식·의미 표준화 → AI-Ready Data 구축(RAG·CAG·TAG·예측 모델) → 분석·서비스 활용(대시보드·실시간 조회, **QFactory·AgentQ가 활용**)

**Architecture — 5계층**
1. Data Sources — 정형(ERP·MES·DB·CSV·API) / 비정형(PDF·DOCX·PPT·메일) / 산업(PLC·센서·시계열·영상) / 지식(매뉴얼·리포트·표준·이력)
2. QData Core Pipeline — **6단계**: Connect(연결) → Parse(구조화) → Clean(품질관리: 중복 제거·오류 보정·결측 처리) → Standardize(스키마 통일·단위 표준화) → Contextualize(도메인·업무 맥락과 관계) → Ready(품질·일관성·맥락)
3. AI Data Engine — RAG Ready(검색·근거) / CAG Ready(반복 참조 컨텍스트 최적화) / TAG Ready(탐색·집계용 구조)
4. AI-Ready Data Outputs — Knowledge Data(청크·임베딩·메타데이터·출처) / Context Data(도메인 맥락·정책·매뉴얼·규칙) / Structured AI Data(테이블 데이터셋·의미 스키마·피처) / Training Data(인스트럭션·Q&A·파인튜닝 데이터셋)
5. AI Applications — LLM·sLLM(상용 API·온프레미스 소형) / AI 에이전트(근거 붙여 답하고 실행까지) / 예측 모델(이상 감지·수요·품질) / **Cubeon**(판단을 승인과 업무 실행으로)

**Features — 5대 기능**
| 영문 분류 | 기능 | 세부 3항목 |
|---|---|---|
| Pipeline | 처리 현황 추적 | 단계별 상태 · 변경 감지(신규·업데이트·삭제 자동 반영) · 개인정보 표시 |
| Chunking | 검색 단위 최적화 | 품질 지표(길이·특수문자·중복·의미 완결성) · 문서별 진단(주의·경고) · 분할 규칙 관리(크기·오버랩·방식) |
| Embedding | 벡터 품질 검증 | 모델별 현황(차원·처리량·지연) · 색인 상태(컬렉션·디스크·인덱스) · 재순위 검토 |
| Recovery | 실패 문서 재처리 | 실패 단계 기록 · 자동 재처리(재시도·우선순위 큐) · 수동 처리 분기(담당자 통보) |
| Governance | 권한 기반 접근 제어 | 폴더 단위 권한(전체·부서별·특정) · 개인정보 마스킹 · 반영 상태 확인(청크 수·처리 상태) |

**Standards & Governance**: 표준 칩 — OPC-UA · ISA-95 · MQTT·Sparkplug B · Modbus · 데이터 카탈로그 · 데이터 변경 이력. 카드 6 — 상호운용 표준 / 데이터 거버넌스(카탈로그·계보·품질 규칙) / 세분화 접근제어(데이터·질의 단위 권한·감사 로그, 규제 산업 데이터 주권) / 산업 상호운용 / 품질·검증 규칙(결측·이상·중복 자동화) / 개방형 카탈로그

**Ideal Use Cases — 4유형**: ① 데이터 정비에서 막힌 제조 조직 ② 설비망·업무망이 분리된 운영 조직 ③ 기술 문서가 흩어진 기업 ④ **폐쇄망·망분리 요건이 있는 기관**(공공·에너지 성격)

## 3. 데모(QData 콘솔) 매핑

| 원문 요소 | QData 콘솔 메뉴 | 구현 |
|---|---|---|
| 5계층 아키텍처 | 랜딩 + 개요 | 신규 |
| Data Sources · 엣지 임시 저장 · 표준 프로토콜 | 01 수집·연계 › 데이터 소스·커넥터 | 신규 |
| Core Pipeline 6단계 | 02 코어 파이프라인 › 6단계 파이프라인 | 신규 |
| Features(Pipeline·Chunking·Embedding·Recovery) | 02 › 문서 처리 파이프라인 | 재사용(RAG 파이프라인 5탭) |
| Standardize·Contextualize | 02 › 표준화·맥락화 | 신규 |
| AI Data Engine RAG·CAG·TAG | 03 AI 데이터 엔진 › 증강 전략 | 재사용 |
| AI-Ready Data Outputs | 03 › AI-Ready 산출물 | 신규 |
| 카탈로그·계보 | 04 거버넌스 › 카탈로그·계보 | 재사용 |
| 품질·검증 규칙 | 04 › 품질·검증 규칙 | 신규 |
| Governance(폴더 권한·마스킹) | 04 › 권한·개인정보 | 재사용(지식영역 설정) |
| 세분화 접근제어·감사 로그 | 04 › 감사 로그 | 재사용 |
| 폐쇄망·망분리 | 04 › 보안·망분리 | 재사용(보안 아키텍처) |
| 데이터·모델 운영 | 05 운영 › 모델 성능·재학습 / 모델 레지스트리 | 재사용 |
| AI Applications(AgentQ·QFactory·Cubeon) | 06 활용 › 서비스 연계 | 신규 |
