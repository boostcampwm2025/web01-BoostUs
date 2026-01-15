> 본 게시물은 ["시각장애인을 위한 읽어주는 쇼핑 대화형 AI '소담' 개발 회고"](https://velog.io/@dongho18/시각장애인을-위한-읽어주는-쇼핑-대화형-AI-소담-개발-회고) 와 내용이 이어집니다.

오늘은 이커머스 도메인 개체명 인식기 개발을 주제로 글을 써보려고 한다.

# 개체명 인식이란?

개체명 인식(Named Entity Recognition)이란 말 그대로 이름을 가진 개체(named entity)를 인식하겠다는 것을 의미한다. 좀 더 쉽게 설명하면, 어떤 이름을 의미하는 단어를 보고는 그 단어가 어떤 유형인지를 인식하는 것을 말한다.

예를 들어 **동호는 2025년에 토스에 입사했다.** 라는 문장이 있을 때, 사람(person), 조직(organization), 시간(time)에 대해 개체명 인식을 수행하는 모델이라면 다음과 같은 결과를 보여준다.

![](https://velog.velcdn.com/images/dongho18/post/f021dca4-24b9-48e9-9b5d-87094b00c768/image.png)

# 개발 배경

이전에 학교 팀 프로젝트를 진행하면서 **상품 추천 알고리즘** 개발을 맡은 적이 있었다.
Word2Vec 를 사용해 사용자의 발화문과 DB에 저장돼있는 제품명을 비교해서 코사인 유사도 값을 계산한 뒤에 유사도 값이 가장 큰 상품을 추천해주는 방식으로 간단하게 구현을 진행했었다.

[구현 방법](https://velog.io/@dongho18/시각장애인을-위한-읽어주는-쇼핑-대화형-AI-소담-개발-회고)

![](https://velog.velcdn.com/images/dongho18/post/7cfc68dc-2703-4b98-98c3-a30b713ab729/image.png)

이 방법은 간단하면서도 나름 성능이 괜찮았지만, 한 가지 문제가 존재했다.
예를 들어 "다이슨 청소기 추천해줘"와 같은 문장 전체를 모두 벡터화시키다 보면, 중요하지 않은 정보들도 함께 벡터화가 되어 노이즈가 생긴다.
즉, 문장이 길어지면 길어질수록 추천 성능이 떨어진다.
그래서, 문장에서 중요한 키워드만 뽑아서 벡터화를 시키는 방법은 없을까를 고민하게 됐고 그에 대한 해결 방법으로 개체명 인식기 개발 방법에 대해 공부하게 된다.

![](https://velog.velcdn.com/images/dongho18/post/f3e0f549-58bd-433f-ac7a-9dcbb3f3f529/image.png)

# 선행 연구

개체명 인식에 대한 선행 연구를 조사해본 결과, 다양한 접근 방식이 존재했다. 주로 사용되는 방법으로는 규칙 기반 접근, 머신러닝 기반 접근, 그리고 최근에는 딥러닝 기반 접근이 있다. 본 글에서는 딥러닝 기반 방식을 사용했다.

## 딥러닝 기반 접근

최근에는 딥러닝을 활용한 개체명 인식 모델들이 주로 연구되고 있다. 딥러닝 모델은 대량의 데이터로부터 자동으로 특징을 추출하고 학습할 수 있다는 특징이 있다. 대표적인 딥러닝 모델로는 RNN, LSTM, 그리고 Transformer 기반 모델(BERT, GPT) 등이 있다.

딥러닝 모델 중 특히 Transformer 기반 모델들은 문맥을 잘 이해하고, 긴 문장에서도 높은 성능을 발휘하는 것으로 알려져 있다. 예를 들어, BERT 모델이나 ELECTRA 모델은 문장의 양방향 문맥 정보를 활용하여 높은 정확도의 개체명 인식을 가능하게 한다. 이러한 모델은 사전 학습(pre-trained)된 상태로 제공되어, 특정 도메인에 맞게 미세 조정(fine-tuning)하는 방식으로 쉽게 적용할 수 있다.

![](https://velog.velcdn.com/images/dongho18/post/671a6771-d9e8-49b6-99d2-f42d29e81437/image.png)

## B-I-O 태깅

개체명 인식 모델을 학습하는 과정은 지도 학습의 일부분으로, 레이블링된 데이터인 B-I-O 태깅이 된 문장을 사용하여 모델이 텍스트에서 개체명을 인식하고 분류하는 방법을 학습한다.

B-I-O 태깅에서 B-태그는 개체명의 시작을, I-태그는 개체명의 내부를 나타낸다. 이 두 태그를 구분하는 이유는 "김치 냉장고"와 같이 두 단어 이상으로 이루어진 하나의 개체명을 식별하기 위해서이다. 마지막으로 O-태그는 개체명과 관련이 없는 일반적인 토큰을 나타낸다.

![](https://velog.velcdn.com/images/dongho18/post/dab04ffe-1a3b-4d93-bd92-f6abce81edd4/image.png)

# 제안하는 방법

선행 연구에서 살펴본 Transformer 기반 모델들은 위키피디아나 뉴스 등의 대규모 텍스트 데이터를 기반으로 학습이 되며, 이러한 데이터에서 언어의 패턴이나 구조를 파악하도록 훈련된다.

하지만, 나의 경우 기본적으로 입력 데이터로 문어체가 아닌 대화체가 들어오기 때문에 일반적인 ELECTRA 모델이 아닌 [Skplanet의 Dialog-KoELECTRA 모델](https://github.com/SKplanet/Dialog-KoELECTRA)을 사용하여 학습을 진행하기로 결정하였다. Dialog-KoELECTRA 모델은 22GB의 대화체 및 문어체 한글 텍스트 데이터로 훈련되었다.

![](https://velog.velcdn.com/images/dongho18/post/c8309dcd-ae42-4325-b507-accf04740e16/image.png)

# 실험

## 데이터셋

앞서 Transformer 기반의 모델을 학습하기 위해서는 B-I-O 태깅이 된 문장들이 필요하다고 했다. 하지만, 이러한 데이터들은 보통 이커머스 회사들의 귀중한 자산이기에 구하기가 쉽지 않았다.

나 같은 경우에는 [AI-Hub 소상공인 고객 주문 질의-응답 텍스트 데이터셋](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=102)을 사용하여 진행했다. 이 데이터셋은 콜센터에서 녹취된 질의-응답 음성 파일을 수집하고, 음성 데이터를 텍스트로 가공한 데이터셋으로 약 400만 건의 대화 데이터를 포함하고 있다.

개체명은 크게 6가지로 나뉘어져있고, 예시는 다음과 같다.

![](https://velog.velcdn.com/images/dongho18/post/f27e728e-35ac-4bcb-abe8-9f0dada6055d/image.png)

## 데이터 전처리

실험에서는 데이터셋의 양이 너무 많아 디지털/가전 카테고리의 데이터로 범위를 제한했다. 또한, 데이터 품질 문제로 인해 태그가 전혀 없거나 매우 부족한 일부 문장을 모두 사용하는 대신, 최소한 2개 이상의 태그가 지정된 문장만을 선택하여 사용했다. (약 50,000개)

![](https://velog.velcdn.com/images/dongho18/post/012eeb8c-d550-4c3b-a188-f762076c2da1/image.png)

## 실험 설계

실험 설계는 크게 세 가지로 구성된다.

1. 문어체 기반 모델과 대화체 기반 모델을 모두 학습시켜 성능을 비교한다.
2. 학습 데이터를 모두 사용한 경우와 일부만 사용한 경우의 성능 차이를 분석한다.
3. 혼동행렬 및 케이스 분석을 통해 모델이 어느 부분에서 강점과 약점을 보이는지 파악한다.

## 평가 지표

평가 지표로는 정밀도, 재현율, F1-Score를 사용하여 모델이 태그를 얼마나 잘 예측했는지 판단한다. 또한, 이런 모델의 경우에는 보통 큰 의미를 갖지 않는 레이블 정보 즉 'O' 태그가 다른 태그보다 압도적으로 많기 때문에 모델이 'O' 태그를 예측하는 데에 편향되어 정확도가 뻥튀기 되어 모델의 성능을 오해할 수 있다는 문제가 있다. 이러한 문제를 막기 위해 seqeval 라이브러리를 사용하여 모델이 해당 개체명을 이루는 모든 단어를 올바르게 예측하였을 경우에만 평가 점수를 계산하도록 하였다.

![](https://velog.velcdn.com/images/dongho18/post/5c1e2208-43ef-4849-a10c-d7cc0e317b0d/image.png)

## 실험 결과

실험에서 사용된 모델은 크게 3가지 이다.

문어체를 기반으로 사전 학습된 KoELECTRA-Small 모델과 KoELECTRA-Base 모델이 있고, 대화체를 기반으로한 사전 학습된 Dialog-KoELECTRA-Small 모델이 있다.

Small 모델과 Base 모델의 차이는 파라미터 수의 차이에 있다. 일반적으로 Small 모델은 자원 제약이 있는 상황이나 빠른 추론이 필요한 경우에 적합하고, Base 모델은 성능을 우선시하는 경우에 더 적합하다.

![](https://velog.velcdn.com/images/dongho18/post/2c1c00e4-a424-4ffe-b686-630007767ab7/image.png)

### 실험 1 - 모델 별 성능 비교

문어체 기반 모델과 대화체 기반 모델로 학습했을 때 실제로 더 좋은 성능이 나왔는지 확인해보기 위해 3가지 모델을 모두 비교해보았다. Full Dataset(N=50,000)을 기준으로 Small 모델끼리 비교했을 때는 약 2%의 성능 개선이 있었지만, Dialog-KoELECTRA-Base 모델을 비교했을 때는 많이 뒤쳐지는 모습을 볼 수 있다.

![](https://velog.velcdn.com/images/dongho18/post/5a4866e3-a967-47d6-a136-f1ad4de62da0/image.png)

### 실험 2 - 학습 데이터 크기 별 성능 비교

흥미로웠던 점은 학습 데이터 수가 적어지면 적어질수록 Dialog-KoELECTRA-Small 모델의 성능이 향상되었다. 실험에서는 Full Dataset의 크기의 약 0.01%인 500개의 학습 데이터로 KoELECTRA-Small 모델을 학습했을 때 F1-Score가 7.5%, Dialog-KoELECTRA-Small 모델은 41.6%로 약 6배 가까이 성능이 개선된 것을 확인할 수 있었다.

![](https://velog.velcdn.com/images/dongho18/post/d8419ec4-dc93-46c5-bcd2-bd5161f56f0a/image.png)

### 실험 3 - 혼동 행렬 및 케이스 분석

'Dialog-KoELECTRA-Small' 모델의 Full Dataset을 기준으로 혼동 행렬을 분석한 결과, 모델은 'O' 태그에서 가장 많이 혼동하는 경향을 보였다. 그 외 개체명은 잘 분류한다는 것이 오차 행렬의 주대각선에 잘 나타난다.

![](https://velog.velcdn.com/images/dongho18/post/7d321cec-21f8-4153-b637-98573b583343/image.png)

높은 손실을 내는 시퀀스들을 분석해본 결과 원본 데이터의 저품질 현상이 주 원인이라는 것을 알게 되었다. 대표적인 예로 "100인치 해상도로 시청 가능" 이라는 문장에서 "100인치" 라는 단어를 모델은 "크기" 라벨로 정확하게 예측했지만 실제로 원본 라벨에서는 'O' 태그가 부착되어 있어 성능이 크게 감소했다.

뿐만 아니라 일부 제품명이 모델의 학습에 혼동을 주고 있는 것으로 확인되었다. 예시에서는 "도로 시"라는 제품명이 모델에게 혼란을 야기하고 있는 것으로 나타났다. [도로시가 뭔지 궁금해서 구글에 검색해보니...](https://www.google.com/search?sca_esv=0eb7a465d1046084&sca_upv=1&rlz=1C1IBEF_koKR1021KR1021&q=%EB%8F%84%EB%A1%9C%EC%8B%9C&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizjpfM95OGAxUwQPUHHT1QDuIQ0pQJegQIDRAB&biw=1858&bih=993&dpr=1)

아무튼 이러한 일부 단어들 때문에 'O' 태그로 예측해야 하는 단어들까지 제품명 라벨로 인식하는 문제까지 발생하고 있었다.

![](https://velog.velcdn.com/images/dongho18/post/df91dea5-12bd-4dc0-b2e1-73d659e6d55b/image.png)

# 결론

이번 프로젝트에서는 이커머스 도메인에서 개체명 인식을 수행하는 모델을 개발하는 과정을 다루었다. 이를 통해 다음과 같은 결론을 도출할 수 있었다.

1. Dialog-KoELECTRA 모델은 문어체 기반의 KoELECTRA 모델보다 높은 성능을 보였다. 이는 특히 적은 양의 데이터로 학습할 때 더욱 두드러졌다.
2. 모델의 성능은 학습 데이터의 품질에 크게 좌우되었다. 특히 B-I-O 태깅의 정확도가 중요한데, 저품질 데이터는 모델의 혼동을 초래하고 성능 저하를 유발했다. 따라서, 고품질의 레이블링 데이터셋 확보가 중요하며, 이를 위해 데이터 전처리와 라벨링 과정에서의 엄격한 품질 관리가 필요하다.
3. 개체명 인식 모델을 실제 프로덕트에 적용한 결과, 추천 성능이 향상되었다.

향후 연구에서는 레이블링이 부정확하게 된 문장들을 제외 시킨 뒤에 다시 모델을 학습시켜볼 예정이다. 만약 이 과정에서 모델의 성능이 더 향상된다면, 데이터 라벨링 과정에서의 품질 관리가 모델 성능 향상에 큰 영향을 미친다는 것을 보다 명확히 입증할 수 있을 것이다.

# 참고 논문

1. Li, J., Sun, A., Han, J., & Li, C. (2020). A survey on deep learning for named entity recognition. IEEE Transactions on Knowledge and Data Engineering, 34(1), 50-70.
2. Nadeau, D., & Sekine, S. (2007). A survey of named entity recognition and classification. Lingvisticae Investigationes, 30(1), 3-26.
3. Ngo, Q. H., Kechadi, T., & Le-Khac, N. A. (2021). Domain specific entity recognition with semantic-based deep learning approach. IEEE Access, 9, 152892-152902.
4. Ishikawa, T., Yakoh, T., & Urushihara, H. (2022). An NLP-inspired data augmentation method for adverse event prediction using an imbalanced healthcare dataset. IEEE Access, 10, 81166-81176.
5. Zeng, X., Lin, S., & Liu, C. (2021). Multi-view deep learning framework for predicting patient expenditure in healthcare. IEEE Open Journal of the `Computer Society, 2, 62-71.
6. Abonizio, H. Q., Paraiso, E. C., & Barbon, S. (2021). Toward text data augmentation for sentiment analysis. IEEE Transactions on Artificial Intelligence, 3(5), 657-668.
7. Wei, J., & Zou, K. (2019). Eda: Easy data augmentation techniques for boosting performance on text classification tasks. arXiv preprint arXiv:1901.11196.
8. Cho, Gyeong Seon, and Kim, Sung Bum. (2022). Korean Named Entity Recognition Using Data Augmentation Techniques. Journal of the Korean Institute of Industrial Engineers, 48(2), 176-184.
9. Edunov, S., Ott, M., Auli, M., & Grangier, D. (2018). Understanding back-translation at scale. arXiv preprint arXiv:1808.09381.
10. Clark, K., Luong, M. T., Le, Q. V., & Manning, C. D. (2020). Electra: Pre-training text encoders as discriminators rather than generators. arXiv preprint arXiv:2003.10555.
