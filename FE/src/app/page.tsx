import FeedSection from '@/features/mainpage/feed/FeedSection';
import RecommendedSection from '@/features/mainpage/recommendation/RecommendedSection';

const Home = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <RecommendedSection />
      <FeedSection />
    </div>
  );
};

export default Home;
