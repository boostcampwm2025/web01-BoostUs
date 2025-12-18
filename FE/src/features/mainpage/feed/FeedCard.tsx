import BambooCard from "./variation/BambooCard";
import BlogCard from "./variation/BlogCard";
import NoticeCard from "./variation/NoticeCard";
import ProjectCard from "./variation/ProjectCard";
import QnaCard from "./variation/QnaCard";

export type FeedType = "blog" | "notice" | "bamboo" | "project" | "qna";

interface FeedTypeProps {
  feedType: FeedType;
}

const FeedCard = ({ feedType }: FeedTypeProps) => {
  const commonClasses = "flex flex-col gap-2 shadow px-4 py-4 rounded-xl w-full h-fit break-inside-avoid mb-4";

  if (feedType === "blog") {
    return (
      <div className={`${commonClasses} bg-white`}>
        <BlogCard />
      </div>
    );
  }

  if (feedType === "notice") {
    return (
      <div className={`${commonClasses} bg-blue-600`}>
        <NoticeCard />
      </div>
    );
  }

  if (feedType === "bamboo") {
    return (
      <div className={`${commonClasses} bg-green-100`}>
        <BambooCard />
      </div>
    );
  }

  if (feedType === "project") {
    return (
      <div className={`${commonClasses} bg-white`}>
        <ProjectCard />
      </div>
    );
  }

  if (feedType === "qna") {
    return (
      <div className={`${commonClasses} bg-white`}>
        <QnaCard />
      </div>
    );
  }
};

export default FeedCard;
