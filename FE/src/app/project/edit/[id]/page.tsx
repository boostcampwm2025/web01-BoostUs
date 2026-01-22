'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // 👈 라우터 추가
import { ImageUp } from 'lucide-react';
import { useProjectRegister } from '@/features/project/hook/useProjectRegister';

import { fetchStacks } from '@/entities/TechStackSelector/api/getTechStack';
import TechStackSelector from '@/entities/TechStackSelector/ui/TechStackSelector';
import {
  TechStackItem,
  TechStackResponse,
} from '@/entities/TechStackSelector/model/types';
import ModalOverlay from '@/shared/ui/ModalOverlay';

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

// 컴포넌트 이름 변경 & params 받기
export default function ProjectEditPage() {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  // ID 유효성 검사
  if (isNaN(projectId)) {
    return (
      <div className="p-10 text-center">유효하지 않은 프로젝트 ID입니다.</div>
    );
  }

  // 훅에 ID와 완료 후 이동할 경로 전달
  const {
    register,
    watch,
    // setValue, // 훅 내부에서 처리하므로 여기서 직접 안 써도 됨 (필요시 사용)
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
  } = useProjectRegister(projectId, () => router.push(`/project`));

  const [stackData, setStackData] = useState<TechStackResponse | null>(null);

  // 기술 스택 목록 불러오기 (기존 로직 유지)
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

  // 텍스트 영역 높이 조절 (기존 로직 유지)
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
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [contentsValue]);

  return (
    <ModalOverlay>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">프로젝트 수정</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 1. 썸네일 업로드 */}
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

        {/* 2. 기수 & 분야 */}
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {['WEB', 'IOS', 'ANDROID'].map((field) => (
                <option key={field} value={field}>
                  {field}
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
              className="block text-sm font-medium text-gray-700"
            >
              시작 날짜
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate', { valueAsDate: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="block text-sm font-medium text-gray-700"
            >
              깃허브 Repository
            </label>
            <input
              id="repoUrl"
              type="url"
              {...register('repoUrl')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="block text-sm font-medium text-gray-700"
            >
              데모 URL
            </label>
            <input
              id="demoUrl"
              type="url"
              {...register('demoUrl')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="데모 URL"
            />
          </div>
        </div>

        {/* 5. 제목 */}
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
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="block text-sm font-medium text-gray-700"
          >
            프로젝트 요약
          </label>
          <input
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="block text-sm font-medium text-gray-700"
          >
            상세 내용 (Markdown 지원)
          </label>
          <textarea
            id="contents"
            rows={6}
            className="mt-1 block w-full resize-none overflow-hidden rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[150px]"
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
        </div>

        {/* 8. 참여자 */}
        <div>
          <label
            htmlFor="participantsInput"
            className="block text-sm font-medium text-gray-700"
          >
            참여자 (GitHub ID)
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="participantsInput"
              type="text"
              {...register('participantsInput')}
              className="block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="shrink-0 rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700"
            >
              추가
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {participants.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 shadow-sm"
              >
                <span className="text-sm font-medium text-gray-800">
                  {name}
                </span>
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 9. 기술 스택 */}
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
            <div className="h-20 flex items-center justify-center bg-gray-50 rounded border border-dashed text-gray-400">
              기술 스택 로딩 중...
            </div>
          )}
          {/* hidden input은 hook 내부 useEffect가 동기화해주므로 제거해도 되지만, 안전장치로 둬도 무방 */}
        </div>

        {/* 버튼 그룹  */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
          <button
            type="button"
            onClick={() => router.push('/project')} // 뒤로가기
            className="rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
