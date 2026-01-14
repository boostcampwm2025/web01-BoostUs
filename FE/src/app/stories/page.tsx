import { fetchStories } from '@/features/stories/api/stories.api';
import StoriesPageContent from '@/features/stories/ui/StoriesPageContent';

const StoriesPage = async () => {
  const response = await fetchStories();
  const initialStories = response.data.items;

  return <StoriesPageContent initialStories={initialStories} />;
};

export default StoriesPage;
