import FeedCard from "./FeedCard";
import FeedHeader from "./FeedHeader";

const FeedSection = () => {
  return (
    <>
      <FeedHeader />
      <section className="flex flex-row gap-4 mt-4 mb-8 w-full">
        <div className="flex flex-col gap-4 w-[25%]">
          <FeedCard feedType="blog" />
          <FeedCard feedType="notice" />
          <FeedCard feedType="bamboo" />
          <FeedCard feedType="project" />
        </div>
        <div className="flex flex-col gap-4 w-[25%]">
          <FeedCard feedType="qna" />
          <FeedCard feedType="bamboo" />
          <FeedCard feedType="project" />
          <FeedCard feedType="blog" />
        </div>
        <div className="flex flex-col gap-4 w-[25%]">
          <FeedCard feedType="bamboo" />
          <FeedCard feedType="qna" />
          <FeedCard feedType="blog" />
          <FeedCard feedType="project" />
        </div>
        <div className="flex flex-col gap-4 w-[25%]">
          <FeedCard feedType="project" />
          <FeedCard feedType="bamboo" />
          <FeedCard feedType="qna" />
          <FeedCard feedType="blog" />
        </div>
      </section>
    </>
  );
};

export default FeedSection;
