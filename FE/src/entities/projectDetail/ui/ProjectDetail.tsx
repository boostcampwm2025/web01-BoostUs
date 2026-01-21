// `src/features/project/ui/ProjectDetail.tsx`

'use client';

import Image from 'next/image';
import { fetchProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';
import { Github, ExternalLink, Users, Calendar, Pencil } from 'lucide-react';
import CloseButton from '@/shared/ui/CloseButton';
import { useParams } from 'next/navigation';
import { Participant, ProjectData } from '@/entities/projectDetail/model/types';
import { useEffect, useState } from 'react';
import paint from '@/assets/NoImage.png';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';
import Link from 'next/link';

interface Props {
  projectId: number;
  onEditClick?: () => void;
}

export default function ProjectDetail({ onEditClick }: Props) {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;

  const id = typeof rawId === 'string' ? Number(rawId) : NaN;
  const isValidId = Number.isFinite(id);

  const [data, setData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <h2 className="text-2xl font-bold">프로젝트 상세</h2>
        <CloseButton />
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative aspect-video max-h-[600px] w-full overflow-hidden rounded-md bg-gray-100">
          <Image
            src={data.thumbnailUrl ?? paint}
            alt={data.title}
            fill
            className="rounded-md object-cover"
            unoptimized
          />
        </div>

        <div className="mt-4 mb-2">
          <span className="mr-2 rounded-4xl bg-blue-600 px-3 py-1.5 text-sm text-white">
            {data.cohort}기
          </span>
        </div>

        <div>
          <h3 className="inline align-middle text-3xl font-bold">
            {data.title}
          </h3>
        </div>

        <p className="text-lg text-gray-600">{data.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-center text-gray-500">
          <Calendar size={20} />
          <span>
            {data.startDate} ~ {data.endDate}
          </span>
          <Users size={20} className={'ml-2'} />
          <span>{data.participants.length}명</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((stack) => (
            <span key={stack} className="rounded bg-gray-200 px-5 py-2 text-lg">
              {stack}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href={data.repoUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-xl border bg-black px-5 py-3 text-lg text-white hover:bg-gray-800"
            rel="noreferrer"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Github size={16} color={'white'} /> GitHub
          </a>
          <a
            href={data.demoUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-lg text-white hover:bg-blue-500"
            rel="noreferrer"
          >
            <ExternalLink size={16} /> 데모 보기
          </a>
        </div>

        <div className="mt-8 rounded-xl bg-blue-50 p-4">
          <h4 className="mb-4 text-lg font-bold text-gray-800">
            프로젝트 개요
          </h4>
          <MarkdownViewer content={data.contents} />
        </div>

        {/* 팀원 리스트 */}
        {data.participants && data.participants.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-6">
            <h4 className="mb-4 text-lg font-bold text-gray-800">팀원</h4>

            <div className="grid grid-cols-4 gap-4">
              {data.participants.map((participant: Participant) => (
                <div
                  key={participant.githubId}
                  className="group flex cursor-default flex-col items-center text-center"
                >
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 ring-2 ring-gray-100 transition-all duration-200 group-hover:ring-blue-500">
                    <span className="text-lg font-bold text-indigo-500 group-hover:text-blue-600">
                      {participant.githubId.charAt(0)}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-gray-700 transition-colors group-hover:text-blue-600">
                    {participant.githubId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            href={`/project/edit/${id}`}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <Pencil size={16} />
            수정하기
          </Link>
        </div>
      </div>
    </div>
  );
}
