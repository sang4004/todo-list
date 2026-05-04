/**
 * 🏠 메인 화면 (index.tsx)
 *
 * Expo Router에서 app/index.tsx는 앱의 "홈 화면"입니다.
 * 웹에서 index.html과 같은 역할이라고 생각하면 됩니다.
 *
 * 이 파일에서 하는 일:
 * 1. useTodos Hook으로 데이터와 로직을 가져옴
 * 2. Header, TodoInput, TodoList 컴포넌트를 조합하여 화면 구성
 *
 * 데이터 흐름:
 * useTodos (데이터 + 로직)
 *     ↓ props로 전달
 * HomeScreen (화면 조합)
 *     ├── Header (진행 상황 표시)
 *     ├── TodoInput (새 할일 입력 → addTodo 호출)
 *     └── TodoList (목록 표시)
 *          └── TodoItem × N개 (각 할일 → toggleTodo/deleteTodo)
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import Header from '../components/Header';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  /**
   * 구조 분해 할당(Destructuring)이란?
   * - 객체에서 필요한 값만 꺼내쓰는 문법
   * - const { todos, addTodo } = useTodos()
   *   ↕ 같은 의미
   * - const result = useTodos();
   *   const todos = result.todos;
   *   const addTodo = result.addTodo;
   */
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo } = useTodos();

  // 데이터 로딩 중이면 로딩 스피너 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    /**
     * SafeAreaView란?
     * - 아이폰의 노치(카메라 영역), 하단 홈 인디케이터 등
     *   "안전한 영역" 안에 컨텐츠를 배치해주는 컴포넌트
     * - 이걸 안 쓰면 노치에 텍스트가 가려질 수 있음
     */
    <SafeAreaView style={styles.container}>
      {/* 📊 헤더: 날짜 + 제목 + 진행률 */}
      <Header todos={todos} />

      {/* ✏️ 할일 입력: 텍스트 입력 + 추가 버튼 */}
      <TodoInput onSubmit={addTodo} />

      {/* 📋 할일 목록: 각 할일 항목들 */}
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체 채우기
    backgroundColor: '#F5F3FF', // 연한 보라 배경
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
});
