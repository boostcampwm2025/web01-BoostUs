'use client';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalOverlay from '@/shared/ui/ModalOverlay';
import ProjectDetail from '@/entities/projectDetail/ui/ProjectDetail';
import RegisterModalPage from '@/features/project/ui/register/RegisterModalPage';

export default function ProjectDetailModalPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <RegisterModalPage />;
  }

  return (
    <ModalOverlay closeOnOutsideClick={true}>
      <Suspense
        fallback={<div className="p-10 text-center">데이터 불러오는 중...</div>}
      >
        <ProjectDetail />
      </Suspense>
    </ModalOverlay>
  );
}
