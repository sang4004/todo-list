/**
 * 💾 AsyncStorage 헬퍼 함수
 *
 * AsyncStorage란?
 * - 웹 브라우저의 localStorage와 비슷한 개념
 * - 앱을 꺼도 데이터가 남아있는 "로컬 저장소"
 * - key-value 형태로 데이터를 저장 (키: 문자열, 값: 문자열)
 * - 객체/배열은 JSON.stringify()로 문자열로 변환 후 저장
 *
 * 이 파일은 AsyncStorage를 직접 다루는 "헬퍼 함수"를 제공합니다.
 * 왜 헬퍼 함수를 만드나요?
 * - 매번 JSON.stringify/parse 하는 코드를 반복하지 않기 위해
 * - 에러 처리를 한 곳에서 관리하기 위해
 * - 나중에 저장소를 바꾸더라도 (예: SQLite) 이 파일만 수정하면 됨
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/todo';

// 저장소에서 사용할 키 값 — @를 붙이는 것은 관례입니다
const STORAGE_KEY = '@todos';

/**
 * 저장된 할일 목록을 불러오는 함수
 *
 * async/await이란?
 * - AsyncStorage는 데이터를 읽는 데 "시간이 걸리는" 작업 (비동기)
 * - await를 붙이면 "이 작업이 끝날 때까지 기다려" 라는 뜻
 * - async 함수 안에서만 await를 쓸 수 있음
 *
 * @returns Todo[] — 할일 배열. 저장된 데이터가 없으면 빈 배열 []
 */
export const loadTodos = async (): Promise<Todo[]> => {
  try {
    // 1. AsyncStorage에서 문자열 데이터를 가져옴
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);

    // 2. 데이터가 있으면 JSON.parse로 객체로 변환, 없으면 빈 배열 반환
    //    JSON.parse: 문자열 → 자바스크립트 객체/배열로 변환
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    // 3. 에러가 발생하면 콘솔에 출력하고 빈 배열 반환
    //    (앱이 크래시되는 것보다 빈 목록을 보여주는 게 낫기 때문)
    console.error('할일 목록 불러오기 실패:', error);
    return [];
  }
};

/**
 * 할일 목록을 저장하는 함수
 *
 * @param todos — 저장할 할일 배열
 */
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    // 1. 배열을 JSON 문자열로 변환
    //    JSON.stringify: 자바스크립트 객체/배열 → 문자열로 변환
    const jsonValue = JSON.stringify(todos);

    // 2. AsyncStorage에 문자열로 저장
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('할일 목록 저장 실패:', error);
  }
};
