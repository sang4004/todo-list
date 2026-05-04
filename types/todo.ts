/**
 * 📐 Todo 타입 정의
 *
 * TypeScript에서는 데이터의 "형태(shape)"를 미리 정의해둡니다.
 * 이렇게 하면:
 * 1. 오타를 내면 코딩 중에 에러를 잡아줌 (todo.txt ← 이런 실수 방지)
 * 2. 자동완성이 잘 됨 (todo. 을 치면 id, text, completed 등이 뜸)
 * 3. 코드를 읽는 사람이 데이터 구조를 한눈에 파악 가능
 */

// 할일 하나의 데이터 형태를 정의하는 인터페이스
export interface Todo {
  id: string; // 고유 식별자 — 각 할일을 구분하기 위한 유니크 ID
  text: string; // 할일 내용 — 사용자가 입력한 텍스트
  completed: boolean; // 완료 여부 — true면 완료, false면 미완료
  createdAt: number; // 생성 시간 — Date.now()로 생성한 타임스탬프(밀리초)
  duration?: number; // ⏱ 타이머 시간 (초 단위, 선택적) — 설정하면 레코드 플레이어 표시
}
