import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

import { getReposByQuery } from '../services/api';
import { RepoItem } from '../services/types';
import {
  REPO_SIZE,
  MAX_REPO_SIZE,
  KEYWORD_DEBOUNCED_TIME,
  TASK_SLEEP_TIME,
} from '../services/config';
import { debounce, throttleAPI } from '../services/utils';

const throttledGetRepos = throttleAPI(getReposByQuery, 5, 60 * 1000);

export const useRepos = () => {
  const queue = useRef<Promise<any> | null>(null);
  const throttleTimer = useRef(-1);
  const debouncedTimer = useRef(-1);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<RepoItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setPage] = useState(1);
  const [currentMax, setMax] = useState(-1);

  const hasMore = useMemo(
    () =>
      data.length > 0 &&
      data.length < currentMax &&
      data.length < MAX_REPO_SIZE,
    [currentMax, data],
  );

  const fetchReposData = useCallback(async (keyword: string, page: number) => {
    setLoading(true);
    const result = await throttledGetRepos(keyword, page, REPO_SIZE);

    if (page === 1) {
      setData(result.data.items);
    } else {
      setData(preData => preData.concat(result.data.items));
    }
    setMax(result.data.total_count);
    setLoading(false);
  }, []);

  const next = async () => {
    if (isLoading) return;

    fetchReposData(keyword, currentPage + 1).then(() =>
      setPage(pre => pre + 1),
    );
  };

  const init = useMemo(
    () =>
      debounce((k: string) => {
        fetchReposData(k, 1);
      }, KEYWORD_DEBOUNCED_TIME),
    [],
  );

  useEffect(() => {
    if (keyword === '') {
      setData([]);
      return;
    }

    setLoading(true); // if start to input, switch the loading to true

    init(keyword);
    // fetchRepos is stable function
  }, [keyword]);

  return {
    isLoading,
    hasMore,
    next,
    data,
    setKeyword,
  } as const;
};
