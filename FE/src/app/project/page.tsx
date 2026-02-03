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

export default async function ProjectPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: PROJECT_KEYS.all,
    queryFn: fetchProjects,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectMainBoard />
    </HydrationBoundary>
  );
}
