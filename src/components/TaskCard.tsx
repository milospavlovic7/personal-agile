import React, { useState, useMemo } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { Task } from '../types';
import { Pin, Check, Target, Edit2 } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const togglePinTask = useMomentumStore(s => s.togglePinTask);
  const setEditingTask = useMomentumStore(s => s.setEditingTask);
  const toggleDailyFocus = useMomentumStore(s => s.toggleDailyFocus);
  const dailyFocusIds = useMomentumStore(s => s.dailyFocus);
  const selectedWeek = useMomentumStore(s => s.selectedWeek);
  const t = useTranslation();

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Rollover detection indicator
  const isRollover = useMemo(() => {
    return !!(task.sprintWeek && task.sprintWeek < selectedWeek && task.status !== "done");
  }, [task, selectedWeek]);

  const subtasksDone = task.subtasks ? task.subtasks.filter(s => s.done).length : 0;
  const subtasksTotal = task.subtasks ? task.subtasks.length : 0;

  const isDailyFocus = dailyFocusIds.includes(task.id);

  const updateTask = useMomentumStore(s => s.updateTask);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descVal, setDescVal] = useState(task.description);

  const saveDescription = () => {
    if (descVal.trim() && descVal.trim() !== task.description) {
      updateTask(task.id, { description: descVal.trim() });
    }
    setIsEditingDesc(false);
  };

  const cancelDescription = () => {
    setDescVal(task.description);
    setIsEditingDesc(false);
  };

  return (
    <div
      className={`task-card ${task.pinned ? 'pinned' : ''} ${isDragging ? 'dragging' : ''} ${isDailyFocus ? 'daily-focus' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditingTask(task);
      }}
    >
      <div className="task-card-header">
        {isEditingDesc ? (
          <textarea
            className="task-desc-inline-input"
            value={descVal}
            onChange={e => setDescVal(e.target.value)}
            onBlur={saveDescription}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveDescription();
              }
              if (e.key === 'Escape') cancelDescription();
            }}
            autoFocus
            onClick={e => e.stopPropagation()}
            onDoubleClick={e => e.stopPropagation()}
          />
        ) : (
          <span 
            className="task-description"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setDescVal(task.description);
              setIsEditingDesc(true);
            }}
            title={t.descEditTooltip}
          >
            {task.description}
          </span>
        )}
        <div className="task-card-pins" onClick={e => e.stopPropagation()}>
          <button
            className="task-card-pin-btn"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTask(task);
            }}
            title={t.detailedEditTooltip}
          >
            <Edit2 size={10} />
          </button>
          <button
            className={`task-card-pin-btn ${task.pinned ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              togglePinTask(task.id);
            }}
            title={task.pinned ? t.unpinTooltip : t.pinTopTooltip}
          >
            <Pin size={10} style={{ transform: task.pinned ? 'rotate(45deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
        </div>
      </div>

      <div className="task-card-footer">
        <div className="task-tags-left">
          {task.priority && (
            <span className={`tag-pill priority priority-${task.priority}`}>
              P{task.priority}
            </span>
          )}
          {task.effort && (
            <span className={`tag-pill effort effort-${task.effort.toLowerCase()}`}>
              {task.effort}
            </span>
          )}
          {isRollover && (
            <span className="task-rollover-badge" title={t.rolloverBadge}>
              {t.rolloverBadge}
            </span>
          )}
        </div>

        {subtasksTotal > 0 && (
          <div className="task-subtask-summary">
            <Check size={9} />
            <span>{subtasksDone}/{subtasksTotal}</span>
          </div>
        )}
        
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: isDailyFocus ? 'var(--accent-purple)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleDailyFocus(task.id);
          }}
          title={isDailyFocus ? t.pinnedFocusTooltip : t.pinFocusTooltip}
        >
          <Target size={10} />
        </button>
      </div>
    </div>
  );
}
