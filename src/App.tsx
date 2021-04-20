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

  return (
    <div className="App">
      <input type="text" onChange={handleKeywordChange} />
      <List
        items={repos.data}
        hasMore={repos.hasMore}
        onLoad={() => console.log('load new data')}
      />
      {repos.isLoading ? (
        <div className="laoding">Loading...</div>
      ) : (
        repos.hasMore && <button onClick={repos.next}>More</button>
      )}
    </div>
  );
}

export default App;
