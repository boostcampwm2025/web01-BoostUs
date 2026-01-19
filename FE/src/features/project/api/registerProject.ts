interface ParticipantInfo {
  githubId: string;
  avatarUrl?: string;
}

interface RegisterProjectRequest {
  thumbnailUrl?: string | null;

  title: string;

  description?: string | null;
  contents?: string | null;

  repoUrl: string;
  demoUrl?: string | null;

  cohort: number;

  techStack?: number[] | null;

  startDate: string;
  endDate: string;

  field: string;

  participants?: ParticipantInfo[] | null;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  error: unknown;
  data: T;
}

const safeReadBody = async (res: Response): Promise<string> => {
  try {
    return await res.text();
  } catch {
    return '';
  }
};

const safeReadText = async (res: Response): Promise<string> => {
  try {
    return await res.text();
  } catch {
    return '';
  }
};

const safeParseJson = <T,>(text: string): T | null => {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

export async function registerProject(data: RegisterProjectRequest) {
  const res = await fetch(`/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await safeReadText(res);
    const parsed = safeParseJson<APIResponse<null>>(text);

    const serverMsg =
      parsed?.error?.message ?? parsed?.message ?? (text ? text : '요청 실패');

    // eslint(@typescript-eslint/restrict-template-expressions): 숫자는 문자열로 변환
    const statusPart = `status: ${String(res.status)} ${res.statusText}`;

    throw new Error(`프로젝트 등록 실패 (${statusPart}) - ${serverMsg}`);
  }

  const json = (await res.json()) as APIResponse<{ id: number }>;
  return json.data.id;
}
