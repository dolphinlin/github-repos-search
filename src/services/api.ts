import Axios from 'axios';

import { RepoItem } from '../services/types';

const client = Axios.create({
  baseURL: 'https://api.github.com/',
});

export const getReposByQuery = (q: string, page: number, size: number = 100) =>
  client.get<{
    total_count: number;
    incomplete_results: boolean;
    items: RepoItem[];
  }>('/search/repositories', {
    params: {
      q,
      page,
      per_page: size,
    },
  });
