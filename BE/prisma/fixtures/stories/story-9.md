> 이 글은 [프로그래머스 올바른 괄호](https://school.programmers.co.kr/learn/courses/30/lessons/12909)을 풀이한다. 코드는 JavaScript로 구현하였다.

## 문제 설명

괄호가 바르게 짝지어졌다는 것은 '(' 문자로 열렸으면 반드시 짝지어서 ')' 문자로 닫혀야 한다는 뜻입니다. 예를 들어

"()()" 또는 "(())()" 는 올바른 괄호입니다.  
")()(" 또는 "(()(" 는 올바르지 않은 괄호입니다.  
'(' 또는 ')' 로만 이루어진 문자열 s가 주어졌을 때, 문자열 s가 올바른 괄호이면 true를 return 하고, 올바르지 않은 괄호이면 false를 return 하는 solution 함수를 완성해 주세요.

## 제한 사항

- 문자열 s의 길이 : 100,000 이하의 자연수
- 문자열 s는 '(' 또는 ')' 로만 이루어져 있습니다.

## 입출력 예제

[##_Image|kage@bKyHuv/btstwjQqCeE/AAAAAAAAAAAAAAAAAAAAAF6OLHBWI9JflFUtzhAQLaLBT2IL3jNRjZv9ZWMJEHXY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=4d2%2B4UK%2FOgHHhxzsyStZ%2FQXq07A%3D|CDM|1.3|{"originWidth":142,"originHeight":180,"style":"alignCenter"}_##]

### 입출력 예 설명

입출력 예 #1,2,3,4  
문제의 예시와 같습니다.

## 풀이

### 접근

s의 문자열을 for문을 이용하여 괄호 검사를 진행한다.괄호 검사의 규칙은 다음과 같다.

> 1\. '(' 열린 괄호가 들어올 시, 스택에 괄호를 추가한다.  
> 2\. ')' 닫힌 괄호가 들어올 시, 스택의 Top과 비교한다.  
>     스택의 Top이 열린 괄호라면 Pop을 해주고, 닫힌 괄호라면 올바르지 않은 괄호 형태이니 false를 반환한다.  
> 3\. s의 모든 괄호를 1번과 2번을 반복하며 검사하고, 스택에 아무 값도 없다면 true를 반환하고 값이 남아있다면 올바르지 않은 괄호 형태이니 false를 반환한다.

[##_Image|kage@vhKc0/btstk4159KC/AAAAAAAAAAAAAAAAAAAAAORWnS6jpA2Ae_HsdKCVHqiaMLfTbYc3mxFPGNJMMUZb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=5Qt342dXitifw9KtBhLyWLwLeP4%3D|CDM|1.3|{"originWidth":1177,"originHeight":737,"style":"alignCenter","width":600,"height":376}_##]

단, 이런 식으로 스택에 직접 문자열을 넣었다 뺐다 하면서 문제를 풀 경우에 효율성 테스트에서 실패를 하게 된다.

그래서, 스택에 문자열을 넣었다 빼는 대신에 숫자를 더했다 빼는 식으로 알고리즘을 바꿔서 문제를 풀었다.

> 1\. stackCount 변수를 0으로 초기화하여 생성한다.  
> 2\. '(' 열린 괄호가 들어올 시, stackCount 변수에 1을 더해준다.  
> 3\. ')' 닫힌 괄호가 들어올 시, stackCount 변수에 1을 빼준다.  
> 4\. 단, stackCount가 0보다 작은 수로 내려갈 시 올바르지 않은 괄호 형태이니 false를 반환한다.  
> 5\. 모든 괄호를 반복하여 검사하고, stackCount가 0이라면 true를 반환하고 0보다 크다면 false를 반환한다.

### 구현

#### **내가 구현한 코드 (실패)**

```
function solution(s) {
  let stack = [];

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === ")") {
      if (stack[stack.length - 1] === "(") stack.pop();
      else return false;
    } else stack.push(c);
  }
  // s를 다 돌고나서 남아있는게 없을 경우 true 반환
  return stack.length === 0 ? true : false;
}
```

#### **다시 푼 코드 (성공)**

```
function solution(s){
    let stackCount = 0;
    for(let i = 0; i < s.length; i++) {
        stackCount += s[i] === "(" ? 1 : -1;
        if(stackCount < 0) return false;
    }
    return stackCount === 0 ? true : false;
}
```
