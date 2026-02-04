export interface GithubRepoReadmeResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string | null;
  content: string;
  encoding: string;
}
