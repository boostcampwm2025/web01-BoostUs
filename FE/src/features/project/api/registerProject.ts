interface ParticipantInfo {
  githubId: string;
  avatarUrl?: string;
}

interface RegisterProjectRequest {
  thumbnailUrl: string | null;
  title: string;
  description: string;
  contents: string;
  repoUrl: string;
  demoUrl: string;
  cohort: number;
  techStack: number[];
  startDate: string;
  endDate: string;
  field: string;
  participants: ParticipantInfo[];
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  error: unknown;
  data: T;
}

export async function registerProject(data: RegisterProjectRequest) {
  const res = await fetch(`/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('프로젝트 등록 실패');
  const json = (await res.json()) as APIResponse<{ id: number }>;
  return json.data.id;
}
