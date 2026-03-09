import MainPageWidget from '@/widgets/Main/Main';
import {
  FEED_PARAMS,
  fetchRecoStory,
  RECO_STORY_PARAMS,
} from '@/features/main/reco/api/fetchRecoStory';
import { fetchRecoProject } from '@/features/main/reco/api/fetchRecoProject';
import { fetchQnaMain } from '@/features/main/qna/api/fetchQnaMain';

export const revalidate = 3600;

const Home = async () => {
  const [
    recommendedStoryResponse,
    recommendedProjectResponse,
    feedResponse,
    qnaResponse,
  ] = await Promise.all([
    fetchRecoStory({
      ...RECO_STORY_PARAMS,
      skipStore: true,
      revalidateSeconds: revalidate,
    }),
    fetchRecoProject({ skipStore: true, revalidateSeconds: revalidate }),
    fetchRecoStory({
      ...FEED_PARAMS,
      skipStore: true,
      revalidateSeconds: revalidate,
    }),
    fetchQnaMain({
      status: 'all',
      size: 3,
      skipStore: true,
      revalidateSeconds: revalidate,
    }),
  ]);

  return (
    <MainPageWidget
      recommendedProjects={recommendedProjectResponse.data ?? []}
      recommendedStory={recommendedStoryResponse.data.items[0] ?? null}
      feedStories={feedResponse.data.items ?? []}
      initialQuestions={qnaResponse.data.items ?? []}
    />
  );
};

export default Home;
