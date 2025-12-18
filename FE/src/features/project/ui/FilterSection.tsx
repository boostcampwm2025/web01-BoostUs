const FilterSection = () => {
  return (
    <section className="flex flex-col bg-white shadow mt-8 px-4 py-4 rounded-xl w-full h-32">
      <input
        type="text"
        placeholder="프로젝트 검색..."
        className="px-2 border border-gray-300 rounded-lg w-full h-12"
      />
    </section>
  );
};

export default FilterSection;
