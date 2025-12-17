interface QuickMenuCardProps {
  menuName: string;
  description: string;
}

const QuickMenuCard = ({ menuName, description }: QuickMenuCardProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white px-4 py-4 border border-gray-200 rounded-xl w-1/3">
      {/* TODO: 아이콘 추가 */}
      <span className="font-bold text-lg">{menuName}</span>
      <p className="text-gray-400 text-sm whitespace-pre-wrap">{description}</p>
    </div>
  );
};

export default QuickMenuCard;
