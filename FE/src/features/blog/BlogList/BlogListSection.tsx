import { BlogMockList } from './BlogMock';
import BlogListCard from './BlogListCard';

const BlogListSection = () => {
  return (
    <section className="flex flex-col gap-4 mt-8 mb-20 w-full">
      <span className="text-black text-sm">
        총{' '}
        <span className="font-semibold text-blue-700 text-sm">
          {BlogMockList.length}
        </span>
        개의 블로그
      </span>
      <div className="gap-4 grid grid-cols-3 w-full">
        {BlogMockList.map((blog) => (
          <BlogListCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogListSection;
