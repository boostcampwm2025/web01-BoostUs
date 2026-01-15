> 이 글은 [프로그래머스 다리를 지나는 트럭](https://school.programmers.co.kr/learn/courses/30/lessons/42583)을 풀이한다. 코드는 JavaScript로 구현하였다.

## 문제 설명

트럭 여러 대가 강을 가로지르는 일차선 다리를 정해진 순으로 건너려 합니다. 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 알아내야 합니다. 다리에는 트럭이 최대 bridge_length대 올라갈 수 있으며, 다리는 weight 이하까지의 무게를 견딜 수 있습니다. 단, 다리에 완전히 오르지 않은 트럭의 무게는 무시합니다. 예를 들어, 트럭 2대가 올라갈 수 있고 무게를 10kg까지 견디는 다리가 있습니다. 무게가 \[7, 4, 5, 6\]kg인 트럭이 순서대로 최단 시간 안에 다리를 건너려면 다음과 같이 건너야 합니다.

[##_Image|kage@be1VxX/btsuSgZmX4V/AAAAAAAAAAAAAAAAAAAAAHgzoQ1DBvpHcaNv2Nx1fwEwWfEGqSFx-EKAMbHnATJb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=laq1aLnYiCsvtA8TwyjmbepbPHo%3D|CDM|1.3|{"originWidth":466,"originHeight":285,"style":"alignCenter"}_##]

따라서, 모든 트럭이 다리를 지나려면 최소 8초가 걸립니다. solution 함수의 매개변수로 다리에 올라갈 수 있는 트럭 수 bridge_length, 다리가 견딜 수 있는 무게 weight, 트럭 별 무게 truck_weights가 주어집니다. 이때 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 return 하도록 solution 함수를 완성하세요.

## 제한 사항

- bridge_length는 1 이상 10,000 이하입니다.
- weight는 1 이상 10,000 이하입니다.
- truck_weights의 길이는 1 이상 10,000 이하입니다.
- 모든 트럭의 무게는 1 이상 weight 이하입니다.

## 입출력 예제

[##_Image|kage@LLjWp/btsuGwbHukx/AAAAAAAAAAAAAAAAAAAAADe6V4U93H6iBnZAxQ_FQDwEONak1Y0q5ZPfPmeChaoj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=R8IMrMbv%2Bewup833ZrkpOEBZTCU%3D|CDM|1.3|{"originWidth":499,"originHeight":148,"style":"alignCenter"}_##]

## 풀이

### 접근

Queue 자료구조를 사용하여 다리를 건너는 트럭의 상태를 관리하는 문제입니다.

1\. 경과 시간(time)을 0으로 초기화하고 현재 다리 위의 트럭 무게(currentWeight)를 0으로 초기화합니다.

2\. 다리를 나타내는 Queue(bridgeQueue)를 빈 배열로 초기화합니다.

3\. 무한 루프를 시작하여 트럭이 모두 다리를 건널 때까지 아래 작업을 반복합니다.

4\. 현재 다리 위의 트럭이 시간에 따라 나가는지 확인하고, 나간 트럭의 무게를 현재 다리 무게에서 빼줍니다.

5\. 다음 트럭이 다리에 진입할 수 있는지 확인하고, 가능하다면 다리에 진입시키고 해당 트럭의 무게를 현재 다리 무게에 더해줍니다. 시간을 1증가시킵니다.

6\. 모든 트럭이 다리를 건넌 경우, 무한 루프를 종료하고 걸린 총 시간(time)을 반환합니다.

### 구현

#### **내가 구현한 코드 (비효율적)**

```
function solution(bridge_length, weight, truck_weights) {
  let count = 0;
  let currentBridgeWeight = 0;
  let waitingQueue = truck_weights.map((weight, count) => ({
    weight: weight,
    count: bridge_length,
  }));
  let bridgeQueue = [];
  while (waitingQueue.length > 0) {
    count++;
    const truck = waitingQueue[0];
    // 다리 위의 트럭들의 count를 1씩 감소
    if (bridgeQueue.length > 0) {
      bridgeQueue.forEach((truck) => {
        truck.count--;
      });
      // 다 지나간 트럭은 큐에서 제거
      if (bridgeQueue[0].count === 0) {
        currentBridgeWeight -= bridgeQueue[0].weight;
        bridgeQueue.shift();
      }
    }
    if (bridgeQueue.length > bridge_length) continue; // 다리의 길이보다 더 많은 트럭이 올라올 경우
    if (truck.weight + currentBridgeWeight > weight) continue; // 다리의 최대 하중을 버티지 못하는 경우
    // 다리 위에 트럭 올리기
    bridgeQueue.push(truck);
    currentBridgeWeight += truck.weight;
    waitingQueue.shift();
  }
  while (bridgeQueue.length > 0) {
    count++;
    bridgeQueue.forEach((truck) => {
      truck.count--;
    });
    // 다 지나간 트럭은 큐에서 제거
    if (bridgeQueue[0].count === 0) {
      currentBridgeWeight -= bridgeQueue[0].weight;
      bridgeQueue.shift();
    }
  }
  return count;
}
```

#### **GPT 코드**

```
function solution(bridge_length, weight, truck_weights) {
    let time = 0; // 경과 시간
    let currentWeight = 0; // 현재 다리 위의 무게
    const bridgeQueue = []; // 다리를 나타내는 Queue

    while (true) {
        time++;

        // 다리에서 트럭이 나가는 경우 처리
        if (bridgeQueue.length > 0 && bridgeQueue[0].endTime === time) {
            const truck = bridgeQueue.shift();
            currentWeight -= truck.weight;
        }

        // 다리에 트럭이 추가 가능한 경우 처리
        if (currentWeight + truck_weights[0] <= weight) {
            const truckWeight = truck_weights.shift();
            bridgeQueue.push({ weight: truckWeight, endTime: time + bridge_length });
            currentWeight += truckWeight;
        }

        // 모든 트럭이 다리를 건넌 경우 종료
        if (truck_weights.length === 0 && bridgeQueue.length === 0) {
            break;
        }
    }

    return time;
}
```
