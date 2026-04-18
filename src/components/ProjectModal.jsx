import React, { useState } from 'react';

export default function ProjectModal({ isOpen, onClose, onSave, initialName = '', title = 'Tạo Dự Án Mới', buttonText = 'Tạo mới' }) {
  const [name, setName] = useState(initialName);

  // Update name when modal opens/changes
  React.useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name);
    setName('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '400px', padding: '2rem', background: 'rgba(255, 255, 255, 0.95)' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{title}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tên dự án</label>
            <input
              type="text"
              className="input-glass"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Kanban Cá nhân..."
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
