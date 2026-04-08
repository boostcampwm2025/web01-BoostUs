import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="border-t border-neutral-border-default flex w-full flex-col items-center justify-center gap-4 bg-neutral-surface-default px-4 py-4 sm:h-20 sm:flex-row sm:gap-8">
      <Image
        src="/assets/Logo.svg"
        alt="boostus 로고"
        width={120}
        height={40}
        className="h-7 w-auto invert-48 sepia-4 saturate-324 hue-rotate-202 brightness-91 contrast-89"
      />
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <span className="text-body-12 text-neutral-text-weak break-keep">
          © 2026 boostus. All rights reserved.
        </span>
        <span className="text-body-12 text-neutral-text-weak break-keep">
          Made by Team{' '}
          <span className="text-brand-text-default text-body-12">
            Pole Position
          </span>{' '}
          with 💚
        </span>
      </div>
      <div className="flex flex-row gap-3">
        <Link
          href="https://github.com/boostcampwm2025/web01-BoostUs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            icon="mdi:github"
            className="w-8 h-8 cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong transition-colors duration-150"
          />
        </Link>
        <Link
          href="https://pole-position.notion.site/Pole-Position-2c3d4705e03f80f7bba0c5264dc7be36"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            icon="ri:notion-fill"
            className="w-8 h-8 cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong transition-colors duration-150"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
