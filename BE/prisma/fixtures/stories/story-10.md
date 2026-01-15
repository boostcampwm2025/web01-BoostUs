> 이 글은 [프로그래머스 베스트앨범](https://www.acmicpc.net/problem/1769)을 풀이한다. 코드는 JavaScript로 구현하였다.

## 문제 설명

스트리밍 사이트에서 장르 별로 가장 많이 재생된 노래를 두 개씩 모아 베스트 앨범을 출시하려 합니다. 노래는 고유 번호로 구분하며, 노래를 수록하는 기준은 다음과 같습니다.

1.  속한 노래가 많이 재생된 장르를 먼저 수록합니다.
2.  장르 내에서 많이 재생된 노래를 먼저 수록합니다.
3.  장르 내에서 재생 횟수가 같은 노래 중에서는 고유 번호가 낮은 노래를 먼저 수록합니다.

노래의 장르를 나타내는 문자열 배열 genres와 노래별 재생 횟수를 나타내는 정수 배열 plays가 주어질 때, 베스트 앨범에 들어갈 노래의 고유 번호를 순서대로 return 하도록 solution 함수를 완성하세요.

## 제한 사항

- genres\[i\]는 고유번호가 i인 노래의 장르입니다.
- plays\[i\]는 고유번호가 i인 노래가 재생된 횟수입니다.
- genres와 plays의 길이는 같으며, 이는 1 이상 10,000 이하입니다.
- 장르 종류는 100개 미만입니다.
- 장르에 속한 곡이 하나라면, 하나의 곡만 선택합니다.
- 모든 장르는 재생된 횟수가 다릅니다.

## 입출력 예제

[##_Image|kage@bVpmpm/btss73uFeUk/AAAAAAAAAAAAAAAAAAAAAFzg6BQX-qVk5v4fPwT8Rc3WhYG5hRIIRVHJDuPfuqc8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&amp;expires=1769871599&amp;allow_ip=&amp;allow_referer=&amp;signature=q3sCmgvgfAPl5WwxYPhEzBDE8fc%3D|CDM|1.3|{"originWidth":663,"originHeight":75,"style":"alignCenter"}_##]

### 입출력 예 설명

classic 장르는 1,450회 재생되었으며, classic 노래는 다음과 같습니다.

- 고유 번호 3: 800회 재생
- 고유 번호 0: 500회 재생
- 고유 번호 2: 150회 재생

pop 장르는 3,100회 재생되었으며, pop 노래는 다음과 같습니다.

- 고유 번호 4: 2,500회 재생
- 고유 번호 1: 600회 재생

따라서 pop 장르의 \[4, 1\]번 노래를 먼저, classic 장르의 \[3, 0\]번 노래를 그다음에 수록합니다.

장르 별로 가장 많이 재생된 노래를 최대 두 개까지 모아 베스트 앨범을 출시하므로 2번 노래는 수록되지 않습니다.

## 풀이

### 접근

내가 처음에 문제를 풀면서 생각한 각 장르의 노래 정보를 저장할 객체는 다음과 같았다.

```
[
    { id: 0, genre: 'classic', play: 500 },
    { id: 1, genre: 'pop', play: 600 },
    { id: 2, genre: 'classic', play: 150 },
    { id: 3, genre: 'classic', play: 800 },
    { id: 4, genre: 'pop', play: 2500 }
]
```

그리고 각 장르의 총 재생 횟수를 계산하고, 재생 횟수에 따라 장르를 내림차순으로 정렬했다.

정렬된 결과는 장르의 순위를 나타내는 배열로 반환된다.

```
["pop", "classic"]
```

장르별로 순위를 매긴 후, 장르 순서대로 반복문을 돌려서 장르별로 해당 장르에 속한 노래들을 모아 배열 'arr'에 저장하고, 이 배열을 재생 횟수에 따라 내림차순으로 정렬했다.

정렬된 배열에서 최대 두 개의 노래를 선택하여 'asnwer' 배열에 고유 ID를 추가한 뒤에, 모든 장르에 대한 처리가 완료되면 최종적으로 'answer' 배열을 반환했다.

### 구현

#### 내가 구현한 코드

```
function getGenreRank(objArray) {
  const playCountObj = {};
  const result = [];
  objArray.forEach((obj) => {
    const { genre, play } = obj;
    playCountObj[genre] = playCountObj[genre] + play || play;
  });
  const sortedPlayCountObj = Object.entries(playCountObj).sort(
    (a, b) => b[1] - a[1]
  );
  sortedPlayCountObj.forEach((obj) => {
    result.push(obj[0]);
  });
  return result;
}

function solution(genres, plays) {
  let answer = [];
  let musicObjArray = [];

  genres.forEach((genre, i) => {
    const musicObj = {};
    musicObj["id"] = i;
    musicObj["genre"] = genre;
    musicObj["play"] = plays[i];
    musicObjArray.push(musicObj);
  });

  // 장르 별로 순위 매기는 함수
  const genreRank = getGenreRank(musicObjArray);

  // 각 장르 별 재생 순위 매기는 함수
  genreRank.forEach((genre) => {
    const arr = [];
    musicObjArray.forEach((obj) => {
      if (obj.genre === genre) {
        arr.push([obj.id, obj.play]);
      }
    });
    const sortedArr = arr.sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < sortedArr.length; i++) {
      if (i > 1) {
        break;
      }
      answer.push(sortedArr[i][0]);
    }
  });
  return answer;
}
```

#### GPT 코드

GPT가 생각하는 가장 최적의 객체 형태는 다음과 같았다.

```
{
  classic: { totalPlayCount: 1450, songs: [ [Object], [Object], [Object] ] },
  pop: { totalPlayCount: 3100, songs: [ [Object], [Object] ] }
}
```

내가 생각했던 객체의 형태보다 훨씬 간단하고 좋은 것 같다.

또한 장르를 총 재생 횟수에 따라 내림차순으로 정렬할 때, 나는 불필요하게 복잡하게 코드를 짠 감이 없지않아 있었는데 GPT는 훨씬 더 간단하고 명료하게 코드를 짠게 인상 깊었다.

```
function solution(genres, plays) {
    const genreMap = {}; // 각 장르의 총 재생 횟수와 노래 정보를 저장할 객체

    // 장르와 노래 정보를 genreMap에 저장
    for (let i = 0; i < genres.length; i++) {
        const genre = genres[i];
        const playCount = plays[i];
        if (!genreMap[genre]) {
            genreMap[genre] = {
                totalPlayCount: 0,
                songs: [],
            };
        }
        genreMap[genre].totalPlayCount += playCount;
        genreMap[genre].songs.push({ index: i, playCount });
    }

    // 장르를 총 재생 횟수에 따라 내림차순으로 정렬
    const sortedGenres = Object.keys(genreMap).sort(
        (a, b) => genreMap[b].totalPlayCount - genreMap[a].totalPlayCount
    );

    const result = [];

    // 각 장르에서 최대 두 개의 노래 선택
    for (const genre of sortedGenres) {
        const songs = genreMap[genre].songs.sort((a, b) => {
            if (a.playCount !== b.playCount) {
                return b.playCount - a.playCount;
            } else {
                return a.index - b.index;
            }
        });

        result.push(songs[0].index); // 가장 많이 재생된 노래
        if (songs.length > 1) {
            result.push(songs[1].index); // 두 번째로 많이 재생된 노래
        }
    }

    return result;
}
```
