/**
 * ✏️ TodoInput 컴포넌트
 *
 * 사용자가 새로운 할일을 입력하는 영역입니다.
 * - TextInput: 텍스트 입력 필드
 * - 시간 선택: 프리셋 버튼 또는 직접 입력으로 타이머 시간 설정 (선택적)
 * - TouchableOpacity: 터치 가능한 추가 버튼
 */

import { useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';

/**
 * 시간 프리셋 옵션
 * - label: 버튼에 표시할 텍스트
 * - seconds: 실제 시간 (초 단위)
 */
const TIME_PRESETS = [
  { label: '5분', seconds: 5 * 60 },
  { label: '15분', seconds: 15 * 60 },
  { label: '25분', seconds: 25 * 60 },
  { label: '30분', seconds: 30 * 60 },
  { label: '45분', seconds: 45 * 60 },
  { label: '1시간', seconds: 60 * 60 },
];

interface TodoInputProps {
  onSubmit: (text: string, duration?: number) => void;
}

export default function TodoInput({ onSubmit }: TodoInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // ⏱ 선택된 타이머 시간 (null이면 타이머 없음)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  // 시간 선택 패널 표시 여부
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 🆕 직접 입력 모드
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customHours, setCustomHours] = useState('');
  const [customMinutes, setCustomMinutes] = useState('');

  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    onSubmit(trimmedText, selectedDuration ?? undefined);

    setText('');
    setSelectedDuration(null);
    setShowTimePicker(false);
    setIsCustomMode(false);
    setCustomHours('');
    setCustomMinutes('');
    Keyboard.dismiss();
  };

  // 시간 프리셋 선택/해제 토글
  const handleTimeSelect = (seconds: number) => {
    setSelectedDuration((prev) => (prev === seconds ? null : seconds));
    setIsCustomMode(false);
    setCustomHours('');
    setCustomMinutes('');
  };

  // 🆕 직접 입력 시간 적용
  const applyCustomTime = () => {
    const hours = parseInt(customHours, 10) || 0;
    const minutes = parseInt(customMinutes, 10) || 0;
    const totalSeconds = hours * 3600 + minutes * 60;

    if (totalSeconds > 0) {
      setSelectedDuration(totalSeconds);
    }
  };

  // 시간 포맷 (선택된 시간 태그에 표시)
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}시간 ${m}분`;
    if (h > 0) return `${h}시간`;
    return `${m}분`;
  };

  return (
    <View style={styles.container}>
      {/* 입력 필드 + 버튼 */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="새로운 할일을 입력하세요"
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          maxLength={100}
        />

        {/* ⏱ 시간 설정 토글 버튼 */}
        <TouchableOpacity
          style={[
            styles.timerToggle,
            showTimePicker && styles.timerToggleActive,
            selectedDuration !== null && styles.timerToggleSelected,
          ]}
          onPress={() => setShowTimePicker(!showTimePicker)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.timerToggleText,
              (showTimePicker || selectedDuration !== null) &&
              styles.timerToggleTextActive,
            ]}
          >
            ⏱
          </Text>
        </TouchableOpacity>

        {/* + 추가 버튼 */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.addButton,
              !text.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* 선택된 시간 태그 (시간이 선택되었을 때만 표시) */}
      {selectedDuration !== null && !showTimePicker && (
        <View style={styles.selectedTag}>
          <Text style={styles.selectedTagText}>
            ⏱ {formatDuration(selectedDuration)} 타이머
          </Text>
          <TouchableOpacity onPress={() => setSelectedDuration(null)}>
            <Text style={styles.selectedTagRemove}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ⏱ 시간 선택 패널 */}
      {showTimePicker && (
        <View style={styles.timePickerContainer}>
          {/* 탭 전환: 프리셋 / 직접 입력 */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, !isCustomMode && styles.tabActive]}
              onPress={() => setIsCustomMode(false)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, !isCustomMode && styles.tabTextActive]}
              >
                빠른 선택
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isCustomMode && styles.tabActive]}
              onPress={() => setIsCustomMode(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, isCustomMode && styles.tabTextActive]}
              >
                직접 입력
              </Text>
            </TouchableOpacity>
          </View>

          {!isCustomMode ? (
            /* ── 프리셋 버튼 모드 ── */
            <View style={styles.timePresets}>
              {TIME_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.seconds}
                  style={[
                    styles.presetButton,
                    selectedDuration === preset.seconds &&
                    styles.presetButtonActive,
                  ]}
                  onPress={() => handleTimeSelect(preset.seconds)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetText,
                      selectedDuration === preset.seconds &&
                      styles.presetTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* ── 🆕 직접 입력 모드 ── */
            <View style={styles.customInputContainer}>
              <View style={styles.customInputRow}>
                {/* 시간 입력 */}
                <View style={styles.customField}>
                  <TextInput
                    style={styles.customInput}
                    value={customHours}
                    onChangeText={(val) => {
                      // 숫자만 허용, 최대 2자리
                      const num = val.replace(/[^0-9]/g, '').slice(0, 2);
                      setCustomHours(num);
                    }}
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={2}
                    textAlign="center"
                  />
                  <Text style={styles.customLabel}>시간</Text>
                </View>

                <Text style={styles.customSeparator}>:</Text>

                {/* 분 입력 */}
                <View style={styles.customField}>
                  <TextInput
                    style={styles.customInput}
                    value={customMinutes}
                    onChangeText={(val) => {
                      const num = val.replace(/[^0-9]/g, '').slice(0, 2);
                      // 59분까지만 허용
                      if (parseInt(num, 10) > 59) return;
                      setCustomMinutes(num);
                    }}
                    placeholder="00"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={2}
                    textAlign="center"
                  />
                  <Text style={styles.customLabel}>분</Text>
                </View>

                {/* 적용 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    !(parseInt(customHours, 10) || parseInt(customMinutes, 10)) &&
                    styles.applyButtonDisabled,
                  ]}
                  onPress={applyCustomTime}
                  disabled={
                    !(parseInt(customHours, 10) || parseInt(customMinutes, 10))
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.applyButtonText}>적용</Text>
                </TouchableOpacity>
              </View>

              {/* 현재 설정된 시간 미리보기 */}
              {selectedDuration !== null && (
                <Text style={styles.customPreview}>
                  ✅ {formatDuration(selectedDuration)} 설정됨
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: Colors.primaryLight,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },

  // ─── 타이머 토글 버튼 ───
  timerToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  timerToggleActive: {
    backgroundColor: Colors.primaryLight,
  },
  timerToggleSelected: {
    backgroundColor: Colors.primaryLight,
  },
  timerToggleText: {
    fontSize: 16,
  },
  timerToggleTextActive: {
    fontSize: 16,
  },

  // ─── 추가 버튼 ───
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.textOnPrimary,
    fontWeight: '600',
    lineHeight: 26,
  },

  // ─── 선택된 시간 태그 ───
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    gap: 6,
  },
  selectedTagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  selectedTagRemove: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
  },

  // ─── 시간 선택 패널 ───
  timePickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // ─── 탭 전환 (빠른 선택 / 직접 입력) ───
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
  },

  // ─── 프리셋 버튼 ───
  timePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  presetButtonActive: {
    backgroundColor: '#EDE9FE',
    borderColor: Colors.primary,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetTextActive: {
    color: Colors.primary,
  },

  // ─── 🆕 직접 입력 모드 ───
  customInputContainer: {
    alignItems: 'center',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customField: {
    alignItems: 'center',
  },
  customInput: {
    width: 56,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    textAlign: "center",
  },
  customLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  customSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  applyButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    marginBottom: 16,
  },
  applyButtonDisabled: {
    backgroundColor: Colors.border,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  customPreview: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 8,
  },
});
