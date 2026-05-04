/**
 * 🔧 앱 전체 레이아웃 (_layout.tsx)
 *
 * Expo Router에서 _layout.tsx는 특별한 파일입니다:
 * - 모든 화면에 공통으로 적용되는 레이아웃을 정의
 * - 네비게이션 구조를 설정 (Stack, Tab 등)
 * - 앱 전체에 필요한 초기화 작업 수행 (폰트 로딩, 상태바 설정 등)
 *
 * Stack이란?
 * - 화면을 "쌓아올리는" 방식의 네비게이션
 * - 새 화면이 위에 쌓이고, 뒤로 가면 위에서 제거됨
 * - 지금은 화면이 하나지만, 나중에 상세 화면을 추가할 수 있음
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* StatusBar: 화면 상단의 시간, 배터리 등 표시 영역 */}
      <StatusBar style="dark" />

      {/* Stack 네비게이터 */}
      <Stack
        screenOptions={{
          headerShown: false, // 기본 헤더 숨김 (우리가 직접 만든 Header 사용)
          contentStyle: { backgroundColor: '#F5F3FF' }, // 배경색
        }}
      />
    </>
  );
}
