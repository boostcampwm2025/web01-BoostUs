'use client';

import { useState } from 'react';

interface BambooCardProps {
  content: string;
}

const BambooCard = ({ content }: BambooCardProps) => {
  const [rotationAngle] = useState(() => Math.floor(Math.random() * 7) - 2);

  const cardStyle = {
    transform: `rotate(${rotationAngle.toString()}deg)`,
  };

  return (
    <div
      className="bg-amber-100 shadow-md px-6 py-8 rounded-xl w-full h-60"
      style={cardStyle}
    >
      <p className="mb-8">{content}</p>
      <span className="text-gray-400 text-sm">5분 전</span>
    </div>
  );
};

export default BambooCard;
