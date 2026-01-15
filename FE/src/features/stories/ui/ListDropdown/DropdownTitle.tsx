import { motion } from 'framer-motion';

const DropdownTitle = () => {
  return (
    <motion.div layout="position">
      <div className="border-neutral-border-default bg-neutral-surface-default w-full rounded-tl-2xl rounded-tr-2xl border-b px-3 py-2">
        <h3 className="text-string-16 text-neutral-text-strong">정렬</h3>
      </div>
    </motion.div>
  );
};

export default DropdownTitle;
