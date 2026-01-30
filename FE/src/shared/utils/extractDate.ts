type DateFormatType = 'relative' | 'absolute';

const extractDate = (
  dateTimeStr: string | undefined,
  formatType: DateFormatType = 'relative'
): string => {
  if (!dateTimeStr || dateTimeStr.length < 10) {
    return '';
  }

  // absolute 타입인 경우 YYYY-MM-DD만 반환
  if (formatType === 'absolute') {
    return dateTimeStr.slice(0, 10);
  }

  // relative 타입인 경우 기존 로직 수행
  const date = new Date(dateTimeStr);
  const now = new Date();

  // 시간차(밀리초) 계산
  const diffMS = now.getTime() - date.getTime();

  // 미래의 시간이 입력된 경우 처리 (선택 사항, 여기서는 방금으로 처리하거나 날짜 반환)
  if (diffMS < 0) {
    return dateTimeStr.slice(0, 10);
  }

  const diffSec = Math.floor(diffMS / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30); // 대략적인 한 달(30일) 기준
  const diffYear = Math.floor(diffDay / 365);

  // 1. 1년 이상인 경우 -> YYYY-MM-DD 반환
  if (diffYear >= 1) {
    return dateTimeStr.slice(0, 10);
  }

  // 2. 1개월 이상 1년 미만 -> n개월 전
  if (diffMonth >= 1) {
    return `${diffMonth.toString()}개월 전`;
  }

  // 3. 1일 이상 1개월 미만 -> n일 전
  if (diffDay >= 1) {
    return `${diffDay.toString()}일 전`;
  }

  // 4. 1시간 이상 1일 미만 -> n시간 전
  if (diffHour >= 1) {
    return `${diffHour.toString()}시간 전`;
  }

  // 5. 1분 이상 1시간 미만 -> n분 전
  if (diffMin >= 1) {
    return `${diffMin.toString()}분 전`;
  }

  // 6. 1분 미만 -> 방금
  return '방금';
};

export default extractDate;
