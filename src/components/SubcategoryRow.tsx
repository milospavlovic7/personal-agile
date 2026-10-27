import React, { useState } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { Category, Subcategory, Task } from '../types';
import BoardColumn from './BoardColumn';
import { ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface SubcategoryRowProps {
  category: Category;
  subcategory: Omit<Subcategory, 'order'> & { order?: number; description?: string };
  tasks: Task[];
}

export default function SubcategoryRow({ category, subcategory, tasks }: SubcategoryRowProps) {
  const collapsedSubcategories = useMomentumStore(s => s.collapsedSubcategories);
  const toggleCollapse = useMomentumStore(s => s.toggleCollapseSubcategory);
  const deleteSub = useMomentumStore(s => s.deleteSubcategory);
  const updateSubcategory = useMomentumStore(s => s.updateSubcategory);
  const isCollapsed = collapsedSubcategories.includes(subcategory.id);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(subcategory.name);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descVal, setDescVal] = useState(subcategory.description || "");

  const [isAddingBacklog, setIsAddingBacklog] = useState(false);
  const t = useTranslation();
  const language = useMomentumStore(s => s.language || 'sr');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subcategory.id === "General") return;
    if (confirm(t.deleteSwimlaneConfirm.replace("{name}", subcategory.name))) {
      deleteSub(category.id, subcategory.id);
    }
  };

  const saveName = () => {
    if (nameVal.trim() && nameVal.trim() !== subcategory.name) {
      updateSubcategory(category.id, subcategory.id, { name: nameVal.trim() });
    }
    setIsEditingName(false);
  };

  const cancelName = () => {
    setNameVal(subcategory.name);
    setIsEditingName(false);
  };

  const saveDesc = () => {
    if (descVal.trim() !== (subcategory.description || "")) {
      updateSubcategory(category.id, subcategory.id, { description: descVal.trim() });
    }
    setIsEditingDesc(false);
  };

  const cancelDesc = () => {
    setDescVal(subcategory.description || "");
    setIsEditingDesc(false);
  };

  return (
    <div className={`subcategory-swimlane ${isCollapsed ? 'collapsed' : ''}`}>
      <div 
        className="subcategory-info-cell"
      >
        <div className="subcategory-title-row" onClick={e => e.stopPropagation()}>
          <button 
            className="subcategory-header-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse(subcategory.id);
            }}
            title={isCollapsed ? (language === 'en' ? "Expand swimlane" : "Proširi swimlane") : (language === 'en' ? "Collapse swimlane" : "Skupi swimlane")}
          >
            {isCollapsed ? (
              <ChevronRight 
                size={10} 
                style={{ transition: 'transform var(--transition-fast)' }} 
              />
            ) : (
              <ChevronDown 
                size={10} 
                style={{ transition: 'transform var(--transition-fast)' }} 
              />
            )}
          </button>

          {isEditingName ? (
            <input
              type="text"
              className="subcategory-name-input"
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') cancelName();
              }}
              autoFocus
            />
          ) : (
            <span 
              className="subcategory-name"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setNameVal(subcategory.name);
                setIsEditingName(true);
              }}
              title={t.titleTooltip}
            >
              {subcategory.name}
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="subcategory-desc-row" onClick={e => e.stopPropagation()}>
            {isEditingDesc ? (
              <textarea
                className="subcategory-desc-input"
                value={descVal}
                onChange={e => setDescVal(e.target.value)}
                onBlur={saveDesc}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveDesc();
                  }
                  if (e.key === 'Escape') cancelDesc();
                }}
                placeholder={t.descPlaceholder}
                autoFocus
              />
            ) : (
              <div 
                className="subcategory-description"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setDescVal(subcategory.description || "");
                  setIsEditingDesc(true);
                }}
                title={t.descTooltip}
              >
                {subcategory.description || <span className="subcategory-desc-empty">{t.descPlaceholder}</span>}
              </div>
            )}
          </div>
        )}
        
        <div className="subcategory-meta-row" onClick={e => e.stopPropagation()}>
          <span className="subcategory-task-count">({tasks.length} {t.tasksCount})</span>
          {subcategory.id !== "General" && (
            <button
              className="category-action-btn delete-sub-btn"
              onClick={handleDelete}
              title={t.deleteSwimlaneTitle}
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed ? (
        <>
          <BoardColumn
            status="tasks"
            category={category}
            subcategory={subcategory as Subcategory}
            tasks={tasks.filter(t => t.status === "tasks")}
          />
          <BoardColumn
            status="in_progress"
            category={category}
            subcategory={subcategory as Subcategory}
            tasks={tasks.filter(t => t.status === "in_progress")}
          />
          <BoardColumn
            status="done"
            category={category}
            subcategory={subcategory as Subcategory}
            tasks={tasks.filter(t => t.status === "done")}
          />
          <BoardColumn
            status="backlog"
            category={category}
            subcategory={subcategory as Subcategory}
            tasks={tasks.filter(t => t.status === "backlog")}
            forceShowQuickAdd={isAddingBacklog}
            onQuickAddClose={() => setIsAddingBacklog(false)}
          />
          <div className="subcategory-actions-cell">
            <button 
              className="row-add-task-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingBacklog(true);
              }}
              title={t.addTaskToBacklog}
            >
              <Plus size={14} />
            </button>
          </div>
        </>
      ) : (
        // Render a placeholder empty space for collapsed grid alignment
        <div style={{ gridColumn: 'span 5' }} />
      )}
    </div>
  );
}
