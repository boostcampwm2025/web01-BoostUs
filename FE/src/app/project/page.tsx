import ProjectMainBoard from '@/features/project/ui/ProjectMainBoard';
import { Suspense } from 'react';

export default function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectMainBoard />
    </Suspense>
  );
}
