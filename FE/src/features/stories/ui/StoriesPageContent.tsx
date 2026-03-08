'use client';

import { StoriesProvider } from '@/features/stories/model';
import StoriesLayout from '@/features/stories/ui/StoriesLayout';

const StoriesPageContent = () => {
  return (
    <StoriesProvider>
      <StoriesLayout />
    </StoriesProvider>
  );
};

export default StoriesPageContent;
