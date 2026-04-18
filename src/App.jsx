import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ProjectModal from './components/ProjectModal';
import { supabase } from './supabaseClient';
import { LayoutDashboard, LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Session initial check:', currentSession);
      setSession(currentSession);
      if (currentSession) {
        fetchProjects();
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error('Auth check error:', err);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed:', _event, newSession);
      setSession(newSession);
      if (newSession) {
        fetchProjects();
      } else {
        setProjects([]);
        setCurrentProject(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    // Real-time subscription for projects
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => fetchProjects()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_members' },
        (payload) => fetchProjects()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      
      // Auto-select first project if none is selected
      if (data && data.length > 0) {
        setCurrentProject(prev => {
          if (!prev) return data[0];
          const exists = data.find(p => p.id === prev.id);
          return exists || data[0];
        });
      } else {
        setCurrentProject(null);
      }
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, created_by: session.user.id }])
      .select()
      .single();

    if (error) {
      alert('Lỗi tạo dự án: ' + error.message);
    } else {
      setProjects([data, ...projects]);
      setCurrentProject(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải...</div>;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header" style={{ justifyContent: 'space-between', padding: '1.5rem 2rem', marginBottom: 0, borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LayoutDashboard size={32} color="#a855f7" />
          <h1>Kanban Board</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{session.user.email}</span>
          <button onClick={handleLogout} className="btn-ghost" title="Đăng xuất" style={{ padding: '0.5rem' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      <main style={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar 
          projects={projects} 
          currentProject={currentProject} 
          onSelectProject={setCurrentProject}
          onOpenAddProject={() => setIsProjectModalOpen(true)}
          user={session.user}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {currentProject ? (
            <Board project={currentProject} user={session.user} />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              Hãy chọn hoặc tạo một dự án mới để bắt đầu.
            </div>
          )}
        </div>
      </main>

      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onSave={handleCreateProject} 
      />
    </div>
  );
}

export default App;
