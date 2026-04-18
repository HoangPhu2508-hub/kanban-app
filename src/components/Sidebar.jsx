import React from 'react';
import { Plus, LayoutTemplate, Users } from 'lucide-react';

export default function Sidebar({ projects, currentProject, onSelectProject, onOpenAddProject, user }) {
  return (
    <div style={{ 
      width: '260px', 
      borderRight: '1px solid var(--border-color)', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderTopRightRadius: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Các dự án</h2>
        <button onClick={onOpenAddProject} className="btn-ghost" style={{ padding: '0.4rem' }} title="Tạo dự án mới">
          <Plus size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
            Bạn chưa có dự án nào.<br/>Hãy tạo mới!
          </p>
        ) : (
          projects.map(project => {
            const isSelected = currentProject?.id === project.id;
            const isOwner = project.created_by === user.id;

            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected ? 'var(--accent-color)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  fontWeight: isSelected ? '500' : '400',
                }}
              >
                {isOwner ? <LayoutTemplate size={18} /> : <Users size={18} />}
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {project.name}
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  );
}
