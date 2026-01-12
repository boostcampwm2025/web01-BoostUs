import { Eye, Heart } from 'lucide-react';

const StoriesRankingCard = ({ hasBorder }: { hasBorder: boolean }) => {
  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-col px-2 py-2 ${
          hasBorder ? 'border-b border-neutral-border-default' : ''
        }`}
      >
        <h3 className="text-display-20 text-neutral-text-strong">
          부스트캠프 커뮤니티 서비스
        </h3>
        <p className="text-body-14 text-neutral-text-weak mt-0.5">
          글 내용 한 줄 요약이 들어가는 자리입니다.
        </p>
        <div className="flex flex-row items-center justify-end w-full mt-3 gap-4">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center gap-1">
              <Heart className="w-3 h-3 text-neutral-text-weak" />
              <span className="text-body-12 text-neutral-text-weak">123</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Eye className="w-3 h-3 text-neutral-text-weak" />
              <span className="text-body-12 text-neutral-text-weak">123</span>
            </div>
          </div>
          <span className="text-body-12 text-neutral-text-weak">
            2026-01-12
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoriesRankingCard;
