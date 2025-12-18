import Image from 'next/image';

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    contents: string;
    likeCount: number;
    viewCount: number;
    readingTime: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      nickname: string;
      cohort: number;
      avatarUrl: string | null;
    };
  };
}

const BlogListCard = ({ blog }: BlogCardProps) => {
  return (
    <article className="bg-white shadow rounded-xl">
      <Image
        src=""
        alt={blog.title}
        className="mb-4 rounded-tl-xl rounded-tr-xl"
      />
      <div className="text-xl px-4 pb-2">{blog.user.nickname}</div>
      <div className="flex flex-col gap-2 px-4 pb-2">
        <span className="font-bold text-xl">{blog.title}</span>
        <span className="text-gray-600 text-md">요약</span>
        <span className="text-gray-600 text-md">기술스택</span>
      </div>
      <div className="flex">
        <span className="px-4 pb-2">조회수 {blog.viewCount}</span>
        <span className="px-4 pb-2">좋아요 {blog.likeCount}</span>
      </div>
    </article>
  );
};

export default BlogListCard;
