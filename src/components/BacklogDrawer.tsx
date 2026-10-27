import React, { useState, useMemo } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { useTranslation } from '../utils/translations';
import { Task } from '../types';
import { Folder, Search } from 'lucide-react';

interface BacklogDrawerProps {
  backlogTasks: Task[];
}

export default function BacklogDrawer({ backlogTasks }: BacklogDrawerProps) {
  const t = useTranslation();
  const moveTask = useMomentumStore(s => s.moveTask);
  const addTask = useMomentumStore(s => s.addTask);
  const categories = useMomentumStore(s => s.categories);
  const setEditingTask = useMomentumStore(s => s.setEditingTask);
  
  const [dragOver, setDragOver] = useState(false);
  const [backlogSearch, setBacklogSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [priSort, setPriSort] = useState("all");
  const [quickDesc, setQuickDesc] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || "General");

  // Drag and drop backlog handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      moveTask(taskId, "backlog", undefined, undefined);
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickDesc.trim()) {
      addTask({
        description: quickDesc.trim(),
        categoryId: selectedCatId,
        subcategoryId: "General",
        sprintWeek: null,
        status: "backlog"
      });
      setQuickDesc("");
    }
  };

  // Filtered Backlog calculation
  const filteredBacklog = useMemo(() => {
    let list = backlogTasks.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(backlogSearch.toLowerCase());
      const matchCat = catFilter === "all" || t.categoryId === catFilter;
      return matchSearch && matchCat;
    });

    // Sorting priority
    if (priSort === "high") {
      list.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    } else if (priSort === "date") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return list;
  }, [backlogTasks, backlogSearch, catFilter, priSort]);

  return (
    <div className="backlog-section">
      <div className="backlog-header">
        <div className="backlog-header-left">
          <Folder size={13} style={{ color: 'var(--text-secondary)' }} />
          <span className="backlog-title">{t.backlogTitle}</span>
        </div>
        <span className="category-count">{backlogTasks.length}</span>
      </div>

      <div className="backlog-search-container">
        <div className="backlog-search-row">
          <Search size={12} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="backlog-search-input"
            placeholder={t.searchBacklogPlaceholder}
            value={backlogSearch}
            onChange={e => setBacklogSearch(e.target.value)}
          />
        </div>

        <div className="backlog-filters">
          <select
            className="backlog-filter-select"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="all">{t.allCategories}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            className="backlog-filter-select"
            value={priSort}
            onChange={e => setPriSort(e.target.value)}
          >
            <option value="all">{t.naturalSort}</option>
            <option value="high">{t.prioritySort}</option>
            <option value="date">{t.newestCreated}</option>
          </select>
        </div>
      </div>

      <div
        className={`backlog-content ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <form onSubmit={handleQuickSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          <input
            type="text"
            className="quick-create-input"
            style={{ height: '30px' }}
            placeholder={t.quickCapturePlaceholder}
            value={quickDesc}
            onChange={e => setQuickDesc(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '4px' }}>
            <select
              className="backlog-filter-select"
              style={{ height: '24px' }}
              value={selectedCatId}
              onChange={e => setSelectedCatId(e.target.value)}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="submit" className="header-btn primary" style={{ height: '24px', flexGrow: 1, padding: 0, justifyContent: 'center' }}>
              {t.captureBtn}
            </button>
          </div>
        </form>

        <div className="backlog-cards-container">
          {filteredBacklog.map(task => {
            const cat = categories.find(c => c.id === task.categoryId) || { name: 'General', color: '#666' };
            const catName = cat.name === 'General' ? t.defaultSubcatName : cat.name;
            return (
              <div
                key={task.id}
                className="task-card backlog-card"
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData("text/plain", task.id);
                }}
                onDoubleClick={() => setEditingTask(task)}
              >
                <div className="backlog-card-header">
                  <span style={{ color: cat.color, fontWeight: 600 }}>{catName}</span>
                  {task.priority && <span>P{task.priority}</span>}
                </div>
                <span className="task-description">{task.description}</span>
              </div>
            );
          })}
          
          {filteredBacklog.length === 0 && (
            <div className="daily-focus-empty" style={{ padding: '24px' }}>
              {t.backlogEmpty}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
