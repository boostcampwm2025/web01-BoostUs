import paint from '../../../../public/assets/paint.png';
import Image from 'next/image';
import RecommendedProjectSection from '@/features/main/reco/ui/RecoProejctSection';
import RecommendStorySection from '@/features/main/reco/ui/RecoStorySection';

const RecommendedSection = () => {
  return (
    <>
      <h1 className="font-bold text-2xl">오늘의 추천</h1>
      <section className="flex flex-row gap-8 mt-4 w-full h-130">
        <RecommendedProjectSection />
        <div className="flex flex-col gap-4 w-[40%]">
          <RecommendStorySection />
        </div>
      </section>
    </>
  );
};

export default RecommendedSection;
