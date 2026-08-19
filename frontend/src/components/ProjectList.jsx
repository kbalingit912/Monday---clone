import { useState, useEffect } from 'react';
import { projectsAPI, boardsAPI } from '../api';

export function ProjectList({ onSelectBoard, onSelectBoardWithProject }) {
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState({});
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedProject, setExpandedProject] = useState(null);
  const [creatingBoardFor, setCreatingBoardFor] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBoardsForProject = async (projectId) => {
    if (boards[projectId]) {
      setExpandedProject(expandedProject === projectId ? null : projectId);
      return;
    }

    try {
      const response = await boardsAPI.getByProject(projectId);
      setBoards({ ...boards, [projectId]: response.data });
      setExpandedProject(projectId);
    } catch (err) {
      console.error('Failed to load boards:', err);
    }
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      try {
        await projectsAPI.create(newProjectName, '');
        setNewProjectName('');
        await loadProjects();
      } catch (err) {
        console.error('Failed to create project:', err);
      }
    }
  };

  const handleCreateBoard = async () => {
    if (newBoardName.trim() && creatingBoardFor) {
      try {
        const boardRes = await boardsAPI.create(creatingBoardFor, newBoardName);
        await boardsAPI.initColumns(boardRes.data.id);
        const response = await boardsAPI.getByProject(creatingBoardFor);
        setBoards({ ...boards, [creatingBoardFor]: response.data });
        setNewBoardName('');
        setCreatingBoardFor(null);
      } catch (err) {
        console.error('Failed to create board:', err);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900">Smart Schedule</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Project</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateProject}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Create
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No projects yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg border border-gray-200">
                  <button
                    onClick={() => loadBoardsForProject(project.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <span className="text-gray-400">
                        {expandedProject === project.id ? '▼' : '▶'}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {project.description}
                      </p>
                    )}
                  </button>

                  {expandedProject === project.id && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                      {creatingBoardFor === project.id ? (
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            placeholder="Board name..."
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={handleCreateBoard}
                            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => {
                              setCreatingBoardFor(null);
                              setNewBoardName('');
                            }}
                            className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCreatingBoardFor(project.id)}
                          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                        >
                          + Add Board
                        </button>
                      )}
                      <div className="space-y-2">
                        {boards[project.id]?.map((board) => (
                          <button
                            key={board.id}
                            onClick={() => onSelectBoard(board.id, project.id)}
                            className="w-full px-4 py-3 bg-white text-left border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            {board.name}
                          </button>
                        ))}
                        {boards[project.id]?.length === 0 && (
                          <p className="text-sm text-gray-600 italic">
                            No boards yet
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
