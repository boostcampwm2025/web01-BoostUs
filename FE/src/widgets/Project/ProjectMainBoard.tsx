import FilterSection from '@/features/project/ui/filter/FilterSection';
import ProjectListSection from '@/features/project/ui/ProjectList/ProjectListSection';
import PageHeader from '@/shared/ui/PageHeader';

export default function ProjectMainBoard() {
  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <PageHeader
        title="프로젝트 모아보기"
        subtitle="부스트캠프 웹·모바일 역대 프로젝트 아카이브"
      />
      <div className="flex flex-row gap-4">
        <FilterSection />
      </div>
      <ProjectListSection />
    </div>
  );
}
