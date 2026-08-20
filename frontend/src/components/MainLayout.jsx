import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BoardContent } from './BoardContent';
import { TradingAssistant } from './TradingAssistant';
import { projectsAPI, boardsAPI } from '../api';

export function MainLayout() {
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' or 'trading'

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

    // Listen for project update events
    const handleProjectsUpdated = async () => {
      await loadProjects();
    };

    window.addEventListener('createProject', handleCreateProject);
    window.addEventListener('projectsUpdated', handleProjectsUpdated);
    return () => {
      window.removeEventListener('createProject', handleCreateProject);
      window.removeEventListener('projectsUpdated', handleProjectsUpdated);
    };
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

      <div className="flex-1 flex flex-col">
        {/* View Switcher */}
        <div style={{ borderBottomColor: '#e5e7eb', borderBottomWidth: '1px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px', backgroundColor: '#ffffff', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentView('tasks')}
            style={{
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderRadius: '6px',
              background: currentView === 'tasks' ? '#2563eb' : 'transparent',
              color: currentView === 'tasks' ? '#ffffff' : '#4b5563',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'tasks') {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'tasks') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            📋 Task Manager
          </button>
          <button
            onClick={() => setCurrentView('trading')}
            style={{
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderRadius: '6px',
              background: currentView === 'trading' ? '#2563eb' : 'transparent',
              color: currentView === 'trading' ? '#ffffff' : '#4b5563',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'trading') {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'trading') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            💰 Trading Assistant
          </button>
        </div>

        {/* Content */}
        {currentView === 'tasks' ? (
          selectedBoard ? (
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
          )
        ) : (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <TradingAssistant />
          </div>
        )}
      </div>
    </div>
  );
}
