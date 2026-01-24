'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Circle, CircleCheck } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

// 1. Context for managing open state
interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
};

// 2. Root Component
export const Dropdown = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className={`relative ${className}`} ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// 3. Trigger Component
export const DropdownTrigger = ({ label }: { label: ReactNode }) => {
  const { isOpen, toggle } = useDropdown();

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-neutral-text-default hover:text-neutral-text-strong transition-colors duration-150 flex cursor-pointer flex-row items-center gap-1 whitespace-nowrap"
    >
      <span className="text-string-16">{label}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown strokeWidth={1} size={20} />
      </motion.div>
    </button>
  );
};

// 4. Content Component (Panel)
export const DropdownContent = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { isOpen } = useDropdown();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          layout
          initial={{ opacity: 0, scaleY: 0, y: -10 }}
          animate={{ opacity: 1, scaleY: 1, y: 0 }}
          exit={{ opacity: 0, scaleY: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`bg-neutral-surface-bold border border-neutral-border-default shadow-default absolute right-0 z-20 mt-2 flex origin-top flex-col overflow-hidden rounded-2xl ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 5. Item Component (Optional: for list style like in Questions)
interface DropdownItemProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}

export const DropdownItem = ({
  label,
  isSelected,
  onClick,
}: DropdownItemProps) => {
  const { close } = useDropdown();

  const handleClick = () => {
    onClick();
    close(); // 아이템 클릭 시 닫기
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-neutral-text-default hover:text-neutral-text-strong hover:bg-neutral-surface-strong w-full px-3 py-2 flex flex-row items-center justify-between cursor-pointer transition-colors duration-75"
    >
      <span
        className={`text-string-14 ${isSelected ? 'text-neutral-text-strong' : ''}`}
      >
        {label}
      </span>
      {isSelected ? (
        <CircleCheck strokeWidth={1.5} size={16} />
      ) : (
        <Circle strokeWidth={1.5} size={16} />
      )}
    </button>
  );
};
