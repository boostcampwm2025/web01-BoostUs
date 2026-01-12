import Image from 'next/image';
import paint from '../../../../../public/assets/paint.png';
import Link from 'next/link';
import TogglePill from '@/shared/ui/TogglePill';
import { Eye } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: number;
    thumbnailUrl: string | null;
    title: string;
    description: string;
    cohort: number;
    techStack: string[];
    createdAt: string;
    updatedAt: string;
    views: number;
  };
}

const ProjectListCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/project/${project.id.toString()}`}
      className="rounded-xl bg-white shadow"
      scroll={false}
    >
      <article className="h-full overflow-hidden rounded-xl bg-white shadow">
        <div className="relative w-full">
          <Image
            src={paint} // 실제로는 project.thumbnailUrl ?? paint 처럼 처리 필요할 수 있음
            alt={project.title}
            className="w-full object-cover"
          />

          <div className="absolute top-2 right-4 z-10">
            <TogglePill
              title={project.cohort.toString() + '기'}
              isSelected={true}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 py-4">
          <span className="text-xl font-bold">{project.title}</span>
          <span className="text-md line-clamp-2 text-gray-600">
            {project.description}
          </span>
          <div className="flex flex-row items-center justify-end gap-2">
            <span className="flex flex-row items-center gap-1 text-sm font-light text-gray-500">
              {project.views} <Eye size={16} className="text-gray-500" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProjectListCard;
