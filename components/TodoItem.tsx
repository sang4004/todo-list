/**
 * 📝 TodoItem 컴포넌트
 *
 * 할일 목록에서 "하나의 항목"을 표시하는 컴포넌트입니다.
 * - 체크박스 (완료 토글)
 * - 할일 텍스트 (완료 시 취소선)
 * - 삭제 버튼
 * - 🎵 레코드 플레이어 (타이머가 설정된 경우)
 */

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Todo } from '../types/todo';
import RecordPlayer from './RecordPlayer';

// Android에서 LayoutAnimation을 사용하려면 이 설정이 필요
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  index,
}: TodoItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // 🎵 레코드 플레이어 확장 여부
  const [isExpanded, setIsExpanded] = useState(false);

  // 마운트 시 나타남 애니메이션
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  // 삭제 핸들러
  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete(todo.id);
    });
  };

  // 🎵 레코드 플레이어 확장/축소 토글
  const toggleExpand = () => {
    /**
     * LayoutAnimation이란?
     * - 다음 렌더링에서 레이아웃이 바뀔 때 자동으로 애니메이션 적용
     * - 높이가 변하는 등의 레이아웃 변화를 부드럽게 만들어줌
     */
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // 타이머 완료 핸들러
  const handleTimerComplete = () => {
    onToggle(todo.id); // 타이머 완료 시 자동으로 할일 완료 처리
  };

  return (
    <Animated.View
      style={[
        styles.container,
        todo.completed && styles.containerCompleted,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* 상단: 체크박스 + 텍스트 + 버튼들 */}
      <View style={styles.topRow}>
        {/* 체크박스 + 텍스트 (터치하면 토글) */}
        <TouchableOpacity
          style={styles.contentArea}
          onPress={() => onToggle(todo.id)}
          activeOpacity={0.6}
        >
          <View
            style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
          >
            {todo.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>

          <View style={styles.textArea}>
            <Text
              style={[styles.text, todo.completed && styles.textCompleted]}
              numberOfLines={2}
            >
              {todo.text}
            </Text>

            {/* 타이머 태그 (duration이 있을 때만 표시) */}
            {todo.duration && !todo.completed && (
              <Text style={styles.durationTag}>
                ⏱ {todo.duration / 60}분
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* 오른쪽 버튼들 */}
        <View style={styles.actions}>
          {/* 🎵 레코드 플레이어 토글 (duration이 있고, 미완료일 때만) */}
          {todo.duration && !todo.completed && (
            <TouchableOpacity
              style={[
                styles.recordButton,
                isExpanded && styles.recordButtonActive,
              ]}
              onPress={toggleExpand}
              activeOpacity={0.6}
            >
              <Text style={styles.recordButtonText}>🎵</Text>
            </TouchableOpacity>
          )}

          {/* 🗑 삭제 버튼 */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🎵 레코드 플레이어 (확장 시 표시) */}
      {isExpanded && todo.duration && !todo.completed && (
        <View style={styles.recordPlayerContainer}>
          <RecordPlayer
            duration={todo.duration}
            onComplete={handleTimerComplete}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  containerCompleted: {
    backgroundColor: Colors.completedBg,
  },

  // ─── 상단 행 ───
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  text: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },

  // ─── 타이머 태그 ───
  durationTag: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 3,
    backgroundColor: Colors.surfaceAlt,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },

  // ─── 오른쪽 버튼들 ───
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#EDE9FE',
  },
  recordButtonText: {
    fontSize: 14,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },

  // ─── 레코드 플레이어 영역 ───
  recordPlayerContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 4,
  },
});
