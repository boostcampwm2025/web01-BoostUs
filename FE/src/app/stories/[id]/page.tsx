import { getStoryById, STORIES_KEY } from '@/features/stories/api/stories.api';
import StoryDetail from '@/features/stories/ui/StoryDetail/StoryDetail';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface Props {
  params: Promise<{ id: string }>;
}

const StoryDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: STORIES_KEY.detail(id),
    queryFn: () => getStoryById(id).then((res) => res.data),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryDetail storyId={id} />
    </HydrationBoundary>
  );
};

export default StoryDetailPage;
