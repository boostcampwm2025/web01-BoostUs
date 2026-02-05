'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldError } from 'react-hook-form';

import ModalOverlay from '@/shared/ui/ModalOverlay';
import Modal from '@/widgets/Modal/Modal';

import { useProjectRegister } from '@/features/project/hook/useProjectRegister';
import { fetchStacks } from '@/entities/TechStackSelector/api/getTechStack';
import TechStackSelector from '@/entities/TechStackSelector/ui/TechStackSelector';
import {
  TechStackResponse,
  TechStackItem,
} from '@/entities/TechStackSelector/model/types';

import {
  FormInput,
  FormSelect,
} from '@/features/project/ui/register/utils/FormFields';
import {
  ThumbnailUploader,
  ParticipantManager,
} from '@/features/project/ui/register/utils/FunctionalComponents';
import { toast } from '@/shared/utils/toast';
import Button from '@/shared/ui/Button/Button';
import { getProjectReadme } from '@/features/project/api/getProjectReadme';
import { getProjectCollaborators } from '@/features/project/api/getProjectCollaborators';

import { FormMarkdownEditor } from '@/features/project/ui/register/utils/FormMarkdownEditor';

const normalizeStacks = (data: unknown): TechStackResponse => {
  const empty: TechStackResponse = {
    FRONTEND: [],
    BACKEND: [],
    DATABASE: [],
    INFRA: [],
    MOBILE: [],
    ETC: [],
  };
  if (Array.isArray(data)) return { ...empty, ETC: data as TechStackItem[] };
  if (data && typeof data === 'object') return { ...empty, ...data };
  return empty;
};

const FIELD_OPTIONS = [
  { label: '웹 풀스택', value: 'WEB' },
  { label: 'iOS', value: 'IOS' },
  { label: 'Android', value: 'ANDROID' },
] as const;

interface ProjectFormProps {
  projectId?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif']);

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEditMode = !!projectId;

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    previewUrl,
    isDragging,
    dragHandlers,
    onSubmit,
    participants,
    addParticipant,
    removeParticipant,
    setParticipants,
    techStack,
    setTechStack,
  } = useProjectRegister(projectId, () => {
    router.refresh();
    router.back();
  });

  const [stackData, setStackData] = useState<TechStackResponse | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);

  const [isOverwriteModalOpen, setIsOverwriteModalOpen] = useState(false);

  const contentsValue = watch('contents');

  useEffect(() => {
    fetchStacks()
      .then((res) => setStackData(normalizeStacks(res.data)))
      .catch((e: unknown) => {
        toast.error(e);
      });
  }, []);

  const cohortOptions = Array.from({ length: 10 }).map((_, i) => ({
    label: `${(i + 1).toString()}기`,
    value: `${(i + 1).toString()}기`,
  }));

  // 실제 데이터를 가져오는 비동기 함수
  const executeRepoFetch = async () => {
    setIsOverwriteModalOpen(false); // 모달 닫기

    const repositoryUrl = getValues('repoUrl');
    if (!repositoryUrl) return;

    setIsFetchingRepo(true);

    try {
      const [readmeResult, collaboratorsResult] = await Promise.allSettled([
        getProjectReadme(repositoryUrl),
        getProjectCollaborators(repositoryUrl),
      ]);

      if (readmeResult.status === 'fulfilled') {
        setValue('contents', readmeResult.value.content ?? '', {
          shouldDirty: true,
          shouldValidate: true,
        });
        toast.success('README를 성공적으로 불러왔습니다.');
      } else {
        toast.error('README를 불러오지 못했습니다. URL을 확인해주세요.');
      }

      if (collaboratorsResult.status === 'fulfilled') {
        const newParticipants = collaboratorsResult.value
          .map((c) => c.githubId)
          .filter(Boolean);

        if (newParticipants.length > 0) {
          setParticipants(newParticipants);
          toast.success('참여자 정보를 업데이트했습니다.');
        } else {
          toast.info('가져올 참여자 정보가 없습니다.');
        }
      } else {
        toast.error('참여자 정보를 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error(error);
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsFetchingRepo(false);
    }
  };

  // 버튼 클릭 핸들러 (내용 유무 확인)
  const handleLoadBtnClick = () => {
    const repositoryUrl = getValues('repoUrl');

    if (!repositoryUrl) {
      toast.error('Repository URL을 입력해주세요.');
      return;
    }

    // 현재 에디터에 내용이 있는지 확인
    const currentContent = getValues('contents');

    // 내용이 존재하면(공백 제외) 모달 띄움
    if (
      typeof currentContent === 'string' &&
      currentContent.trim().length > 0
    ) {
      setIsOverwriteModalOpen(true);
    } else {
      // 내용이 없거나 문자열이 아니거나, 빈 문자열이면 바로 실행
      void executeRepoFetch();
    }
  };

  return (
    <ModalOverlay>
      <div className="w-full rounded-2xl bg-neutral-surface-default">
        <h2 className="mb-4 text-display-24 text-neutral-text-strong">
          {isEditMode ? '프로젝트 수정' : '프로젝트 등록'}
        </h2>

        {/*  덮어쓰기 확인 모달 */}
        <Modal
          isOpen={isOverwriteModalOpen}
          onClose={() => setIsOverwriteModalOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-display-18 text-neutral-text-strong">
                덮어쓰기 확인
              </h3>
              <p className="mt-2 text-body-14 text-neutral-text-default">
                상세 내용이 이미 존재합니다.
                <br />
                Repository의 README 내용으로 덮어쓰시겠습니까?
              </p>
              <p className="mt-1 text-string-12 text-danger-text-default">
                * 기존 작성 내용은 사라집니다.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsOverwriteModalOpen(false)}
                className="rounded-lg border border-neutral-border-default px-4 py-2 text-string-16 text-neutral-text-default hover:bg-neutral-surface-alt transition-colors"
              >
                취소
              </button>
              <Button type="button" onClick={executeRepoFetch}>
                덮어쓰기
              </Button>
            </div>
          </div>
        </Modal>

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
          <ThumbnailUploader
            previewUrl={previewUrl}
            isDragging={isDragging}
            dragHandlers={dragHandlers}
            register={register('thumbnail', {
              validate: {
                fileType: (files) => {
                  const file = files?.[0];
                  if (!file) return true;
                  return (
                    ALLOWED_TYPES.has(file.type) ||
                    'PNG, JPG, JPEG, GIF만 업로드 가능해요.'
                  );
                },
                fileSize: (files) => {
                  const file = files?.[0];
                  if (!file) return true;
                  return (
                    file.size <= MAX_FILE_SIZE ||
                    '이미지 크기는 최대 5MB까지 가능해요.'
                  );
                },
              },
            })}
            error={errors.thumbnail}
          />

          <div className="flex flex-row gap-4">
            <FormSelect
              id="cohort"
              label="기수"
              options={cohortOptions}
              register={register('cohort')}
            />
            <FormSelect
              id="field"
              label="분야"
              options={[...FIELD_OPTIONS]}
              register={register('field')}
            />
          </div>

          <div className="flex flex-row gap-4">
            <FormInput
              id="startDate"
              type="date"
              label="시작 날짜"
              register={register('startDate', { valueAsDate: true })}
              error={errors.startDate}
            />
            <FormInput
              id="endDate"
              type="date"
              label="종료 날짜"
              register={register('endDate', { valueAsDate: true })}
              error={errors.endDate}
            />
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <FormInput
                  id="repoUrl"
                  type="url"
                  label="깃허브 Repository"
                  placeholder="URL 입력"
                  register={register('repoUrl', {
                    required: 'Repository URL은 필수입니다.',
                    pattern: {
                      value: /^https:\/\/github\.com\//,
                      message:
                        'https://github.com/ 으로 시작하는 올바른 주소를 입력해주세요.',
                    },
                  })}
                  error={errors.repoUrl}
                />
              </div>

              {/* 높이 맞춤용 가짜 라벨 */}
              <div className="flex flex-col">
                <span className="block text-string-16 text-transparent select-none">
                  &nbsp;
                </span>
                <div className="mt-1">
                  <Button
                    type="button"
                    onClick={handleLoadBtnClick}
                    disabled={isFetchingRepo}
                  >
                    {isFetchingRepo ? '로딩 중...' : '불러오기'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <FormInput
                id="demoUrl"
                type="url"
                label="데모 URL"
                placeholder="URL"
                register={register('demoUrl')}
                error={errors.demoUrl}
              />
            </div>
          </div>

          <FormInput
            id="title"
            label="프로젝트 제목"
            placeholder="제목"
            register={register('title', {
              required: '프로젝트 제목을 입력해주세요.',
              maxLength: {
                value: 50,
                message: '제목은 50자 이내로 입력해주세요.',
              },
            })}
            error={errors.title}
          />
          <FormInput
            id="description"
            label="프로젝트 요약"
            placeholder="요약"
            register={register('description')}
            error={errors.description}
          />

          <FormMarkdownEditor
            id="contents"
            label="상세 내용"
            placeholder="마크다운으로 내용을 작성해보세요."
            register={register('contents')}
            watchValue={(contentsValue as unknown as string) ?? ''} // watch값 전달 필수
            error={errors.contents}
            className="min-h-37.5"
          />

          <ParticipantManager
            participants={participants}
            addParticipant={addParticipant}
            removeParticipant={removeParticipant}
            register={register('participantsInput')}
            error={errors.participants as FieldError}
            isComposing={isComposing}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />

          <div>
            <label className="block text-string-16 text-neutral-text-default mb-2">
              기술 스택
            </label>
            {stackData ? (
              <TechStackSelector
                data={stackData}
                selectedStack={techStack}
                onChange={setTechStack}
              />
            ) : (
              <div className="h-20 flex items-center justify-center bg-neutral-surface-default border rounded text-neutral-text-weak">
                로딩 중...
              </div>
            )}
            <input type="hidden" {...register('techStack')} />
            {errors.techStack && (
              <p className="mt-1 text-string-12 text-danger-text-default">
                {errors.techStack.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <Button buttonStyle="outlined" onClick={() => router.back()}>
              취소
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? '처리 중...'
                : isEditMode
                  ? '수정 완료'
                  : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}
