import StoriesHeader from '@/features/stories/ui/StoriesHeader';
import StoriesSearchBar from '@/features/stories/ui/StoriesSearchBar/StoriesSearchBar';

const StoriesPage = () => {
  return (
    <div className="flex flex-col w-full font-sans max-w-7xl">
      <StoriesHeader />
      <StoriesSearchBar />
    </div>
  );
};

export default StoriesPage;
