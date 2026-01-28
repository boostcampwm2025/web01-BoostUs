'use client';

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { memberAtom } from '@/features/login/model/auth.store';
import { PenToolIcon } from '@/components/ui/pen-tool';
import { GithubIcon } from '@/components/ui/github';
import CheckCircleIcon from '@/components/ui/CheckCircleIcon';
import AlertCircleIcon from '@/components/ui/AlertCircleIcon';

// 폼 데이터 타입 정의
interface RssFormValues {
  rssUrl: string;
}

export default function MemberInfoMangeSections() {
  const member = useAtomValue(memberAtom);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RssFormValues>({
    defaultValues: {
      rssUrl: '',
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: RssFormValues) => {
    console.log('제출된 RSS URL:', data.rssUrl);
    // TODO: 여기서 API 호출하여 RSS URL 업데이트 로직 추가
    // await updateRssUrl(data.rssUrl);
  };

  if (!member) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 전체 카드 컨테이너 */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        {/* 프로필 섹션 */}
        <section className="flex flex-row gap-5 mb-8">
          {/* 아바타  */}
          <div className="flex-shrink-0">
            <div className="group relative w-24 h-24 rounded-full overflow-hidden border border-neutral-100 cursor-pointer">
              <Image
                src={member.avatarUrl ?? '/assets/NoImage.png'}
                alt="프로필 사진"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* 오버레이 */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-bold">수정</span>
              </div>
            </div>
          </div>

          {/* 우측 텍스트 정보 */}
          <div className="flex flex-col justify-center gap-2 flex-1">
            {/* 닉네임 + 수정 아이콘 */}
            <div className="flex flex-row items-center gap-2">
              <span className="text-xl font-bold text-neutral-900">
                {member.nickname}
              </span>
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <PenToolIcon size={16} />
              </button>
            </div>

            {/* 깃허브 배지 */}
            <div>
              <a
                href={`https://github.com/${member.nickname}`} // 깃허브 링크 예시
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                <GithubIcon size={14} className="fill-current" />
                <span>@{member.nickname ?? '깃허브ID'}</span>
              </a>
            </div>

            {/* 캠퍼 인증 배지 */}
            <div className="mt-1">
              {member.cohort ? (
                // 기수 정보가 있을 때 (인증 완료)
                <div className="flex items-center gap-1 text-blue-500 text-sm font-bold">
                  <CheckCircleIcon />
                  <span>캠퍼 인증 완료 ({member.cohort}기)</span>
                </div>
              ) : (
                // 기수 정보가 없을 때 (미인증)
                <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
                  <AlertCircleIcon /> {/* 회색 아이콘 */}
                  <span>캠퍼 인증 미완료</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/*<hr className="border-neutral-100 my-6" />*/}

        {/* 하단: RSS 관리 섹션 */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              블로그 RSS URL 관리
            </h3>
            <p className="text-sm text-neutral-500">
              블로그 RSS를 연동하면 새 글이 자동으로 공유돼요
            </p>
          </div>

          {/* react-hook-form 영역 */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <input
              {...register('rssUrl', {
                required: 'URL을 입력해주세요',
                pattern: {
                  value: /^(http|https):\/\/[^ "]+$/,
                  message: '올바른 URL 형식이 아닙니다.',
                },
              })}
              type="text"
              placeholder="https://example.com/rss"
              className="flex-1 border border-neutral-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-neutral-300"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg px-6 py-3 text-sm transition-colors whitespace-nowrap"
            >
              등록하기
            </button>
          </form>
          {errors.rssUrl && (
            <p className="text-red-500 text-xs mt-2 ml-1">
              {errors.rssUrl.message}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
