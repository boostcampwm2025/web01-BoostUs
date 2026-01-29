// `src/features/project/ui/ProjectDetail.tsx`

'use client';

import Image from 'next/image';
import { fetchProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';
import { Github, ExternalLink, Users, Pencil, Calendar1 } from 'lucide-react';
import CloseButton from '@/shared/ui/CloseButton';
import { useParams } from 'next/navigation';
import { Participant, ProjectData } from '@/entities/projectDetail/model/types';
import { useEffect, useState } from 'react';
import paint from 'public/assets/NoImage.png';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';
import extractDate from '@/shared/utils/extractDate';

interface Props {
  projectId: number;
  onEditClick?: () => void;
}

import { useAuth } from '@/features/login/model/auth.store';

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;

  const id = typeof rawId === 'string' ? Number(rawId) : NaN;
  const isValidId = Number.isFinite(id);

  const [data, setData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { member } = useAuth();

  const isMember = data?.participants?.find(
    (m) => m.githubId === member?.member?.githubLogin
  )?.githubId;

  useEffect(() => {
    if (!isValidId) {
      setError('유효하지 않은 프로젝트 ID입니다.');
      return;
    }

    let alive = true;

    void (async () => {
      try {
        const response = await fetchProjectDetail({ id });
        if (!alive) return;
        setData(response.data);
        setError(null);
      } catch {
        if (!alive) return;
        setError('프로젝트 상세 조회 실패');
        setData(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, isValidId]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>로딩 중...</div>;

  const techStack = Array.isArray(data.techStack) ? data.techStack : [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-display-24">프로젝트 상세</h2>
        <CloseButton />
      </div>

      <div className="flex flex-col">
        <div className="relative aspect-video max-h-150 w-full overflow-hidden rounded-xl bg-neutral-surface-default border-neutral-border-default shadow-default">
          <Image
            src={data.thumbnailUrl ?? paint}
            alt={data.title}
            fill
            className="rounded-xl object-cover"
            unoptimized
          />
        </div>

        <div className="mt-8 mb-2">
          <span className="rounded-full bg-brand-surface-default px-3 h-8 w-fit flex items-center justify-center text-string-14 text-brand-text-on-default">
            {data.cohort}기
          </span>
        </div>

        <h3 className="text-display-20 text-neutral-text-strong mb-1">
          {data.title}
        </h3>

        <p className="text-string-16 text-neutral-text-weak mb-1">
          {data.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-center text-body-14 text-neutral-text-weak">
          <Calendar1 size={16} />
          <span>
            {extractDate(data.startDate)} ~ {extractDate(data.endDate)}
          </span>
          <Users size={16} className={'ml-2'} />
          <span>{data.participants.length}명</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {techStack.map((stack) => (
            <span
              key={stack}
              className="rounded-full bg-brand-surface-weak border border-neutral-border-default px-4 py-1 text-body-14 text-neutral-text-weak"
            >
              {stack}
            </span>
          ))}
        </div>

        <div className="mt-8 flex gap-2">
          <a
            href={data.repoUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-xl border bg-brand-surface-github px-4 py-3 text-brand-text-on-default text-string-16 hover:bg-brand-surface-github/90 transition-colors duration-150"
            rel="noreferrer"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Github size={16} color={'white'} /> GitHub Repository
          </a>
          <a
            href={data.demoUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-brand-surface-default px-4 py-3 text-brand-text-on-default text-string-16 hover:bg-brand-dark transition-colors duration-150"
            rel="noreferrer"
          >
            <ExternalLink size={16} /> 데모 보기
          </a>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-display-24 text-neutral-text-strong">
            프로젝트 개요
          </h2>
          <div className="p-4">
            <MarkdownViewer content={data.contents} />
          </div>
        </div>

        {/* 팀원 리스트 */}
        {data.participants && data.participants.length > 0 && (
          <div className="mt-4 border-t border-neutral-border-default pt-8">
            <h2 className="mb-8 text-display-24 text-neutral-text-strong">
              팀원
            </h2>

            <div className="grid grid-cols-5 gap-4">
              {data.participants.map((participant: Participant) => (
                <div
                  key={participant.githubId}
                  className="group flex cursor-default flex-col items-center text-center justify-center"
                >
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-surface-strong ring-2 ring-brand-light transition-all duration-200 group-hover:ring-brand-border-default">
                    <Image
                      className="rounded-full"
                      width="100"
                      height="100"
                      sizes="100px"
                      src={participant.avatarUrl ?? paint}
                      alt={participant.githubId}
                    />
                  </div>

                  <div className="text-body-12 text-neutral-text-default transition-colors">
                    {participant.githubId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isMember && (
          <div className="mt-8 flex justify-center">
            <a
              href={`/project/edit/${id.toString()}`}
              className="flex items-center gap-1 text-string-16 text-neutral-text-weak hover:text-neutral-text-strong transition-colors duration-150"
            >
              <Pencil size={16} />
              수정하기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
