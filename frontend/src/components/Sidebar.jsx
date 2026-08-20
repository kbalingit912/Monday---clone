import { useState } from 'react';

export function Sidebar({ projects, selectedProject, boards, selectedBoard, onSelectBoard, onSelectProject, onCreateBoard }) {
  const [expandedProject, setExpandedProject] = useState(selectedProject);

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
    onSelectProject(projectId);
  };

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col h-screen border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">Smart Schedule</h1>
        <p className="text-slate-400 text-sm mt-1">Task Manager</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Binders Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 mb-3">
            <h2 className="text-xs uppercase font-bold text-slate-400">Binders</h2>
            <button
              onClick={() => {
                const projectName = prompt('Enter project name:');
                if (projectName) {
                  // Trigger create project
                  window.dispatchEvent(
                    new CustomEvent('createProject', { detail: { name: projectName } })
                  );
                }
              }}
              className="text-slate-400 hover:text-slate-200 text-lg"
              title="Create new project"
            >
              +
            </button>
          </div>
          <div className="space-y-1">
            {projects.map((project) => (
              <div key={project.id}>
                <button
                  onClick={() => toggleProject(project.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    selectedProject?.id === project.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-xs text-slate-400">
                      {boards.filter((b) => b.project_id === project.id).length}
                    </span>
                  </div>
                </button>

                {/* Boards for expanded project */}
                {expandedProject === project.id && (
                  <div className="ml-3 mt-2 space-y-1 border-l border-slate-700 pl-3">
                    {boards
                      .filter((b) => b.project_id === project.id)
                      .map((board) => (
                        <button
                          key={board.id}
                          onClick={() => onSelectBoard(board, project)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            selectedBoard?.id === board.id
                              ? 'bg-blue-500 text-white'
                              : 'text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {board.name}
                        </button>
                      ))}
                    <button
                      onClick={() => onCreateBoard(project.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition"
                    >
                      + New board
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        <p>© 2026 Smart Schedule</p>
      </div>
    </aside>
  );
}
