/**
 * 🫙 EmptyState 컴포넌트
 * 할일 목록이 비어있을 때 보여주는 안내 화면
 */

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

export default function EmptyState() {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: bounceAnim }] }]}
      >
        📝
      </Animated.Text>
      <Text style={styles.title}>아직 할일이 없어요</Text>
      <Text style={styles.subtitle}>
        위의 입력창에 새로운 할일을 추가해보세요!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emoji: { fontSize: 64, marginBottom: 20 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
