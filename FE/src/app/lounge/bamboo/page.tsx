import BambooCard from '@/features/bamboo/ui/BambooCard';

export default function Bamboo() {
  return (
    <>
      <div className="gap-4 grid grid-cols-3 mt-8">
        <BambooCard
          content="오늘 처음으로 배포 성공했어요! 떨리는 마음으로 해봤는데 에러 없이 잘
        돌아가네요 ㅠㅠ"
        />
        <BambooCard content="3일 동안 안 풀리던 버그를 드디어 해결했습니다... 원인은 오타였어요!!" />
        <BambooCard content="TS로 마이그레이션 시작했는데 생각보다 재밌네요. any 남발하지 않으려고 노력 중..." />
      </div>
    </>
  );
}
