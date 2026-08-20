import { useState } from 'react';

const sidebarStyle = {
  backgroundColor: '#1f2937',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '256px',
  borderRightWidth: '1px',
  borderRightColor: '#374151',
};

const headerStyle = {
  padding: '24px',
  borderBottomWidth: '1px',
  borderBottomColor: '#374151',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
};

const subtitleStyle = {
  color: '#9ca3af',
  fontSize: '14px',
  marginTop: '4px',
};

const navStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
};

const bindersHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const bindersLabelStyle = {
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: '#9ca3af',
};

const plusButtonStyle = {
  color: '#9ca3af',
  fontSize: '20px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0 4px',
};

const emptyStateStyle = {
  color: '#9ca3af',
  fontSize: '13px',
  padding: '12px',
  textAlign: 'center',
};

const projectButtonStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '10px 12px',
  borderRadius: '8px',
  transition: 'all 0.2s',
  background: 'transparent',
  color: '#d1d5db',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const boardButtonStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '13px',
  background: 'transparent',
  color: '#9ca3af',
  border: 'none',
  cursor: 'pointer',
  marginBottom: '2px',
};

const footerStyle = {
  padding: '16px',
  borderTopWidth: '1px',
  borderTopColor: '#374151',
  fontSize: '12px',
  color: '#9ca3af',
};

export function Sidebar({ projects, selectedProject, boards, selectedBoard, onSelectBoard, onSelectProject, onCreateBoard }) {
  const [expandedProject, setExpandedProject] = useState(selectedProject);

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
    onSelectProject(projectId);
  };

  return (
    <aside style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>Smart Schedule</div>
        <p style={subtitleStyle}>Task Manager</p>
      </div>

      {/* Navigation */}
      <div style={navStyle}>
        {/* Binders Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={bindersHeaderStyle}>
            <h2 style={bindersLabelStyle}>Binders</h2>
            <button
              onClick={() => {
                const projectName = prompt('Enter project name:');
                if (projectName) {
                  window.dispatchEvent(
                    new CustomEvent('createProject', { detail: { name: projectName } })
                  );
                }
              }}
              style={plusButtonStyle}
              onMouseEnter={(e) => (e.target.style.color = '#d1d5db')}
              onMouseLeave={(e) => (e.target.style.color = '#9ca3af')}
              title="Create new project"
            >
              +
            </button>
          </div>

          {projects.length === 0 ? (
            <div style={emptyStateStyle}>
              No projects yet. Click + to create one.
            </div>
          ) : (
            <div>
              {projects.map((project) => (
                <div key={project.id} style={{ marginBottom: '4px' }}>
                  <button
                    onClick={() => toggleProject(project.id)}
                    style={{
                      ...projectButtonStyle,
                      background: selectedProject?.id === project.id ? '#2563eb' : 'transparent',
                      color: selectedProject?.id === project.id ? '#ffffff' : '#d1d5db',
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
                    <span>{project.name}</span>
                    <span style={{ fontSize: '12px', color: selectedProject?.id === project.id ? '#e5e7eb' : '#9ca3af' }}>
                      {boards.filter((b) => b.project_id === project.id).length}
                    </span>
                  </button>

                  {/* Boards for expanded project */}
                  {expandedProject === project.id && (
                    <div style={{ marginLeft: '12px', marginTop: '8px', borderLeftWidth: '1px', borderLeftColor: '#374151', paddingLeft: '12px' }}>
                      {boards
                        .filter((b) => b.project_id === project.id)
                        .map((board) => (
                          <button
                            key={board.id}
                            onClick={() => onSelectBoard(board, project)}
                            style={{
                              ...boardButtonStyle,
                              background: selectedBoard?.id === board.id ? '#1d4ed8' : 'transparent',
                              color: selectedBoard?.id === board.id ? '#ffffff' : '#9ca3af',
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
                          ...boardButtonStyle,
                          color: '#6b7280',
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
      <div style={footerStyle}>
        <p>© 2026 Smart Schedule</p>
      </div>
    </aside>
  );
}
