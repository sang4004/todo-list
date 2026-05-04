/**
 * 🎯 Header 컴포넌트
 *
 * 앱 상단에 표시되는 헤더입니다.
 * - 앱 제목 ("오늘의 할일")
 * - 현재 날짜
 * - 완료율 프로그래스 바
 *
 * 컴포넌트란?
 * - UI를 구성하는 "레고 블록" 같은 것
 * - 독립적으로 동작하는 재사용 가능한 UI 조각
 * - Props(속성)를 받아서 그에 맞게 화면을 그림
 *
 * Props란?
 * - 부모 컴포넌트가 자식에게 전달하는 데이터
 * - 함수의 매개변수와 비슷한 개념
 * - 읽기 전용 — 자식에서 직접 수정할 수 없음
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Todo } from '../types/todo';
import { Colors } from '../constants/colors';

// Props의 타입 정의 — 이 컴포넌트가 어떤 데이터를 받는지 명시
interface HeaderProps {
  todos: Todo[]; // 전체 할일 목록 (진행률 계산용)
}

export default function Header({ todos }: HeaderProps) {
  // 📊 통계 계산
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  // 완료율: 할일이 없으면 0, 있으면 완료 수 / 전체 수
  const progressRate = totalCount > 0 ? completedCount / totalCount : 0;

  // 📅 현재 날짜 포맷팅
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <View style={styles.container}>
      {/* 날짜 표시 */}
      <Text style={styles.date}>{dateString}</Text>

      {/* 제목 */}
      <Text style={styles.title}>오늘의 할일</Text>

      {/* 프로그래스 바 영역 */}
      <View style={styles.progressContainer}>
        {/* 완료 개수 텍스트 */}
        <View style={styles.progressTextRow}>
          <Text style={styles.progressText}>
            {completedCount}/{totalCount} 완료
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(progressRate * 100)}%
          </Text>
        </View>

        {/* 프로그래스 바 — 배경(track) + 채워진 부분(fill) */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                // width를 퍼센트로 설정하여 진행률 표시
                // 예: 60% 완료면 width: '60%'
                width: `${Math.round(progressRate * 100)}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * StyleSheet.create란?
 * - React Native에서 스타일을 정의하는 방법
 * - CSS와 비슷하지만 JavaScript 객체 형태
 * - camelCase 사용 (font-size → fontSize)
 * - 단위 없이 숫자만 사용 (px 안 씀 — React Native가 자동으로 처리)
 */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24, // 좌우 패딩 24
    paddingTop: 16,
    paddingBottom: 20,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800', // 굵기 (100~900, 높을수록 굵음)
    color: Colors.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.5, // 자간 (음수면 좁아짐)
  },
  progressContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    // 그림자 효과 (iOS)
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // 그림자 효과 (Android)
    elevation: 2,
  },
  progressTextRow: {
    flexDirection: 'row', // 가로 배치 (기본은 세로 — column)
    justifyContent: 'space-between', // 양 끝으로 배치
    alignItems: 'center', // 세로 중앙 정렬
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4, // 둥근 모서리
    overflow: 'hidden', // 자식이 부모 영역 밖으로 나가지 않도록
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
});
