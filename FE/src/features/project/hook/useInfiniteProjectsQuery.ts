// import { useInfiniteQuery } from '@tanstack/react-query';
// import {
//   fetchProjects,
//   type SortOrder,
//   type ProjectsResponse,
// } from '@/features/project/api/projects';
//
// export function useInfiniteProjectsQuery(params: {
//   field: string;
//   cohort: string;
//   sortOrder: SortOrder;
// }) {
//   return useInfiniteQuery<
//     ProjectsResponse, // TQueryFnData
//     Error, // TError
//     ProjectsResponse, // TData
//     readonly [
//       'projects',
//       { field: string; cohort: string; sortOrder: SortOrder },
//     ], // TQueryKey
//     number | null
//   >({
//     queryKey: ['projects', params] as const,
//     initialPageParam: null,
//     queryFn: ({ pageParam }) =>
//       fetchProjects({
//         field: params.field,
//         cohort: params.cohort,
//         sortOrder: params.sortOrder,
//         cursor: pageParam,
//       }),
//     getNextPageParam: (lastPage) => lastPage.nextCursor,
//     staleTime: 30_000,
//     gcTime: 5 * 60_000,
//   });
// }
