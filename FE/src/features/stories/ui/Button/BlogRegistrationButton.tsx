'use client';

import CustomDialog from '@/shared/ui/Dialog/CustomDialog';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { forwardRef } from 'react';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';
import { useBlogRegistration } from '@/features/stories/model/useBlogRegistration';

interface LinkButtonProps extends HTMLMotionProps<'button'> {
  shouldHighlight?: boolean;
}

const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ shouldHighlight, ...props }, ref) => {
    return (
      <motion.button
        aria-label="내 블로그 등록하기"
        ref={ref}
        type="button"
        className={`relative cursor-pointer transition-colors duration-150 ${
          shouldHighlight
            ? 'text-brand-surface-default'
            : 'text-neutral-text-weak hover:text-brand-surface-default'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <LinkIcon />
      </motion.button>
    );
  }
);
LinkButton.displayName = 'LinkButton';

export const BlogRegistrationButton = () => {
  const router = useRouter();

  const { member, formState, status, messages, handlers } =
    useBlogRegistration();

  const { blogUrl, setBlogUrl, rssUrl } = formState;
  const { isLoading, isSubmitting, hasRssFeed, hasError } = status;
  const { serverError, successMessage, conversionError } = messages;

  const shouldHighlight = !member || (member && !hasRssFeed);

  // 1. 비로그인 상태
  if (!member) {
    return (
      <CustomTooltip
        content="로그인 후 블로그를 등록할 수 있어요"
        contentClassName="bg-brand-surface-default text-brand-text-on-default"
      >
        <LinkButton
          shouldHighlight={shouldHighlight}
          onClick={() => {
            const currentPath = window.location.pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          }}
        />
      </CustomTooltip>
    );
  }

  // 2. 로그인 + 캠퍼 인증 완료
  if (member.member.cohort) {
    return (
      <CustomDialog
        dialogTitle="내 블로그 등록하기"
        dialogDescription="내 블로그를 등록하면 캠퍼들의 이야기에 내 글을 게시할 수 있어요."
        dialogTrigger={
          <div className="inline-block">
            <CustomTooltip
              content={
                hasRssFeed
                  ? '내 블로그 등록하기'
                  : '블로그를 등록하고 내 글을 공유해보세요!'
              }
              contentClassName="bg-brand-surface-default text-brand-text-on-default"
            >
              <LinkButton shouldHighlight={shouldHighlight} />
            </CustomTooltip>
          </div>
        }
        dialogContent={
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="blog-url"
                className="text-string-16 text-neutral-text-default"
              >
                내 블로그 주소
              </label>
              <input
                id="blog-url"
                type="text"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                placeholder="https://myblog.tistory.com"
                className={`w-full rounded-lg border px-4 py-2 duration-150 transition-colors focus:outline-none ${
                  hasError
                    ? 'border-danger-border-default'
                    : 'focus:border-brand-surface-default'
                }`}
                disabled={isLoading || isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              {blogUrl && !conversionError && rssUrl && (
                <p className="text-body-12 text-neutral-text-weak">
                  내 블로그 RSS 주소: {rssUrl}
                </p>
              )}
              {conversionError && (
                <p className="text-string-12 text-danger-text-default">
                  {conversionError}
                </p>
              )}
              {serverError && (
                <p className="text-string-12 text-danger-text-default">
                  {serverError}
                </p>
              )}
              {successMessage && (
                <p className="text-string-12 text-success-surface-default">
                  {successMessage}
                </p>
              )}
            </div>
          </div>
        }
        onSubmit={handlers.handleSubmitRss}
      />
    );
  }

  // 3. 로그인 + 캠퍼 미인증
  return (
    <CustomTooltip
      content="블로그를 등록하고 내 글을 공유해보세요!"
      contentClassName="bg-brand-surface-default text-brand-text-on-default"
    >
      <LinkButton
        shouldHighlight={shouldHighlight}
        onClick={() => router.push('/login')}
      />
    </CustomTooltip>
  );
};
