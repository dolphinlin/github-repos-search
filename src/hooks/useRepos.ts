import { useState, useEffect, useCallback, useMemo } from 'react';
import parseLinkHeader, { Link } from 'parse-link-header';

import { getReposByQuery } from '../services/api';
import { RepoItem } from '../services/types';
import {
  REPO_SIZE,
  KEYWORD_DEBOUNCED_TIME,
  RATE_LIMIT_LIMIT,
  RATE_LIMIT_DURATION,
  ResponseHeader,
} from '../services/config';
import { debounce, throttleAPI, ms2s } from '../services/utils';

interface LinkRef extends Link {
  page: string;
  per_page: string;
  q: string;
}

const { fn: throttledGetRepos, cancel } = throttleAPI(getReposByQuery, res => {
  const { headers } = res;

  return {
    limit: headers[ResponseHeader.limit] ?? RATE_LIMIT_LIMIT,
    used: headers[ResponseHeader.used] ?? 0,
    resetTime:
      headers[ResponseHeader.reset] ?? ms2s(Date.now() + RATE_LIMIT_DURATION),
  };
});

const INIT_PAGE = 1;
export const useRepos = () => {
  /**
   * @TODO use reducer to replace multiple state
   */
  const [linkRef, setLinkRef] = useState<LinkRef | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<RepoItem[]>([]);
  const [keyword, setKeyword] = useState('');

  const hasMore = useMemo(() => !!linkRef?.page && data.length > 0, [
    linkRef,
    data,
  ]);

  const fetchReposData = useCallback(async (keyword: string, page: number) => {
    setLoading(true);
    const result = await throttledGetRepos({
      q: keyword,
      page,
      size: REPO_SIZE,
    });

    // get next rel by header
    const { link } = result.headers;
    if (link) {
      const parsed = parseLinkHeader(link);

      setLinkRef((parsed?.next as LinkRef) ?? null);
    }

    if (page === INIT_PAGE) {
      setData(result.data.items);
    } else {
      setData(preData => preData.concat(result.data.items));
    }
    setLoading(false);
  }, []);

  const next = useCallback(async () => {
    if (isLoading || !linkRef) return;

    fetchReposData(linkRef.q, +linkRef.page);
  }, [isLoading, linkRef, fetchReposData]);

  const init = useMemo(
    () =>
      debounce((k: string) => {
        if (!k.trim()) return;
        fetchReposData(k, INIT_PAGE);
      }, KEYWORD_DEBOUNCED_TIME),
    [fetchReposData],
  );

  useEffect(() => {
    setData([]); // clear data
    init(keyword);
    if (keyword === '') {
      setLoading(false);
      return;
    }

    // if start to input, switch the loading to true
    setLoading(true);
    cancel(); // cancel previous call
  }, [keyword]);

  return {
    isLoading,
    hasMore,
    next,
    data,
    setKeyword,
  } as const;
};
