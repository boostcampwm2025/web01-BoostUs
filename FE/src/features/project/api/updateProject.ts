interface UpdateProjectBody {
  title: string;
  repoUrl: string;
  thumbnailUrl: string | null;
  description: string;
  contents: string;
  demoUrl: string;
  cohort: number;
  techStack: string[];
  startDate: string;
  endDate: string;
  field: string;
  participants: string[];
}

export const updateProject = async (id: number, body: UpdateProjectBody) => {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // 에러 처리: 서버에서 에러 메시지를 주면 그걸 던지고, 아니면 기본 메시지
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '프로젝트 수정에 실패했습니다.');
  }

  return response.json();
};
