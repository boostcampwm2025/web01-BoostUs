import Link from 'next/link';
import FilterSection from '@/features/project/ui/filter/FilterSection';
import ProjectListSection from '@/features/project/ui/ProjectList/ProjectListSection';

export default function ProjectMainBoard() {
  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <h1 className="text-3xl font-bold">프로젝트 모아보기</h1>
      <h2>부스트캠프 웹 ・ 모바일 역대 프로젝트 아카이브</h2>
      <div className="flex flex-row gap-4">
        <FilterSection />
        <Link
          href="/project/register"
          className="bg-accent-blue text-display-24 self-end rounded px-4 py-2 text-gray-50"
        >
          프로젝트 등록하기
        </Link>
      </div>
      <ProjectListSection />
    </div>
  );
}
