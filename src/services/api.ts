import Axios from 'axios';

import { RepoItem } from '../services/types';

const client = Axios.create({
  baseURL: 'https://api.github.com/',
});

export interface GetReposParams {
  q: string;
  page: number;
  size?: number;
}
export const getReposByQuery = ({ q, page, size = 100 }: GetReposParams) => {
  return client.get<{
    total_count: number;
    incomplete_results: boolean;
    items: RepoItem[];
  }>('/search/repositories', {
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
    params: {
      q,
      page,
      per_page: size,
      sort: 'stars', // ensure sort
    },
  });
};
