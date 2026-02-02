import Image from 'next/image';
import TogglePill from '@/shared/ui/TogglePill';
import { Eye } from 'lucide-react';
import TechList from '@/features/project/ui/ProjectList/TechList';
import paint from 'public/assets/NoImage.png';
import { Card } from '@/shared/ui/Card';

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
    viewCount: number;
  };
}

const ProjectListCard = ({ project }: ProjectCardProps) => {
  return (
    <Card.Root
      href={`/project/${project.id.toString()}`}
      scroll={false}
      className="flex flex-col"
    >
      <Card.ImageContainer className="shrink-0">
        <Image
          src={project.thumbnailUrl ?? paint}
          alt={project.title}
          className="aspect-video w-full object-cover"
          width={300}
          height={160}
          unoptimized
        />
        <div className="absolute top-3 right-3 z-10">
          <TogglePill
            title={project.cohort.toString() + '기'}
            isSelected={true}
          />
        </div>
      </Card.ImageContainer>

      <Card.Content className="flex-1 px-4 pt-4 pb-2 gap-2">
        <Card.Title>{project.title}</Card.Title>
        <Card.Description className="line-clamp-2 overflow-hidden text-ellipsis wrap-break-word">
          {project.description}
        </Card.Description>

        <Card.Footer className="justify-between">
          <div className="flex h-14 flex-row flex-wrap content-start gap-2 overflow-hidden">
            {project.techStack.map((tech) => (
              <TechList key={tech} title={tech} />
            ))}
          </div>
          <span className="text-neutral-text-weak flex shrink-0 flex-row items-center gap-1 self-end text-body-12 font-light">
            <Eye size={16} className="text-neutral-text-weak" strokeWidth={2} />
            {project.viewCount}
          </span>
        </Card.Footer>
      </Card.Content>
    </Card.Root>
  );
};

export default ProjectListCard;
