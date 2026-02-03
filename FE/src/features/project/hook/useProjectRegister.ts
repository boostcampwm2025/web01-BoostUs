import { useState, useEffect, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { ProjectFormValues } from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';
import {
  updateProject,
  UpdateProjectBody,
} from '@/features/project/api/updateProject';
import { fetchProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';
import { useRouter } from 'next/navigation';
import { uploadThumbnail } from '../api/uploadThumbnail';
import formatLocalDate from '@/shared/utils/formatLocalDate';
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PROJECT_KEYS } from '@/features/project/api/getProjects';

export const useProjectRegister = (
  editProjectId?: number,
  onClose?: () => void
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const formMethods = useForm<ProjectFormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      contents: '',
      repoUrl: '',
      demoUrl: '',
      cohort: '10기',
      participantsInput: '',
      techStackInput: '',
      field: 'WEB',
      startDate: new Date(),
      endDate: new Date(),
      participants: [],
      techStack: [],
    },
  });

  const { watch, setValue, handleSubmit, getValues } = formMethods;
  // eslint-disable-next-line react-hooks/incompatible-library
  const thumbnailList = watch('thumbnail');

  // 프로젝트 추가 Mutation
  const createMutation = useMutation({
    mutationFn: registerProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success('프로젝트가 등록되었습니다.');
      router.push('/project');
      if (onClose) onClose();
    },
  });

  // 프로젝트 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateProjectBody }) =>
      updateProject(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success('프로젝트 정보가 수정되었습니다.');
      router.push('/project');
      if (onClose) onClose();
    },
  });

  // 1. 데이터 로드
  useEffect(() => {
    if (!editProjectId || isNaN(editProjectId)) return;

    const loadData = async () => {
      try {
        const response = await fetchProjectDetail({ id: editProjectId });
        const rawData = response.data || response;

        if (!rawData) return;

        const toDateObj = (dateStr: string | null): Date => {
          if (!dateStr) return new Date();
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? new Date() : d;
        };

        const cohortValue = rawData.cohort
          ? `${rawData.cohort.toString().replace('기', '')}기`
          : '10기';

        const contentText = Array.isArray(rawData.contents)
          ? rawData.contents.join('\n')
          : rawData.contents || '';

        setValue('title', rawData.title);
        setValue('repoUrl', rawData.repoUrl ?? '');
        setValue('demoUrl', rawData.demoUrl ?? '');
        setValue('description', rawData.description ?? '');

        setValue('startDate', toDateObj(rawData.startDate));
        setValue('endDate', toDateObj(rawData.endDate));

        setValue('cohort', cohortValue as ProjectFormValues['cohort']);
        setValue('field', rawData.field ?? 'WEB');

        setValue('contents', contentText);

        if (rawData.thumbnailUrl) setPreviewUrl(rawData.thumbnailUrl);

        const loadedTechStack = Array.isArray(rawData.techStack)
          ? rawData.techStack
          : [];
        setTechStack(loadedTechStack);

        const loadedParticipants = Array.isArray(rawData.participants)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rawData.participants.map((p: any) =>
              typeof p === 'string' ? p : (p as { githubId: string }).githubId
            )
          : [];
        setParticipants(loadedParticipants);
      } catch (err) {
        toast.error(err);
      }
    };
    void loadData();
  }, [editProjectId, setValue]);

  // 2. 썸네일 미리보기
  useEffect(() => {
    if (thumbnailList && thumbnailList.length > 0) {
      const file = thumbnailList[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (!editProjectId) setPreviewUrl(null);
  }, [thumbnailList, editProjectId]);

  // 3. State -> Form 동기화
  useEffect(() => {
    setValue('participants', participants);
  }, [participants, setValue]);

  useEffect(() => {
    setValue('techStack', techStack);
  }, [techStack, setValue]);

  // 드래그 핸들러
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
    const raw = getValues('participantsInput');
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

  // 4. 폼 제출 로직
  const submitValidForm = async (data: ProjectFormValues) => {
    try {
      let uploadedThumbnailUrl: string | null = previewUrl;
      let thumbnailUploadId: string | null = null;

      if (data.thumbnail && data.thumbnail.length > 0) {
        const file = data.thumbnail[0];
        const uploadResult = await uploadThumbnail(file);
        uploadedThumbnailUrl = uploadResult.thumbnailUrl;
        thumbnailUploadId = uploadResult.thumbnailUploadId ?? null;
      }

      const cohortStr =
        typeof data.cohort === 'string' ? data.cohort.replace('기', '') : '0';
      const parsedCohort = parseInt(cohortStr, 10);

      const contentsStr = Array.isArray(data.contents)
        ? data.contents.join('\n')
        : (data.contents ?? '');

      const startDateLocal = formatLocalDate(data.startDate);
      const endDateLocal = formatLocalDate(data.endDate);

      const validDemoUrl =
        data.demoUrl && data.demoUrl.trim() !== '' ? data.demoUrl : null;

      // 공통으로 들어갈 기본 데이터
      const baseData = {
        thumbnailUrl: uploadedThumbnailUrl ?? null,
        thumbnailUploadId: thumbnailUploadId,
        title: data.title,
        description: data.description ?? '',
        contents: contentsStr,
        repoUrl: data.repoUrl,
        demoUrl: validDemoUrl,
        cohort: isNaN(parsedCohort) ? 0 : parsedCohort,
        startDate: startDateLocal,
        endDate: endDateLocal,
        techStack: techStack,
        field: data.field,
      };

      if (editProjectId) {
        await updateMutation.mutateAsync({
          id: editProjectId,
          body: {
            ...baseData,
            participants: participants,
            demoUrl: baseData.demoUrl ?? '',
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...baseData,
          participants: participants.map((id) => ({ githubId: id })),
        });
      }
    } catch (error: unknown) {
      toast.error(error);
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
