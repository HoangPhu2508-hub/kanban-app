import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, AlertCircle, Edit3 } from 'lucide-react';

const PRIORITY_COLORS = {
  Low: '#34d399',    // Green
  Medium: '#fbbf24', // Yellow
  High: '#ef4444'    // Red
};

const PRIORITY_LABELS = {
  Low: 'Thấp',
  Medium: 'Trung bình',
  High: 'Cao'
};

export default function Card({ task, index, onDeleteTask, onEditTask }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="glass-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: '1rem',
            marginBottom: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style.transform} scale(1.05)`
              : provided.draggableProps.style.transform,
            ...provided.draggableProps.style,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1rem', fontWeight: '500', lineHeight: '1.4' }}>
              {task.title}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                className="btn-ghost" 
                style={{ padding: '4px', color: 'var(--text-secondary)' }}
                onClick={() => onEditTask(task)}
                title="Sửa công việc"
              >
                <Edit3 size={16} />
              </button>
              <button 
                className="btn-ghost" 
                style={{ padding: '4px', color: 'var(--text-secondary)' }}
                onClick={() => onDeleteTask(task.id)}
                title="Xóa công việc"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            <AlertCircle size={14} color={PRIORITY_COLORS[task.priority]} />
            <span style={{ fontSize: '0.75rem', color: PRIORITY_COLORS[task.priority] }}>
              {PRIORITY_LABELS[task.priority] || task.priority}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
