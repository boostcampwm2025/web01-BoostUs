import { useState, useEffect, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  projectSchema,
  ProjectFormValues,
} from '@/features/project/model/projectSchema';
import { registerProject } from '@/features/project/api/registerProject';
import { updateProject } from '@/features/project/api/updateProject';
import { fetchProjectDetail } from '@/entities/projectDetail/api/projectDetailAPI';

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

export const useProjectRegister = (
  editProjectId?: number,
  onClose?: () => void
) => {
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

  const { watch, setValue, handleSubmit, reset } = formMethods;
  const thumbnailList = watch('thumbnail');

  useEffect(() => {
    if (!editProjectId || isNaN(editProjectId)) return;

    const loadData = async () => {
      try {
        const response = await fetchProjectDetail({ id: editProjectId });
        const rawData = response.data || response;

        if (!rawData) {
          console.error('데이터가 비어있습니다.');
          return;
        }

        // 1. 날짜 변환 (YYYY-MM-DD)
        const toDateString = (dateStr: string | Date | null) => {
          if (!dateStr) return new Date().toISOString().split('T')[0];
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
          return d.toISOString().split('T')[0];
        };

        const startDateStr = toDateString(rawData.startDate);
        const endDateStr = toDateString(rawData.endDate);

        // 2. 기수 변환
        const cohortValue = rawData.cohort
          ? `${rawData.cohort.toString().replace('기', '')}기`
          : '10기';

        // 3. 내용 변환 (배열의 0번째 요소)
        const contentText = Array.isArray(rawData.contents)
          ? rawData.contents[0]
          : rawData.contents || '';

        setValue('title', rawData.title);
        setValue('repoUrl', rawData.repoUrl ?? '');
        setValue('demoUrl', rawData.demoUrl ?? '');
        setValue('description', rawData.description ?? '');

        // 날짜 강제 주입
        setValue('startDate', startDateStr as any);
        setValue('endDate', endDateStr as any);

        // 셀렉트 박스 강제 주입
        setValue('cohort', cohortValue as any);
        setValue('field', (rawData.field ?? 'WEB') as any);

        // 텍스트 에디터 강제 주입 (contents는 배열 형태나 .0으로 접근)
        setValue('contents', [contentText]); // 혹은 setValue('contents.0', contentText);

        // 4. 별도 상태(State) 동기화
        setPreviewUrl(rawData.thumbnailUrl);
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
  }, [editProjectId, setValue, reset]); // 의존성에 setValue 추가

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

      if (editProjectId) {
        await updateProject(editProjectId, requestBody);
        alert('수정되었습니다.');
      } else {
        await registerProject(requestBody);
        alert('등록되었습니다.');
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
