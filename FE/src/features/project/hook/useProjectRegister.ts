import { useState, useEffect, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  ProjectFormValues,
} from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';

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
      field: 'Web',
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const { watch, setValue } = formMethods;
  const thumbnailList = watch('thumbnail') as FileList | undefined;

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
      // 중복 추가 방지 (선택 사항)
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
      // S3 이미지 업로드 로직
      let uploadedThumbnailUrl: string | null = null;
      if (data.thumbnail && data.thumbnail.length > 0) {
        console.log('이미지 업로드 필요:', data.thumbnail[0].name);
        uploadedThumbnailUrl = 'https://임시-이미지-주소.com/image.png';
      }

      // 기수 처리 (1기 -> 1)
      const cohortStr = data.cohort
        ? (data.cohort as string).replace('기', '')
        : '0';
      const parsedCohort = parseInt(cohortStr, 10);

      const requestBody = {
        thumbnailUrl: uploadedThumbnailUrl,
        title: data.title,
        description: data.description,
        contents: Array.isArray(data.contents)
          ? data.contents.join('\n')
          : data.contents,
        repoUrl: data.repoUrl,
        demoUrl: data.demoUrl,
        cohort: isNaN(parsedCohort) ? 0 : parsedCohort,

        // 날짜 처리 (YYYY-MM-DD)
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0],

        techStack: techStack,

        field: data.field,

        participants: participants.map((name) => ({
          githubId: name,
          avatarUrl: undefined,
        })),
      };

      console.log('전송할 데이터:', requestBody);

      await registerProject(requestBody);
      alert('프로젝트가 등록되었습니다.');
      // 성공 후 페이지 이동이나 폼 초기화 로직 추가 가능
    } catch (error: any) {
      console.error(error);
      alert(`등록 실패: ${error.message}`);
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
