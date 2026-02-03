/** JWT 페이로드 (access/refresh 토큰) */
export type JwtPayload = {
  type?: string;
  sub?: string;
  exp?: number;
  role?: string;
};
