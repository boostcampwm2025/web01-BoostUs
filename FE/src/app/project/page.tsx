import ProjectMainBoard from '@/widgets/Project/ProjectMainBoard';
import { Suspense } from 'react';

export default function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectMainBoard />
    </Suspense>
  );
}
