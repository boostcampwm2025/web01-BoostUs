export type TokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

export type GithubUserResponse = {
  id: number;
  login: string;
  avatar_url: string;
};

export type GithubOrgResponse = {
  login: string;
  id: number;
};

export type GithubLoginPayload = {
  githubId: number;
  githubLogin: string;
  avatarUrl: string;
  orgLogins: string[];
};
