'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ModalOverlay from '@/shared/ui/ModalOverlay';

const projectSchema = z.object({
  title: z
    .string()
    .min(1, '프로젝트 이름을 입력해주세요.')
    .max(50, '프로젝트 이름은 50자 이하로 입력해주세요.'),
  description: z
    .string()
    .min(1, '프로젝트 설명을 입력해주세요.')
    .max(200, '프로젝트 설명은 200자 이하로 입력해주세요.'),
  summary: z
    .string()
    .min(1, '프로젝트 요약을 입력해주세요.')
    .max(100, '프로젝트 요약은 100자 이하로 입력해주세요.'),
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
  startDate: z
    .date()
    .refine(
      (date) => date <= new Date(),
      '시작 날짜는 현재 날짜 이전이어야 합니다.'
    ),
  endDate: z
    .date()
    .refine(
      (date) => date >= new Date(),
      '종료 날짜는 현재 날짜 이후이어야 합니다.'
    ),

  members: z.array(z.string()).min(1, '팀원을 선택해주세요.'),
});

export default function RegisterModalPage() {
  return (
    <ModalOverlay>
      <h1>프로젝트 등록 페이지</h1>
    </ModalOverlay>
  );
}
