interface ErrorResponse {
  message?: string;
}

export async function updateNickname(nickname: string): Promise<void> {
  const response = await fetch('/api/members/me/profile/nickname', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
    credentials: 'include',
  });

  if (!response.ok) {
    // 백엔드에서 보낸 에러 메시지 전송
    let message = '닉네임 변경에 실패했습니다.';
    try {
      const errorData = (await response.json()) as ErrorResponse;
      if (errorData?.message) message = errorData.message;
    } catch {
      // non-JSON 또는 빈 응답 대비
    }
    throw new Error(message);
  }
}
