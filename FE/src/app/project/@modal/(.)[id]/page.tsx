import ProjectDetailModal from '@/widgets/Modal/ProjectDetailModal';

export default async function ProjectDetailModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = Number(resolvedParams.id);

  if (isNaN(projectId)) return null;

  return <ProjectDetailModal projectId={projectId} />;
}
