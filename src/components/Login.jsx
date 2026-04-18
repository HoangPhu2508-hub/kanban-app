import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LayoutDashboard } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận (nếu có yêu cầu).');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert('Lỗi đăng nhập Google: ' + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'transparent' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '400px', width: '90%', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <LayoutDashboard size={48} color="#a855f7" />
        </div>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', color: 'var(--text-primary)' }}>Kanban App</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {isSignUp ? 'Tạo tài khoản mới' : 'Đăng nhập để tiếp tục'}
        </p>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-glass"
          />
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-glass"
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
          </button>
        </form>

        <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isSignUp ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
          >
            {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </button>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn-ghost" 
          style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
        >
          Đăng nhập bằng Google
        </button>
      </div>
    </div>
  );
}
