# eatGNU

[eatGNU 구경하기](http://eatgnu.kro.kr/)
[깃 레포로 이동하기](https://github.com/JangDongHo/eatGNU)

## 개요

내가 사이드 프로젝트를 하기로 마음 먹은건 군대에서부터 시작됐다. 다른 선배 개발자분들께서 항상 하는 말이 '이론을 배우고 나서는 항상 무언가를 직접 만들어봐야 실력이 는다" 였다. 나도 이에 적극적으로 동의한다. 예전에 파이썬을 가지고 디스코드 봇을 만들어본 적이 있었는데 이때 무언가 내가 성장하는 느낌을 받았었는데, 마찬가지로 이번에도 그 느낌을 다시 받고싶었다. 그래서 노마드코더 코코아톡 클론코딩 강의(HTML+CSS)를 다 듣고나서 내가 얼마나 이해하고 뭐가 부족한지 점검하고자 사이드 프로젝트를 기획하게 되었다.

## 아이디어

사이드 프로젝트 아이디어를 짜면서 중점적으로 생각한건 아래와 같다.

- 수요가 있는가? 누군가에게 도움이 되는가?
- 내가 학습한 것을 온전히 적용시킬 수 있는가?
- 내가 감당할 수 있는 규모인가?
- 수익을 창출할 수 있는가?

먼저, 처음 떠올린 아이디어는 `주식 도우미 웹사이트` 였는데, 사실 이건 HTML, CSS를 점검하기 보다는 백엔드쪽이 주를 이루겠다 싶어서 제외했다.

그리고 고심하다 떠올린 것이 `맛집 소개 웹사이트` 이다. 예전에 부산대에 다니던 친구가 웹사이트에서 먹을만한 식당을 찾고 있길래 뭔가해서 봤더니, 부산대생이 만든 [eatEatPNU](http://eateatpnu.com/) 를 보고 있었다. '우리 학교에는 이런걸 만든 사람이 있을까?' 하고 찾아봤는데 없는 것이었다! 마침, 개강을 앞둔 시즌이라 분명히 수요가 있을거라고 생각하고 바로 개발에 착수했다.

- 수요가 있는가? 누군가에게 도움이 되는가? => `대학생 새내기들`
- 내가 학습한 것을 온전히 적용시킬 수 있는가? => `단순한 정보 제공 웹사이트이므로, 백엔드보다는 프론트엔드에 집중할 수 있음`
- 내가 감당할 수 있는 규모인가? => `크게 부담되지 않는 수준일 것 같았음`
- 수익을 창출할 수 있는가? => `광고를 넣을 수도 있지만, 아주 작은 사이드 프로젝트였기에 수익 창출은 과감히 포기하고 깔끔한 웹사이트로 서비스 하기로 마음 먹음`

## 디자인

![](<https://images.velog.io/images/dongho18/post/7026bdad-8ee0-41b7-9cdb-cfb2e2a13498/ezgif.com-gif-maker%20(5).gif>)
디자인은 아무래도 노마드코더 강의를 많이 듣다보니, 노마드코더 홈페이지 UI와 유사한 형태로 가버렸다. ~~(죄송합니다 ㅠㅠ)~~
중점사항으로는 적은 코드로 어느 기기든 다 콘텐츠가 잘 보이도록 Flexbox를 중점적으로 사용했다.

음식 사진이 차지하는 비중을 제일 크게 하여 시각적인 요소를 부각하였으며, 그 뒤로 가게 이름의 폰트 사이즈를 크게하여 어떤 가게인지 잘 인지할 수 있도록 하였다. 그 외에는, 식당의 부가설명과 태그를 작게 만들어 박스 안에 넣어두었다.

## 기능

사이드 프로젝트를 하면서 뼈저리게 느낀 점은 HTML, CSS만으로는 나와 웹사이트를 이용할 사용자들 모두 만족할 수 없겠다는걸 깨달았다. 내가 웹사이트를 첫 배포를 하기 전에 넣고싶었던 필수적인 기능들은 `음식 태그 필터링` 과 `식당 위치를 알려주는 지도` 이 두개였는데, 막상 이 두개를 적용하려면 자바스크립트의 이해가 필요해보였다. 그래서, 노마드코더 바닐라JS 강의를 병행하며 이론을 공부했고 그 외에 이해가 안되는 것들은 구글링하며 기능 완성에 집중했다.

### 음식 종류 필터링

![](<https://images.velog.io/images/dongho18/post/76e2358f-6536-4a8c-9ff2-5d2260b95c09/ezgif.com-gif-maker%20(6).gif>)

하나의 html에서 모든 음식을 다 보여주는 구조다 보니, 최소한 음식 종류별로 따로 식당들을 보여줄 수 있게 필터링하는 기능이 없으면 안되겠다고 생각해서 만든 기능이다.

```js
const tagBtnContainer = document.querySelector('.tag-filter__tags');
const restaurantContainer = document.querySelector('.restaurant-lists');
const restaurants = document.querySelectorAll('.restaurant-list');
tagBtnContainer.addEventListener('click', () => {
  const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
  restaurantContainer.classList.add('anim-out');
  setTimeout(() => {
    restaurants.forEach((restaurant) => {
      if (filter === '*' || filter === restaurant.dataset.type) {
        restaurant.classList.remove('invisible');
      } else {
        restaurant.classList.add('invisible');
      }
    });
    restaurantContainer.classList.remove('anim-out');
  }, 280);
});
```

사실, 이 코드는 내 것이 아니다. 왜냐하면, 이 기능을 넣을 당시에 자바스크립트 강의를 듣기 전이었고, 무지성으로 구글링하여 억지로 코드를 이해하며 넣은 코드기 때문이다. 지금이야, 바닐라JS 강의를 모두 다 들은 상태라 코드를 보고 이해가 가능하지만, 이 당시에는 지금은 HTML, CSS에 집중하는 사이드 프로젝트니 배포를 마무리 한 후 내 손으로 직접 짜보자고 생각하고 넘어갔다. 그래서, 이 회고록을 작성하고 태그 필터링 부분은 다 지우고 내 방식으로 짜볼 생각이다.

### 식당 위치 지도로 보여주기 (Feat. 네이버 지도 API)

<p align="center">
  <img src="https://images.velog.io/images/dongho18/post/a64ae4fc-953f-4a39-aaee-cf5c84c43fee/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-02-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.21.25.png" width="600" height="500"/>
</p>

위에서도 언급했지만, 예전에 디스코드 봇을 잠깐 만든적이 있었는데 그때 API를 사용해본 경험이 있어서 그런지 이 부분을 만드는데 몇 번의 삽질은 있었지만 크게 어렵지 않았다. 네이버 지도 API를 적용시키면서 가장 좋았던건 [예제](https://navermaps.github.io/maps.js/docs/tutorial-digest.example.html)가 잘 나와있어서 하나하나 기본 예제부터 실행시켜보며 어떤 식으로 작동하는지 알아보기 편했다.

#### 버튼 실행 함수

```js
const buttons = document.querySelectorAll('.restaurant-list');
const queryMap = document.querySelector('#map-container');
const mapQuitBtn = document.querySelector('#map-quit');

for (const button of buttons) {
  button.addEventListener('click', function (event) {
    const restaurantName = event.path[2].childNodes[5].childNodes[1].innerText;
    const restaurantAddress = event.path[2].attributes[1].value;
    document.body.style.overflow = 'hidden';
    queryMap.classList.remove('invisible');
    geocoding(restaurantName, restaurantAddress);
  });
}
```

먼저, for문을 사용해서 식당 리스트 하나하나에 클릭 이벤트를 부여하여 어떤 식당 버튼을 눌렀는지 정보를 주도록 만들었다. 지금 보니 좀 부끄러운 코드인데, 구글링 안하고 console.dir로 무지성으로 경로를 찾아가면서 만든거라 기괴한 코드가 나와버렸다. ~~~(저것보다 더 간단해질 수 있는데..)~~~ 이 부분은 나중에 리팩토링 할 때 고쳐야겠다.

#### 식당 좌표값을 어떻게 따올까?

식당 위치를 지도에 띄우기 위해서는 식당 좌표값이 필요했다. 내가 생각한 방법은 두 가지였다.

- 주먹구구식으로 HTML 태그에 식당 좌표값을 하나씩 다 따와서 넣자!
- 식당 이름만 넣으면 자동으로 식당 좌표값을 반환하는 함수를 만들어보자!

전자로 하기에는... 엄두가 안났다.. 초기 식당 개수만 50개 가까이 됐고, 앞으로 꾸준히 식당 리스트를 업데이트 한다고 생각했을 때 그건 정말 미친 짓이었다! 그래서, 재빠르게 네이버 지도 API 예제 중에 식당 이름을 입력하면 식당 좌표값을 반환해주는 예제가 없는지 찾아보았다. 아쉽게도, 식당 이름만 입력하면 좌표 값을 주는 예제는 없었고 그 대신에 ['도로명 주소나 지번 주소를 입력하면 좌표로 변환해주는 API 예제'](https://navermaps.github.io/maps.js/docs/tutorial-3-geocoder-geocoding.example.html)가 있었다. 그래서, 조금 번거롭지만 도로명 주소(지번 주소)까지는 HTML 태그에 직접 찾아서 넣는걸로 타협했다.

##### 좌표 값을 따오자!

```js
function geocoding(name, address) {
  var Addr_val = address;

  // 도로명 주소를 좌표 값으로 변환(API)
  naver.maps.Service.geocode(
    {
      query: Addr_val,
    },
    function (status, response) {
      if (status !== naver.maps.Service.Status.OK) {
        return alert('Something wrong!');
      }

      var result = response.v2, // 검색 결과의 컨테이너
        items = result.addresses; // 검색 결과의 배열

      // 리턴 받은 좌표 값을 변수에 저장
      let x = parseFloat(items[0].x);
      let y = parseFloat(items[0].y);
      mapQuitBtn.addEventListener('click', quitMap);
      mapGenerator(name, String(y), String(x));
    },
  );
}
```

식당 좌표 값을 따오는 코드이다. Addr_val 변수에 도로명 주소(지번 주소)를 넣으면 지도 API에서 좌표값을 반환해준다. ~~(대단해!)~~ 사실 여기서 정말 이상한 걸로 큰 애를 먹었는데.. 코드에는 문제가 없다고 확신했는데.. 자꾸 오류가 터지는 것이다. 그래서 엄청난 삽질 끝에 원인을 발견했는데 `Web Dynamic Map` 서비스만 신청하고 `Geocoding` 서비스를 신청을 안해서 터진 오류였다.. 멍청이! 그래도 삽질 끝에 해결할 때 느끼는 기쁜 감정으로 개발하는거 아니겠는가? ~~(라고 합리화 해보았다.)~~

##### 지도를 생성하자!

```js
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function mapGenerator(name, la,lo){
  var HOME_PATH = window.HOME_PATH || '.';
  var location = new naver.maps.LatLng(la,lo),
      map = new naver.maps.Map('map', {
          center: location,
          zoom: 19
      }),
      marker = new naver.maps.Marker({
          map: map,
          position: location
      });
  if (isMobile()) {
    var contentString = [
        '<div class="">',
        '   <h5>'+name+'</h5>',
        '</div>'
    ].join('');
  }
  else {
    var contentString = [
        '<div class="">',
        '   <h5>'+name+'</h5>',
        '   <p><br>',
        '       <a target="_blank" href="http://map.naver.com/search/가좌동'+name+'" >네이버 지도 바로 가기</a>',
        '   </p>',
        '</div>'
    ].join('');
  }
```

좌표값을 따온 뒤에 지도를 생성하는 함수를 넣었다. 아래에 contentString 변수는 지도 마커를 클릭했을 시 띄우는 식당 정보 창인데 식당 이름과 식당의 네이버 지도 주소 링크를 포함하고 있다. 네이버 지도 링크는 네이버 지도의 url의 검색 부분을 변수를 입혀서 자동으로 링크가 생성되게 만들었다. 근데 이 방법은 PC 지도에서만 작동이 되길래 모바일은 아쉽지만 이 기능을 빼버리는걸로 결정했다 (ㅠㅠ)

##### 식당 정보 창을 띄우자!

```js
  var infowindow = new naver.maps.InfoWindow({
      content: contentString,
      maxWidth: 300,
      backgroundColor: "#eee",
      borderColor: "#A4A4A4",
      borderRadius:"30px",
      borderWidth: 2,
      disableAnchor:true,
      anchorColor: "#A4A4A4",
      pixelOffset: new naver.maps.Point(10, -10)
  });

  naver.maps.Event.addListener(marker, "click", function(e) {
      if (infowindow.getMap()) {
        infowindow.close();
      } else {
        infowindow.open(map, marker);
      }
  });
  setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
  }, 600);
}
```

지도에서 마커를 클릭했을 때 뜨는 식당 정보 창을 만드는 object와 감지하고 띄우는 eventlistener 함수이다.

## 웹 호스팅 & 도메인 준비

배포를 하면서 생각한 요소는 운영 비용이었는데, 아무래도 이 프로젝트로 수익을 창출할 생각이 없었기 때문에 비용 없이 서비스를 운영하는 쪽으로 생각하게 되었다.

웹 호스팅은 노마드코더 강의에서 접한 `github pages`를 통해 무료로 웹사이트를 돌릴 수 있었다. 이런 서비스를 무료로 제공해주는 깃허브에게 너무 감사하다.

그런데, 문제는 기본 url이 너무 안 이뻐서 구글링을 해보니 다행히 url을 자체 도메인으로 변경할 수 있었다. 그래서 무료 도메인을 알아봤는데 중고딩 시절에 마인크래프트 서버를 운영할 때 사용했던 `내도메인.한국`이 아직까지 살아있길래 바로 eatGNU.kro.kr 도메인을 만들어 적용했다. 이 과정은 구글링으로 크게 어렵지 않게 적용시켰다.

## 성공적인 배포

<p align="center">
  <img src="https://images.velog.io/images/dongho18/post/b73c1f06-2994-4649-a394-7bb7b536055b/KakaoTalk_Photo_2022-02-21-22-29-19.jpeg" width="450" height="600"/>
</p>
이 프로젝트를 기획할 때부터 배포는 에브리타임 새내기게시판에 할 예정이었다. 왜냐하면, 식당들을 잘 알고있는 재학생들 보다는 새내기들에게 더 수요가 있을 것 같다고 생각했기 때문이다.

그렇게 2022년 2월 18일에 내 손으로 만든 첫 웹사이트가 배포되었다. 일명 '핫게'라고 불리는 곳에 들어가려면 추천 수 10개가 필요해 글이 묻히기 전에 내 친구들을 동원해서 추천 수를 빠르게 늘렸다. 핫게에 들어가면 그 뒤로는 저절로 홍보가 될 것이라고 생각했다. 내 생각이 맞았다. 내 글은 5분 정도 후에 핫게에 들어갔고 그 뒤로는 에브리타임 메인 홈에 뜨면서 노출 수가 증가했다. 내가 예상했던 것 보다 더 큰 반응이었다. 첫 날에는 추천수 50개와 스크랩 100개를 받았는데, 두 번째 날에는 실시간 인기글 1위까지 들어가며 추천 수와 스크랩 수가 폭발적으로 늘어났다. 그렇게 2월 21일 기준으로 추천수 123개와 스크랩 수 305개를 받는 기염을 토했다.

금요일에 배포를 했었는데, 주말 동안 이것 때문에 너무 행복했다. 비록 수익이 없더라도, 내 손으로 만든 서비스를 누군가 필요해서 봐주는 것 만으로도 개발자에게는 큰 힘이 되었다. 내 웹페이지가 공개되고 축하와 응원을 해준 내 친구들과 관심을 가져준 재학생들에게 감사하다.

## 깨달은 점

사이드 프로젝트를 진행하면서 내가 생각했던 것보다 많은 것을 깨달았다. 왜 사람들이 사이드 프로젝트를 그렇게 강조하는지 알겠다. 내가 배웠던 이론들을 점검하며 부족한 부분을 알 수 있었고, 필요한 기능을 구현하기 위해서 직접 구글링 해가며 새로운 것들을 학습했다. 그리고, 제일 중요한 것은 **자신감**을 얻었다는 것이다. 사이드 프로젝트를 만들기 전에는 '내가 과연 이걸 만들 수 있을까?' 지레 겁이 났다. 또, '만든다 한들 실패하면 어떡하지? 아무도 관심을 가져주지 않으면 어떡하지?' 라는 생각이 앞섰었다. 그러나, 나는 개발과 배포 모두 성공했고 사용자들에게 좋은 반응을 얻었다. 그러나, 비록 실패하더라도 그 과정에서 많은 것을 깨달을 수 있을 것이라는 생각이 들었다. 그것만으로 사이드 프로젝트는 큰 나의 성장 원동력이 되는 것이다.

## 아쉬웠던 점

### 아쉬운 코드

아무래도 강의를 들은 직후에 따로 더 깊게 공부하지 않고 바로 사이드 프로젝트를 진행한거라, 코드가 온전한 내 것이라고 느껴지지 않는다. 다음 사이드 프로젝트를 진행하기 전까지 부족한 부분을 더 공부해서 보완해야겠다.

### 무지성 개발 과정

다음 사이드 프로젝트부터는 다른 개발자들처럼 체계화된 개발을 하고 싶다. 예를 들면 UI/UX 요소를 미리 종이에 그려보든 피그마를 통해 구현해본다던지, 빠르게 프로토타입을 만들어 먼저 소수의 사용자들에게 배포해 반응을 살펴본다든지, 노션을 통해 오늘의 할당량을 정해서 개발해보고 싶다.

## 마무리하며

비록 개발 과정이 순탄치는 않았지만 많은 것을 느낄 수 있었던 첫 사이드 프로젝트였다.
다음 사이드 프로젝트에서는 더 성장한 나를 기대하며 글을 마무리한다.
