import Image from 'next/image';
import paint from '../../../../../public/assets/paint.png';
import Link from 'next/link';

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
  };
}

const ProjectListCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/project/${project.id.toString()}`}
      className="rounded-xl bg-white shadow"
      scroll={false}
    >
      <article className="rounded-xl bg-white shadow">
        <Image
          src={paint}
          alt={project.title}
          className="mb-4 rounded-tl-xl rounded-tr-xl"
        />
        <div className="flex flex-col gap-2 px-4 pb-2">
          <span className="text-xl font-bold">{project.title}</span>
          <span className="text-md text-gray-600">{project.description}</span>
        </div>
      </article>
    </Link>
  );
};

export default ProjectListCard;
