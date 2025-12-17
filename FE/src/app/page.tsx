import FeedSection from "@/features/mainpage/feed/FeedSection";
import QuickMenuSection from "@/features/mainpage/quickmenu/QuickMenuSection";
import RecommendedSection from "@/features/mainpage/recommendation/RecommendedSection";

const Home = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <RecommendedSection />
      <FeedSection />
      <QuickMenuSection />
    </div>
  );
};

export default Home;
