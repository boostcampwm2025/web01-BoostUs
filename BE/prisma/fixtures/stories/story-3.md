오늘은 많은 학과 교수님들의 관심과 대회에서 큰 상을 받았던 팀 프로젝트를 진행한 경험을 회고하고자 한다. 이 프로젝트를 통해 나는 인공지능에 대한 큰 흥미를 가지게 되었고, 그것이 가진 잠재력을 몸소 깨닫게 되었다.

[깃허브 리포지토리](https://github.com/AlgoThreeReading-Team)

# 대화형 AI 소담이란?

대화형 AI 소담은 눈이 잘 보이지 않는 시각장애인분들을 대상으로 상품에 대한 정보를 소리로 설명해주는 서비스이다. 사용자는 아래 사진과 같이 특정 상품을 추천받을 수도 있고 원한다면 상품 정보에 대한 답변도 얻을 수 있다.

스크린리더를 통해 상품의 정보를 들으면서 이해하는 시각장애인들의 입장에서 복잡한 쇼핑몰 UI는 큰 독이다.
가령 사용자가 사과 하나를 사기 위해 쇼핑몰에 들어간다고 가정한다면, 사용자는 사과와 관련 없는 많은 정보들을 소리를 통해 듣고 있어야 한다.

만약 인공지능 점원이 사용자가 원하는 상품을 빠르게 추천해주고, 설명해준다면 어떨까? 그게 가능하다면 사용자는 짧은 시간 안에 상품을 파악하고 구매하는데 큰 도움을 받을 것이다.

[시연 영상](https://drive.google.com/file/d/1irIDroCX0r1bx-w5nkVEEh7senVA5E_b/view?usp=sharing)

![](https://velog.velcdn.com/images/dongho18/post/2b8fd843-4281-460b-b3df-0d148a33ff4e/image.png)

# 어떻게 만들건데?

이를 구현하기 위해 필요한건 크게 두 가지이다.

1. 사용자에게 상품을 추천해준다.
2. 사용자에게 상품을 설명해준다.

심플해보이지만 이 프로젝트를 처음 기획할 당시에는 어떤 식으로 설계를 할지 고민이 많았다.
내가 선택한 방법은 다음과 같다.

## 데이터셋 준비

실험 대상은 '쿠팡'으로 정했다.
쿠팡에서 랜덤한 상품 데이터를 30개 정도 골라 스크래핑 하여 데이터를 정형화 시켰다.
이 정형화 된 상품 정보들을 이용해 사용자에게 상품을 추천해주고 설명해주는 로직을 짜보기로 했다.
혹시라도 이 데이터가 필요한 사람들을 위해 [깃허브 리포지토리](https://github.com/AlgoThreeReading-Team/SodamSodam-Chatbot/blob/main/recommend/product.csv) 를 공유한다.

![](https://velog.velcdn.com/images/dongho18/post/b168851c-ff02-4e16-bf92-376bbfa88057/image.png)

## 상품 추천(검색)

상품을 사용자에게 어떻게 하면 간단한 방법으로 추천해줄 수 있을까?
ChatGPT에게 부탁하자니 이 친구는 생성형 모델이지 추천 모델이 아니였기에 제외시켰다.
다른 전통적인 방식인 사용자 기반 추천과 아이템 기반 추천으로 상품을 추천하자니, 사용자의 구매 및 탐색 이력이 필요한데 나 같은 대학생에게 그러한 정보는 없었다.

![](https://velog.velcdn.com/images/dongho18/post/45971b87-d2d7-4407-83d6-b80bead59dd0/image.png)

이가 없으면 잇몸으로 개발해보자.
나는 아주 간단한 방법으로 상품 DB 안에 있는 제품명과 사용자의 발화문을 각각 벡터화 시켜서 코사인 유사도 값을 계산한 뒤, 유사도 값이 가장 큰 상품을 추천해주는 방식으로 개발을 진행했다.

![](https://velog.velcdn.com/images/dongho18/post/02d8298a-7d2e-483d-b8db-fd49f2ebe672/image.png)

먼저 문장을 벡터화 시켜 주기 위해 한국어 사전 학습 모델인 `jhgan/ko-sroberta-multitask` 을 불러와준다.
상품 DB의 제품명들을 불러온 model을 이용해 벡터화 시킨다. 이렇게 제품명을 벡터화 해주면 나중에 들어올 사용자의 발화문과 얼마나 유사한지를 수학적으로 계산할 수 있게 된다.

```python
from sentence_transformers import SentenceTransformer, util
import torch
import pandas as pd

model = SentenceTransformer("jhgan/ko-sroberta-multitask")
df = pd.read_csv("product.csv")
df["벡터화된 제품명"] = df["제품명"].apply(lambda x: model.encode(x))
```

그런 다음 유사도를 계산해서 유사성이 높은 상품들을 추출해내는 함수를 작성한다.
이 함수는 사용자의 발화문을 나타내는 `query` 변수와, 반환할 상위 결과의 개수를 나타내는 `top_k` 변수를 인자로 받는다.

함수의 동작 방식을 설명하자면 다음과 같다.

1. 사용자의 발화문을 모델을 통해 벡터화한다.
2. 데이터프레임의 "벡터화된 제품명"열과 발화문 간의 코사인 유사도를 계산한다.
3. 계산된 유사도 중에서 상위 K개의 결과를 선택한다.
4. 선택된 결과 중 코사인 유사도가 0.3 이상인 상품들에 대한 정보를 추출하고, 이 정보들을 포함한 리스트를 생성한다.
5. 생성된 리스트를 반환한다.

참고로 여기서 코사인 유사도는 0~1 사이의 값이 나오게 되는데, 유사도가 높을 수록 값이 1에 가까워진다.
나 같은 경우는 조금 널널하게 문턱값을 `0.3` 으로 잡았는데 이 값은 여러 가지 실험을 통해서 개발자가 임의로 정하면 된다.

```python
def get_query_sim_top_k(query, top_k):
    query_encode = model.encode(query)
    cos_scores = util.pytorch_cos_sim(query_encode, df["벡터화된 제품명"])[0]
    top_results = torch.topk(cos_scores, k=top_k)

    top_indices = top_results.indices.tolist()  # 상위 상품 인덱스 리스트

    result_list = []

    for index in top_indices:
        if cos_scores[index] >= 0.3:
            product_info = {
                "id": df.iloc[index]["index"],
                "title": df.iloc[index]["title"],
                # ...(중략)
            }
            result_list.append(product_info)
    return result_list

query = "맛있는 고구마 추천해줘"
product = get_query_sim_top_k(query, 1)
print(product)
```

이렇게 하면 "맛있는 고구마 추천해줘" 라는 사용자의 발화문과 DB 안의 상품명들과 하나하나 비교해서 그럴싸한 상품 하나를 추천해주게 된다. 물론 나중에 알았지만, 이 방식은 결점이 많아 크게 권장하지는 않는다. 대학교 팀 프로젝트나 개인적으로 진행하는 사이드 프로젝트에만 사용하길 바란다.

## 상품 설명

상품 설명을 진행하기 앞서 한 가지 의문이 들 수도 있을 것이다.
"사용자가 상품을 추천해달라는 것인지, 설명해달라는 것인지 어떻게 구분할 수 있어?"
이를 해결하기 위해서는 사용자의 발화문이 입력 값으로 들어왔을 때 그 문장이 '상품 추천' 카테고리에 해당하는지, 아니면 '상품 설명'에 해당하는지 분류해주는 인공지능 모델이 필요했다.
하지만, 이 당시 나는 인공지능에 '인'자도 모르는 학부생이였기에 ChatGPT API를 이용하여 해결했다.

### 사용자 의도 파악

![](https://velog.velcdn.com/images/dongho18/post/5f8e1343-874d-4a9f-bf0b-38fddb4876ee/image.png)

사용자가 어떠한 질문을 했을 때 ChatGPT가 '추천'인지 '설명'인지 분류를 하기 위해서는 약간의 프롬프트 엔지니어링이 필요했다.

분류할 의도를 `allowed_intents` 리스트에 집어 넣고, GPT에게 `사용자의 발화문이 어느 범주에 속하는지 반드시 리스트에 해당하는 하나의 범주로만 대답해라` 고 유도한다.

만약 GPT가 예측한 의도가 허용된 의도 목록에 있는지 확인하고, 있으면 해당 의도를 반환하고, 없으면 "미분류"로 반환한다.

```python
from openai import OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def get_user_intent(query):
    allowed_intents = [
        "상품 설명",
        "상품 추천",
        "리뷰 요약",
        "미분류",
    ]
    messages = [
        {
            "role": "system",
            "content": "당신은 사용자의 질문 의도를 이해하는 유용한 보조자입니다.",
        },
        {
            "role": "user",
            "content": f"아래 문장은 어느 범주에 속합니까: {' | '.join(allowed_intents)}? 반드시 하나의 토큰으로만 응답하세요. \n{query} \nA:",
        },
    ]

    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
    chatbot_response = response.choices[0].message.content

    return chatbot_response if chatbot_response in allowed_intents else "미분류"
```

그렇다면 상품 설명은 어떤 방식으로 이루어질까?
앞서 사용자가 상품 하나를 추천 받게 되면 클라이언트는 추천 받은 상품에 대한 id 값을 기억하고 있는다.
사용자가 상품 하나를 추천 받은 뒤에 그 상품에 대한 설명을 요청하면 서버로 상품 id에 대한 값이 같이 넘어오게 된다.

예를 들어, 1번 id 값을 가지는 상품을 추천받았다면 사용자가 그 다음에 하는 질문들과 함께 1번 id 값이 같이 넘어가게 된다. 그런 다음 이 질문의 의도가 "상품 설명" 이라면 상품 id 값을 이용해 db에서 1번 상품에 대한 정보들을 가져온다.

![](https://velog.velcdn.com/images/dongho18/post/b3682edc-b6fa-4e23-8e5c-492dc2a1f4d8/image.png)

그렇게 가져온 상품 정보들을 GPT에게 문자열 형태로 넘긴 다음 요약을 하라고 시킨다.

```python
def get_description_answer(product_info, query):
    messages = [
        {
            "role": "system",
            "content": "당신은 사용자에게 상품에 대해서 설명해주는 점원입니다. 손님은 항상 바쁘기 때문에 답변을 간결하게 하려고 노력해주세요.",
        },
        {
            "role": "user",
            "content": f"질문: {query}\n상품 정보: {product_info}\n이 상품에 대해서 설명해주는 멘트만 짧게 작성해주세요. \nA:",
        },
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=messages, temperature=0.5
    )
    chatbot_response = response.choices[0].message.content

    return chatbot_response
```

# 맺음말

인공지능 기술이 빠르게 발전하고 있다. 이제는 나같은 컴퓨터 공학 학부생들도 ChatGPT API와 같은 도구를 이용하여 현실적이고 유용한 제품을 개발할 수 있게 되었다. 빠른 발전에 도태되지 않기 위해 계속해서 인공지능 분야에서 학습하고 발전하는 것이 중요한 것 같다.

이 글을 보는 다른 분들도 ChatGPT 시대에서 자신의 역량을 어떻게 발휘할 수 있을지 같이 고민해보고 또 도움이 되었으면 한다.
