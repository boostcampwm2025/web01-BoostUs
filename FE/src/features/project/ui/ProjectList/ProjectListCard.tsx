import Image from 'next/image';
import paint from '../../../../../public/assets/paint.png';
import Link from 'next/link';
import TogglePill from '@/shared/ui/TogglePill';
import { Eye } from 'lucide-react';
import TechList from '@/features/project/ui/ProjectList/TechList';

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
      className="block h-full rounded-xl bg-white shadow"
      scroll={false}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow">
        <div className="relative w-full shrink-0">
          {' '}
          <Image
            src={paint}
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

        <div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-2">
          <span className="text-display-bold20 text-neutral-text-strong font-bold">
            {project.title}
          </span>
          <span className="text-body-regular14 text-neutral-text-weak line-clamp-2 pb-2">
            {project.description}
          </span>

          <div className="mt-auto flex flex-row justify-between gap-2">
            <div className="flex h-14 flex-row flex-wrap content-start gap-2 overflow-hidden">
              {project.techStack.map((tech) => (
                <TechList key={tech} title={tech} />
              ))}
            </div>
            <span className="text-neutral-text-weak flex shrink-0 flex-row items-center gap-1 self-end text-sm font-light">
              {project.views}
              {'  '}
              <Eye size={16} className="text-neutral-text-weak" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProjectListCard;
