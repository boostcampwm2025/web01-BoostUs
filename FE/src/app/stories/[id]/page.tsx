import {
  fetchStories,
  getStoryById,
  STORIES_KEY,
} from '@/features/stories/api/stories.api';
import StoryDetail from '@/features/stories/ui/StoryDetail/StoryDetail';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

/**
 * 정적 파라미터 생성: 빌드 시점에 최신 스토리 20개를 미리 HTML로 생성
 */
export const generateStaticParams = async () => {
  try {
    const response = await fetchStories({ size: 20 });
    return response.data.items.map((story) => ({
      id: story.id, // /stories/[id] 경로의 id 파라미터
    }));
  } catch (error) {
    console.error('Error generating static params for stories:', error);
    return [];
  }
};

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
