interface ParticipantInfo {
  githubId: string;
  avatarUrl?: string;
}

interface RegisterProjectRequest {
  thumbnailUploadId?: string | null;

  thumbnailUrl?: string | null;

  title: string;

  description?: string | null;
  contents?: string | null;

  repoUrl: string;
  demoUrl?: string | null;

  cohort: number;

  techStack?: string[] | null;

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

const safeReadText = async (res: Response): Promise<string> => {
  try {
    return await res.text();
  } catch {
    return '';
  }
};

const safeParseJson = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const getServerMessage = (parsed: unknown, fallbackText: string): string => {
  if (!isRecord(parsed)) return fallbackText || '요청 실패';

  const message =
    typeof parsed.message === 'string' ? parsed.message : undefined;

  const error =
    isRecord(parsed.error) && typeof parsed.error.message === 'string'
      ? parsed.error.message
      : undefined;

  return error ?? message ?? (fallbackText ? fallbackText : '요청 실패');
};

export async function registerProject(data: RegisterProjectRequest) {
  const res = await fetch(`/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await safeReadText(res);
    const parsed = safeParseJson(text);
    const serverMsg = getServerMessage(parsed, text);

    const statusPart = `status: ${String(res.status)} ${res.statusText}`;
    throw new Error(`프로젝트 등록 실패 (${statusPart}) - ${serverMsg}`);
  }

  const json = (await res.json()) as APIResponse<{ id: number }>;
  return json.data.id;
}
