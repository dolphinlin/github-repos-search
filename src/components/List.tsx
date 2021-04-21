import { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import Item from './Item';
import Loading from './Loading';

import { RepoItem } from '../services/types';

const Container = styled.div`
  height: 300px;
  width: 100%;
  margin: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

const observerOption: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

export interface Props {
  items: RepoItem[];
  hasMore: boolean;
  isLoading: boolean;
  onLoad?: () => void;
}
const List = ({ items, hasMore, isLoading, onLoad: handleLoad }: Props) => {
  const hasMoreRef = useRef<HTMLDivElement | null>(null);

  const observerCB = useCallback<IntersectionObserverCallback>(
    entries => {
      const loadingEntry = entries.find(
        entry => entry.target === hasMoreRef.current,
      );

      if (!loadingEntry) return;
      if (loadingEntry.isIntersecting && handleLoad) handleLoad();
    },
    [handleLoad],
  );

  useEffect(() => {
    // register intersection-observer
    const observer = new IntersectionObserver(observerCB, observerOption);
    if (hasMoreRef.current) observer.observe(hasMoreRef.current);

    // unregister observer after unmount
    return () => {
      if (hasMoreRef.current) {
        observer.unobserve(hasMoreRef.current);
      }
    };
  }, [observerCB]);

  return (
    <Container className="list">
      {items.map(item => (
        <Item
          key={item.id}
          id={`${item.id}`}
          name={item.full_name}
          starsCount={item.stargazers_count}
          owner={item.owner.login}
          url={item.html_url}
        />
      ))}
      {isLoading && (
        <div className="loading">
          <Loading />
        </div>
      )}

      {hasMore && <div className="has-more" ref={hasMoreRef}></div>}
    </Container>
  );
};

export default List;
