import RecommendedSection from '@/features/main/reco/RecommendedSection';
import FeedSection from '@/features/main/feed/FeedSection';
import MainBelowSection from '@/features/main/below/MainBelowSection';
import type { Project } from '@/features/project/api/getProjects';
import type { Question } from '@/features/questions/model/questions.type';
import type { Story } from '@/features/stories/model/stories.type';

interface MainPageWidgetProps {
  recommendedProjects: Project[];
  recommendedStory: Story | null;
  feedStories: Story[];
  initialQuestions: Question[];
}

export default function MainPageWidget({
  recommendedProjects,
  recommendedStory,
  feedStories,
  initialQuestions,
}: MainPageWidgetProps) {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <RecommendedSection
        recommendedProjects={recommendedProjects}
        recommendedStory={recommendedStory}
      />
      <FeedSection stories={feedStories} />
      <MainBelowSection initialQuestions={initialQuestions} />
    </div>
  );
}
