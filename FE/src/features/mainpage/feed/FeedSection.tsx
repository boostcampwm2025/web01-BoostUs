import FeedCard from '@/features/mainpage/feed/FeedCard';
import FeedHeader from '@/features/mainpage/feed/FeedHeader';

const FeedSection = () => {
  return (
    <>
      <FeedHeader />
      <section className="gap-4 columns-4 mt-4 mb-8 w-full">
        <FeedCard feedType="blog" />
        <FeedCard feedType="notice" />
        <FeedCard feedType="bamboo" />
        <FeedCard feedType="project" />
        <FeedCard feedType="qna" />
        <FeedCard feedType="bamboo" />
        <FeedCard feedType="project" />
        <FeedCard feedType="blog" />
        <FeedCard feedType="bamboo" />
        <FeedCard feedType="qna" />
        <FeedCard feedType="blog" />
        <FeedCard feedType="project" />
        <FeedCard feedType="project" />
        <FeedCard feedType="bamboo" />
        <FeedCard feedType="qna" />
        <FeedCard feedType="blog" />
      </section>
    </>
  );
};

export default FeedSection;
