'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function CloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/project')}
      className="rounded px-3 py-1 hover:bg-gray-300"
    >
      <X size={24} />
    </button>
  );
}
