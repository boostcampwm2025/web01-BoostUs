const cohort = [
  '전체',
  '10기',
  '9기',
  '8기',
  '7기',
  '6기',
  '5기',
  '4기',
  '3기',
  '2기',
  '1기',
];

interface FieldOption {
  label: string;
  value: string;
}

const field: FieldOption[] = [
  { label: '전체', value: '' },
  { label: '웹 풀스택', value: 'WEB' },
  { label: 'iOS', value: 'IOS' },
  { label: 'Android', value: 'ANDROID' },
];

export { cohort, field };
