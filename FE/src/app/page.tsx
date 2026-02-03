import MainPageWidget from '@/widgets/Main/Main';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import {
  FEED_PARAMS,
  FEED_QUERY_KEY,
  fetchRecoStory,
  RECO_STORY_PARAMS,
  RECO_STORY_QUERY_KEY,
} from '@/features/main/reco/api/fetchRecoStory';
import {
  fetchRecoProject,
  RECO_PROJECT_QUERY_KEY,
} from '@/features/main/reco/api/fetchRecoProject';
import {
  fetchQnaMain,
  MAIN_QNA_KEY,
} from '@/features/main/qna/api/fetchQnaMain';

// ISR(1시간 캐싱) 적용: 1시간마다 페이지 재생성
export const revalidate = 3600;

const Home = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: RECO_STORY_QUERY_KEY,
    queryFn: () => fetchRecoStory(RECO_STORY_PARAMS),
  });

  await queryClient.prefetchQuery({
    queryKey: RECO_PROJECT_QUERY_KEY,
    queryFn: fetchRecoProject,
  });

  await queryClient.prefetchQuery({
    queryKey: FEED_QUERY_KEY,
    queryFn: () => fetchRecoStory(FEED_PARAMS),
  });

  await queryClient.prefetchQuery({
    queryKey: [MAIN_QNA_KEY, 'ALL'],
    queryFn: () => fetchQnaMain({ status: 'all', size: 3 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainPageWidget />
    </HydrationBoundary>
  );
};

export default Home;
