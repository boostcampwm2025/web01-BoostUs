'use client';

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { memberAtom } from '@/features/login/model/auth.store';
import { PenToolIcon } from '@/components/ui/pen-tool';
import { GithubIcon } from '@/components/ui/github';
import CheckCircleIcon from '@/components/ui/CheckCircleIcon';
import AlertCircleIcon from '@/components/ui/AlertCircleIcon';
import { useAuth } from '@/features/login/model/auth.store';
import { UsersIcon } from '@/components/ui/users';
import { FolderGit2Icon } from '@/components/ui/folder-git-2';
import { useState } from 'react';

import { createOrUpdateFeed } from '@/features/feed/api/feed.api';
import {
  convertBlogUrlToRss,
  detectPlatformFromBlogUrl,
} from '@/features/feed/utils/blog-rss-converter';
import { CheckIcon } from '@/components/ui/check';
import { updateNickname } from '@/features/myPage/api/updateNickname';
import { toast } from 'sonner';

// 폼 데이터 타입 정의
interface RssFormValues {
  blogUrl: string | null;
}

export default function MemberInfoMangeSections() {
  const [authState, setAuthState] = useAtom(memberAtom);
  const member = authState?.member;
  const latestProject = authState?.latestProject;
  const feed = authState?.feed;
  const { logout } = useAuth();

  // 피드백 메세지
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 닉네임 수정 상태
  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);

  // 닉네임 수정 버튼 클릭 핸들러
  const handleNicknameAction = async () => {
    if (isEditingNickname) {
      // 입력값이 없거나 공백만 있으면 리턴
      const safeInput = nicknameInput ?? '';

      if (!safeInput.trim()) {
        toast.error('닉네임을 입력해주세요.');
        return;
      }

      try {
        await updateNickname(safeInput);

        setAuthState((prev) => {
          if (!prev?.member) return prev; // 예외 처리

          return {
            ...prev, // 기존 상태 유지
            member: {
              ...prev.member, // 기존 멤버 정보 유지
              nickname: safeInput, // 닉네임만 새 값으로 덮어쓰기
            },
          };
        });

        setIsEditingNickname(false);
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e?.message || '닉네임 수정에 실패했습니다.');
        }
      }
    } else {
      //  수정 모드 진입
      setNicknameInput(member?.nickname ?? '');
      setIsEditingNickname(true);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    await logout();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // 로딩 상태
  } = useForm<RssFormValues>({
    defaultValues: {
      blogUrl: feed?.feedUrl ?? '', // 기존 값이 있으면 보여줌
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: RssFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const inputUrl = (data.blogUrl ?? '').trim();

    // 1. 플랫폼 감지 및 RSS 변환 로직
    let finalRssUrl = inputUrl;
    const autoPlatform = detectPlatformFromBlogUrl(inputUrl);

    if (autoPlatform && autoPlatform !== 'custom') {
      try {
        finalRssUrl = convertBlogUrlToRss(autoPlatform, inputUrl);
      } catch (error) {
        setServerError('URL 변환에 실패했습니다. 올바른 블로그 주소인가요?');
        return;
      }
    }

    // 2. API 호출
    try {
      await createOrUpdateFeed({ feedUrl: finalRssUrl });

      // 성공 처리
      if (finalRssUrl !== inputUrl) {
        setSuccessMessage(`RSS로 자동 변환되어 등록되었어요! (${finalRssUrl})`);
      } else {
        setSuccessMessage('블로그 주소(RSS)가 성공적으로 등록되었어요.');
      }
    } catch (error) {
      setServerError('등록에 실패했습니다. 다시 시도해 주세요.');
      console.error(error);
    }
  };

  if (!member) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 전체 카드 컨테이너 */}
      <div className="bg-neutral-surface-bold border border-neutral-border-default rounded-2xl p-6 shadow-default">
        {/* 프로필 섹션 */}
        <section className="flex flex-row gap-5 mb-5">
          {/* 아바타  */}
          <div className="shrink-0">
            <div className="group relative w-24 h-24 rounded-full overflow-hidden border border-neutral-border-default cursor-pointer">
              <Image
                src={member.avatarUrl ?? '/assets/NoImage.png'}
                alt="프로필 사진"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* 오버레이 */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-brand-text-on-default text-display-20">
                  수정
                </span>
              </div>
            </div>
          </div>

          {/* 우측 텍스트 정보 */}
          <div className="flex flex-col justify-center gap-2 flex-1">
            {/* 닉네임 + 수정 아이콘 */}
            <div className="flex flex-row items-center gap-2">
              {!isEditingNickname ? (
                <span className="text-display-20 text-neutral-text-strong">
                  {member.nickname}
                </span>
              ) : (
                <input
                  type="text"
                  value={nicknameInput ?? ''}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // 엔터 입력 시 불필요한 새로고침이나 폼 제출 방지
                      handleNicknameAction(); // 저장 함수 실행
                    }
                  }}
                  className="text-display-20 text-neutral-text-strong border-b border-neutral-border-default
             focus:outline-none focus:border-brand-border-default transition-colors bg-transparent
             p-0 w-30"
                />
              )}
              <button
                type="button"
                className="text-neutral-text-weak hover:text-neutral-text-strong cursor-pointer transition-colors duration-150"
                onClick={handleNicknameAction}
              >
                {isEditingNickname ? (
                  <CheckIcon size={16} />
                ) : (
                  <PenToolIcon size={16} />
                )}
              </button>
            </div>

            {/* 깃허브 배지 */}
            <div>
              <a
                href={`https://github.com/${member.githubLogin ?? '깃허브ID'}`} // 깃허브 링크 예시
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                <GithubIcon size={14} className="fill-current" />
                <span>@ {member.githubLogin ?? '깃허브ID'}</span>
              </a>
            </div>

            {/* 캠퍼 인증 배지 */}
            <div className="mt-1">
              {member.cohort ? (
                // 기수 정보가 있을 때 (인증 완료)
                <div className="flex items-center gap-1 text-blue-500 text-string-14">
                  <CheckCircleIcon />
                  <span>캠퍼 인증 완료 ({member.cohort}기)</span>
                </div>
              ) : (
                // 기수 정보가 없을 때 (미인증)
                <div className="flex items-center gap-1 text-danger-text-default text-string-14">
                  <AlertCircleIcon /> {/* 회색 아이콘 */}
                  <span>캠퍼 인증 미완료</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/*<hr className="border-neutral-100 my-6" />*/}
        <div className={'flex flex-col gap-2 mb-5'}>
          <div className="flex flex-row items-center gap-2">
            <UsersIcon size={20} />
            <span className={'text-string-16 text-neutral-text-strong'}>
              현재 소속된 팀
            </span>
            <span className={'text-neutral-text-default text-body-16'}>
              {latestProject?.teamName ?? '없음'}
            </span>
          </div>
          <div className={'flex flex-row items-center gap-2'}>
            <FolderGit2Icon size={20} />
            <p className={'text-string-16 text-neutral-text-strong'}>
              내 프로젝트
            </p>
            <span className={'text-neutral-text-default text-body-16'}>
              {latestProject?.title ?? '없음'}
            </span>
          </div>
        </div>

        {/* RSS 관리 섹션 */}
        <section>
          <div className="mb-4">
            <h3 className="text-display-20 text-neutral-text-strong mb-1">
              블로그 주소 관리
            </h3>
            <p className="text-body-14 text-neutral-text-weak">
              블로그 주소를 입력하면 자동으로 RSS를 찾아 등록해요.
            </p>
          </div>

          {/* react-hook-form 영역 */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <input
              {...register('blogUrl', {
                required: '블로그 주소를 입력해주세요',
                pattern: {
                  value: /^(http|https):\/\/[^ "]+$/,
                  message: '올바른 URL 형식이 아닙니다.',
                },
              })}
              type="text"
              disabled={isSubmitting} // 제출 중엔 비활성화
              placeholder="https://velog.io/@id 또는 티스토리 주소"
              className="flex-1 border border-neutral-border-default rounded-lg px-4 py-2 text-body-14 focus:outline-none focus:border-brand-border-default transition-colors placeholder:text-neutral-text-weak disabled:bg-neutral-50"
            />
            <button
              type="submit"
              disabled={isSubmitting} // 제출 중엔 비활성화
              className={`bg-brand-surface-default text-brand-text-on-default text-string-16 rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-brand-surface-strong'
              }`}
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </form>

          {/* 메시지 피드백 영역 */}
          <div className="mt-2 min-h-2.5">
            {/* 1. 폼 유효성 에러 */}
            {errors.blogUrl && (
              <p className="text-danger-text-default text-string-12 ml-1">
                {errors.blogUrl.message}
              </p>
            )}
            {/* 2. 서버/로직 에러 */}
            {!errors.blogUrl && serverError && (
              <p className="text-danger-text-default text-string-12 ml-1">
                {serverError}
              </p>
            )}
            {/* 3. 성공 메시지 */}
            {!errors.blogUrl && !serverError && successMessage && (
              <p className="text-brand-text-default text-string-12 ml-1">
                {successMessage}
              </p>
            )}
          </div>
        </section>

        <div className="flex justify-end mr-2">
          <button
            onClick={handleLogout}
            className="text-string-16 text-neutral-text-weak hover:text-neutral-text-strong cursor-pointer duration-150 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
