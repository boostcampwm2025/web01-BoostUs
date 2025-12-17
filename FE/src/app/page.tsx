import FeedSection from "@/features/feed/FeedSection";
import RecommendedSection from "@/features/recommendation/RecommendedSection";

const Home = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <RecommendedSection />
      <FeedSection />
    </div>
  );
};

export default Home;
