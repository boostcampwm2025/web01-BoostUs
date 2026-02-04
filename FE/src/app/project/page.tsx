import ProjectMainBoard from '@/widgets/Project/ProjectMainBoard';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import {
  fetchProjects,
  PROJECT_KEYS,
} from '@/features/project/api/getProjects';
import { Suspense } from 'react';

export const revalidate = 3600;

export default async function ProjectPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: PROJECT_KEYS.all,
    queryFn: () => fetchProjects({ skipStore: true }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectMainBoard />
      </Suspense>
    </HydrationBoundary>
  );
}
