'use client';

import Image from 'next/image';
import { fetchMockProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';
import { Github, ExternalLink, Users, Calendar, X } from 'lucide-react';
import CloseButton from '@/shared/ui/CloseButton';
import { useParams } from 'next/navigation';
import { participant, ProjectData } from '@/entities/projectDetail/model/types';
import { useEffect, useState } from 'react';

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;

  const id = typeof rawId === 'string' ? Number(rawId) : NaN;
  const isValidId = Number.isFinite(id);

  const [data, setData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        const response = await fetchMockProjectDetail({ id });
        if (!alive) return;
        setData(response.data);
        setError(null);
        console.log(response.data);
      } catch {
        if (!alive) return;
        setError('프로젝트 상세 조회 실패');
        setData(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">프로젝트 상세</h2>
        <CloseButton />
      </div>

      <div className="flex flex-col gap-2">
        {/* 썸네일 */}
        <div className="relative aspect-video max-h-[600px] w-full overflow-hidden rounded-md bg-gray-100">
          <Image
            // Todo: data.thumbnailUrl은 없어서 이후에 지정되면 넣기
            src={'/assets/paint.png'}
            alt={data.title}
            fill
            className="rounded-md object-cover"
          />
        </div>

        {/* cohort */}
        <div className="mt-4 mb-2">
          <span className="mr-2 rounded-4xl bg-blue-600 px-3 py-1.5 text-sm text-white">
            {data.cohort}기
          </span>
        </div>

        {/* title */}
        <div>
          <h3 className="inline align-middle text-3xl font-bold">
            {data.title}
          </h3>
        </div>

        <p className="text-lg text-gray-600">{data.description}</p>

        {/* 날짜, 인원 */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-center text-gray-500">
          <Calendar size={20} />
          <span>
            {data.startDate} ~ {data.endDate}
          </span>
          <Users size={20} className={'ml-2'} />
          <span>{data.participants.length}명</span>
        </div>

        {/* 스택 그룹 */}
        {/*<div className="mt-4 flex flex-wrap gap-2">*/}
        {/*  {data.techStacks.map((stack) => (*/}
        {/*    <span key={stack} className="rounded bg-gray-200 px-5 py-2 text-lg">*/}
        {/*      {stack}*/}
        {/*    </span>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/* 버튼 그룹 */}
        <div className="mt-4 flex gap-2">
          <a
            href={data.repositoryUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-xl border bg-black px-5 py-3 text-lg text-white hover:bg-gray-800"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Github size={16} color={'white'} /> GitHub
          </a>
          <a
            href={data.demoUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-lg text-white hover:bg-blue-500"
          >
            <ExternalLink size={16} /> 데모 보기
          </a>
        </div>

        {/* 프로젝트 개요 */}
        <div className="mt-8 rounded-xl bg-blue-50 p-4">
          <h4 className="mb-4 text-lg font-bold text-gray-800">
            프로젝트 개요
          </h4>
          <div
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: data.contents }}
          />
        </div>
        {/* 팀원 리스트*/}
        {}
        {data.participants && data.participants.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-6">
            <h4 className="mb-4 text-lg font-bold text-gray-800">팀원</h4>

            <div className="grid grid-cols-4 gap-4">
              {data.participants.map((participant: participant) => (
                <div
                  key={participant.githubId}
                  className="group flex cursor-default flex-col items-center text-center"
                >
                  {/* 아바타 영역*/}
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 ring-2 ring-gray-100 transition-all duration-200 group-hover:ring-blue-500">
                    <span className="text-lg font-bold text-indigo-500 group-hover:text-blue-600">
                      {participant.githubId.charAt(0)}
                    </span>
                  </div>

                  {/* 이름 영역 */}
                  <div className="text-xs font-medium text-gray-700 transition-colors group-hover:text-blue-600">
                    {participant.githubId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
