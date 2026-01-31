import RecommendedSection from '@/features/main/reco/RecommendedSection';
import FeedSection from '@/features/main/FeedSection';
import MainBelowSection from '@/features/main/MainBelowSection';

export default function MainPageWidget() {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <RecommendedSection />
      <FeedSection />
      <MainBelowSection />
    </div>
  );
}
