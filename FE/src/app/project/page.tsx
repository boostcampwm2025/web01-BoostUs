import FilterSection from '@/features/project/ui/filter/FilterSection';
import ProjectListSection from '@/features/project/ui/ProjectList/ProjectListSection';

const ProjectPage = () => {
  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <h1 className="text-3xl font-bold">프로젝트 모아보기</h1>
      <h2>부스트캠프 웹 ・ 모바일 역대 프로젝트 아카이브</h2>
      <FilterSection />
      <ProjectListSection />
    </div>
  );
};

export default ProjectPage;
