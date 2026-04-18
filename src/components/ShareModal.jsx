import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ShareModal({ isOpen, onClose, project, user }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // Add to project_members
    const { error } = await supabase
      .from('project_members')
      .insert([{ project_id: project.id, email: email.trim() }]);

    setLoading(false);
    if (error) {
      if (error.code === '23505') {
        alert('Email này đã nằm trong dự án!');
      } else {
        alert('Lỗi chia sẻ: Bạn có phải người tạo dự án này không?');
      }
    } else {
      alert('Chia sẻ thành công!');
      setEmail('');
      onClose();
    }
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
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Chia sẻ dự án</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Mời người khác cùng xem và chỉnh sửa thẻ công việc trong bảng <strong>{project.name}</strong>
        </p>
        <form onSubmit={handleShare}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email người nhận</label>
            <input 
              type="email" 
              className="input-glass" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nguyenvana@gmail.com"
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi lời mời'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
