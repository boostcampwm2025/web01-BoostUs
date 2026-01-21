import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => v === undefined || v === '' || z.string().url().safeParse(v).success,
    {
      message: '유효한 URL을 입력해주세요.',
    }
  )
  .transform((v) => (v === '' ? undefined : v));

const optionalFileList = z
  .custom<FileList | undefined>()
  .optional()
  .refine(
    (files) => files === undefined || files instanceof FileList,
    '파일 형식이 올바르지 않습니다.'
  )
  .refine(
    (files) =>
      files === undefined ||
      files.length === 0 ||
      files[0].size <= MAX_FILE_SIZE,
    '최대 10MB까지 업로드 가능합니다.'
  )
  .refine(
    (files) =>
      files === undefined ||
      files.length === 0 ||
      ACCEPTED_IMAGE_TYPES.includes(files[0].type),
    '.jpg, .jpeg, .png, .webp 파일만 업로드 가능합니다.'
  )
  .transform((files) => {
    if (!files) return undefined;
    if (files.length === 0) return undefined;
    return files;
  });

// 1) 먼저 "정확한 출력 타입"을 정의
export type ProjectFormValues = {
  thumbnail: FileList | undefined;
  field: 'WEB' | 'IOS' | 'ANDROID';
  title: string;
  description: string | undefined;
  contents?: string[] | undefined;
  repoUrl: string;
  demoUrl: string | undefined;
  cohort:
    | '1기'
    | '2기'
    | '3기'
    | '4기'
    | '5기'
    | '6기'
    | '7기'
    | '8기'
    | '9기'
    | '10기';
  startDate: Date;
  endDate: Date;
  participantsInput?: string | undefined;
  participants?: string[] | undefined;
  techStackInput?: string | undefined;
  techStack?: string[] | undefined;
};

export const projectSchema: z.ZodType<ProjectFormValues> = z
  .object({
    thumbnail: optionalFileList,
    field: z.enum(['WEB', 'IOS', 'ANDROID']),
    title: z
      .string()
      .min(1, '프로젝트 이름을 입력해주세요.')
      .max(50, '프로젝트 이름은 50자 이하로 입력해주세요.'),
    description: z
      .string()
      .trim()
      .max(200, '프로젝트 설명은 200자 이하로 입력해주세요.')
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
    contents: z.array(z.string()).optional(),
    repoUrl: z.url('유효한 GitHub Repository URL을 입력해주세요.'),
    demoUrl: optionalUrl.refine(
      (v) => v === undefined || v === '' || v.startsWith('http'),
      {
        message: '유효한 데모 URL을 입력해주세요.',
      }
    ),
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
      .refine((date) => !isNaN(date.getTime()), {
        message: '시작 날짜를 입력해주세요.',
      })
      .refine((date) => date <= new Date(), {
        message: '시작 날짜는 현재 날짜 이전이어야 합니다.',
      }),

    endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: '종료 날짜를 입력해주세요.',
    }),
    // 참여자
    // 화면 입력용 임시 필드(검증 제외)
    participantsInput: z.string().optional(),

    // 실제 제출 배열
    participants: z.array(z.string()).optional(),
    // 기술스택
    // 화면 입력용 임시 필드(검증 제외)
    techStackInput: z.string().optional(),

    // 실제 제출 배열
    techStack: z.array(z.string()).optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: '종료 날짜는 시작 날짜 이후이어야 합니다.',
    path: ['endDate'], // 에러를 endDate 필드에 표시
  });
