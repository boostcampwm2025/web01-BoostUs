'use client';

import { useState, useEffect, DragEvent } from 'react'; // DragEvent 추가
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ModalOverlay from '@/shared/ui/ModalOverlay';
import { ImageUp } from 'lucide-react';

// --- Zod Schema (기존 유지) ---
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const projectSchema = z.object({
  thumbnail: z
    .custom<FileList>()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      '썸네일 이미지를 업로드해주세요.'
    )
    .refine(
      (files) =>
        files instanceof FileList &&
        files.length > 0 &&
        files[0].size <= MAX_FILE_SIZE,
      '최대 10MB까지 업로드 가능합니다.'
    )
    .refine(
      (files) =>
        files instanceof FileList &&
        files.length > 0 &&
        ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      '.jpg, .jpeg, .png, .webp 파일만 업로드 가능합니다.'
    ),
  title: z
    .string()
    .min(1, '프로젝트 이름을 입력해주세요.')
    .max(50, '프로젝트 이름은 50자 이하로 입력해주세요.'),
  description: z
    .string()
    .min(1, '프로젝트 설명을 입력해주세요.')
    .max(200, '프로젝트 설명은 200자 이하로 입력해주세요.'),
  contents: z.array(z.string()).min(1, '프로젝트 상세내용을 입력해주세요.'),
  repositoryUrl: z.url('유효한 GitHub Repository URL을 입력해주세요.'),
  demoUrl: z.url('유효한 데모 URL을 입력해주세요.'),
  cohort: z.enum([
    '1기',
    '2기',
    '3기',
    '4기',
    '5기',
    '6기',
    '7기',
    '8기',
    '9기',
    '10기',
  ]),
  startDate: z.coerce
    .date()
    // 1. 빈 값이거나 유효하지 않은 날짜인 경우 체크
    .refine((date) => !isNaN(date.getTime()), {
      message: '시작 날짜를 입력해주세요.',
    })
    // 2. 미래 날짜 체크
    .refine((date) => date <= new Date(), {
      message: '시작 날짜는 현재 날짜 이전이어야 합니다.',
    }),

  endDate: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: '종료 날짜를 입력해주세요.',
    })
    .refine((date) => date >= new Date(), {
      message: '종료 날짜는 현재 날짜 이후이어야 합니다.',
    }),
  members: z.array(z.string()).min(1, '팀원을 선택해주세요.'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function RegisterModalPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
  });

  const thumbnailList = watch('thumbnail');
  useEffect(() => {
    if (thumbnailList && thumbnailList.length > 0) {
      const file = thumbnailList[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // 메모리 누수 방지
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [thumbnailList]);

  // --- 드래그 앤 드롭 핸들러 ---
  const onDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = e.dataTransfer.files;
      // React Hook Form에 값 수동 주입 및 검증 트리거
      setValue('thumbnail', droppedFiles, { shouldValidate: true });
      clearErrors('thumbnail');
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    console.log('Form Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('프로젝트가 등록되었습니다.');
  };

  return (
    <ModalOverlay>
      <div className="w-full rounded-lg bg-white">
        <h2 className="mb-4 text-xl font-bold">프로젝트 등록</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* --- 썸네일 업로드 --- */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="thumbnail"
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
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
                    {/* 기존 ImageUp 컴포넌트 사용 */}
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
                      PNG, JPG, JPEG, GIF 파일 형식을 여러 개 업로드 할 수
                      있어요
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
                className="hidden" // 화면에서 숨김 처리
                {...register('thumbnail')}
              />
            </label>

            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-500">
                {errors.thumbnail?.message?.toString()}
              </p>
            )}
          </div>
          {/* ---------------------------------- */}

          {/* 기수 선택 필드 */}
          <div>
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

          <div className="flex flex-row gap-4">
            {/* 시작 날짜 */}
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
                {...register('startDate')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* 종료 날짜 */}
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
                {...register('endDate')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className={'flex flex-row gap-4'}>
            {/* 깃허브 Repository URL 필드 */}
            <div className="flex-1">
              <label
                htmlFor="repositoryUrl"
                className="block text-sm font-medium text-gray-700"
              >
                깃허브 Repository
              </label>
              <input
                id="repositoryUrl"
                type="url"
                {...register('repositoryUrl')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="GitHub Repository URL을 입력하세요"
              />
              {errors.repositoryUrl && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.repositoryUrl.message}
                </p>
              )}
            </div>
            {/* 데모 URL 필드 */}
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

          {/* 제목 필드 */}
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

          {/* 설명 필드 */}
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

          {/* 프로젝트 상세내용 */}
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="프로젝트 내용을 입력하세요"
            />
            {errors.contents && (
              <p className="mt-1 text-xs text-red-500">
                {errors.contents.message}
              </p>
            )}
          </div>

          {/* 제출 버튼 */}
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
