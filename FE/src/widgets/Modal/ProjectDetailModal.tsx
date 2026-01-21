'use client';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalOverlay from '@/shared/ui/ModalOverlay';
import ProjectDetail from '@/entities/projectDetail/ui/ProjectDetail';
import RegisterModalPage from '@/features/project/ui/register/RegisterModalPage';

interface Props {
  projectId: number;
}

export default function ProjectDetailModalPage({ projectId }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleCLose = () => {
    router.back();
  };

  if (isEditing) {
    return (
      <RegisterModalPage
        editProjectId={projectId}
        onClose={() => setIsEditing(false)} // 닫으면 다시 상세 화면으로
      />
    );
  }

  return (
    <ModalOverlay>
      <Suspense
        fallback={<div className="p-10 text-center">데이터 불러오는 중...</div>}
      >
        <ProjectDetail />
      </Suspense>
    </ModalOverlay>
  );
}
