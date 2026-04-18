import React, { useState } from 'react';

export default function TaskModal({ isOpen, onClose, onSave, columnId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, priority, status: columnId });
    setTitle('');
    setDescription('');
    setPriority('Medium');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }}>
        <h2 style={{ marginBottom: '1rem' }}>Thêm công việc mới</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tiêu đề *</label>
            <input 
              autoFocus
              className="input-glass" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Nhập tiêu đề..."
              required
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mô tả</label>
            <textarea 
              className="input-glass" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Nhập mô tả chi tiết..."
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Độ ưu tiên</label>
            <select 
              className="input-glass" 
              value={priority} 
              onChange={e => setPriority(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="Low" style={{ background: 'white', color: 'black' }}>Thấp</option>
              <option value="Medium" style={{ background: 'white', color: 'black' }}>Trung bình</option>
              <option value="High" style={{ background: 'white', color: 'black' }}>Cao</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Hủy</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
