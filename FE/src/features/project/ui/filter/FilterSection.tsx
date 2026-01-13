'use client';
import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import TogglePills from '@/features/project/ui/filter/TogglePills';
import Image from 'next/image';
import open from '@/assets/weui_arrow-outlined.svg';
import * as data from '@/features/project/ui/filter/data';

const FilterSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState('전체');
  const [selectedField, setSelectedField] = useState('전체');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCohortChange = (cohort: string) => {
    setSelectedCohort(cohort);
    const params = new URLSearchParams(searchParams.toString());

    if (cohort === '전체' || !cohort) {
      params.delete('cohort');
    } else {
      params.set('cohort', cohort);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    const params = new URLSearchParams(searchParams.toString());

    if (field === '전체' || !field) {
      params.delete('field');
    } else {
      params.set('field', field);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return isOpen ? (
    <section className="mt-8 flex w-full flex-col rounded-xl bg-white px-4 py-4 shadow">
      <div className="mb-4 flex flex-col gap-2">
        <span className={'text-string-16'}>기수</span>
        <TogglePills
          sort={data.cohort}
          onChange={handleCohortChange}
          selected={selectedCohort}
        />
      </div>
      <div className="mb-10 flex flex-col gap-2">
        <span className={'text-string-16 text-black'}>분야</span>
        <TogglePills
          sort={data.field}
          onChange={handleFieldChange}
          selected={selectedField}
        />
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
