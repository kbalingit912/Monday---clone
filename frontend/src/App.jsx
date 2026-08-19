import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProjectList } from './components/ProjectList';
import { Board } from './components/Board';
import './index.css';

function App() {
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleSelectBoard = (boardId, projectId) => {
    setSelectedBoardId(boardId);
    setSelectedProjectId(projectId);
  };

  return (
    <ErrorBoundary>
      <div className="w-full h-screen">
        {selectedBoardId ? (
          <Board
            boardId={selectedBoardId}
            projectId={selectedProjectId}
            onBack={() => {
              setSelectedBoardId(null);
              setSelectedProjectId(null);
            }}
          />
        ) : (
          <ProjectList onSelectBoard={handleSelectBoard} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
