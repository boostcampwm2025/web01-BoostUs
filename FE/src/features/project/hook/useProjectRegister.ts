import { useState, useEffect, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { ProjectFormValues } from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';
import { updateProject } from '@/features/project/api/updateProject';
import { fetchProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';
import { useRouter } from 'next/navigation';
import { uploadThumbnail } from '../api/uploadThumbnail';
import { toast } from 'sonner';

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return '알 수 없는 오류';
  }
};

export const useProjectRegister = (
  editProjectId?: number,
  onClose?: () => void
) => {
  const router = useRouter();
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

  const { watch, setValue, handleSubmit } = formMethods;
  const thumbnailList = watch('thumbnail');

  // 1. 데이터 로드
  useEffect(() => {
    if (!editProjectId || isNaN(editProjectId)) return;

    const loadData = async () => {
      try {
        const response = await fetchProjectDetail({ id: editProjectId });
        const rawData = response.data || response;

        if (!rawData) return;

        const toDateString = (dateStr: string | Date | null) => {
          if (!dateStr) return new Date().toISOString().split('T')[0];
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
          return d.toISOString().split('T')[0];
        };

        const startDateStr = toDateString(rawData.startDate);
        const endDateStr = toDateString(rawData.endDate);

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

        setValue('startDate', startDateStr as any);
        setValue('endDate', endDateStr as any);
        setValue('cohort', cohortValue as any);
        setValue('field', (rawData as any).field ?? 'WEB');

        setValue('contents', contentText);

        if (rawData.thumbnailUrl) setPreviewUrl(rawData.thumbnailUrl);

        setTechStack(rawData.techStack || []);

        const participantNames =
          rawData.participants?.map((p: any) =>
            typeof p === 'string' ? p : p.githubId
          ) || [];
        setParticipants(participantNames);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };
    loadData();
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

  // 4. 폼 제출 로직
  const submitValidForm = async (data: ProjectFormValues) => {
    try {
      let uploadedThumbnailUrl: string | null = previewUrl;
      let thumbnailUploadId: string | undefined = undefined;
      if (data.thumbnail && data.thumbnail.length > 0) {
        const file = data.thumbnail[0];
        const uploadResult = await uploadThumbnail(file);
        uploadedThumbnailUrl = uploadResult.thumbnailUrl;
        thumbnailUploadId = uploadResult.thumbnailUploadId;
      }

      const cohortStr =
        typeof data.cohort === 'string' ? data.cohort.replace('기', '') : '0';
      const parsedCohort = parseInt(cohortStr, 10);

      const requestBody = {
        thumbnailUrl: uploadedThumbnailUrl,
        thumbnailUploadId: thumbnailUploadId,
        title: data.title,
        description: data.description ?? '',

        // [수정 4] 폼 데이터가 문자열이므로 그대로 전송 (혹시 모를 배열 타입 방어 코드 포함)
        contents:
          typeof data.contents === 'string'
            ? data.contents
            : Array.isArray(data.contents)
              ? data.contents.join('\n')
              : (data.contents ?? ''),

        repoUrl: data.repoUrl,

        demoUrl:
          data.demoUrl && data.demoUrl.trim() !== '' ? data.demoUrl : null,

        cohort: isNaN(parsedCohort) ? 0 : parsedCohort,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0],

        // 백엔드(@IsString({each:true}))에 맞춰 문자열 배열 그대로 전송
        techStack: techStack,

        field: data.field,
        participants: participants,
      };

      if (editProjectId) {
        await updateProject(editProjectId, requestBody as any);
        toast.success('프로젝트가 수정되었습니다.');
        await router.push('/project');
      } else {
        await registerProject(requestBody as any);
        toast.success('프로젝트가 등록되었습니다.');
        await router.push('/project');
      }
      if (onClose) onClose();
    } catch (error: unknown) {
      console.error(error);
      alert(`처리 실패: ${getErrorMessage(error)}`);
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
