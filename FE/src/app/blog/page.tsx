import BlogListSection from '@/features/blog/BlogList/BlogListSection';

const BlogPage = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl font-sans">
      <h1 className="font-bold text-3xl">캠퍼들의 이야기</h1>
      <h2>부스트 캠프 캠퍼들이 전하는 기술 이야기들</h2>
      <BlogListSection />
    </div>
  );
};

export default BlogPage;
