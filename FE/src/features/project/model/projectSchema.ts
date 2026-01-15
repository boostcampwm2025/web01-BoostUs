import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const projectSchema = z
  .object({
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
      .refine((date) => !isNaN(date.getTime()), {
        message: '시작 날짜를 입력해주세요.',
      })
      .refine((date) => date <= new Date(), {
        message: '시작 날짜는 현재 날짜 이전이어야 합니다.',
      }),

    endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: '종료 날짜를 입력해주세요.',
    }),
    // 화면 입력용 임시 필드(검증 제외)
    participantsInput: z.string().optional(),

    // 실제 제출 배열
    participants: z.array(z.string()).min(1, '팀원을 선택해주세요.'),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: '종료 날짜는 시작 날짜 이후이어야 합니다.',
    path: ['endDate'], // 에러를 endDate 필드에 표시
  });

export type ProjectFormValues = z.infer<typeof projectSchema>;
