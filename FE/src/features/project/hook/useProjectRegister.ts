import { useState, useEffect, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  ProjectFormValues,
} from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';

// 에러 메시지 추출 헬퍼
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return '알 수 없는 오류';
  }
};

export const useProjectRegister = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 참여자는 별도 로직이 있어서 state 유지
  const [techStack, setTechStack] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const formMethods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      contents: [''], // 스키마가 array(string)이면 배열로
      repoUrl: '',
      demoUrl: '',
      cohort: '10기',
      participantsInput: '',
      techStackInput: '',
      field: 'WEB',
      startDate: new Date(),
      endDate: new Date(),
      participants: [],
      techStack: [], // 초기값 빈 배열
    },
  });

  const { watch, setValue, handleSubmit } = formMethods;
  const thumbnailList = watch('thumbnail');

  // 참여자 목록 동기화
  useEffect(() => {
    setValue('participants', participants, { shouldValidate: true });
  }, [participants, setValue]);

  // 기술스택 목록 동기화
  useEffect(() => {
    setValue('techStack', techStack, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [techStack, setValue]);

  // 썸네일 미리보기 로직
  useEffect(() => {
    if (thumbnailList && thumbnailList.length > 0) {
      const file = thumbnailList[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [thumbnailList]);

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget;
    if (relatedTarget instanceof Node && currentTarget.contains(relatedTarget))
      return;
    setIsDragging(false);
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0)
      setValue('thumbnail', files, { shouldValidate: true });
  };

  // 참여자 추가/삭제 로직
  const handleParticipantsAdd = () => {
    const raw = watch('participantsInput');
    const name = (raw ?? '').trim();
    if (name === '') return;

    setParticipants((prev) => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });
    setValue('participantsInput', '', { shouldDirty: true });
  };

  const handleParticipantsRemove = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 제출 로직
  const submitValidForm = async (data: ProjectFormValues) => {
    try {
      // TODO: S3 이미지 업로드 로직
      let uploadedThumbnailUrl: string | null = null;
      if (data.thumbnail && data.thumbnail.length > 0) {
        console.log('이미지 업로드 필요:', data.thumbnail[0].name);
        uploadedThumbnailUrl = 'https://임시-이미지-주소.com/image.png';
      }

      // 기수 처리 ('10기' -> 10)
      const cohortStr =
        typeof data.cohort === 'string' ? data.cohort.replace('기', '') : '0';
      const parsedCohort = parseInt(cohortStr, 10);

      const requestBody = {
        thumbnailUrl: uploadedThumbnailUrl,
        title: data.title,
        description: data.description ?? '',
        contents: Array.isArray(data.contents)
          ? data.contents.join('\n')
          : (data.contents ?? ''),
        repoUrl: data.repoUrl,
        demoUrl: data.demoUrl,
        cohort: isNaN(parsedCohort) ? 0 : parsedCohort,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0],
        techStack: data.techStack,
        field: data.field,
        participants: participants.map((name) => ({
          githubId: name,
          avatarUrl: undefined,
        })),
      };

      await registerProject(requestBody);
      alert('프로젝트가 등록되었습니다.');
    } catch (error: unknown) {
      console.error(error);
      alert(`등록 실패: ${getErrorMessage(error)}`);
    }
  };

  return {
    ...formMethods,
    previewUrl,
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    onSubmit: handleSubmit(submitValidForm),
    participants,
    addParticipant: handleParticipantsAdd,
    removeParticipant: handleParticipantsRemove,

    techStack,
    setTechStack,
  };
};
