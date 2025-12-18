import Link from 'next/link';
import { Check, Tag } from 'lucide-react';
import { Question } from '../model/types';

// 태그 색상 로직
const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface Props {
  data: Question;
}

export const QuestionCard = ({ data }: Props) => {
  return (
    <Link
      href={`/question/${data.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      <div className="flex">
        {/* 왼쪽: 통계 */}
        <div className="w-24 sm:w-32 bg-gray-50 p-4 flex flex-col items-center justify-center gap-4 border-r border-r-gray-200 shrink-0">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {data.likeCount}
            </div>
            <div className="text-xs text-gray-500">추천</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xl sm:text-2xl font-bold ${data.isResolved ? 'text-green-600' : 'text-gray-400'}`}
            >
              {data.answerCount}
            </div>
            <div className="text-xs text-gray-500">답변</div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-lg font-medium text-gray-600">
              {data.viewCount}
            </div>
            <div className="text-xs text-gray-500">조회</div>
          </div>
        </div>

        {/* 오른쪽: 내용 */}
        <div className="flex-1 p-4 sm:p-6 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-semibold hover:text-[#005CFD] transition-colors flex-1 flex items-center gap-2 pr-2 min-w-0">
              <span className="truncate">{data.title}</span>
              {data.isResolved && (
                <Check className="w-5 h-5 text-green-600 shrink-0" />
              )}
            </h2>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
            {data.summary}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map((tag, i) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tagColors[i % tagColors.length]}`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img
                  src={data.user.avatarUrl}
                  alt={data.user.nickname}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <span className="font-medium text-gray-700 mr-1">
                    {data.user.nickname}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({data.user.cohort}pt)
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">
                {formatDate(data.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
