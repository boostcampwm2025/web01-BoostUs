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
export const dynamicParams = true;

/**
 * 정적 파라미터 생성: 빌드 시점에 최신 스토리 20개를 미리 HTML로 생성
 * 백엔드 API가 사용 불가능한 경우 (로컬 빌드 등) 빈 배열을 반환하여 동적 렌더링 사용
 */
export const generateStaticParams = async () => {
  // 백엔드 API URL이 설정되지 않은 경우 정적 생성 스킵
  if (!process.env.INTERNAL_API_URL) {
    console.warn(
      '[stories] INTERNAL_API_URL not set. Skipping static generation.'
    );
    return [];
  }

  try {
    const response = await fetchStories({ size: 20 }, { skipStore: true });
    console.log(
      `[stories] Generated ${response.data.items.length.toString()} static params`
    );
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
