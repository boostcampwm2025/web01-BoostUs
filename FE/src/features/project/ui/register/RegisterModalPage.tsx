'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ModalOverlay from '@/shared/ui/ModalOverlay';
import { ImageUp } from 'lucide-react';
import { useProjectRegister } from '@/features/project/hook/useProjectRegister';

import { fetchStacks } from '@/entities/TechStackSelector/api/getTechStack';
import TechStackSelector from '@/entities/TechStackSelector/ui/TechStackSelector';
import {
  TechStackItem,
  TechStackResponse,
} from '@/entities/TechStackSelector/model/types';

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

// interface RegisterModalPageProps {
//   editProjectId?: number;
//   onClose?: () => void;
// }

export default function RegisterModalPage() {
  const {
    register,
    watch,
    setValue,
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
  } = useProjectRegister();

  const [stackData, setStackData] = useState<TechStackResponse | null>(null);

  // 1. techStack 값을 실시간 감시 (초기값 [] 방어)
  const currentTechStack = watch('techStack') || [];

  useEffect(() => {
    const loadStacks = async () => {
      try {
        const res = await fetchStacks();

        setStackData(normalizeStacks(res));
      } catch (err) {
        console.error(err);
      }
    };
    void loadStacks();
  }, []);

  const [isComposing, setIsComposing] = useState(false);
  const contentsValue = watch('contents.0');
  const contentsRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const el = contentsRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [contentsValue]);

  const {
    ref: contentsRHRef,
    onChange: contentsOnChange,
    ...contentsRest
  } = register('contents.0');

  return (
    <ModalOverlay>
      <div className="w-full rounded-lg bg-white">
        <h2 className="mb-4 text-xl font-bold">프로젝트 등록</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 썸네일 업로드 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="thumbnail"
              {...dragHandlers}
              className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 ${
                isDragging
                  ? 'scale-[0.99] border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : errors.thumbnail
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white">
                      이미지 변경하기
                    </div>
                  )}
                </div>
              ) : (
                <div className="pointer-events-none flex flex-col items-center gap-4 p-4 text-center">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-colors ${isDragging ? 'bg-blue-200 text-blue-600' : 'bg-gray-300 text-gray-500'}`}
                  >
                    <ImageUp size={48} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-lg font-bold transition-colors ${isDragging ? 'text-blue-600' : 'text-gray-800'}`}
                    >
                      {isDragging
                        ? '여기에 놓으세요!'
                        : '이미지를 여기로 드래그하여 업로드 하세요'}
                    </span>
                    <span className="text-sm text-gray-500">
                      PNG, JPG, JPEG, GIF 형식의 이미지를 1개 업로드할 수 있어요
                    </span>
                  </div>
                  <div className="mt-2 rounded-lg bg-blue-100 px-6 py-2.5 text-sm font-semibold text-blue-600">
                    파일 또는 폴더 선택
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
              <p className="mt-1 text-sm text-red-500">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* 기수 & 분야 */}
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="cohort"
                className="block text-sm font-medium text-gray-700"
              >
                기수
              </label>
              <select
                id="cohort"
                {...register('cohort')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="block text-sm font-medium text-gray-700"
              >
                분야
              </label>
              <select
                id="field"
                {...register('field')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {['WEB', 'IOS', 'ANDROID'].map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 날짜 */}
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                시작 날짜
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate', { valueAsDate: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="block text-sm font-medium text-gray-700"
              >
                종료 날짜
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate', { valueAsDate: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* URL */}
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="repoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                깃허브 Repository
              </label>
              <input
                id="repoUrl"
                type="url"
                {...register('repoUrl')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="GitHub Repository URL을 입력하세요"
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
                className="block text-sm font-medium text-gray-700"
              >
                데모 URL
              </label>
              <input
                id="demoUrl"
                type="url"
                {...register('demoUrl')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="데모 URL을 입력하세요"
              />
              {errors.demoUrl && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.demoUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              프로젝트 제목
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 요약 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              프로젝트 요약내용
            </label>
            <input
              id="description"
              {...register('description')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="프로젝트 요약을 입력하세요"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* 상세 내용 */}
          <div>
            <label
              htmlFor="contents"
              className="block text-sm font-medium text-gray-700"
            >
              프로젝트 상세내용
            </label>
            <textarea
              id="contents"
              {...register('contents.0')}
              rows={4}
              className="mt-1 block w-full resize-none overflow-hidden rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="프로젝트 내용을 입력하세요"
              {...contentsRest}
              ref={(el) => {
                contentsRef.current = el;
                contentsRHRef(el);
              }}
              onChange={(e) => {
                contentsOnChange(e);
                const el = e.currentTarget;
                el.style.height = '0px';
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
            {errors.contents && (
              <p className="mt-1 text-xs text-red-500">
                {errors.contents.message}
              </p>
            )}
          </div>

          {/* 참여자 */}
          <div>
            <label
              htmlFor="participantsInput"
              className="block text-sm font-medium text-gray-700"
            >
              프로젝트 참여자
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="participantsInput"
                type="text"
                {...register('participantsInput')}
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="이름을 입력하세요"
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
                className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                등록
              </button>
            </div>
            {errors.participants && (
              <p className="mt-1 text-xs text-red-500">
                {errors.participants.message as string}
              </p>
            )}
            <div className="mt-3 flex flex-row gap-2">
              {participants.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                >
                  <span className="text-sm text-gray-800">{name}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/*  기술 스택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기술 스택
            </label>
            {stackData ? (
              <TechStackSelector
                data={stackData}
                selectedStack={techStack}
                onChange={setTechStack}
              />
            ) : (
              <div className="h-20 flex items-center justify-center bg-gray-50 rounded text-gray-400 text-sm">
                로딩 중...
              </div>
            )}
            <input type="hidden" {...register('techStack')} />
            {errors.techStack && (
              <p className="mt-1 text-xs text-red-500">
                {errors.techStack.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </ModalOverlay>
  );
}
