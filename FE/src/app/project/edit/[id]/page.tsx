'use client';

import { useParams } from 'next/navigation';
import ProjectForm from '@/widgets/ProjectRegister/ProjectForm';

export default function EditPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  if (isNaN(projectId)) {
    return <div>유효하지 않은 프로젝트 ID입니다.</div>;
  }

  // ID를 넘겨주면 "수정 모드"
  return <ProjectForm projectId={projectId} />;
}
