import StoriesPageContent from '@/features/stories/ui/StoriesPageContent';
import { Suspense } from 'react';

const StoriesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoriesPageContent />
    </Suspense>
  );
};

export default StoriesPage;
