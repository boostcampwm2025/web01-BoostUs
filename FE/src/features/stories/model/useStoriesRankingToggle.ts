'use client';

import { useState } from 'react';

export const useStoriesRankingToggle = () => {
  const [isRankingOpen, setIsRankingOpen] = useState<boolean>(true);
  const rankingToggle = () => setIsRankingOpen(!isRankingOpen);

  return { isRankingOpen, rankingToggle };
};
