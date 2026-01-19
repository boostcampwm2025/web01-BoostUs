import { useState, useEffect, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  ProjectFormValues,
} from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';

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

  const [participants, setParticipants] = useState<string[]>([]);

  const [techStack, setTechStack] = useState<number[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const formMethods = useForm({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      contents: [''],
      repoUrl: '',
      demoUrl: '',
      cohort: '10기', // 초기값 빈 문자열
      participantsInput: '',
      techStackInput: '',
      field: 'WEB',
      startDate: new Date(),
      endDate: new Date(),
      participants: [],
      techStack: [],
    },
  });

  const { watch, setValue } = formMethods;
  const thumbnailList = watch('thumbnail');

  // 1. 참여자 목록이 바뀌면 폼 데이터에 반영
  useEffect(() => {
    setValue('participants', participants, { shouldValidate: true });
  }, [participants, setValue]);

  // 2. 기술 스택이 바뀌면 폼 데이터에 반영
  useEffect(() => {
    setValue('techStack', techStack, { shouldValidate: true });
  }, [techStack, setValue]);

  useEffect(() => {
    if (thumbnailList && thumbnailList.length > 0) {
      const file = thumbnailList[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [thumbnailList]);

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

  const handleParticipantsAdd = () => {
    const raw = watch('participantsInput');
    const name = (raw ?? '').trim();
    if (name === '') return;

    setParticipants((prev) => {
      // 중복 추가 방지
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      return next;
    });
    setValue('participantsInput', '', { shouldDirty: true });
  };

  const handleParticipantsRemove = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTechStackAdd = () => {
    const raw = watch('techStackInput');
    const techStr = (raw ?? '').trim();
    if (techStr === '') return;

    const techId = parseInt(techStr, 10);

    if (isNaN(techId)) {
      alert('기술 스택은 현재 ID(숫자)로만 입력 가능합니다.'); // 임시 경고
      setValue('techStackInput', '');
      return;
    }

    setTechStack((prev) => {
      if (prev.includes(techId)) return prev;
      const next = [...prev, techId];
      return next;
    });
    setValue('techStackInput', '', { shouldDirty: true });
  };

  const handleTechStackRemove = (index: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== index));
  };

  const submitValidForm = async (data: ProjectFormValues) => {
    try {
      //TODO: S3 이미지 업로드 로직
      let uploadedThumbnailUrl: string | null = null;
      if (data.thumbnail && data.thumbnail.length > 0) {
        console.log('이미지 업로드 필요:', data.thumbnail[0].name);
        uploadedThumbnailUrl = 'https://임시-이미지-주소.com/image.png';
      }

      // 기수 처리
      const cohortStr = data.cohort
        ? (data.cohort as string).replace('기', '')
        : '0';
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

        // 날짜 처리 (YYYY-MM-DD)
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
      // 성공 후 페이지 이동이나 폼 초기화 로직 추가 가능
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
    onSubmit: formMethods.handleSubmit(submitValidForm), // handleSubmit으로 감싸야 함

    participants,
    addParticipant: handleParticipantsAdd,
    removeParticipant: handleParticipantsRemove,

    techStack,
    addTechStack: handleTechStackAdd,
    removeTechStack: handleTechStackRemove,
  };
};
