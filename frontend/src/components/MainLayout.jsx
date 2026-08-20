import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BoardContent } from './BoardContent';
import { projectsAPI, boardsAPI } from '../api';

export function MainLayout() {
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();

    // Listen for project creation events
    const handleCreateProject = async (e) => {
      const { name } = e.detail;
      try {
        await projectsAPI.create(name, '');
        await loadProjects();
      } catch (err) {
        console.error('Failed to create project:', err);
      }
    };

    window.addEventListener('createProject', handleCreateProject);
    return () => window.removeEventListener('createProject', handleCreateProject);
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data || response || []);

      // Load all boards for all projects
      const allBoards = [];
      for (const project of (response.data || response || [])) {
        try {
          const boardResponse = await boardsAPI.getByProject(project.id);
          allBoards.push(...(boardResponse.data || boardResponse || []));
        } catch (err) {
          console.error(`Failed to load boards for project ${project.id}:`, err);
        }
      }
      setBoards(allBoards);

      // Select first project if available
      if (response.data?.[0] || response?.[0]) {
        setSelectedProject(response.data?.[0] || response[0]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBoard = (board, project) => {
    setSelectedBoard(board);
    setSelectedProject(project);
  };

  const handleSelectProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleCreateBoard = async (projectId) => {
    const boardName = prompt('Enter board name:');
    if (!boardName) return;

    try {
      await boardsAPI.create(projectId, boardName);
      await loadProjects();
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        boards={boards}
        selectedBoard={selectedBoard}
        onSelectBoard={handleSelectBoard}
        onSelectProject={handleSelectProject}
        onCreateBoard={handleCreateBoard}
      />

      {selectedBoard ? (
        <BoardContent
          board={selectedBoard}
          project={selectedProject}
          onBack={() => setSelectedBoard(null)}
          onRefresh={loadProjects}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Select a board to get started</p>
          </div>
        </div>
      )}
    </div>
  );
}
