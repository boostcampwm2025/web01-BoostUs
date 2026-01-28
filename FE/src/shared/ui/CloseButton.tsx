'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function CloseButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/project')}
      className="rounded text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong transition-colors duration-150"
    >
      <X size={24} />
    </button>
  );
}
