import { useState, useEffect, DragEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  ProjectFormValues,
} from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';

export const useProjectRegister = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const formMethods = useForm({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      contents: [''],
      participants: [],
      participantsInput: '',
    },
  });

  const { watch, setValue } = formMethods;
  const thumbnailList = watch('thumbnail') as FileList | undefined;

  // 썸네일 미리보기 URL 생성 및 정리
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
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget;

    // If the drag is moving into a child of the label, do not reset the dragging state
    if (
      relatedTarget instanceof Node &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      setValue('thumbnail', files, { shouldValidate: true });
    }
  };
  const handleParticipantsAdd = () => {
    const raw = watch('participantsInput');
    const name = (raw ?? '').trim();

    if (name === '') return;

    setParticipants((prev) => {
      const next = [...prev, name];
      setValue('participants', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return next;
    });

    setValue('participantsInput', '', { shouldDirty: true });
  };

  const handleParticipantsRemove = (index: number) => {
    setParticipants((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue('participants', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return next;
    });
  };

  const handleTechStackAdd = () => {
    const raw = watch('techStackInput');
    const tech = (raw ?? '').trim();

    if (tech === '') return;

    setTechStack((prev) => {
      const next = [...prev, tech];
      setValue('techStack', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return next;
    });

    setValue('techStackInput', '', { shouldDirty: true });
  };

  const handleTechStackRemove = (index: number) => {
    setTechStack((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue('techStack', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return next;
    });
  };

  const submitValidForm = async (data: ProjectFormValues) => {
    try {
      // 이미지 업로드 처리 (S3)
      let uploadedThumbnailUrl: string | null = null;

      if (data.thumbnail && data.thumbnail.length > 0) {
        const file = data.thumbnail[0];
        // TODO: 여기서 실제 이미지 업로드 API를 호출하고 URL을 받아와야 합니다.
        // 예: uploadedThumbnailUrl = await uploadImageToS3(file);
        console.log('이미지 업로드 필요:', file.name);
        uploadedThumbnailUrl = 'https://임시-이미지-주소.com/image.png'; // 테스트용 더미
      }

      // 2. API 요청 데이터 형태에 맞게 변환 (Mapping)
      const requestBody = {
        thumbnailUrl: uploadedThumbnailUrl, // FileList -> string 변환
        title: data.title,
        description: data.description,
        contents: data.contents.join('\n'), // string[] -> string (필요시)
        repoUrl: data.repoUrl,
        demoUrl: data.demoUrl,
        cohort: parseInt(data.cohort.replace('기', '')),
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],

        techStack: data.techStack, // FormValues에 이 필드가 있는지 확인 필요
        field: data.field, // FormValues에 이 필드가 있는지 확인 필요

        // 참여자 매핑
        participants: participants.map((name) => ({
          githubId: name,
          avatarUrl: '', // API 스펙에 있다면 빈 문자열이라도 넣어줘야 함
        })),
      };

      console.log('Payload:', requestBody);

      // 3. API 호출
      const projectId = await registerProject(requestBody);
      alert('프로젝트가 등록되었습니다.');
    } catch (error) {
      console.error(error);
      alert('등록 중 오류가 발생했습니다.');
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
    onSubmit: submitValidForm,

    participants,
    addParticipant: handleParticipantsAdd,
    removeParticipant: handleParticipantsRemove,

    techStack,
    addTechStack: handleTechStackAdd,
    removeTechStack: handleTechStackRemove,
  };
};
