/**
 * 🎣 useTodos 커스텀 Hook
 *
 * 커스텀 Hook이란?
 * - React의 내장 Hook(useState, useEffect 등)을 조합해서 만든 "나만의 함수"
 * - 이름이 반드시 "use"로 시작해야 함 (React의 규칙)
 * - 로직을 컴포넌트에서 분리해서 재사용 가능하게 만드는 패턴
 *
 * 이 Hook의 역할:
 * - 할일 목록 상태(state) 관리
 * - CRUD 함수 제공 (Create, Read, Update, Delete)
 * - 앱 시작 시 저장된 데이터 자동 로드
 * - 데이터 변경 시 자동 저장
 *
 * 사용법:
 * const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
 */

import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';
import { loadTodos, saveTodos } from '../utils/storage';

export function useTodos() {
  /**
   * useState란?
   * - 컴포넌트에서 "변하는 데이터"를 관리하는 Hook
   * - [현재값, 값을변경하는함수] = useState(초기값)
   * - 값이 변경되면 컴포넌트가 자동으로 다시 렌더링됨
   *
   * 여기서는 할일 배열을 상태로 관리합니다.
   * <Todo[]>는 TypeScript 문법으로, "이 상태는 Todo 타입의 배열이다" 라는 뜻
   */
  const [todos, setTodos] = useState<Todo[]>([]);

  // 데이터 로딩 중인지 추적하는 상태
  const [isLoading, setIsLoading] = useState(true);

  /**
   * useEffect란?
   * - 컴포넌트가 화면에 나타날 때(마운트) 실행되는 "부수 효과"
   * - 두 번째 인자 []는 "최초 1번만 실행해라" 라는 뜻
   *   - [] 빈 배열 = 마운트 시 1번
   *   - [변수] = 변수가 바뀔 때마다 실행
   *   - 생략 = 매 렌더링마다 실행
   *
   * 여기서는 앱이 시작될 때 AsyncStorage에서 저장된 데이터를 불러옵니다.
   */
  useEffect(() => {
    const initTodos = async () => {
      const savedTodos = await loadTodos();
      setTodos(savedTodos);
      setIsLoading(false);
    };
    initTodos();
  }, []);

  /**
   * useCallback이란?
   * - 함수를 "기억(메모이제이션)"해두는 Hook
   * - 컴포넌트가 리렌더링 될 때마다 새 함수가 만들어지는 것을 방지
   * - 성능 최적화에 도움 (지금은 크게 체감 안 되지만, 좋은 습관)
   * - 두 번째 인자는 "이 값이 변할 때만 함수를 새로 만들어라" 라는 의존성 배열
   */

  /**
   * ✅ 할일 추가 함수
   * @param text - 할일 내용 (사용자가 입력한 텍스트)
   * @param duration - 타이머 시간 (초 단위, 선택적)
   */
  const addTodo = useCallback(
    (text: string, duration?: number) => {
      // 새 할일 객체 생성
      const newTodo: Todo = {
        id: Date.now().toString(), // 현재 시간을 ID로 사용 (간단한 유니크 ID 생성법)
        text: text.trim(), // trim()은 양쪽 공백을 제거 ("  할일  " → "할일")
        completed: false, // 새로 만든 할일은 당연히 미완료 상태
        createdAt: Date.now(), // 생성 시간 기록
        ...(duration ? { duration } : {}), // duration이 있으면 추가
      };

      // 기존 목록 앞에 새 할일을 추가 (최신 항목이 위에 오도록)
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      saveTodos(updatedTodos); // AsyncStorage에도 저장
    },
    [todos]
  );

  /**
   * 🔄 할일 완료/미완료 토글 함수
   * @param id - 토글할 할일의 ID
   *
   * map()이란?
   * - 배열의 각 요소를 변환해서 "새로운 배열"을 만드는 함수
   * - 원본 배열은 변경하지 않음 (불변성 유지 — React에서 매우 중요!)
   *
   * 왜 원본을 직접 수정하면 안 되나요?
   * - React는 "이전 상태"와 "새 상태"를 비교해서 화면을 업데이트
   * - 원본을 직접 수정하면 React가 변경을 감지하지 못함
   * - 항상 새로운 배열/객체를 만들어서 setState에 전달해야 함
   */
  const toggleTodo = useCallback(
    (id: string) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed } // 해당 ID의 할일만 completed를 반전
          : todo // 나머지는 그대로
      );
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    },
    [todos]
  );

  /**
   * 🗑 할일 삭제 함수
   * @param id - 삭제할 할일의 ID
   *
   * filter()란?
   * - 조건에 맞는 요소만 남기는 함수
   * - todo.id !== id → "ID가 다른 것만 남겨라" = 해당 ID는 제거
   */
  const deleteTodo = useCallback(
    (id: string) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    },
    [todos]
  );

  // Hook에서 필요한 데이터와 함수들을 반환
  // 컴포넌트에서는 이렇게 사용: const { todos, addTodo, ... } = useTodos();
  return {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
