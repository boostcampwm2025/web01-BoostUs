import RecommendedProjectSection from '@/features/main/reco/ui/RecoProjectSection';
import RecommendStorySection from '@/features/main/reco/ui/RecoStorySection';

const RecommendedSection = () => {
  return (
    <>
      <h1 className="text-display-24 text-neutral-text-strong">오늘의 추천</h1>
      <section className="mt-4 flex w-full flex-col gap-4 lg:h-130 lg:flex-row lg:gap-8">
        <div className="w-full lg:flex-1">
          <RecommendedProjectSection />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-[40%]">
          <RecommendStorySection />
        </div>
      </section>
    </>
  );
};

export default RecommendedSection;
