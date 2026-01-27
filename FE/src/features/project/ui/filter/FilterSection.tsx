'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import TogglePills from '@/features/project/ui/filter/TogglePills';
import Image from 'next/image';
import open from '@/assets/weui_arrow-outlined.svg';
import * as data from '@/features/project/ui/filter/data';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ease: [number, number, number, number] = [0.04, 0.62, 0.23, 0.98];

const normalizeCohortSelected = (cohortParam: string | null) => {
  if (!cohortParam) return '전체';
  if (cohortParam === '전체') return '전체';

  const n = cohortParam.replace(/[^0-9]/g, '');
  return n ? `${n}기` : '전체';
};

const FilterSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedField = searchParams.get('field') ?? '전체';
  const selectedCohort = normalizeCohortSelected(searchParams.get('cohort'));
  const [isOpen, setIsOpen] = useState(true);
  const pushWithParams = (params: URLSearchParams) => {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleCohortChange = (cohort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (cohort === '전체' || !cohort) {
      params.delete('cohort');
    } else {
      const value = cohort.replace(/[^0-9]/g, '');
      params.set('cohort', value);
    }

    pushWithParams(params);
  };

  const handleFieldChange = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (field === '전체' || !field) {
      params.delete('field');
    } else {
      params.set('field', field);
    }

    pushWithParams(params);
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
      className="mt-8 flex w-full flex-col overflow-hidden rounded-xl bg-neutral-surface-bold border border-neutral-border-default"
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
                <span className={'text-string-16 text-neutral-text-strong'}>
                  기수
                </span>
                <TogglePills
                  sort={data.cohort}
                  onChange={handleCohortChange}
                  selected={selectedCohort}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className={'text-string-16 text-neutral-text-strong'}>
                  분야
                </span>
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
      <div className="relative z-10 flex flex-row justify-between bg-neutral-surface-bold p-4">
        <button
          className="text-neutral-text-weak text-string-16 flex flex-1 flex-row items-center gap-1 cursor-pointer hover:text-neutral-text-strong transition-colors duration-150"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              필터 접기 <ChevronUp size={20} />
            </>
          ) : (
            <>
              필터 펼치기{' '}
              <ChevronDown
                size={20}
                className="transition-transform duration-300"
              />
            </>
          )}
        </button>
        <Link
          href="/project/register"
          className="bg-brand-surface-default text-string-16 self-end rounded-lg px-4 py-2 text-brand-text-on-default"
        >
          등록하기
        </Link>
      </div>
    </motion.div>
  );
};

export default FilterSection;
