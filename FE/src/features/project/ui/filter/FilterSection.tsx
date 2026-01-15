'use client';
import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import TogglePills from '@/features/project/ui/filter/TogglePills';
import Image from 'next/image';
import open from '@/assets/weui_arrow-outlined.svg';
import * as data from '@/features/project/ui/filter/data';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

const ease: [number, number, number, number] = [0.04, 0.62, 0.23, 0.98];

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

  const filterVariants: Variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginBottom: 0,
      transition: { duration: 0.3, ease },
    },
    open: {
      height: 'auto',
      opacity: 1,
      marginBottom: 16,
      transition: { duration: 0.3, ease },
    },
  };

  return (
    <motion.div
      layout // 부모 컨테이너가 자식의 변화에 따라 자연스럽게 늘어남
      className="mt-8 flex w-full flex-col overflow-hidden rounded-xl bg-white shadow"
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={filterVariants}
            className="overflow-hidden px-4" // 좌우 패딩만 줌 (상하 패딩은 내부에서 처리하거나 variants로 조절)
          >
            {/* 내용물을 감싸는 div에 상단 패딩을 줘서 같이 밀려 내려오게 함 */}
            <div className="flex flex-col pt-4">
              <div className="mb-4 flex flex-col gap-2">
                <span className={'text-string-medium16'}>기수</span>
                <TogglePills
                  sort={data.cohort}
                  onChange={handleCohortChange}
                  selected={selectedCohort}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className={'text-string-medium16 text-black'}>분야</span>
                <TogglePills
                  sort={data.field}
                  onChange={handleFieldChange}
                  selected={selectedField}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 버튼 영역: 항상 존재, 패딩 고정 */}
      <div className="relative z-10 bg-white p-4">
        <button
          className="text-neutral-text-weak text-string-medium16 flex w-full flex-row items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              필터 접기 <Image src={open} alt="open" />
            </>
          ) : (
            <>
              필터 펼치기{' '}
              <Image
                src={open}
                className="rotate-180 transition-transform duration-300"
                alt="open"
              />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default FilterSection;
