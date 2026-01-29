import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageCardProps {
  imageSrc: string;
  subtitle: string;
  title: string;
  description: string;
}

const ImageCard = ({
  imageSrc,
  subtitle,
  title,
  description,
}: ImageCardProps) => {
  return (
    <motion.div
      className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-full max-w-121.5 aspect-486/254">
        <Image
          src={imageSrc}
          alt={`${subtitle} 소개 이미지`}
          fill
          className="object-contain" // 이미지 비율 유지
          sizes="(max-width: 768px) 100vw, 486px"
        />
      </div>
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
        <span className="text-display-16 text-brand-dark">{subtitle}</span>
        <h2 className="text-display-24 text-neutral-text-strong mt-1">
          {title}
        </h2>
        <p className="text-string-20 text-neutral-text-weak mt-2 break-keep lg:px-0 px-8">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ImageCard;
