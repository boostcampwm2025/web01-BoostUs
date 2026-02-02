'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldError } from 'react-hook-form';

import ModalOverlay from '@/shared/ui/ModalOverlay';
import { useProjectRegister } from '@/features/project/hook/useProjectRegister';
import { fetchStacks } from '@/entities/TechStackSelector/api/getTechStack';
import TechStackSelector from '@/entities/TechStackSelector/ui/TechStackSelector';
import {
  TechStackResponse,
  TechStackItem,
} from '@/entities/TechStackSelector/model/types';

// 위에서 만든 부품들 import
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from '@/features/project/ui/register/utils/FormFields';
import {
  ThumbnailUploader,
  ParticipantManager,
} from '@/features/project/ui/register/utils/FunctionalComponents';

// 데이터 정규화 함수
const normalizeStacks = (data: unknown): TechStackResponse => {
  const empty: TechStackResponse = {
    FRONTEND: [],
    BACKEND: [],
    DATABASE: [],
    INFRA: [],
    MOBILE: [],
    ETC: [],
  };
  if (Array.isArray(data)) return { ...empty, ETC: data as TechStackItem[] };
  if (data && typeof data === 'object') return { ...empty, ...data };
  return empty;
};

const FIELD_OPTIONS = [
  { label: '웹 풀스택', value: 'WEB' },
  { label: 'iOS', value: 'IOS' },
  { label: 'Android', value: 'ANDROID' },
] as const;

interface ProjectFormProps {
  projectId?: number; // 이 값이 있으면 수정 모드
}

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEditMode = !!projectId;

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    previewUrl,
    isDragging,
    dragHandlers,
    onSubmit,
    participants,
    addParticipant,
    removeParticipant,
    techStack,
    setTechStack,
  } = useProjectRegister(projectId, () => {
    router.refresh();
    router.push('/project'); // 완료 후 이동
  });

  const [stackData, setStackData] = useState<TechStackResponse | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const contentsValue = watch('contents');

  useEffect(() => {
    fetchStacks()
      .then((res) => setStackData(normalizeStacks(res.data)))
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const cohortOptions = Array.from({ length: 10 }).map((_, i) => ({
    label: `${i + 1}기`,
    value: `${i + 1}기`,
  }));

  return (
    <ModalOverlay>
      <div className="w-full rounded-2xl bg-neutral-surface-default">
        <h2 className="mb-4 text-display-24 text-neutral-text-strong">
          {isEditMode ? '프로젝트 수정' : '프로젝트 등록'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <ThumbnailUploader
            previewUrl={previewUrl}
            isDragging={isDragging}
            dragHandlers={dragHandlers}
            register={register('thumbnail')}
            error={errors.thumbnail}
          />

          <div className="flex flex-row gap-4">
            <FormSelect
              id="cohort"
              label="기수"
              options={cohortOptions}
              register={register('cohort')}
            />
            <FormSelect
              id="field"
              label="분야"
              options={[...FIELD_OPTIONS]}
              register={register('field')}
            />
          </div>

          <div className="flex flex-row gap-4">
            <FormInput
              id="startDate"
              type="date"
              label="시작 날짜"
              register={register('startDate', { valueAsDate: true })}
              error={errors.startDate}
            />
            <FormInput
              id="endDate"
              type="date"
              label="종료 날짜"
              register={register('endDate', { valueAsDate: true })}
              error={errors.endDate}
            />
          </div>

          <div className="flex flex-row gap-4">
            <FormInput
              id="repoUrl"
              type="url"
              label="깃허브 Repository"
              placeholder="URL"
              register={register('repoUrl')}
              error={errors.repoUrl}
            />
            <FormInput
              id="demoUrl"
              type="url"
              label="데모 URL"
              placeholder="URL"
              register={register('demoUrl')}
              error={errors.demoUrl}
            />
          </div>

          <FormInput
            id="title"
            label="프로젝트 제목"
            placeholder="제목"
            register={register('title')}
            error={errors.title}
          />
          <FormInput
            id="description"
            label="프로젝트 요약"
            placeholder="요약"
            register={register('description')}
            error={errors.description}
          />

          <FormTextarea
            id="contents"
            label="상세 내용"
            placeholder="내용 입력"
            register={register('contents')}
            watchValue={(contentsValue as unknown as string) ?? ''}
            rows={6}
            error={errors.contents}
            className="min-h-[150px]"
          />

          <ParticipantManager
            participants={participants}
            addParticipant={addParticipant}
            removeParticipant={removeParticipant}
            register={register('participantsInput')}
            error={errors.participants as FieldError}
            isComposing={isComposing}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />

          <div>
            <label className="block text-string-16 text-neutral-text-default mb-2">
              기술 스택
            </label>
            {stackData ? (
              <TechStackSelector
                data={stackData}
                selectedStack={techStack}
                onChange={setTechStack}
              />
            ) : (
              <div className="h-20 flex items-center justify-center bg-neutral-surface-default border rounded text-neutral-text-weak">
                로딩 중...
              </div>
            )}
            <input type="hidden" {...register('techStack')} />
            {errors.techStack && (
              <p className="mt-1 text-string-12 text-danger-text-default">
                {errors.techStack.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg bg-brand-surface-weak border border-neutral-border-default px-4 py-2 text-string-16"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-surface-default px-4 py-2 text-string-16 text-brand-text-on-default disabled:opacity-50"
            >
              {isSubmitting
                ? '처리 중...'
                : isEditMode
                  ? '수정 완료'
                  : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}
