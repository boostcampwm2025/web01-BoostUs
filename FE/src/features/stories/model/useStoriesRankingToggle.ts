'use client';

import { useState } from 'react';

export const useStoriesRankingToggle = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const rankingToggle = () => setIsOpen(!isOpen);

  return { isOpen, rankingToggle };
};
