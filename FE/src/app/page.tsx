import FeedSection from '@/features/main/FeedSection';
import RecommendedSection from '@/features/main/reco/RecommendedSection';

const Home = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <RecommendedSection />
      <FeedSection />
    </div>
  );
};

export default Home;
