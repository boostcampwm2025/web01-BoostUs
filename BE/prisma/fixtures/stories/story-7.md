> 이 글은 [프로그래머스 프로세스](https://school.programmers.co.kr/learn/courses/30/lessons/42587)를 풀이한다. 코드는 JavaScript로 구현하였다.

## 문제 설명

운영체제의 역할 중 하나는 컴퓨터 시스템의 자원을 효율적으로 관리하는 것입니다. 이 문제에서는 운영체제가 다음 규칙에 따라 프로세스를 관리할 경우 특정 프로세스가 몇 번째로 실행되는지 알아내면 됩니다.

1. 실행 대기 큐(Queue)에서 대기중인 프로세스 하나를 꺼냅니다.  
2. 큐에 대기중인 프로세스 중 우선순위가 더 높은 프로세스가 있다면 방금 꺼낸 프로세스를 다시 큐에 넣습니다.  
3. 만약 그런 프로세스가 없다면 방금 꺼낸 프로세스를 실행합니다.  
  3.1 한 번 실행한 프로세스는 다시 큐에 넣지 않고 그대로 종료됩니다.  
예를 들어 프로세스 4개 \[A, B, C, D\]가 순서대로 실행 대기 큐에 들어있고, 우선순위가 \[2, 1, 3, 2\]라면 \[C, D, A, B\] 순으로 실행하게 됩니다.

현재 실행 대기 큐(Queue)에 있는 프로세스의 중요도가 순서대로 담긴 배열 priorities와, 몇 번째로 실행되는지 알고싶은 프로세스의 위치를 알려주는 location이 매개변수로 주어질 때, 해당 프로세스가 몇 번째로 실행되는지 return 하도록 solution 함수를 작성해주세요.

## 제한 사항

- priorities의 길이는 1 이상 100 이하입니다.
  - priorities의 원소는 1 이상 9 이하의 정수입니다.
  - priorities의 원소는 우선순위를 나타내며 숫자가 클 수록 우선순위가 높습니다.
- location은 0 이상 (대기 큐에 있는 프로세스 수 - 1) 이하의 값을 가집니다.
  - priorities의 가장 앞에 있으면 0, 두 번째에 있으면 1 … 과 같이 표현합니다.

## 입출력 예제

[##_Image|kage@rm7Kk/btsuh4eROoY/AAAAAAAAAAAAAAAAAAAAAAunHGXgoU7mhzVS33Zsjxc-SzwUG68_Tyr3D9oU2QVI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=18qNCAzuL8f2Q%2BN7gOBWSawOlZE%3D|CDM|1.3|{"originWidth":277,"originHeight":111,"style":"alignCenter"}_##]

### 입출력 예 설명

예제 #1

문제에 나온 예와 같습니다.

예제 #2

6개의 프로세스 \[A, B, C, D, E, F\]가 대기 큐에 있고 중요도가 \[1, 1, 9, 1, 1, 1\] 이므로 \[C, D, E, F, A, B\] 순으로 실행됩니다. 따라서 A는 5번째로 실행됩니다.

## 풀이

### 접근

이 문제를 자바스크립트로 효율적으로 해결하기 위해서는 큐(Queue)를 사용하여 우선순위에 따라 프로세스를 처리하는 방법이 좋습니다.

1\. 먼저, 주어진 priorities 배열을 이용하여 프로세스와 우선순위를 묶어 큐에 넣습니다. 이때, 각 프로세스에 대한 위치 정보도 함께 저장해야 합니다.

2\. 실행 대기 큐(Queue)에서 대기중인 프로세스 하나를 꺼냅니다. (shift)

3\. 큐를 순회하면서 현재 가장 높은 우선순위를 찾습니다.    3-1. 만약 가장 높은 우선순위를 가진 프로세스를 찾았다면, 방금 꺼낸 프로세스를 다시 큐에 넣습니다. (push)    3-2. 방금 꺼낸 프로세스가 가장 우선순위가 높았다면, count를 1 늘려줍니다.        3-2-1. 이때, 목표 프로세스의 위치와 비교하여 목표 프로세스를 찾았다면 실행 순서를 반환합니다.

### 구현

#### GPT 코드

우선순위가 가장 높은 프로세스를 찾을 때 Math.max 메소드를 활용하였습니다.

이때, 객체의 원소들을 하나씩 꺼내어서 펼쳐서 리턴 해주어야 하기에 전개 연산자(...)를 사용하였습니다.

그리고, 프로세스의 우선순위를 기준으로 max 값을 찾기 위해 map 함수를 이용하였습니다.

이 부분의 원리가 이해가 안된다면, Math.max 함수의 작동 방식을 조금 더 공부해보시면 좋을 것 같습니다.

```
function solution(priorities, location) {
  // 프로세스 중요도를 index 값과 함께 배열에 저장
  let queue = priorities.map((priority, index) => ({ priority, index }));
  let count = 0;

  while (queue.length > 0) {
    const currentProcess = queue.shift();
    const highestPriority = Math.max(
      ...queue.map((process) => process.priority)
    );

    if (currentProcess.priority < highestPriority) queue.push(currentProcess);
    else {
      count++;
      if (currentProcess.index === location) return count;
    }
  }
}
```
