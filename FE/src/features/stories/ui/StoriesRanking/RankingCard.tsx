import { Eye, Heart } from 'lucide-react';

const StoriesRankingCard = ({ hasBorder }: { hasBorder: boolean }) => {
  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-col px-3 py-2 ${
          hasBorder ? 'border-neutral-border-default border-b' : ''
        }`}
      >
        <h3 className="text-display-20 text-neutral-text-strong">
          부스트캠프 커뮤니티 서비스
        </h3>
        <p className="text-body-14 text-neutral-text-weak mt-0.5 line-clamp-1 w-full">
          글 내용 한 줄 요약이 들어가는 자리입니다.
        </p>
        <div className="mt-3 flex w-full flex-row items-center justify-end gap-2">
          <div className="flex flex-row items-center gap-1">
            <Heart className="text-neutral-text-weak h-3 w-3" />
            <span className="text-body-12 text-neutral-text-weak">123</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Eye className="text-neutral-text-weak h-3 w-3" />
            <span className="text-body-12 text-neutral-text-weak">123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesRankingCard;
