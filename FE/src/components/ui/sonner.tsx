'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import React from 'react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group border-neutral-border-default bg-neutral-surface-bold shadow-hover"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-neutral-surface-bold group-[.toaster]:text-neutral-text-default group-[.toaster]:shadow-hover text-string-16 sonner-progress-bar',
          title: 'text-string-16 text-neutral-text-default font-sans',
          description:
            'group-[.toast]:text-neutral-text-weak text-body-14 font-sans',
          actionButton:
            'group-[.toast]:bg-brand-solid-default group-[.toast]:text-brand-text-inverse',
          cancelButton:
            'group-[.toast]:bg-neutral-surface-default group-[.toast]:text-neutral-text-default',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-brand-text-default" />,
        info: <InfoIcon className="size-4 text-neutral-text-default" />,
        warning: <TriangleAlertIcon className="size-4 text-orange-400" />,
        error: <OctagonXIcon className="size-4 text-danger-text-default" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-neutral-text-default" />
        ),
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
