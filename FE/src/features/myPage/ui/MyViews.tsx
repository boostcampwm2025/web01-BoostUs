import { HelpCircle } from 'lucide-react';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';

export default function MyViews() {
  // 모의 데이터 (막대 높이 %)
  const mockBars = [40, 65, 30, 80, 55, 90, 45];
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="w-full h-full bg-bold border border-neutral-border-default rounded-2xl p-6 shadow-default flex flex-col">
      {/* 헤더 영역 */}
      <div className="mb-6 flex items-center gap-1.5">
        <h3 className="text-display-20 text-neutral-text-strong">
          내 이야기 조회수
        </h3>
        <CustomTooltip
          content="최근 7일간의 조회수 통계입니다."
          contentClassName="bg-brand-surface-default text-brand-text-on-default"
          side="top"
        >
          <HelpCircle
            size={16}
            className="text-neutral-text-weak cursor-pointer transition-colors hover:text-neutral-text-strong duration-150"
          />
        </CustomTooltip>
      </div>

      {/* 그래프 영역 (Flex로 꽉 채우기) */}
      <div className="flex-1 flex flex-col justify-end">
        {/* 막대 그래프 컨테이너 */}
        <div className="w-full h-40 flex items-end justify-between gap-2 sm:gap-4">
          {mockBars.map((height, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            >
              {/* 호버 시 나오는 숫자 */}
              <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {height * 12}
              </span>

              {/* 막대 (Bar) */}
              <div
                className="w-full bg-neutral-100 rounded-t-lg relative overflow-hidden group-hover:bg-emerald-50 transition-colors duration-300"
                style={{ height: `${height.toString()}%` }}
              >
                {/* 막대 안의 채워진 부분 애니메이션 효과 (옵션) */}
                <div className="absolute bottom-0 left-0 w-full bg-emerald-500/80 h-0 group-hover:h-full transition-all duration-500 ease-out rounded-t-lg" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-emerald-500 opacity-20" />
              </div>

              {/* 요일 라벨 */}
              <span className="text-body-12 text-neutral-text-weak">
                {days[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
