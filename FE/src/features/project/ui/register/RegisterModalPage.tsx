'use client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ModalOverlay from '@/shared/ui/ModalOverlay';

// 파일 유효성 검사 상수. -> 이후 논의 필요
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
      '최대 5MB까지 업로드 가능합니다.'
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
  startDate: z.preprocess(
    (arg) => {
      // 값이 비어있거나, Invalid Date(유효하지 않은 날짜)라면 null로 변환
      if (arg instanceof Date && !isNaN(arg.getTime())) {
        return arg;
      }
      return null;
    },
    z
      .date()
      .nullable() // null 허용
      .refine((date) => date !== null, {
        message: '시작 날짜를 입력해주세요.', // null일 때 (선택 안 했을 때)
      })
      .refine((date) => date <= new Date(), {
        message: '시작 날짜는 현재 날짜 이전이어야 합니다.',
      })
  ),

  endDate: z.preprocess(
    (arg) => {
      if (arg instanceof Date && !isNaN(arg.getTime())) {
        return arg;
      }
      return null;
    },
    z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: '종료 날짜를 입력해주세요.',
      })
      .refine((date) => date >= new Date(), {
        message: '종료 날짜는 현재 날짜 이후이어야 합니다.',
      })
  ),
  members: z.array(z.string()).min(1, '팀원을 선택해주세요.'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function RegisterModalPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const thumbnailList = watch('thumbnail');
  if (
    thumbnailList instanceof FileList &&
    thumbnailList.length > 0 &&
    !previewUrl
  ) {
    const file = thumbnailList[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  const onSubmit = async (data: ProjectFormValues) => {
    //TODO: API 호출 로직 등을 여기에 작성
    console.log('Form Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 모의 지연
    alert('프로젝트가 등록되었습니다.');
  };

  return (
    <ModalOverlay>
      <div className="w-full rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">프로젝트 등록</h2>
        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          {/*썸네일 업로드*/}
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              썸네일 이미지
            </label>
            <div className="mt-1 flex items-center gap-4">
              <div className="relative h-24 w-36 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Thumbnail Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                {...register('thumbnail')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {errors.thumbnail && (
              <p className="mt-1 text-xs text-red-500">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

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
                {...register('startDate', { valueAsDate: true })}
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
          {/*프로젝트 상세내용*/}
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
