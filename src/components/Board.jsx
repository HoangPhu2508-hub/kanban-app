import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from './TaskModal';
import ShareModal from './ShareModal';
import ProjectModal from './ProjectModal';
import { supabase } from '../supabaseClient';
import { Search, Filter, Share2, Edit3, Trash2 } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'Cần làm (To Do)' },
  { id: 'doing', title: 'Đang làm (In Progress)' },
  { id: 'done', title: 'Đã xong (Done)' }
];

export default function Board({ project, user }) {
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    if (!project) return;
    
    fetchTasks();

    const channel = supabase
      .channel(`tasks-project-${project.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${project.id}` },
        (payload) => fetchTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error.message);
    } else {
      setTasks(data || []);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // Optimistic UI update
    const updatedTasks = tasks.map(task => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId };
      }
      return task;
    });
    setTasks(updatedTasks);

    // Update DB
    const { error } = await supabase
      .from('tasks')
      .update({ status: destination.droppableId })
      .eq('id', draggableId);

    if (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleOpenTaskModal = (columnId) => {
    setActiveColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = async (taskData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          ...taskData,
          user_id: user.id,
          project_id: project.id
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding task:', error);
      alert('Lỗi thêm công việc: ' + error.message);
    } else if (data) {
      setTasks(prevTasks => [data, ...prevTasks]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const handleUpdateProject = async (newName) => {
    const { error } = await supabase
      .from('projects')
      .update({ name: newName })
      .eq('id', project.id);
      
    if (error) {
      alert('Lỗi khi cập nhật dự án: ' + error.message);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dự án "${project.name}" không? Toàn bộ thẻ công việc sẽ bị xóa vĩnh viễn.`)) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);
        
      if (error) {
        alert('Lỗi khi xóa dự án: ' + error.message);
      }
    }
  };

  const isOwner = project.created_by === user.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-glass" 
            placeholder="Tìm kiếm công việc..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="input-glass"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="All" style={{ background: 'white', color: 'black' }}>Tất cả ưu tiên</option>
            <option value="High" style={{ background: 'white', color: 'black' }}>Cao</option>
            <option value="Medium" style={{ background: 'white', color: 'black' }}>Trung bình</option>
            <option value="Low" style={{ background: 'white', color: 'black' }}>Thấp</option>
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          {isOwner && (
            <>
              <button 
                onClick={() => setIsEditProjectModalOpen(true)}
                className="btn-ghost" 
                style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}
                title="Sửa tên dự án"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={handleDeleteProject}
                className="btn-ghost" 
                style={{ padding: '0.6rem', color: '#ef4444' }}
                title="Xóa dự án"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="btn-primary" 
                style={{ padding: '0.6rem 1rem', background: '#ec4899', marginLeft: '0.5rem' }}
              >
                <Share2 size={16} /> Chia sẻ dự án
              </button>
            </>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-container" style={{ padding: '0 2rem' }}>
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter(task => task.status === column.id);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                onOpenAddModal={() => handleOpenTaskModal(column.id)}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </div>
      </DragDropContext>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSave={handleAddTask}
        columnId={activeColumnId}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={project}
        user={user}
      />
      <ProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        onSave={handleUpdateProject}
        initialName={project.name}
        title="Đổi Tên Dự Án"
        buttonText="Lưu thay đổi"
      />
    </div>
  );
}
