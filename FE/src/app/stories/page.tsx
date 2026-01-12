import StoriesHeader from '@/features/stories/ui/StoriesHeader';
import StoriesList from '@/features/stories/ui/StoriesList/StoriesList';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/StoriesRanking';
import StoriesSearchBar from '@/features/stories/ui/StoriesSearchBar/StoriesSearchBar';

const StoriesPage = () => {
  return (
    <div className="flex flex-col w-full font-sans max-w-7xl">
      <StoriesHeader />
      <div className="grid grid-cols-[7fr_3fr] gap-8 mt-8">
        <div className="flex flex-col w-full gap-8">
          <StoriesSearchBar />
          <StoriesList />
        </div>
        <StoriesRanking />
      </div>
    </div>
  );
};

export default StoriesPage;
