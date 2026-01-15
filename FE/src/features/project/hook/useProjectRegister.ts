import { useState, useEffect, DragEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  ProjectFormValues,
} from '@/features/project/model/projectSchema';

export const useProjectRegister = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
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
    } else {
      setPreviewUrl(null);
    }
  }, [thumbnailList]);

  // --- 드래그 앤 드롭 핸들러 ---
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
    const raw = watch('participantsInput'); // string | undefined 일 수 있음
    const name = (raw ?? '').trim(); // 항상 string

    if (name !== '') {
      setParticipants((prev) => [...prev, name]);
      setValue('participantsInput', '');
    }
  };
  const handleParticipantsRemove = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };
  const submitValidForm = async (data: ProjectFormValues) => {
    console.log('Form Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('프로젝트가 등록되었습니다.');
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
  };
};
