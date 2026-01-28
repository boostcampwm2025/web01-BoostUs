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
      className="flex flex-row items-center justify-center gap-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Image
        src={imageSrc}
        alt={`${subtitle} 소개 이미지`}
        width={486}
        height={254}
      />
      <div className="flex flex-col">
        <span className="text-display-16 text-brand-dark">{subtitle}</span>
        <h2 className="text-display-24 text-neutral-text-strong mt-1">
          {title}
        </h2>
        <p className="text-string-20 text-neutral-text-weak mt-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ImageCard;
