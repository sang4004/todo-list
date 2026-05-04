/**
 * 🎵 RecordPlayer 컴포넌트
 *
 * LP 레코드 판이 돌아가는 타이머 UI입니다.
 * - 타이머가 실행 중이면 레코드가 회전
 * - 남은 시간을 레코드 중앙 라벨에 표시
 * - 톤암이 레코드 바로 오른쪽에 붙어있고, 재생 시 레코드 위로 이동
 * - 재생/일시정지 버튼 + 진행률 바 (모두 중앙 정렬)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';

interface RecordPlayerProps {
  duration: number; // 전체 시간 (초)
  onComplete: () => void; // 타이머 완료 시 콜백
}

export default function RecordPlayer({
  duration,
  onComplete,
}: RecordPlayerProps) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // 🎵 레코드 회전 애니메이션
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  // 🎯 톤암 회전 애니메이션 (부드러운 전환)
  const tonearmRotation = useRef(new Animated.Value(0)).current;

  // 재생/정지에 따라 레코드 회전 + 톤암 이동
  useEffect(() => {
    if (isPlaying) {
      // 레코드 회전 시작
      spinAnimation.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.current.start();

      // 톤암이 레코드 위로 이동 (35deg → 5deg)
      Animated.timing(tonearmRotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      spinAnimation.current?.stop();

      // 톤암이 원래 위치로 복귀
      Animated.timing(tonearmRotation, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }

    return () => {
      spinAnimation.current?.stop();
    };
  }, [isPlaying, spinValue, tonearmRotation]);

  // ⏱ 타이머 카운트다운
  useEffect(() => {
    if (!isPlaying || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          setIsFinished(true);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, remainingTime, onComplete]);

  // 회전 각도 변환
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // 톤암 회전 각도: 대기(-5deg) → 재생(5deg, 레코드 위)
  const tonearmAngle = tonearmRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '30deg'],
  });

  // 시간 포맷
  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // 진행률
  const progress = duration > 0 ? 1 - remainingTime / duration : 0;

  // 재생/일시정지 토글
  const togglePlay = () => {
    if (isFinished) {
      setRemainingTime(duration);
      setIsFinished(false);
      spinValue.setValue(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* 레코드 + 톤암을 감싸는 wrapper (중앙 정렬용) */}
      <View style={styles.playerWrapper}>
        {/* 🎵 레코드 판 */}
        <Animated.View
          style={[styles.record, { transform: [{ rotate: spin }] }]}
        >
          {/* 레코드 홈(groove) — 동심원 패턴 */}
          <View style={[styles.groove, styles.groove1]} />
          <View style={[styles.groove, styles.groove2]} />
          <View style={[styles.groove, styles.groove3]} />
          <View style={[styles.groove, styles.groove4]} />
          <View style={[styles.groove, styles.groove5]} />

          {/* 🏷 중앙 라벨 (시간 표시) */}
          <View style={[styles.label, isFinished && styles.labelFinished]}>
            <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
            <Text style={styles.statusText}>
              {isFinished ? '완료! 🎉' : isPlaying ? '진행 중' : '일시정지'}
            </Text>
          </View>
        </Animated.View>

        {/* 톤암 — 레코드 바로 오른쪽에 붙어있음 */}
        <View style={styles.tonearmBase}>
          {/* 톤암 피벗 점 (회전 중심) */}
          <View style={styles.tonearmPivot} />
          {/* 톤암 본체 (회전 애니메이션 적용) */}
          <Animated.View
            style={[
              styles.tonearmArm,
              { transform: [{ rotate: tonearmAngle }] },
            ]}
          >
            <View style={styles.tonearmStick} />
            <View style={styles.tonearmHead} />
          </Animated.View>
        </View>
      </View>

      {/* 🎮 컨트롤 영역 (중앙 정렬) */}
      <View style={styles.controls}>
        {/* 진행률 바 */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {/* 재생/일시정지 버튼 */}
        <TouchableOpacity
          style={[styles.playButton, isFinished && styles.playButtonFinished]}
          onPress={togglePlay}
          activeOpacity={0.7}
        >
          <Text style={styles.playButtonText}>
            {isFinished ? '↻' : isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const RECORD_SIZE = 140;
const LABEL_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // 전체 중앙 정렬
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  // 레코드 + 톤암을 가로로 묶는 wrapper
  playerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  // ─── 레코드 판 ───
  record: {
    width: RECORD_SIZE,
    height: RECORD_SIZE,
    borderRadius: RECORD_SIZE / 2,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d2d4a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // ─── 레코드 홈 (동심원) ───
  groove: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  groove1: {
    width: RECORD_SIZE - 10,
    height: RECORD_SIZE - 10,
  },
  groove2: {
    width: RECORD_SIZE - 24,
    height: RECORD_SIZE - 24,
  },
  groove3: {
    width: RECORD_SIZE - 38,
    height: RECORD_SIZE - 38,
  },
  groove4: {
    width: RECORD_SIZE - 52,
    height: RECORD_SIZE - 52,
  },
  groove5: {
    width: RECORD_SIZE - 66,
    height: RECORD_SIZE - 66,
  },

  // ─── 중앙 라벨 ───
  label: {
    width: LABEL_SIZE,
    height: LABEL_SIZE,
    borderRadius: LABEL_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  labelFinished: {
    backgroundColor: Colors.success,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
  },

  // ─── 톤암 (레코드 바로 오른쪽) ───
  tonearmBase: {
    width: 30,
    height: RECORD_SIZE,
    marginLeft: -8, // 레코드와 살짝 겹치도록
    alignItems: 'center',
  },
  tonearmPivot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9CA3AF',
    marginTop: 4,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  tonearmArm: {
    alignItems: 'center',
    transformOrigin: 'top center',
    marginTop: -2,
  },
  tonearmStick: {
    width: 3,
    height: 60,
    backgroundColor: '#9CA3AF',
    borderRadius: 1.5,
  },
  tonearmHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B7280',
    marginTop: -2,
  },

  // ─── 컨트롤 (중앙 정렬) ───
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    width: RECORD_SIZE + 30, // 레코드 + 톤암 너비에 맞춤
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonFinished: {
    backgroundColor: Colors.success,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
