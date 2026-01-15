> 이 글은 [프로그래머스 주식가격](https://school.programmers.co.kr/learn/courses/30/lessons/42584)을 풀이한다. 코드는 JavaScript로 구현하였다.

## 문제 설명

초 단위로 기록된 주식가격이 담긴 배열 prices가 매개변수로 주어질 때, 가격이 떨어지지 않은 기간은 몇 초인지를 return 하도록 solution 함수를 완성하세요.

## 제한 사항

- prices의 각 가격은 1 이상 10,000 이하인 자연수입니다.
- prices의 길이는 2 이상 100,000 이하입니다.

## 입출력 예제

[##_Image|kage@vB1a9/btstMkbleoB/AAAAAAAAAAAAAAAAAAAAAFuNhzLyeZ2q7pPMBptqqN7SARXSyJbZ3sKbP2SFq1Q2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=lUMU6ve0uBmUNgOG8RMb8MgnvJ4%3D|CDM|1.3|{"originWidth":230,"originHeight":78,"style":"alignCenter"}_##]

### 입출력 예 설명

- 1초 시점의 ₩1은 끝까지 가격이 떨어지지 않았습니다.
- 2초 시점의 ₩2은 끝까지 가격이 떨어지지 않았습니다.
- 3초 시점의 ₩3은 1초뒤에 가격이 떨어집니다. 따라서 1초간 가격이 떨어지지 않은 것으로 봅니다.
- 4초 시점의 ₩2은 1초간 가격이 떨어지지 않았습니다.
- 5초 시점의 ₩3은 0초간 가격이 떨어지지 않았습니다.

## 풀이

### 접근

이 문제는 한 시간동안 고민을 하다 결국 포기하고 못 풀었다 ㅜㅜ

다른 블로그의 글을 참고해봤는데, 대부분의 코드가 스택을 이용해서 푸는게 아닌 단순 반복문을 통해서 푼 문제가 많은 것 같아 스택을 이용해서 푸는 방법을 ChatGPT에게 물어보았다.

> 1\. 'answer' 배열을 0으로 초기화하고, 스택을 선언한다.  
> 2\. 주식 가격을 순회하면서 다음을 수행한다.  
>     - 현재 가격이 스택의 가장 위에 있는 가격보다 작을 때까지 스택에서 가격을 빼면서, 해당 기간 동안 가격이 떨어지지 않은 것으로 처리한다.  
>     - 스택에 현재 가격의 인덱스를 추가한다.  
> 3\. 스택에 남은 가격들은 주식 가격이 떨어지지 않은 경우로 처리한다.

[##_Image|kage@k6KmQ/btstzmuKTSc/AAAAAAAAAAAAAAAAAAAAAATfhbaSGAQoi1n6UH5oP5XRRamuadwRAQJy7K9XZT6N/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=MzcZaLJCx0mtm3ekaOs57gMYXZU%3D|CDM|1.3|{"originWidth":2099,"originHeight":941,"style":"alignCenter"}_##][##_Image|kage@efXV1z/btstyisEhR6/AAAAAAAAAAAAAAAAAAAAALvobM7E91phnHFp5rqRKDYZXEmbO--tbFkjfssdH4oz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=37vDwhXDlLIlynDut31tPAVEGuI%3D|CDM|1.3|{"originWidth":1724,"originHeight":945,"style":"alignCenter"}_##]

### 구현

#### GPT 코드

```
function solution(prices) {
  const n = prices.length;
  const answer = new Array(n).fill(0); // 결과를 저장할 배열 초기화
  const stack = []; // 스택을 사용하여 주식 가격의 인덱스를 저장

  for (let i = 0; i < n; i++) {
    // 스택이 비어있지 않고 현재 가격이 스택의 가장 위에 있는 가격보다 작을 경우
    while (stack.length > 0 && prices[i] < prices[stack[stack.length - 1]]) {
      const top = stack.pop(); // 스택에서 가장 위에 있는 가격의 인덱스를 꺼냄
      answer[top] = i - top; // 현재 시점과의 차이를 계산하여 저장
    }
    stack.push(i); // 현재 가격의 인덱스를 스택에 저장
  }

  // 스택에 남아있는 가격들은 가격이 떨어지지 않은 경우
  while (stack.length > 0) {
    const top = stack.pop(); // 스택에서 가장 위에 있는 가격의 인덱스를 꺼냄
    answer[top] = n - 1 - top; // 마지막 시점과의 차이를 계산하여 저장
  }

  return answer;
}
```
