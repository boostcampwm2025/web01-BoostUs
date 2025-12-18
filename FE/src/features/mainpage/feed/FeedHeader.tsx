const FeedHeader = () => {
  return (
    <div className="flex flex-row justify-between items-center mt-8">
      <h1 className="font-bold text-2xl">피드</h1>
      <div className="flex gap-2">
        <label>
          <input type="radio" name="" />
          최신순
        </label>
        <label>
          <input type="radio" name="" />
          인기순
        </label>
      </div>
    </div>
  );
};

export default FeedHeader;
