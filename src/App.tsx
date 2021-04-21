import { useCallback } from 'react';
import type { InputHTMLAttributes } from 'react';

import './App.css';

import List from './components/List';

import { useRepos } from './hooks/useRepos';

function App() {
  const repos = useRepos();

  const handleKeywordChange = useCallback<
    NonNullable<InputHTMLAttributes<HTMLInputElement>['onChange']>
  >(
    e => {
      repos.setKeyword(e.target.value);
    },
    [repos.setKeyword],
  );

  const handleListLoad = () => {
    console.log('load new data');
    if (repos.isLoading || !repos.hasMore) return;

    return repos.next();
  };

  return (
    <div className="App">
      <input type="text" onChange={handleKeywordChange} />
      <h1>data length: {repos.data.length}</h1>
      <List
        items={repos.data}
        hasMore={repos.hasMore}
        isLoading={repos.isLoading}
        onLoad={handleListLoad}
      />
    </div>
  );
}

export default App;
