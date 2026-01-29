'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function CloseButton() {
  const router = useRouter();

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/project');
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      className="rounded text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong transition-colors duration-150"
    >
      <X size={24} />
    </button>
  );
}
