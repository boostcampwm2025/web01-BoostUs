import Image from "next/image";
import paint from "../../../../../public/assets/paint.png";

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
    <article className="bg-white shadow rounded-xl">
      <Image src={paint} alt={project.title} className="mb-4 rounded-tl-xl rounded-tr-xl" />
      <div className="flex flex-col gap-2 px-4 pb-2">
        <span className="font-bold text-xl">{project.title}</span>
        <span className="text-gray-600 text-md">{project.description}</span>
      </div>
    </article>
  );
};

export default ProjectListCard;
