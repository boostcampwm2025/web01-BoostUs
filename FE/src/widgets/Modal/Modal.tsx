'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    if (!isClient) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isClient]);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      className="z-100 fixed inset-0 flex justify-center items-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-neutral-surface-default shadow-lg mx-4 p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
