import { Suspense } from 'react';
import ModalOverlay from '@/shared/ui/ModalOverlay';
import ProjectDetail from '@/entities/projectDetail/ui/ProjectDetail';

export default function ProjectDetailModalPage() {
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
