'use client';
import { useState } from 'react';

import TogglePills from '@/features/project/ui/filter/TogglePills';
import Image from 'next/image';
import open from '@/assets/weui_arrow-outlined.svg';
import * as data from '@/features/project/ui/filter/data';

const FilterSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  return isOpen ? (
    <section className="mt-8 flex w-full flex-col rounded-xl bg-white px-4 py-4 shadow">
      <div className="mb-4 flex flex-col gap-2">
        <span className={'text-string-medium16'}>기수</span>
        <TogglePills sort={data.generations} />
      </div>
      <div className="mb-10 flex flex-col gap-2">
        <span className={'text-string-medium16 text-black'}>분야</span>
        <TogglePills sort={data.field} />
      </div>
      <div className="">
        <button
          className="text-neutral-text-weak text-string-medium16 flex flex-row items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <>
            필터 접기 <Image src={open} alt="open" />
          </>
        </button>
      </div>
    </section>
  ) : (
    <div className="flex flex-row items-center gap-2">
      <button
        className="text-neutral-text-weak text-string-medium16 mt-8 flex w-full flex-col flex-row items-center gap-2 rounded-xl bg-white px-4 py-4 shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <>
          필터 펼치기 <Image src={open} alt="open" />
        </>
      </button>
    </div>
  );
};

export default FilterSection;
