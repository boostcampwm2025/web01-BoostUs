import { Calendar1 } from 'lucide-react';

const CardHeader = () => {
  return (
    <div className="w-full h-10 flex flex-row items-center px-4 bg-neutral-surface-strong rounded-t-2xl border-b border-neutral-border-default">
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="relative w-6 h-6 bg-accent-green rounded-full">
            {/* <Image
    src={question.member.avatarUrl}
    alt={`${question.member.nickname}'의 프로필 사진`}
    className="object-cover rounded-full"
    fill
  /> */}
          </div>
          <span className="text-string-16 text-neutral-text-default">June</span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <Calendar1
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">
            {'2026-01-06'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
