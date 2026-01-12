import Image from 'next/image';
import { fetchMockProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';
import { Github, ExternalLink, Users, Calendar } from 'lucide-react';
import { white } from 'next/dist/lib/picocolors';

export default async function ProjectDetail() {
  const response = await fetchMockProjectDetail();
  const data = response.data;

  return (
    <div className="flex flex-col gap-2">
      {/* 썸네일 */}
      <div className="relative w-full aspect-video max-h-[600px] overflow-hidden rounded-md bg-gray-100">
        <Image
          // Todo: data.thumbnailUrl은 없어서 이후에 지정되면 넣기
          src={'/assets/paint.png'}
          alt={data.title}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* cohort */}
      <div className="mt-4 mb-2">
        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-4xl text-sm mr-2">
          {data.cohort}기
        </span>
      </div>

      {/* title */}
      <div>
        <h3 className="text-3xl font-bold inline align-middle">{data.title}</h3>
      </div>

      <p className="text-gray-600 text-lg">{data.description}</p>

      {/* 날짜, 인원 */}
      <div className="flex flex-wrap items-center gap-2 mt-4 text-center text-gray-500">
        <Calendar size={20} />
        <span>
          {data.startDate} ~ {data.endDate}
        </span>
        <Users size={20} className={'ml-2'} />
        <span>{data.members.length}명</span>
      </div>

      {/* 스택 그룹 */}
      <div className="flex flex-wrap gap-2 mt-4">
        {data.stacks.map((stack) => (
          <span key={stack} className="px-5 py-2 bg-gray-200 rounded text-lg">
            {stack}
          </span>
        ))}
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-2 mt-4">
        <a
          href={data.repositoryUrl}
          target="_blank"
          className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-800 text-white bg-black text-lg"
        >
          <Github size={16} color={'white'} /> GitHub
        </a>
        <a
          href={data.demoUrl}
          target="_blank"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-500 text-lg"
        >
          <ExternalLink size={16} /> 데모 보기
        </a>
      </div>

      {/* 프로젝트 개요 */}
      <div className="mt-8 bg-blue-50 p-4 rounded-xl">
        <h4 className="text-lg font-bold mb-4 text-gray-800">프로젝트 개요</h4>
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: data.contents }}
        />
      </div>
      {/* 팀원 리스트*/}
      {data.members && data.members.length > 0 && (
        <div className="mt-4 pt-6 border-t border-gray-100">
          <h4 className="text-lg font-bold mb-4 text-gray-800">팀원</h4>

          <div className="grid grid-cols-4 gap-4">
            {data.members.map(
              (member: { id: number; nickname: string; avatarUrl: string }) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center text-center group cursor-default"
                >
                  {/* 아바타 영역*/}
                  <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-2 ring-2 ring-gray-100 group-hover:ring-blue-500 transition-all duration-200">
                    <span className="text-lg font-bold text-indigo-500 group-hover:text-blue-600">
                      {member.nickname.charAt(0)}
                    </span>
                  </div>

                  {/* 이름 영역 */}
                  <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {member.nickname}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
