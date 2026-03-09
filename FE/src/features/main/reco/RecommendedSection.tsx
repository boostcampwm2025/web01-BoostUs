import RecommendedProjectSection from '@/features/main/reco/ui/RecoProjectSection';
import RecommendStorySection from '@/features/main/reco/ui/RecoStorySection';
import type { Project } from '@/features/project/api/getProjects';
import type { Story } from '@/features/stories/model/stories.type';

interface RecommendedSectionProps {
  recommendedProjects: Project[];
  recommendedStory: Story | null;
}

const RecommendedSection = ({
  recommendedProjects,
  recommendedStory,
}: RecommendedSectionProps) => {
  return (
    <>
      <h1 className="text-display-24 text-neutral-text-strong">오늘의 추천</h1>
      <section className="flex flex-row gap-8 mt-4 w-full h-130">
        <RecommendedProjectSection projects={recommendedProjects} />
        <div className="flex flex-col gap-4 w-[40%]">
          <RecommendStorySection story={recommendedStory} />
        </div>
      </section>
    </>
  );
};

export default RecommendedSection;
