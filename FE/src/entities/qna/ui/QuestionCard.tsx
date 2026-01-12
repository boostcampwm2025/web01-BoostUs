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
  // Handle ISO date strings properly to avoid timezone issues
  const date = new Date(
    dateString.includes('T') ? dateString : dateString + 'T00:00:00Z'
  );
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface Props {
  data: Question;
}

export const QuestionCard = ({ data }: Props) => {
  return (
    <Link
      href={`/question/${data.id}`}
      className="block bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl overflow-hidden transition-all cursor-pointer"
    >
      <div className="flex">
        {/* 왼쪽: 통계 */}
        <div className="flex flex-col justify-center items-center gap-4 bg-gray-50 p-4 border-r border-r-gray-200 w-24 sm:w-32 shrink-0">
          <div className="text-center">
            <div className="font-bold text-gray-900 text-xl sm:text-2xl">
              {data.likeCount}
            </div>
            <div className="text-gray-500 text-xs">추천</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xl sm:text-2xl font-bold ${data.isResolved ? 'text-green-600' : 'text-gray-400'}`}
            >
              {data.answerCount}
            </div>
            <div className="text-gray-500 text-xs">답변</div>
          </div>
          <div className="hidden sm:block text-center">
            <div className="font-medium text-gray-600 text-lg">
              {data.viewCount}
            </div>
            <div className="text-gray-500 text-xs">조회</div>
          </div>
        </div>

        {/* 오른쪽: 내용 */}
        <div className="flex-1 p-4 sm:p-6 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <h2 className="flex flex-1 items-center gap-2 pr-2 min-w-0 font-semibold hover:text-[#005CFD] text-lg sm:text-xl transition-colors">
              <span className="truncate">{data.title}</span>
              {data.isResolved && (
                <Check className="w-5 h-5 text-green-600 shrink-0" />
              )}
            </h2>
          </div>

          <p className="mb-4 text-gray-600 text-sm sm:text-base line-clamp-2">
            {data.summary}
          </p>

          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
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

            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <img
                  src={data.user.avatarUrl}
                  alt={data.user.nickname}
                  className="rounded-full w-6 h-6"
                />
                <div>
                  <span className="mr-1 font-medium text-gray-700">
                    {data.user.nickname}
                  </span>
                  <span className="text-gray-400 text-xs">
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
