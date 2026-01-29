import { subDays, format } from 'date-fns';

// 지난 1년간의 랜덤 데이터를 생성하는 함수
export const generateMockData = () => {
  const data = [];
  const today = new Date();

  // 365일 전부터 오늘까지 루프
  for (let i = 365; i >= 0; i--) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');

    // 랜덤하게 활동 레벨 부여 (0: 없음, 1~4: 활동 많음)
    // 약 40% 확률로 활동이 있도록 설정
    const count = Math.random() > 0.6 ? Math.floor(Math.random() * 10) + 1 : 0;

    // level은 count에 따라 0~4 단계로 나뉨 (라이브러리 스펙)
    let level = 0;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 5) level = 2;
    else if (count <= 8) level = 3;
    else level = 4;

    data.push({
      date: dateString,
      count,
      level,
    });
  }
  return data;
};
