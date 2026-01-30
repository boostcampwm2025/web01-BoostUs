'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ImageUp, X } from 'lucide-react';
import { useProjectRegister } from '@/features/project/hook/useProjectRegister';

import { fetchStacks } from '@/entities/TechStackSelector/api/getTechStack';
import TechStackSelector from '@/entities/TechStackSelector/ui/TechStackSelector';
import {
  TechStackItem,
  TechStackResponse,
} from '@/entities/TechStackSelector/model/types';
import ModalOverlay from '@/shared/ui/ModalOverlay';

const FIELD_OPTIONS = [
  { label: '웹 풀스택', value: 'WEB' },
  { label: 'iOS', value: 'IOS' },
  { label: 'Android', value: 'ANDROID' },
] as const;

// API 데이터 정규화 함수
const normalizeStacks = (data: unknown): TechStackResponse => {
  const empty: TechStackResponse = {
    FRONTEND: [],
    BACKEND: [],
    DATABASE: [],
    INFRA: [],
    MOBILE: [],
    ETC: [],
  };

  if (Array.isArray(data)) {
    return { ...empty, ETC: data as TechStackItem[] };
  }

  if (data && typeof data === 'object') {
    const obj = data as Partial<TechStackResponse>;
    return {
      FRONTEND: obj.FRONTEND ?? [],
      BACKEND: obj.BACKEND ?? [],
      DATABASE: obj.DATABASE ?? [],
      INFRA: obj.INFRA ?? [],
      MOBILE: obj.MOBILE ?? [],
      ETC: obj.ETC ?? [],
    };
  }

  return empty;
};

export default function ProjectEditPage() {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  if (isNaN(projectId)) {
    return (
      <div className="p-10 text-center">유효하지 않은 프로젝트 ID입니다.</div>
    );
  }

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
    router.push(`/project`);
  });

  const [stackData, setStackData] = useState<TechStackResponse | null>(null);

  useEffect(() => {
    const loadStacks = async () => {
      try {
        const res = await fetchStacks();
        setStackData(normalizeStacks(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    void loadStacks();
  }, []);

  // -------------------------------------------------------------
  // [수정 포인트 1] 텍스트 영역 높이 조절 로직 개선
  // -------------------------------------------------------------
  const [isComposing, setIsComposing] = useState(false);
  const contentsRef = useRef<HTMLTextAreaElement | null>(null);
  const contentsValue = watch('contents.0');

  const {
    ref: contentsRHRef,
    onChange: contentsOnChange,
    ...contentsRest
  } = register('contents.0');

  useLayoutEffect(() => {
    const el = contentsRef.current;
    if (!el) return;

    // 기존: el.style.height = '0px'; -> 스크롤 튐의 원인
    // 변경: 'auto'로 설정하여 급격한 높이 변화 방지
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [contentsValue]);

  return (
    <ModalOverlay>
      <h2 className="mb-4 text-display-24 text-neutral-text-strong">
        프로젝트 수정
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 1. 썸네일 업로드 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="thumbnail"
            {...dragHandlers}
            className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 ${
              isDragging
                ? 'scale-[0.99] border-brand-border-default bg-brand-surface-weak ring-2 ring-brand-border-default'
                : errors.thumbnail
                  ? 'border-danger-border-default bg-danger-surface-default'
                  : 'border-neutral-border-default bg-neutral-surface-default hover:bg-neutral-surface-strong hover:border-neutral-border-active'
            } `}
          >
            {previewUrl ? (
              <div className="relative h-full w-full">
                <img
                  src={previewUrl}
                  alt="Thumbnail Preview"
                  className="h-full w-full object-cover"
                />
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-brand-text-on-default">
                    이미지 변경하기
                  </div>
                )}
              </div>
            ) : (
              <div className="pointer-events-none flex flex-col items-center gap-4 p-4 text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-colors ${isDragging ? 'bg-brand-dark text-brand-text-on-default' : 'bg-brand-surface-default text-brand-text-on-default'}`}
                >
                  <ImageUp size={48} />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-display-20 transition-colors ${isDragging ? 'text-brand-text-default' : 'text-neutral-text-strong'}`}
                  >
                    {isDragging
                      ? '여기에 놓으세요!'
                      : '이미지를 여기로 드래그하여 업로드 하세요'}
                  </span>
                  <span className="text-body-14 text-neutral-text-weak">
                    PNG, JPG, JPEG, GIF 형식의 이미지를 1개 업로드할 수 있어요
                  </span>
                </div>
              </div>
            )}
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              {...register('thumbnail')}
            />
          </label>
          {errors.thumbnail && (
            <p className="mt-1 text-string-12 text-danger-text-default">
              {errors.thumbnail.message}
            </p>
          )}
        </div>

        {/* 2. 기수 & 분야 */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="cohort"
              className="block text-string-16 text-neutral-text-default"
            >
              기수
            </label>
            <select
              id="cohort"
              {...register('cohort')}
              className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const generation = String(i + 1);
                return (
                  <option key={i} value={`${generation}기`}>
                    {generation}기
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="field"
              className="block text-string-16 text-neutral-text-default"
            >
              분야
            </label>
            <select
              id="field"
              {...register('field')}
              className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
            >
              {FIELD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. 날짜 */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-string-16 text-neutral-text-default"
            >
              시작 날짜
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate', { valueAsDate: true })}
              className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="endDate"
              className="block text-string-16 text-neutral-text-default"
            >
              종료 날짜
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate', { valueAsDate: true })}
              className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* 4. URL */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="repoUrl"
              className="block text-string-16 text-neutral-text-default"
            >
              깃허브 Repository
            </label>
            <input
              id="repoUrl"
              type="url"
              {...register('repoUrl')}
              className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
              placeholder="GitHub URL"
            />
            {errors.repoUrl && (
              <p className="mt-1 text-xs text-red-500">
                {errors.repoUrl.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="demoUrl"
              className="block text-string-16 text-neutral-text-default"
            >
              데모 URL
            </label>
            <input
              id="demoUrl"
              type="url"
              {...register('demoUrl')}
              className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
              placeholder="데모 URL"
            />
          </div>
        </div>

        {/* 5. 제목 */}
        <div>
          <label
            htmlFor="title"
            className="block text-string-16 text-neutral-text-default"
          >
            프로젝트 제목
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
            placeholder="제목을 입력하세요"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* 6. 요약 */}
        <div>
          <label
            htmlFor="description"
            className="block text-string-16 text-neutral-text-default"
          >
            프로젝트 요약
          </label>
          <input
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
            placeholder="짧은 요약을 입력하세요"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* 7. 상세 내용 */}
        <div>
          <label
            htmlFor="contents"
            className="block text-string-16 text-neutral-text-default"
          >
            상세 내용 (Markdown 지원)
          </label>
          <textarea
            id="contents"
            rows={6}
            className="mt-1 block w-full resize-none overflow-hidden rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default min-h-[150px]"
            placeholder="프로젝트 내용을 입력하세요"
            {...contentsRest}
            ref={(el) => {
              contentsRef.current = el;
              contentsRHRef(el);
            }}
            // [수정 포인트 2] onChange 중복 로직 제거
            // 이미 useLayoutEffect가 contentsValue 변경을 감지하므로 여기서 높이 조절 불필요
            onChange={contentsOnChange}
          />
        </div>

        {/* 8. 참여자 */}
        <div>
          <label
            htmlFor="participantsInput"
            className="block text-string-16 text-neutral-text-default"
          >
            참여자 (GitHub ID)
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="participantsInput"
              type="text"
              {...register('participantsInput')}
              className="block w-full rounded-lg border border-neutral-border-default p-2  focus:border-neutral-border-active focus:ring-brand-border-default"
              placeholder="GitHub ID 입력"
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                if (isComposing || e.nativeEvent.isComposing) return;
                e.preventDefault();
                addParticipant();
              }}
            />
            <button
              type="button"
              onClick={addParticipant}
              className="shrink-0 rounded-lg cursor-pointer duration-150 transition-colors bg-brand-surface-default px-4 py-2 text-brand-text-on-default text-string-16 hover:bg-brand-dark"
            >
              추가
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {participants.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex items-center gap-2 rounded-full border border-neutral-border-default bg-neutral-surface-bold px-4 py-1.5"
              >
                <span className="text-string-16 text-neutral-text-default">
                  {name}
                </span>
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong duration-150 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 9. 기술 스택 */}
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
            <div className="h-20 flex items-center justify-center bg-neutral-surface-default rounded border border-dashed text-neutral-text-weak">
              기술 스택 로딩 중...
            </div>
          )}
        </div>

        {/* 버튼 그룹  */}
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            onClick={() => router.push('/project')}
            className="rounded-lg bg-brand-surface-weak border border-neutral-border-default px-4 py-2 text-string-16 text-neutral-text-default hover:border-neutral-border-active hover:text-brand-text-default cursor-pointer duration-150 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg bg-brand-surface-default px-4 py-2 text-string-16 text-brand-text-on-default hover:bg-brand-dark disabled:opacity-50 duration-150 transition-colors"
          >
            {isSubmitting ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
