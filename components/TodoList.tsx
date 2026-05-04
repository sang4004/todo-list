/**
 * 📋 TodoList 컴포넌트
 *
 * FlatList를 사용하여 할일 목록을 효율적으로 렌더링합니다.
 * 
 * FlatList vs ScrollView:
 * - ScrollView: 모든 항목을 한번에 렌더링 (적은 데이터에 적합)
 * - FlatList: 화면에 보이는 항목만 렌더링 (많은 데이터에 적합, 성능 좋음)
 */

import { FlatList, StyleSheet } from 'react-native';
import { Todo } from '../types/todo';
import EmptyState from './EmptyState';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          index={index}
        />
      )}
      ListEmptyComponent={<EmptyState />}
      contentContainerStyle={[
        styles.listContent,
        todos.length === 0 && styles.emptyContent,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  emptyContent: {
    flex: 1,
  },
});
