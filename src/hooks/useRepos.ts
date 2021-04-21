import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import parseLinkHeader from 'parse-link-header';

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

interface LinkRef {
  page: number;
  per_page: number;
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

export const useRepos = () => {
  const [linkRef, setLinkRef] = useState<LinkRef | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<RepoItem[]>([]);
  const [keyword, setKeyword] = useState('');

  const hasMore = useMemo(() => !!linkRef?.page, [linkRef]);

  const fetchReposData = useCallback(async (keyword: string, page: number) => {
    setLoading(true);
    const result = await throttledGetRepos({
      q: keyword,
      page,
      size: REPO_SIZE,
    });

    const { link } = result.headers;
    if (link) {
      const parsed = parseLinkHeader(link);

      /**
       * @TODO type assert
       */
      setLinkRef((parsed?.next as any) ?? null);
    }

    if (page === 1) {
      setData(result.data.items);
    } else {
      setData(preData => preData.concat(result.data.items));
    }
    setLoading(false);
  }, []);

  const next = async () => {
    if (isLoading || !linkRef) return;

    fetchReposData(linkRef.q, linkRef.page);
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
