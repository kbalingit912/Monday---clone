import { useState } from 'react';

export function Sidebar({ projects, selectedProject, boards, selectedBoard, onSelectBoard, onSelectProject, onCreateBoard }) {
  const [expandedProject, setExpandedProject] = useState(selectedProject);

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
    onSelectProject(projectId);
  };

  return (
    <aside style={{ backgroundColor: '#1f2937' }} className="w-64 text-white flex flex-col h-screen border-r" style={{ borderColor: '#374151' }}>
      {/* Header */}
      <div className="p-6" style={{ borderBottomColor: '#374151', borderBottomWidth: '1px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>Smart Schedule</div>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Task Manager</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Binders Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 mb-3">
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9ca3af' }}>
              Binders
            </h2>
            <button
              onClick={() => {
                const projectName = prompt('Enter project name:');
                if (projectName) {
                  window.dispatchEvent(
                    new CustomEvent('createProject', { detail: { name: projectName } })
                  );
                }
              }}
              style={{
                color: '#9ca3af',
                fontSize: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#d1d5db')}
              onMouseLeave={(e) => (e.target.style.color = '#9ca3af')}
              title="Create new project"
            >
              +
            </button>
          </div>

          {projects.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '13px', padding: '12px', textAlign: 'center' }}>
              No projects yet. Click + to create one.
            </div>
          ) : (
            <div className="space-y-1">
              {projects.map((project) => (
                <div key={project.id}>
                  <button
                    onClick={() => toggleProject(project.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      background: selectedProject?.id === project.id ? '#2563eb' : 'transparent',
                      color: selectedProject?.id === project.id ? '#ffffff' : '#d1d5db',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedProject?.id !== project.id) {
                        e.target.style.backgroundColor = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedProject?.id !== project.id) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{project.name}</span>
                      <span style={{ fontSize: '12px', color: selectedProject?.id === project.id ? '#e5e7eb' : '#9ca3af' }}>
                        {boards.filter((b) => b.project_id === project.id).length}
                      </span>
                    </div>
                  </button>

                  {/* Boards for expanded project */}
                  {expandedProject === project.id && (
                    <div style={{ marginLeft: '12px', marginTop: '8px', borderLeftColor: '#374151', borderLeftWidth: '1px', paddingLeft: '12px', space: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {boards
                        .filter((b) => b.project_id === project.id)
                        .map((board) => (
                          <button
                            key={board.id}
                            onClick={() => onSelectBoard(board, project)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              transition: 'all 0.2s',
                              background: selectedBoard?.id === board.id ? '#1d4ed8' : 'transparent',
                              color: selectedBoard?.id === board.id ? '#ffffff' : '#9ca3af',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              if (selectedBoard?.id !== board.id) {
                                e.target.style.backgroundColor = '#2d3748';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedBoard?.id !== board.id) {
                                e.target.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            {board.name}
                          </button>
                        ))}
                      <button
                        onClick={() => onCreateBoard(project.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: '#6b7280',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#9ca3af')}
                        onMouseLeave={(e) => (e.target.style.color = '#6b7280')}
                      >
                        + New board
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px', borderTopColor: '#374151', borderTopWidth: '1px', fontSize: '12px', color: '#9ca3af' }}>
        <p>© 2026 Smart Schedule</p>
      </div>
    </aside>
  );
}
