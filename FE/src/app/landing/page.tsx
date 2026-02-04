import LandingPageContent from '@/features/landing/ui/LandingPageContent';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import {
  getLandingCount,
  LANDING_STATS_KEY,
} from '@/features/landing/api/landing.api';

export const revalidate = 3600;

const LandingPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: LANDING_STATS_KEY,
    queryFn: () => getLandingCount({ skipStore: true }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingPageContent />
    </HydrationBoundary>
  );
};

export default LandingPage;
