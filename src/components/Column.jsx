import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { Plus } from 'lucide-react';

export default function Column({ column, tasks, onOpenAddModal, onDeleteTask }) {
  return (
    <div 
      className="glass-panel"
      style={{
        width: '320px',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        maxHeight: '100%',
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem', 
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          {column.title}
        </h3>
        <span style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '0.8rem' 
        }}>
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: '100px',
              overflowY: 'auto',
              transition: 'background-color 0.2s ease',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              borderRadius: '8px',
              // hide scrollbar but allow scroll
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {tasks.map((task, index) => (
              <Card 
                key={task.id} 
                task={task} 
                index={index} 
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div style={{ marginTop: '1rem' }}>
        <button 
          className="btn-ghost" 
          style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem' }}
          onClick={onOpenAddModal}
        >
          <Plus size={18} style={{ marginRight: '0.5rem' }}/>
          Thêm thẻ mới
        </button>
      </div>
    </div>
  );
}
