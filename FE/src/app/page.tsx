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

export const revalidate = 3600;

const Home = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: RECO_STORY_QUERY_KEY,
      queryFn: () => fetchRecoStory({ ...RECO_STORY_PARAMS, skipStore: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: RECO_PROJECT_QUERY_KEY,
      queryFn: () => fetchRecoProject({ skipStore: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: FEED_QUERY_KEY,
      queryFn: () => fetchRecoStory({ ...FEED_PARAMS, skipStore: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: [MAIN_QNA_KEY, 'ALL'],
      queryFn: () => fetchQnaMain({ status: 'all', size: 3 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainPageWidget />
    </HydrationBoundary>
  );
};

export default Home;
