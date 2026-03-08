'use client';

import { createContext, JSX, ReactNode, useContext, useState } from 'react';

export interface StoriesUIContextType {
  isRankingOpen: boolean;
  toggleRanking: () => void;
}

const StoriesUIContext = createContext<StoriesUIContextType | null>(null);

export const StoriesUIProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const toggleRanking = () => setIsRankingOpen((prev) => !prev);

  return (
    <StoriesUIContext.Provider value={{ isRankingOpen, toggleRanking }}>
      {children}
    </StoriesUIContext.Provider>
  );
};

export const useStoriesUIContext = (): StoriesUIContextType => {
  const context = useContext(StoriesUIContext);
  if (!context) {
    throw new Error(
      'useStoriesUIContext must be used within a StoriesUIProvider'
    );
  }
  return context;
};
