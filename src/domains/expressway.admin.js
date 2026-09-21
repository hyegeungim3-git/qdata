/**
 * 한국도로공사 적용 사례 — 관리자(재사용 화면) 콘텐츠
 *
 * RoadQ(ex-road-ai)에서 검증된 도로공사 값을 그대로 옮겨 왔다(2026-09-21 포크 시점).
 * 키는 src/admin/mocks.js 상수명과 같아야 한다 — applyAdminDomain()이 이 키로 덮어쓴다.
 * 수치·식별자 정본: docs/WORLD-LEDGER-EXPRESSWAY.md
 */
const expresswayAdmin = {
  "MOCK_VECTOR_COLLECTIONS": [{"name": "road_design_guides", "vectors": 612400, "dim": 1024, "status": "Active", "updated": "2026-09-17"}, {"name": "maintenance_manuals", "vectors": 418920, "dim": 1024, "status": "Active", "updated": "2026-09-18"}, {"name": "incident_response", "vectors": 186300, "dim": 1024, "status": "Active", "updated": "2026-09-18"}, {"name": "bridge_inspection_reports", "vectors": 322700, "dim": 1024, "status": "Active", "updated": "2026-09-16"}, {"name": "inspection_forms_ocr", "vectors": 198540, "dim": 1024, "status": "Building", "updated": "2026-09-18"}, {"name": "toll_ops_handbook", "vectors": 85700, "dim": 1024, "status": "Active", "updated": "2026-09-11"}],
  "ADMIN_VECTOR_SEARCH_RESULTS": [
    {
      "id": "vec_8a1",
      "score": 0.92,
      "content": "...본 지침은 한국도로공사의 고속도로 유지관리 업무 수행에 필요한 사항을 규정함을 목적으로 한다..."
    },
    {
      "id": "vec_3b2",
      "score": 0.88,
      "content": "...제 2 조 (적용범위) 이 지침은 공사의 전 임직원 및 도로 현장 협력업체에 적용하며..."
    },
    {
      "id": "vec_9c3",
      "score": 0.75,
      "content": "...VDS 관측지점 정기 점검은 분기 1회 실시를 원칙으로 하며, 통신 불량은 3일 내 출동을 원칙으로 한다..."
    }
  ],
  "MOCK_MODELS": [
    {
      "id": "gpt-oss",
      "name": "GPT-OSS-120B",
      "param": "120B",
      "context": "128K",
      "quant": "None (FP16)",
      "status": "Running",
      "loaded": "Node-01"
    },
    {
      "id": "llama-3",
      "name": "Llama-3-Kor-Instruct",
      "param": "70B",
      "context": "8K",
      "quant": "AWQ-4bit",
      "status": "Running",
      "loaded": "Node-01"
    },
    {
      "id": "exaone",
      "name": "EXAONE-3.0-7.8B",
      "param": "7.8B",
      "context": "32K",
      "quant": "FP16",
      "status": "Running",
      "loaded": "Node-02"
    },
    {
      "id": "gemma",
      "name": "Gemma-2-9B-It",
      "param": "9B",
      "context": "8K",
      "quant": "GGUF-Q8",
      "status": "Stopped",
      "loaded": "-"
    },
    {
      "id": "solar",
      "name": "Solar-10.7B-v1.0",
      "param": "10.7B",
      "context": "4K",
      "quant": "GGUF-Q5",
      "status": "Running",
      "loaded": "Node-02"
    }
  ],
  "MOCK_DATA_ASSETS": [
    {
      "id": "as-1",
      "name": "VDS 5분 집계 시계열",
      "source": "EXTIS 수집 서버",
      "owner": "데이터플랫폼부",
      "grade": "내부",
      "format": "시계열 테이블",
      "volume": "일 2,840만 행",
      "cycle": "5분",
      "freshness": "4분 12초 전",
      "quality": 95,
      "standardized": 100,
      "tags": [
        "TAG 대상",
        "시계열"
      ],
      "consumers": [
        "통행속도 예측",
        "데이터 조회"
      ]
    },
    {
      "id": "as-2",
      "name": "도로 지침·기준 문서",
      "source": "EDMS 문서관리시스템",
      "owner": "도로처",
      "grade": "내부",
      "format": "PDF·HWP",
      "volume": "문서 1,240건",
      "cycle": "수시",
      "freshness": "2일 전",
      "quality": 92,
      "standardized": 100,
      "tags": [
        "RAG 대상",
        "지침"
      ],
      "consumers": [
        "지식 검색",
        "내규 조회"
      ]
    },
    {
      "id": "as-3",
      "name": "정비 작업지시서 스캔 이미지",
      "source": "EXMMS 스캔·업로드",
      "owner": "시설처 구조물관리부",
      "grade": "내부",
      "format": "이미지",
      "volume": "월 286건",
      "cycle": "수시",
      "freshness": "1일 전",
      "quality": 71,
      "standardized": 45,
      "tags": [
        "OCR 대상"
      ],
      "consumers": [
        "문서 인식(OCR)"
      ]
    }
  ],
  "MOCK_DATA_LINEAGE": {
    "as-1": {
      "upstream": [
        {
          "name": "VDS 검지기 원시 신호",
          "type": "센서"
        },
        {
          "name": "프로브 통행속도",
          "type": "API"
        }
      ],
      "stages": [
        {
          "name": "수집",
          "desc": "EXTIS 5분 주기 수집",
          "tool": "수집 커넥터"
        },
        {
          "name": "정제",
          "desc": "결측 보간·이상치 제거(현재 결측률 4.8%)",
          "tool": "품질 규칙"
        },
        {
          "name": "적재",
          "desc": "EX-DataLake 시계열 테이블 적재",
          "tool": "스트림 적재"
        }
      ],
      "downstream": [
        {
          "name": "통행속도 예측 모델",
          "type": "모델"
        },
        {
          "name": "데이터 조회 에이전트",
          "type": "에이전트"
        }
      ]
    },
    "as-2": {
      "upstream": [
        {
          "name": "부서별 지침 원본",
          "type": "파일"
        },
        {
          "name": "개정 이력",
          "type": "문서"
        }
      ],
      "stages": [
        {
          "name": "수집",
          "desc": "EDMS 연동 수집",
          "tool": "커넥터"
        },
        {
          "name": "청킹",
          "desc": "조항 단위 분할(512토큰)",
          "tool": "RAG 파이프라인"
        },
        {
          "name": "임베딩",
          "desc": "벡터 생성·색인",
          "tool": "임베딩 엔진"
        }
      ],
      "downstream": [
        {
          "name": "지식 검색 에이전트",
          "type": "에이전트"
        },
        {
          "name": "내규 조회 에이전트",
          "type": "에이전트"
        }
      ]
    },
    "as-3": {
      "upstream": [
        {
          "name": "스캔 원본",
          "type": "이미지"
        }
      ],
      "stages": [
        {
          "name": "전처리",
          "desc": "기울기·노이즈 보정",
          "tool": "이미지 전처리"
        },
        {
          "name": "OCR",
          "desc": "문자·표 인식",
          "tool": "Vision OCR"
        }
      ],
      "downstream": [
        {
          "name": "문서 인식 에이전트",
          "type": "에이전트"
        }
      ]
    }
  },
  "ADMIN_AGENT_FOLDER_LINKS": [
    {
      "agent": "사규 기반 문서 사전 검토",
      "folders": [
        "도로설계기준",
        "법률/계약"
      ]
    },
    {
      "agent": "교통데이터 분석 어시스턴트",
      "folders": [
        "도로유지관리지침",
        "도로설계기준"
      ]
    },
    {
      "agent": "HR 질의응답 봇",
      "folders": [
        "인사규정",
        "교육자료"
      ]
    }
  ],
  "ADMIN_PERSONA": {
    "name": "한지훈",
    "role": "관리자",
    "dept": "디지털계획처 AI인프라부",
    "email": "han@ex.co.kr"
  },
  "MOCK_BATCH_JOBS": [
    {
      "id": "bj-001",
      "src": "그룹웨어",
      "target": "도로설계기준",
      "schedule": "매일 02:00",
      "lastRun": "2026-09-18 02:00",
      "lastResult": "성공",
      "addedDocs": 3,
      "updatedDocs": 1,
      "deletedDocs": 0,
      "enabled": true
    },
    {
      "id": "bj-002",
      "src": "ERP",
      "target": "인사규정",
      "schedule": "매주 월 03:00",
      "lastRun": "2026-09-17 03:00",
      "lastResult": "성공",
      "addedDocs": 0,
      "updatedDocs": 2,
      "deletedDocs": 0,
      "enabled": true
    },
    {
      "id": "bj-003",
      "src": "EDMS",
      "target": "법률/계약",
      "schedule": "실시간 동기화",
      "lastRun": "2026-09-18 09:15",
      "lastResult": "성공",
      "addedDocs": 1,
      "updatedDocs": 0,
      "deletedDocs": 0,
      "enabled": true
    },
    {
      "id": "bj-004",
      "src": "그룹웨어",
      "target": "교육자료",
      "schedule": "매일 04:00",
      "lastRun": "2026-09-17 04:00",
      "lastResult": "실패",
      "addedDocs": 0,
      "updatedDocs": 0,
      "deletedDocs": 0,
      "enabled": false
    }
  ],
  "MOCK_KB_DOCS": {
    "f-001": [
      {
        "id": "d-001",
        "name": "도로설계기준_2026.pdf",
        "size": "4.2MB",
        "pii": false,
        "status": "완료",
        "chunks": 312,
        "uploaded": "2026-09-05",
        "uploader": "오재현"
      },
      {
        "id": "d-002",
        "name": "VDS_설치·운영기준.pdf",
        "size": "8.1MB",
        "pii": false,
        "status": "완료",
        "chunks": 580,
        "uploaded": "2026-09-03",
        "uploader": "이도현"
      },
      {
        "id": "d-003",
        "name": "공사구간_안전점검체크리스트.xlsx",
        "size": "1.2MB",
        "pii": true,
        "status": "완료",
        "chunks": 85,
        "uploaded": "2026-09-01",
        "uploader": "김태우"
      }
    ],
    "f-002": [
      {
        "id": "d-011",
        "name": "교량점검_실무매뉴얼.pdf",
        "size": "12.3MB",
        "pii": false,
        "status": "완료",
        "chunks": 820,
        "uploaded": "2026-09-03",
        "uploader": "정민석"
      },
      {
        "id": "d-012",
        "name": "2026_유지보수이력.xlsx",
        "size": "2.8MB",
        "pii": true,
        "status": "처리중",
        "chunks": 190,
        "uploaded": "2026-09-04",
        "uploader": "정민석"
      }
    ],
    "f-003": [
      {
        "id": "d-021",
        "name": "인사규정_2026_개정안.pdf",
        "size": "2.4MB",
        "pii": true,
        "status": "완료",
        "chunks": 145,
        "uploaded": "2026-09-07",
        "uploader": "임하늘"
      },
      {
        "id": "d-022",
        "name": "복리후생제도안내.pdf",
        "size": "1.8MB",
        "pii": false,
        "status": "완료",
        "chunks": 98,
        "uploaded": "2026-08-13",
        "uploader": "임하늘"
      }
    ],
    "f-004": [
      {
        "id": "d-031",
        "name": "유지보수_표준계약서_2026.docx",
        "size": "580KB",
        "pii": false,
        "status": "완료",
        "chunks": 62,
        "uploaded": "2026-08-29",
        "uploader": "강민철"
      }
    ],
    "f-005": [
      {
        "id": "d-041",
        "name": "신입교육과정.pptx",
        "size": "22.5MB",
        "pii": false,
        "status": "완료",
        "chunks": 410,
        "uploaded": "2026-08-25",
        "uploader": "윤서진"
      },
      {
        "id": "d-042",
        "name": "도로안전교육_2026_3분기.pdf",
        "size": "5.8MB",
        "pii": false,
        "status": "완료",
        "chunks": 270,
        "uploaded": "2026-09-04",
        "uploader": "윤서진"
      }
    ]
  },
  "MOCK_KB_FOLDERS": [
    {
      "id": "f-001",
      "name": "도로설계기준",
      "parent": null,
      "docs": 245,
      "perm": "all",
      "owner": "도로처"
    },
    {
      "id": "f-011",
      "name": "포장·토공",
      "parent": "f-001",
      "docs": 120,
      "perm": "dept",
      "owner": "도로처"
    },
    {
      "id": "f-012",
      "name": "교량·터널",
      "parent": "f-001",
      "docs": 125,
      "perm": "dept",
      "owner": "시설처 구조물관리부"
    },
    {
      "id": "f-002",
      "name": "도로유지관리지침",
      "parent": null,
      "docs": 180,
      "perm": "dept",
      "owner": "시설처 구조물관리부"
    },
    {
      "id": "f-021",
      "name": "점검 이력",
      "parent": "f-002",
      "docs": 80,
      "perm": "dept",
      "owner": "시설처 구조물관리부"
    },
    {
      "id": "f-003",
      "name": "인사규정",
      "parent": null,
      "docs": 120,
      "perm": "all",
      "owner": "경영지원처"
    },
    {
      "id": "f-004",
      "name": "법률/계약",
      "parent": null,
      "docs": 95,
      "perm": "specific",
      "owner": "법무실"
    },
    {
      "id": "f-005",
      "name": "교육자료",
      "parent": null,
      "docs": 310,
      "perm": "all",
      "owner": "인재개발원"
    }
  ],
  "MOCK_SYNC_LOGS": [
    {
      "id": 1,
      "time": "2026-09-18 09:15:22",
      "src": "EDMS",
      "folder": "법률/계약",
      "file": "유지보수_용역계약서_수정본.docx",
      "action": "추가",
      "pii": false,
      "status": "완료"
    },
    {
      "id": 2,
      "time": "2026-09-18 02:00:45",
      "src": "그룹웨어",
      "folder": "도로설계기준",
      "file": "도로안전시설_설치지침_9월.pdf",
      "action": "추가",
      "pii": false,
      "status": "완료"
    },
    {
      "id": 3,
      "time": "2026-09-18 02:00:43",
      "src": "그룹웨어",
      "folder": "도로설계기준",
      "file": "공사구간_안전점검일지_9월.xlsx",
      "action": "업데이트",
      "pii": true,
      "status": "완료(마스킹)"
    },
    {
      "id": 4,
      "time": "2026-09-17 03:01:12",
      "src": "ERP",
      "folder": "인사규정",
      "file": "급여기준표_개정.xlsx",
      "action": "업데이트",
      "pii": true,
      "status": "완료(마스킹)"
    },
    {
      "id": 5,
      "time": "2026-09-16 04:00:33",
      "src": "그룹웨어",
      "folder": "교육자료",
      "file": "신입교육자료_9월.pptx",
      "action": "추가",
      "pii": false,
      "status": "실패"
    }
  ],
  "UPSTAGE_OCR_MOCK": {
    "totalPages": 3,
    "totalBlocks": 16,
    "elapsed": 2.4,
    "pages": [
      {
        "page": 1,
        "text": "제1조 (목적)\n이 규정은 한국도로공사의 고속도로 교통 시계열 데이터 수집·품질관리에 관한 사항을 규정함을 목적으로 한다.\n\n제2조 (적용 범위)\n이 규정은 공사가 운영하는 모든 VDS 관측지점에 적용한다.\n\n제3조 (정의)\n이 규정에서 사용하는 용어의 정의는 다음과 같다.",
        "blocks": [
          {
            "text": "제1조 (목적)",
            "bbox": {
              "x": 14,
              "y": 14,
              "w": 35,
              "h": 6
            }
          },
          {
            "text": "이 규정은 한국도로공사의 고속도로 교통 시계열 데이터 수집·품질관리에 관한 사항을 규정함을 목적으로 한다.",
            "bbox": {
              "x": 14,
              "y": 22,
              "w": 70,
              "h": 8
            }
          },
          {
            "text": "제2조 (적용 범위)",
            "bbox": {
              "x": 14,
              "y": 36,
              "w": 38,
              "h": 6
            }
          },
          {
            "text": "이 규정은 공사가 운영하는 모든 VDS 관측지점에 적용한다.",
            "bbox": {
              "x": 14,
              "y": 44,
              "w": 65,
              "h": 6
            }
          },
          {
            "text": "제3조 (정의)",
            "bbox": {
              "x": 14,
              "y": 56,
              "w": 28,
              "h": 6
            }
          },
          {
            "text": "이 규정에서 사용하는 용어의 정의는 다음과 같다.",
            "bbox": {
              "x": 14,
              "y": 64,
              "w": 60,
              "h": 6
            }
          }
        ]
      },
      {
        "page": 2,
        "text": "제4조 (점검 주기)\n① VDS 관측지점: 정기 점검 분기 1회, 수시 점검 결측 발생 시\n② 프로브 통행속도: 정기 점검 반기 1회, 표본 검증 분기 1회\n③ 노면기상(RWIS): 정기 점검 분기 1회, 동절기 전 정밀 점검",
        "blocks": [
          {
            "text": "제4조 (점검 주기)",
            "bbox": {
              "x": 14,
              "y": 10,
              "w": 36,
              "h": 6
            }
          },
          {
            "text": "① VDS 관측지점: 정기 점검 분기 1회, 수시 점검 결측 발생 시",
            "bbox": {
              "x": 18,
              "y": 20,
              "w": 66,
              "h": 6
            }
          },
          {
            "text": "② 프로브 통행속도: 정기 점검 반기 1회, 표본 검증 분기 1회",
            "bbox": {
              "x": 18,
              "y": 29,
              "w": 62,
              "h": 6
            }
          },
          {
            "text": "③ 노면기상(RWIS): 정기 점검 분기 1회, 동절기 전 정밀 점검",
            "bbox": {
              "x": 18,
              "y": 38,
              "w": 60,
              "h": 6
            }
          }
        ]
      },
      {
        "page": 3,
        "text": "제5조 (점검 결과 보고)\n점검 완료 후 14일 이내에 점검 결과 보고서를 작성하여 디지털계획처장에게 제출하여야 한다.\n\n[별표 1] VDS 관측지점 점검 체크리스트",
        "blocks": [
          {
            "text": "제5조 (점검 결과 보고)",
            "bbox": {
              "x": 14,
              "y": 10,
              "w": 44,
              "h": 6
            }
          },
          {
            "text": "점검 완료 후 14일 이내에 결과보고서를 제출하여야 한다.",
            "bbox": {
              "x": 14,
              "y": 20,
              "w": 70,
              "h": 8
            }
          },
          {
            "text": "[별표 1] VDS 관측지점 점검 체크리스트",
            "bbox": {
              "x": 14,
              "y": 36,
              "w": 52,
              "h": 6
            }
          },
          {
            "text": "(개인 식별 정보 처리됨 — PII 마스킹 적용)",
            "bbox": {
              "x": 14,
              "y": 46,
              "w": 65,
              "h": 6
            }
          },
          {
            "text": "담당자 서명란",
            "bbox": {
              "x": 14,
              "y": 58,
              "w": 28,
              "h": 6
            }
          },
          {
            "text": "디지털계획처장 확인",
            "bbox": {
              "x": 14,
              "y": 66,
              "w": 34,
              "h": 6
            }
          }
        ]
      }
    ]
  },
  "UPSTAGE_PARSE_MOCK": {
    "statistics": {
      "paragraphs": 24,
      "headings": 8,
      "tables": 3,
      "figures": 2,
      "total": 37
    },
    "elements": [
      {
        "category": "heading1",
        "content": "교통데이터 품질관리규정",
        "page": 1
      },
      {
        "category": "heading2",
        "content": "제1장 총칙",
        "page": 1
      },
      {
        "category": "paragraph",
        "content": "제1조 (목적) 이 규정은 한국도로공사의 고속도로 교통 시계열 데이터 수집·품질관리에 관한 사항을 규정함을 목적으로 한다.",
        "page": 1
      },
      {
        "category": "paragraph",
        "content": "제2조 (적용 범위) 이 규정은 공사가 운영하는 모든 VDS 관측지점에 적용한다.",
        "page": 1
      },
      {
        "category": "heading2",
        "content": "제2장 점검 기준",
        "page": 2
      },
      {
        "category": "table",
        "content": "| 점검 대상 | 점검 주기 | 담당부서 |\n|---------|---------|--------|\n| VDS 관측지점 | 분기 1회 | 데이터플랫폼부 |\n| 프로브 통행속도 | 반기 1회 | 도로교통연구원 |",
        "page": 2
      },
      {
        "category": "paragraph",
        "content": "제4조 (점검 방법) 점검은 관련 법령 및 내부 기준에 따라 실시한다.",
        "page": 2
      },
      {
        "category": "figure",
        "content": "[그림 1] VDS 품질 점검 업무 흐름도",
        "page": 2
      },
      {
        "category": "heading2",
        "content": "제3장 보고 의무",
        "page": 3
      },
      {
        "category": "paragraph",
        "content": "제5조 (보고 의무) 점검 완료 후 14일 이내에 결과보고서를 제출하여야 한다.",
        "page": 3
      },
      {
        "category": "list",
        "content": "• 정기점검 결과 보고서\n• 대표 관측지점 선정 조서\n• 이상 발견 시 즉시 보고",
        "page": 3
      },
      {
        "category": "figure",
        "content": "[그림 2] 보고 체계도",
        "page": 3
      }
    ],
    "outputs": {
      "markdown": "# 교통데이터 품질관리규정\n\n## 제1장 총칙\n\n**제1조 (목적)** 이 규정은 한국도로공사의 고속도로 교통 시계열 데이터 수집·품질관리에 관한 사항을 규정함을 목적으로 한다.\n\n**제2조 (적용 범위)** 이 규정은 공사가 운영하는 모든 VDS 관측지점에 적용한다.\n\n## 제2장 점검 기준\n\n| 점검 대상 | 점검 주기 | 담당부서 |\n|---------|---------|--------|\n| VDS 관측지점 | 분기 1회 | 데이터플랫폼부 |\n| 프로브 통행속도 | 반기 1회 | 도로교통연구원 |\n\n> [그림 1] VDS 품질 점검 업무 흐름도\n\n## 제3장 보고 의무\n\n**제5조 (보고 의무)** 점검 완료 후 14일 이내에 결과보고서를 제출하여야 한다.\n\n- 정기점검 결과 보고서\n- 대표 관측지점 선정 조서\n- 이상 발견 시 즉시 보고",
      "html": "<h1>교통데이터 품질관리규정</h1>\n<h2>제1장 총칙</h2>\n<p><strong>제1조 (목적)</strong> 이 규정은 한국도로공사의 고속도로 교통 시계열 데이터 수집·품질관리에 관한 사항을 규정함을 목적으로 한다.</p>\n<p><strong>제2조 (적용 범위)</strong> 이 규정은 공사가 운영하는 모든 VDS 관측지점에 적용한다.</p>\n<h2>제2장 점검 기준</h2>\n<table><tr><th>점검 대상</th><th>점검 주기</th><th>담당부서</th></tr><tr><td>VDS 관측지점</td><td>분기 1회</td><td>데이터플랫폼부</td></tr></table>",
      "text": "교통데이터 품질관리규정\n\n제1장 총칙\n\n제1조 (목적) 이 규정은 한국도로공사의 고속도로 교통 시계열 데이터 수집·품질관리에 관한 사항을 규정함을 목적으로 한다.\n\n제2조 (적용 범위) 이 규정은 공사가 운영하는 모든 VDS 관측지점에 적용한다.\n\n제2장 점검 기준\nVDS 관측지점 | 분기 1회 | 데이터플랫폼부\n프로브 통행속도 | 반기 1회 | 도로교통연구원"
    }
  },
  "MOCK_CHUNK_PREVIEW": [
    {
      "idx": 1,
      "text": "제1장 총칙 제1조(목적) 이 지침은 고속도로 교통 시계열 데이터의 수집·정제·품질관리에 관한 세부 기준과 절차를 정하여 데이터의 정확성과 연속성을 확보함을 목적으로 한다.",
      "len": 142,
      "score": 96
    },
    {
      "idx": 2,
      "text": "제2조(적용범위) 이 지침은 전국 VDS 관측지점과 프로브 통행속도 수집 데이터 및 이를 위탁 운영하는 수탁기관에 적용한다.",
      "len": 88,
      "score": 93
    },
    {
      "idx": 3,
      "text": "제3조(정의) ① \"대표 관측지점\"이란 구간 교통 특성을 대표하도록 선정한 VDS 지점을 말한다. ② \"결측\"이란 5분 집계 주기에 유효 관측값이 수신되지 않은 상태를 말한다.",
      "len": 165,
      "score": 97
    }
  ],
  "MOCK_CHUNK_QUALITY": [
    {
      "docId": "d-001",
      "name": "도로설계기준_2026.pdf",
      "folder": "도로설계기준",
      "avgLen": 154,
      "specialCharPct": 1.2,
      "dupPct": 0.8,
      "semanticScore": 94,
      "status": "양호"
    },
    {
      "docId": "d-002",
      "name": "VDS_설치·운영기준.pdf",
      "folder": "도로설계기준",
      "avgLen": 168,
      "specialCharPct": 2.1,
      "dupPct": 1.5,
      "semanticScore": 91,
      "status": "양호"
    },
    {
      "docId": "d-011",
      "name": "교량점검_실무매뉴얼.pdf",
      "folder": "도로유지관리지침",
      "avgLen": 142,
      "specialCharPct": 4.5,
      "dupPct": 3.2,
      "semanticScore": 78,
      "status": "주의"
    },
    {
      "docId": "d-021",
      "name": "인사규정_2026_개정안.pdf",
      "folder": "인사규정",
      "avgLen": 201,
      "specialCharPct": 0.8,
      "dupPct": 0.4,
      "semanticScore": 96,
      "status": "양호"
    },
    {
      "docId": "d-041",
      "name": "신입교육과정.pptx",
      "folder": "교육자료",
      "avgLen": 88,
      "specialCharPct": 8.2,
      "dupPct": 6.5,
      "semanticScore": 58,
      "status": "경고"
    },
    {
      "docId": "e-006",
      "name": "도로교통법_시행규칙_개정.pdf",
      "folder": "법률/계약",
      "avgLen": 178,
      "specialCharPct": 1.9,
      "dupPct": 0.9,
      "semanticScore": 92,
      "status": "양호"
    }
  ],
  "MOCK_DATA_SOURCES_EXT": [
    {
      "id": "ds-e01",
      "name": "법령정보센터 (법제처)",
      "method": "Open API",
      "url": "https://www.law.go.kr/DRF/lawService",
      "target": "법률/계약",
      "schedule": "매주 화 05:00",
      "lastSync": "2026-09-18 05:00",
      "status": "정상",
      "docCount": 1240,
      "newToday": 3
    },
    {
      "id": "ds-e02",
      "name": "나라장터 (조달청)",
      "method": "Open API",
      "url": "https://openapi.g2b.go.kr/",
      "target": "법률/계약",
      "schedule": "매일 06:00",
      "lastSync": "2026-09-18 06:01",
      "status": "정상",
      "docCount": 320,
      "newToday": 12
    },
    {
      "id": "ds-e03",
      "name": "기상청 방재기상정보",
      "method": "Open API",
      "url": "https://apihub.kma.go.kr/",
      "target": "교통안전 매뉴얼",
      "schedule": "매시 정각",
      "lastSync": "2026-09-18 09:00",
      "status": "정상",
      "docCount": 88,
      "newToday": 0
    },
    {
      "id": "ds-e04",
      "name": "국토교통부 도로업무편람",
      "method": "크롤링",
      "url": "https://www.molit.go.kr/",
      "target": "도로설계기준",
      "schedule": "매주 목 04:00",
      "lastSync": "2026-09-13 04:00",
      "status": "오류",
      "docCount": 42,
      "newToday": 0
    }
  ],
  "MOCK_DATA_SOURCES_INT": [
    {
      "id": "ds-i01",
      "name": "그룹웨어 (WorksOn)",
      "protocol": "REST API",
      "target": "도로설계기준/교육자료",
      "schedule": "매일 02:00",
      "lastSync": "2026-09-18 02:01",
      "status": "정상",
      "docCount": 555,
      "newToday": 5
    },
    {
      "id": "ds-i02",
      "name": "ERP (SAP S/4HANA)",
      "protocol": "DB Direct",
      "target": "인사규정",
      "schedule": "매주 월 03:00",
      "lastSync": "2026-09-17 03:02",
      "status": "정상",
      "docCount": 120,
      "newToday": 0
    },
    {
      "id": "ds-i03",
      "name": "EDMS (문서관리시스템)",
      "protocol": "WebDAV",
      "target": "법률/계약",
      "schedule": "실시간 동기화",
      "lastSync": "2026-09-18 09:15",
      "status": "정상",
      "docCount": 95,
      "newToday": 1
    },
    {
      "id": "ds-i04",
      "name": "EXMMS (유지보수 작업관리)",
      "protocol": "REST API",
      "target": "도로유지관리지침",
      "schedule": "매일 01:00",
      "lastSync": "2026-09-18 01:03",
      "status": "경고",
      "docCount": 280,
      "newToday": 0
    }
  ],
  "MOCK_DOC_PIPELINE": [
    {
      "id": "dp-001",
      "name": "도로설계기준_2026.pdf",
      "folder": "도로설계기준",
      "src": "그룹웨어",
      "type": "PDF",
      "size": "4.2MB",
      "ingest": "2026-09-18 02:01",
      "parseStatus": "완료",
      "chunkStatus": "완료",
      "embedStatus": "완료",
      "chunks": 312,
      "tokens": 48200,
      "pii": false,
      "version": 3,
      "changeType": "업데이트"
    },
    {
      "id": "dp-002",
      "name": "도로안전시설_설치지침_9월.pdf",
      "folder": "도로설계기준",
      "src": "그룹웨어",
      "type": "PDF",
      "size": "8.1MB",
      "ingest": "2026-09-18 02:00",
      "parseStatus": "완료",
      "chunkStatus": "완료",
      "embedStatus": "완료",
      "chunks": 580,
      "tokens": 91000,
      "pii": false,
      "version": 1,
      "changeType": "신규"
    },
    {
      "id": "dp-003",
      "name": "급여기준표_개정.xlsx",
      "folder": "인사규정",
      "src": "ERP",
      "type": "XLSX",
      "size": "1.8MB",
      "ingest": "2026-09-17 03:01",
      "parseStatus": "완료",
      "chunkStatus": "완료",
      "embedStatus": "완료",
      "chunks": 145,
      "tokens": 18500,
      "pii": true,
      "version": 5,
      "changeType": "업데이트"
    },
    {
      "id": "dp-004",
      "name": "유지보수_용역계약서_수정본.docx",
      "folder": "법률/계약",
      "src": "EDMS",
      "type": "DOCX",
      "size": "580KB",
      "ingest": "2026-09-18 09:15",
      "parseStatus": "완료",
      "chunkStatus": "완료",
      "embedStatus": "처리중",
      "chunks": 62,
      "tokens": 9800,
      "pii": false,
      "version": 2,
      "changeType": "업데이트"
    },
    {
      "id": "dp-005",
      "name": "신입교육자료_9월.pptx",
      "folder": "교육자료",
      "src": "그룹웨어",
      "type": "PPTX",
      "size": "22.5MB",
      "ingest": "2026-09-16 04:00",
      "parseStatus": "완료",
      "chunkStatus": "실패",
      "embedStatus": "대기",
      "chunks": 0,
      "tokens": 0,
      "pii": false,
      "version": 1,
      "changeType": "신규"
    },
    {
      "id": "dp-006",
      "name": "도로교통법_시행규칙_개정.pdf",
      "folder": "법률/계약",
      "src": "법령정보센터",
      "type": "PDF",
      "size": "3.2MB",
      "ingest": "2026-09-18 05:00",
      "parseStatus": "완료",
      "chunkStatus": "완료",
      "embedStatus": "완료",
      "chunks": 210,
      "tokens": 33500,
      "pii": false,
      "version": 1,
      "changeType": "신규"
    },
    {
      "id": "dp-007",
      "name": "나라장터_입찰공고_0918.json",
      "folder": "법률/계약",
      "src": "조달청",
      "type": "JSON",
      "size": "1.1MB",
      "ingest": "2026-09-18 06:01",
      "parseStatus": "완료",
      "chunkStatus": "완료",
      "embedStatus": "완료",
      "chunks": 28,
      "tokens": 4200,
      "pii": false,
      "version": 1,
      "changeType": "신규"
    }
  ],
  "MOCK_EMBED_STATUS": {
    "today": {
      "total": 1420,
      "success": 1398,
      "fail": 8,
      "pending": 14,
      "successRate": 98.4
    },
    "models": [
      {
        "name": "KLUE-BERT-base",
        "dim": 768,
        "docs": 12400,
        "lastUpdated": "2026-09-18 02:30",
        "status": "정상",
        "avgLatency": 42
      },
      {
        "name": "BGE-M3 (한국어 특화)",
        "dim": 1024,
        "docs": 5800,
        "lastUpdated": "2026-09-18 06:10",
        "status": "정상",
        "avgLatency": 67
      }
    ],
    "vectorDb": {
      "name": "Milvus 2.4",
      "collections": 6,
      "totalVectors": 1824560,
      "diskUsage": "18.4 GB",
      "indexType": "HNSW",
      "status": "정상",
      "queryLatency": 8
    },
    "anomalies": [
      {
        "id": "an-001",
        "doc": "신입교육과정.pptx",
        "type": "낮은밀도",
        "desc": "벡터 클러스터 밀도 임계값(0.45) 미만 — 이미지 슬라이드 과다 포함 의심",
        "detected": "2026-09-16 04:12",
        "status": "미처리"
      },
      {
        "id": "an-002",
        "doc": "2026_유지보수이력.xlsx",
        "type": "이상치",
        "desc": "유클리디안 거리 상위 1% 이상 이탈 벡터 12개 탐지 — 수식/특수문자 과다",
        "detected": "2026-09-17 03:05",
        "status": "검토중"
      }
    ],
    "weeklyTrend": [
      {
        "date": "09-12",
        "success": 1280,
        "fail": 22
      },
      {
        "date": "09-13",
        "success": 1350,
        "fail": 15
      },
      {
        "date": "09-14",
        "success": 1180,
        "fail": 31
      },
      {
        "date": "09-15",
        "success": 890,
        "fail": 8
      },
      {
        "date": "09-16",
        "success": 420,
        "fail": 12
      },
      {
        "date": "09-17",
        "success": 1390,
        "fail": 6
      },
      {
        "date": "09-18",
        "success": 1398,
        "fail": 8
      }
    ]
  },
  "MOCK_REPROCESS_QUEUE": [
    {
      "id": "rq-001",
      "doc": "신입교육자료_9월.pptx",
      "folder": "교육자료",
      "src": "그룹웨어",
      "stage": "청킹",
      "error": "PPTX 이미지 슬라이드 파싱 오류 (PIL 디코딩 실패)",
      "failedAt": "2026-09-16 04:00",
      "retryCount": 2,
      "status": "대기중",
      "priority": "높음"
    },
    {
      "id": "rq-002",
      "doc": "국토교통부_도로업무편람.pdf",
      "folder": "도로설계기준",
      "src": "크롤링",
      "stage": "임베딩",
      "error": "임베딩 서버 응답 타임아웃 (>30s)",
      "failedAt": "2026-09-13 04:15",
      "retryCount": 1,
      "status": "대기중",
      "priority": "보통"
    },
    {
      "id": "rq-003",
      "doc": "교량점검일지_8월.xlsx",
      "folder": "도로유지관리지침",
      "src": "그룹웨어",
      "stage": "파싱",
      "error": "암호화된 XLSX 파일 — 비밀번호 해제 필요",
      "failedAt": "2026-09-11 02:05",
      "retryCount": 3,
      "status": "수동처리필요",
      "priority": "높음"
    },
    {
      "id": "rq-004",
      "doc": "돌발상황대응매뉴얼_v3.pdf",
      "folder": "교통안전 매뉴얼",
      "src": "EDMS",
      "stage": "임베딩",
      "error": "토큰 수 초과 (한도 32,768 — 실제 41,200토큰)",
      "failedAt": "2026-09-15 09:30",
      "retryCount": 0,
      "status": "대기중",
      "priority": "보통"
    }
  ],
  "MOCK_AUG_ROUTES": [
    {
      "id": "rt-1",
      "order": 1,
      "when": "수치·집계·비교를 묻는 질의",
      "keywords": "속도, 교통량, 결측률, 추이, 대비",
      "strategy": "TAG",
      "hits": 1240,
      "enabled": true
    },
    {
      "id": "rt-2",
      "order": 2,
      "when": "표준 서식·지침 조회",
      "keywords": "기준, 절차, 지침, 시방, 주기",
      "strategy": "CAG",
      "hits": 1860,
      "enabled": true
    },
    {
      "id": "rt-3",
      "order": 3,
      "when": "그 외 문서 근거가 필요한 질의",
      "keywords": "(기본 경로)",
      "strategy": "RAG",
      "hits": 4920,
      "enabled": true
    }
  ],
  "MOCK_AUG_STRATEGIES": [
    {
      "id": "rag",
      "name": "RAG",
      "full": "Retrieval-Augmented Generation",
      "desc": "벡터 검색으로 근거 문서를 찾아 답변",
      "targets": [
        "도로 지침·기준 문서"
      ],
      "share": 62,
      "avgLatency": 1180,
      "hitRate": 88,
      "costPer1k": "₩24",
      "strength": "문서가 많고 자주 갱신돼도 대응",
      "caveat": "검색 지연이 있고 청킹 품질에 좌우된다"
    },
    {
      "id": "cag",
      "name": "CAG",
      "full": "Cache-Augmented Generation",
      "desc": "지식을 캐시에 미리 적재해 검색 없이 답변",
      "targets": [
        "자주 쓰는 표준 서식·기준"
      ],
      "share": 23,
      "avgLatency": 340,
      "hitRate": 95,
      "costPer1k": "₩11",
      "strength": "검색 단계가 없어 빠르고 답변이 일관된다",
      "caveat": "적재 용량 한계 — 원문이 바뀌면 재적재해야 한다"
    },
    {
      "id": "tag",
      "name": "TAG",
      "full": "Table-Augmented Generation",
      "desc": "자연어를 SQL로 변환해 정형 데이터를 집계",
      "targets": [
        "VDS 5분 집계 테이블"
      ],
      "share": 15,
      "avgLatency": 860,
      "hitRate": 91,
      "costPer1k": "₩18",
      "strength": "수치를 계산해 답하므로 집계·비교에 정확",
      "caveat": "노선·이정 기준정보가 표준화돼 있어야 한다"
    }
  ],
  "MOCK_CAG_CACHE": [
    {
      "id": "cc-1",
      "name": "도로유지관리지침 요약본",
      "tokens": "42K",
      "loaded": "2026-09-15 02:10",
      "sourceRev": "v4 (2026-09-14)",
      "status": "최신",
      "hits": 1420
    },
    {
      "id": "cc-2",
      "name": "돌발상황 대응 절차",
      "tokens": "28K",
      "loaded": "2026-09-02 02:10",
      "sourceRev": "v2 (2026-09-01)",
      "status": "최신",
      "hits": 640
    },
    {
      "id": "cc-3",
      "name": "자주 묻는 질문 모음",
      "tokens": "16K",
      "loaded": "2026-08-08 02:10",
      "sourceRev": "v7 (2026-09-12)",
      "status": "재적재 필요",
      "hits": 310
    }
  ],
  "MOCK_PRED_DRIFT": [
    {
      "feature": "VDS 결측 구간 분포",
      "psi": 0.28,
      "level": "주의",
      "note": "VDS-0010-0247 통신 불량 3일 누적 — 드리프트 지수 +0.9 (임계 1.0)"
    },
    {
      "feature": "차로별 점유율",
      "psi": 0.11,
      "level": "정상",
      "note": "유의미한 변화 없음"
    },
    {
      "feature": "관측 시간대 분포",
      "psi": 0.07,
      "level": "정상",
      "note": "유의미한 변화 없음"
    }
  ],
  "MOCK_PRED_MODELS": [
    {
      "id": "pm-1",
      "name": "통행속도 예측 모델",
      "task": "시계열 회귀",
      "version": "v2.3",
      "deployed": "2026-07-02",
      "metricName": "MAE(km/h)",
      "baseline": 4.2,
      "current": 4.7,
      "threshold": 5,
      "status": "정상",
      "samples": "일 2,840만 건",
      "owner": "데이터플랫폼부",
      "nextRetrain": "2026-10-02"
    },
    {
      "id": "pm-2",
      "name": "노면결빙 예측 모델",
      "task": "이진분류",
      "version": "v1.8",
      "deployed": "2026-05-26",
      "metricName": "F1",
      "baseline": 0.91,
      "current": 0.86,
      "threshold": 0.85,
      "status": "주의",
      "samples": "월 3,600건",
      "owner": "도로교통연구원",
      "nextRetrain": "재학습 검토 중"
    }
  ],
  "MOCK_PRED_TREND": [
    {
      "month": "2026.03",
      "통행속도 예측 모델": 4.2,
      "노면결빙 예측 모델": 0.91
    },
    {
      "month": "2026.05",
      "통행속도 예측 모델": 4.3,
      "노면결빙 예측 모델": 0.9
    },
    {
      "month": "2026.07",
      "통행속도 예측 모델": 4.5,
      "노면결빙 예측 모델": 0.88
    },
    {
      "month": "2026.09",
      "통행속도 예측 모델": 4.7,
      "노면결빙 예측 모델": 0.86
    }
  ],
  "MOCK_RETRAIN_RUNS": [
    {
      "id": "rt-1",
      "model": "노면결빙 예측 모델",
      "trigger": "성능 임계 근접",
      "started": "2026-09-15 02:00",
      "champion": 0.86,
      "challenger": 0.9,
      "verdict": "승격 대기",
      "note": "검증셋 개선 확인, 담당자 승인 후 배포"
    },
    {
      "id": "rt-2",
      "model": "통행속도 예측 모델",
      "trigger": "정기(분기)",
      "started": "2026-07-02 02:00",
      "champion": 5.1,
      "challenger": 4.2,
      "verdict": "승격 완료",
      "note": "ex-speed-lstm v2.3으로 배포됨"
    }
  ],
  "MOCK_BOUNDARY_POLICY": [
    {
      "grade": "기밀",
      "label": "C",
      "internal": "허용",
      "gateway": "차단",
      "external": "차단",
      "note": "내부 GPU에서만 처리. 외부 모델 경유 자체가 차단된다"
    },
    {
      "grade": "대외비",
      "label": "S",
      "internal": "허용",
      "gateway": "조건부",
      "external": "차단",
      "note": "마스킹 후에만 게이트웨이 경유 허용, 승인 이력 필수"
    },
    {
      "grade": "내부",
      "label": "I",
      "internal": "허용",
      "gateway": "허용",
      "external": "차단",
      "note": "외부 직접 전송은 불가"
    },
    {
      "grade": "공개",
      "label": "O",
      "internal": "허용",
      "gateway": "허용",
      "external": "허용",
      "note": "제한 없음"
    }
  ],
  "MOCK_DATA_FLOWS": [
    {
      "id": "df-1",
      "name": "EXTIS 교통 시계열 수집·적재",
      "source": "VDS·프로브 수집 서버",
      "zone": "제어망(EXTIS)",
      "processedAt": "EX-DataLake 적재 파이프라인",
      "dest": "업무망 분석계",
      "crossing": false,
      "dataClass": "내부",
      "volume": "일 2,840만 건(5분 집계)",
      "encryption": "전송 TLS 1.3 · 저장 AES-256",
      "status": "정상"
    },
    {
      "id": "df-2",
      "name": "도로 지침·기준 RAG 검색",
      "source": "업무망 문서서버(EDMS)",
      "zone": "업무망",
      "processedAt": "내부 GPU 서버",
      "dest": "업무망 사용자",
      "crossing": false,
      "dataClass": "내부",
      "volume": "일 12,400건",
      "encryption": "전송 TLS 1.3 · 저장 AES-256",
      "status": "정상"
    },
    {
      "id": "df-3",
      "name": "플래그십 모델 질의(보안 게이트웨이 경유)",
      "source": "사용자 질의",
      "zone": "업무망",
      "processedAt": "외부 상용 LLM",
      "dest": "업무망 사용자",
      "crossing": true,
      "dataClass": "공개",
      "volume": "일 840건",
      "encryption": "전송 TLS 1.3 · 민감정보 마스킹 후 전송",
      "status": "통제 중"
    },
    {
      "id": "df-4",
      "name": "기상청 노면기상 특보 수집(RWIS 연계)",
      "source": "기상청 공개 API",
      "zone": "외부망",
      "processedAt": "DMZ 수집 서버",
      "dest": "내부 지식베이스",
      "crossing": true,
      "dataClass": "공개",
      "volume": "10분 주기 배치",
      "encryption": "단방향 반입(내부→외부 요청 없음)",
      "status": "정상"
    }
  ],
  "MOCK_EXTERNAL_ACCESS": [
    {
      "id": "ex-1",
      "org": "유지보수 협력사 A",
      "user": "외부 담당자 1",
      "scope": "작업지시 이력 조회",
      "grade": "내부",
      "expires": "2026-12-31",
      "mfa": true,
      "lastAccess": "2026-09-18 10:22",
      "status": "활성"
    },
    {
      "id": "ex-2",
      "org": "교량 계측 위탁사 B",
      "user": "외부 담당자 2",
      "scope": "교량 계측 데이터 제출",
      "grade": "내부",
      "expires": "2026-11-30",
      "mfa": true,
      "lastAccess": "2026-09-17 16:40",
      "status": "활성"
    },
    {
      "id": "ex-3",
      "org": "외부 연구기관",
      "user": "연구원 1",
      "scope": "집계 통계 열람(원본 불가)",
      "grade": "공개",
      "expires": "2026-10-31",
      "mfa": true,
      "lastAccess": "2026-09-15 09:12",
      "status": "활성"
    },
    {
      "id": "ex-4",
      "org": "유지보수 협력사 C",
      "user": "외부 담당자 3",
      "scope": "작업지시 이력 조회",
      "grade": "내부",
      "expires": "2026-08-31",
      "mfa": false,
      "lastAccess": "2026-08-30 14:05",
      "status": "만료"
    }
  ],
  "MOCK_ACCESS_LOGS": [
    {
      "id": 1,
      "time": "2026-09-07 09:10:23",
      "user": "한지훈",
      "dept": "디지털계획처 AI인프라부",
      "action": "로그인",
      "ip": "10.20.30.41",
      "detail": "SSO 인증 성공"
    },
    {
      "id": 2,
      "time": "2026-09-07 09:08:15",
      "user": "이도현",
      "dept": "디지털계획처 데이터플랫폼부",
      "action": "에이전트 호출",
      "ip": "10.20.30.55",
      "detail": "교통데이터 분석 어시스턴트 질의"
    },
    {
      "id": 3,
      "time": "2026-09-07 08:55:02",
      "user": "서지우",
      "dept": "디지털계획처 정보보안부",
      "action": "모델 설정 변경",
      "ip": "10.20.30.10",
      "detail": "GPT-OSS-120B Temperature 0.3→0.2"
    },
    {
      "id": 4,
      "time": "2026-09-07 08:45:33",
      "user": "임하늘",
      "dept": "경영지원처",
      "action": "문서 업로드",
      "ip": "10.20.30.78",
      "detail": "인사규정_2026_개정안.pdf (2.4MB)"
    },
    {
      "id": 5,
      "time": "2026-09-07 08:30:11",
      "user": "박선영",
      "dept": "교통센터 상황관리부",
      "action": "에이전트 호출",
      "ip": "10.20.30.62",
      "detail": "돌발상황 대응 가이드 질의"
    },
    {
      "id": 6,
      "time": "2026-09-07 08:20:45",
      "user": "강민철",
      "dept": "법무실",
      "action": "에이전트 호출",
      "ip": "10.20.30.90",
      "detail": "계약서 검토 에이전트 질의"
    },
    {
      "id": 7,
      "time": "2026-09-06 17:55:10",
      "user": "윤서진",
      "dept": "인재개발원",
      "action": "보고서 생성",
      "ip": "10.20.30.44",
      "detail": "기술교육 이수현황 리포트"
    },
    {
      "id": 8,
      "time": "2026-09-06 17:30:22",
      "user": "김태우",
      "dept": "수도권본부 도로교통부",
      "action": "로그아웃",
      "ip": "10.20.30.33",
      "detail": "세션 종료"
    }
  ],
  "MOCK_EXTRACT_LOG": [
    {
      "id": 1,
      "time": "2026-09-18 11:30",
      "user": "임하늘",
      "dept": "경영지원처",
      "type": "통계 엑셀",
      "file": "이용통계_0918.xlsx",
      "size": "48KB",
      "rows": 340
    },
    {
      "id": 2,
      "time": "2026-09-17 16:45",
      "user": "한지훈",
      "dept": "AI인프라부",
      "type": "로그 CSV",
      "file": "접속로그_0917.csv",
      "size": "1.2MB",
      "rows": 5820
    },
    {
      "id": 3,
      "time": "2026-09-16 14:20",
      "user": "서지우",
      "dept": "정보보안부",
      "type": "보고서 PDF",
      "file": "월간리포트_202608.pdf",
      "size": "3.4MB",
      "rows": null
    },
    {
      "id": 4,
      "time": "2026-09-15 10:05",
      "user": "이도현",
      "dept": "데이터플랫폼부",
      "type": "질의이력 CSV",
      "file": "질의이력_이도현_0915.csv",
      "size": "89KB",
      "rows": 248
    }
  ],
  "MOCK_USAGE_HISTORY": [
    {
      "id": "uh-001",
      "user": "한지훈",
      "dept": "디지털계획처 AI인프라부",
      "mode": "GENERAL",
      "query": "VDS 결측률이 관리 임계를 넘은 구간이 어디인가요?",
      "answer": "교통데이터 품질관리규정(제3장)상 구간 결측률 관리 임계는 3.0%입니다. 현재 경부선 구간이 4.8%로 임계를 초과했으며, 원인 지점은 VDS-0010-0247 통신 불량 3일 누적...",
      "time": "2026-09-18 14:30",
      "tokens": 284,
      "rating": 5,
      "errReport": false
    },
    {
      "id": "uh-002",
      "user": "이도현",
      "dept": "디지털계획처 데이터플랫폼부",
      "mode": "REVIEW",
      "query": "업로드한 정비 작업지시 기안문을 유지관리지침과 대조해서 위반 소지 검토해줘",
      "answer": "유지관리지침 대조 결과: 차로 차단 작업 시 교통관리계획 사전 승인 필요(제42조②), 안전시설 배치도 누락...",
      "time": "2026-09-18 13:20",
      "tokens": 412,
      "rating": 4,
      "errReport": false
    },
    {
      "id": "uh-003",
      "user": "박선영",
      "dept": "교통센터 상황관리부",
      "mode": "TRANSLATE",
      "query": "업로드한 영문 도로안전 기준서를 한국어로 번역해줘",
      "answer": "설계속도의 정의 (AASHTO 기하구조 설계기준) — 설계속도란 도로의 기하구조를 결정하는 기준이 되는 속도로서, 해당 구간에서 안전하게 주행할 수 있는 최고 속도를 말한다...",
      "time": "2026-09-18 11:05",
      "tokens": 556,
      "rating": 5,
      "errReport": false
    },
    {
      "id": "uh-004",
      "user": "정민석",
      "dept": "시설처 구조물관리부",
      "mode": "GENERAL",
      "query": "비상시 대피 경로",
      "answer": "본사 건물의 비상 대피 경로는...",
      "time": "2026-09-17 16:42",
      "tokens": 185,
      "rating": 2,
      "errReport": true,
      "errDetail": "층별 대피도 누락, 환각 의심"
    },
    {
      "id": "uh-005",
      "user": "강민철",
      "dept": "법무실",
      "mode": "REVIEW",
      "query": "수의계약 한도액 기준 확인",
      "answer": "수의계약은 추정가격이 2천만원 이하인 경우...",
      "time": "2026-09-17 15:30",
      "tokens": 320,
      "rating": 3,
      "errReport": false
    },
    {
      "id": "uh-006",
      "user": "윤서진",
      "dept": "인재개발원",
      "mode": "REPORT",
      "query": "이번 주 VDS 품질 점검 12건 완료, 돌발상황 대응 보고 2건 처리 완료를 주간 실적 보고서로 작성해줘",
      "answer": "디지털계획처 주간 업무 실적 보고 | 보고 기간: 2026.09.07~09.11...",
      "time": "2026-09-17 14:15",
      "tokens": 680,
      "rating": 5,
      "errReport": false
    }
  ],
  "MOCK_WORK_LOG": [
    {
      "id": 1,
      "time": "2026-09-18 14:35",
      "user": "한지훈",
      "dept": "AI인프라부",
      "ip": "10.20.30.41",
      "action": "문서 업로드",
      "target": "도로설계기준_2026.pdf",
      "detail": "도로설계기준 폴더 업로드 (4.2MB)"
    },
    {
      "id": 2,
      "time": "2026-09-18 14:20",
      "user": "서지우",
      "dept": "정보보안부",
      "ip": "10.20.30.10",
      "action": "설정 변경",
      "target": "GPT-OSS-120B",
      "detail": "Temperature 0.3→0.2 변경"
    },
    {
      "id": 3,
      "time": "2026-09-18 13:55",
      "user": "이도현",
      "dept": "데이터플랫폼부",
      "ip": "10.20.30.55",
      "action": "에이전트 호출",
      "target": "교통데이터 분석 어시스턴트",
      "detail": "VDS-0010-0247 결측 추이 질의 (응답 2.1s)"
    },
    {
      "id": 4,
      "time": "2026-09-18 11:30",
      "user": "임하늘",
      "dept": "경영지원처",
      "ip": "10.20.30.78",
      "action": "데이터 추출",
      "target": "이용통계_0918.xlsx",
      "detail": "통계 엑셀 다운로드 (48KB)"
    },
    {
      "id": 5,
      "time": "2026-09-18 10:12",
      "user": "박선영",
      "dept": "교통센터 상황관리부",
      "ip": "10.20.30.62",
      "action": "지식영역 접근",
      "target": "교통안전 매뉴얼 DB",
      "detail": "돌발상황 대응 관련 5건 검색"
    }
  ]
};

export default expresswayAdmin;
