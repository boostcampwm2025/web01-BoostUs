import { getStoryById } from '@/features/stories/api/stories.api';
import StoryDetail from '@/features/stories/ui/StoryDetail/StoryDetail';

interface Props {
  params: Promise<{ id: string }>;
}

const StoryDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const response = await getStoryById(id);
  const story = response.data;

  return <StoryDetail story={story} />;
};

export default StoryDetailPage;
