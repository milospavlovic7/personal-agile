import { useState, useMemo } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { Category, Subcategory, Task } from '../types';
import TaskCard from './TaskCard';
import { useTranslation } from '../utils/translations';

interface BoardColumnProps {
  status: Task['status'];
  category: Category;
  subcategory: Subcategory;
  tasks: Task[];
  forceShowQuickAdd?: boolean;
  onQuickAddClose?: () => void;
}

export default function BoardColumn({
  status,
  category,
  subcategory,
  tasks,
  forceShowQuickAdd = false,
  onQuickAddClose
}: BoardColumnProps) {
  const moveTask = useMomentumStore(s => s.moveTask);
  const addTask = useMomentumStore(s => s.addTask);
  const selectedWeek = useMomentumStore(s => s.selectedWeek);
  const columnLimit = useMomentumStore(s => s.columnLimit);
  const language = useMomentumStore(s => s.language || 'sr');
  const t = useTranslation();
  
  const [dragOver, setDragOver] = useState(false);
  const [taskDesc, setTaskDesc] = useState("");
  const [localShowQuickAdd, setLocalShowQuickAdd] = useState(false);

  // HTML5 Drag Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      moveTask(taskId, status, category.id, subcategory.id);
    }
  };

  const showQuickAdd = forceShowQuickAdd || localShowQuickAdd;

  const handleCloseQuickAdd = () => {
    setTaskDesc("");
    setLocalShowQuickAdd(false);
    if (onQuickAddClose) {
      onQuickAddClose();
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskDesc.trim()) {
      addTask({
        description: taskDesc.trim(),
        categoryId: category.id,
        subcategoryId: subcategory.id,
        sprintWeek: status === "backlog" ? null : selectedWeek,
        status: status
      });
      handleCloseQuickAdd();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      handleCloseQuickAdd();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseQuickAdd();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (showQuickAdd) return;

    // Verify target is not inside a task card, an active form, input, textarea, or button
    const target = e.target as HTMLElement;
    if (
      target.closest('.task-card') || 
      target.closest('.quick-create-container') || 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.tagName === 'BUTTON'
    ) {
      return;
    }
    
    setLocalShowQuickAdd(true);
  };

  // Sorting: pinned first, then priority (null last), then creation date
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      const priA = a.priority === null ? 999 : a.priority;
      const priB = b.priority === null ? 999 : b.priority;
      if (priA !== priB) return priA - priB;
      
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [tasks]);

  const { displayedTasks, hiddenCount } = useMemo(() => {
    let limit = Infinity;
    if (columnLimit === 'top3') limit = 3;
    if (columnLimit === 'top5') limit = 5;
    
    return {
      displayedTasks: sortedTasks.slice(0, limit),
      hiddenCount: Math.max(0, sortedTasks.length - limit)
    };
  }, [sortedTasks, columnLimit]);

  const hiddenTasksText = useMemo(() => {
    if (language === 'en') {
      return `${t.morePrefix} ${hiddenCount} ${hiddenCount === 1 ? t.moreTask1 : t.moreTask24}`;
    } else {
      let label = t.moreTask5;
      const mod10 = hiddenCount % 10;
      const mod100 = hiddenCount % 100;
      
      if (mod10 === 1 && mod100 !== 11) {
        label = t.moreTask1;
      } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        label = t.moreTask24;
      }
      return `${t.morePrefix} ${hiddenCount} ${label}`;
    }
  }, [hiddenCount, language, t]);

  return (
    <div
      className={`board-column ${status} ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={handleDoubleClick}
    >
      <div className="task-list">
        {displayedTasks.map(t => (
          <TaskCard key={t.id} task={t} />
        ))}

        {hiddenCount > 0 && (
          <div className="hidden-tasks-badge" title={language === 'en' ? "Some tasks are hidden by the display limit" : "Neki zadaci su skriveni limitom prikaza"}>
            {hiddenTasksText}
          </div>
        )}
        
        {showQuickAdd && (
          <div className="quick-create-container inline-form" onDoubleClick={e => e.stopPropagation()}>
            <form onSubmit={handleQuickSubmit} className="quick-create-form">
              <input
                type="text"
                className="quick-create-input"
                placeholder={t.newTaskPlaceholder}
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
