/**
 * 🎨 색상 상수 정의
 *
 * 앱에서 사용할 모든 색상을 한 곳에서 관리합니다.
 * 왜 이렇게 하나요?
 * - 색상을 바꾸고 싶을 때 이 파일 하나만 수정하면 됨
 * - 일관된 디자인 유지 가능
 * - 코드에서 "#7C3AED" 같은 헥스코드 대신 Colors.primary 처럼 의미있는 이름 사용
 */

export const Colors = {
  // 🟣 메인 색상 (보라 계열)
  primary: '#7C3AED', // 메인 보라색 — 주요 버튼, 강조 요소에 사용
  primaryLight: '#A78BFA', // 밝은 보라 — 호버 효과, 보조 요소에 사용
  primaryDark: '#5B21B6', // 어두운 보라 — 버튼 누름 효과 등에 사용

  // 🎨 배경 그라데이션
  gradientStart: '#EDE9FE', // 그라데이션 시작 (연한 보라)
  gradientMiddle: '#DDD6FE', // 그라데이션 중간
  gradientEnd: '#C4B5FD', // 그라데이션 끝 (좀 더 진한 보라)

  // ⬜ 카드 / 표면 색상
  surface: '#FFFFFF', // 카드 배경 (흰색)
  surfaceAlt: '#F5F3FF', // 대체 표면 색상 (아주 연한 보라)

  // ✏️ 텍스트 색상
  textPrimary: '#1F2937', // 주요 텍스트 (거의 검은색)
  textSecondary: '#6B7280', // 보조 텍스트 (회색)
  textMuted: '#9CA3AF', // 비활성 텍스트 (연한 회색)
  textOnPrimary: '#FFFFFF', // primary 배경 위의 텍스트 (흰색)

  // ✅ 상태 색상
  success: '#10B981', // 성공/완료 (초록)
  successLight: '#D1FAE5', // 성공 배경
  danger: '#EF4444', // 삭제/위험 (빨강)
  dangerLight: '#FEE2E2', // 위험 배경

  // 🔲 기타
  border: '#E5E7EB', // 테두리 색
  shadow: 'rgba(124, 58, 237, 0.08)', // 그림자 색 (반투명 보라)
  overlay: 'rgba(0, 0, 0, 0.3)', // 오버레이 배경
  completedBg: '#F9FAFB', // 완료된 항목 배경
};
