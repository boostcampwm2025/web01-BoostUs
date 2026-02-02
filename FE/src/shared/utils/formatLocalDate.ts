// 로컬 시간 기준 YYYY-MM-DD 변환 함수
const formatLocalDate = (date: Date | null): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year.toString()}-${month}-${day}`;
};

export default formatLocalDate;
