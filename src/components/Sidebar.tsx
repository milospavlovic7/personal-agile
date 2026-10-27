import { useMemo } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { useTranslation } from '../utils/translations';
import { Task } from '../types';
import { Target, Terminal, X } from 'lucide-react';

interface SidebarProps {
  activeSprintTasks: Task[];
}

export default function Sidebar({ activeSprintTasks }: SidebarProps) {
  const t = useTranslation();
  const dailyFocusIds = useMomentumStore(s => s.dailyFocus);
  const tasks = useMomentumStore(s => s.tasks);
  const toggleDailyFocus = useMomentumStore(s => s.toggleDailyFocus);
  const setEditingTask = useMomentumStore(s => s.setEditingTask);
  const categories = useMomentumStore(s => s.categories);

  // Extract details for daily focus tasks
  const focusTasks = useMemo(() => {
    return tasks.filter(t => dailyFocusIds.includes(t.id));
  }, [tasks, dailyFocusIds]);

  // Velocity/Stats Calculation
  const stats = useMemo(() => {
    const total = activeSprintTasks.length;
    const completed = activeSprintTasks.filter(t => t.status === "done").length;
    const inProgress = activeSprintTasks.filter(t => t.status === "in_progress").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, percent };
  }, [activeSprintTasks]);

  // Category share mapping
  const categoryShare = useMemo(() => {
    const counts: Record<string, number> = {};
    activeSprintTasks.forEach(t => {
      counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
    });
    return counts;
  }, [activeSprintTasks]);

  return (
    <aside>
      <div className="sidebar-top">
        
        {/* Daily Focus Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={12} className="focus" style={{ color: 'var(--accent-purple)' }} />
              <span>{t.dailyFocusTitle}</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {focusTasks.filter(t => t.status === 'done').length}/{focusTasks.length}
            </span>
          </div>
          
          <div className="daily-focus-list">
            {focusTasks.length > 0 ? (
              focusTasks.map(task => (
                <div
                  key={task.id}
                  className="daily-focus-item"
                  onClick={() => setEditingTask(task)}
                >
                  <span className={`daily-focus-text ${task.status === 'done' ? 'completed' : ''}`}>
                    {task.description}
                  </span>
                  <button
                    className="daily-focus-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDailyFocus(task.id);
                    }}
                    title={t.removeFocusTooltip}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))
            ) : (
              <div className="daily-focus-empty">
                {t.dailyFocusEmpty}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Sprint Progress Card */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <Terminal size={12} style={{ marginRight: '6px' }} />
            <span>{t.sprintVelocityTitle}</span>
          </div>
          
          <div className="stats-card">
            <div className="stats-row">
              <span style={{ color: 'var(--text-secondary)' }}>{t.completionLabel}</span>
              <span className="stats-value">{stats.percent}%</span>
            </div>
            
            <div className="stats-progress-container">
              <div className="stats-progress-bar" style={{ width: `${stats.percent}%` }}></div>
            </div>

            <div className="stats-row" style={{ fontSize: '11px', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {t.tasksStats.replace("{completed}", String(stats.completed)).replace("{total}", String(stats.total))}
              </span>
            </div>

            <div className="stats-categories">
              {categories.map(cat => {
                const cnt = categoryShare[cat.id] || 0;
                if (cnt === 0) return null;
                return (
                  <div key={cat.id} className="stats-cat-item">
                    <span className="stats-cat-name">
                      <span className="stats-cat-dot" style={{ backgroundColor: cat.color }}></span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                        {cat.name}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'Fira Code, monospace' }}>{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      <div className="sidebar-footer">
        <div className="shortcut-row">
          <span>{t.cmdPaletteLabel}</span>
          <span className="shortcut-key">Ctrl + K</span>
        </div>
        <div className="shortcut-row">
          <span>{t.exitModalLabel}</span>
          <span className="shortcut-key">Esc</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '9px', color: 'var(--text-muted)' }}>
          Momentum OS v1.0
        </div>
      </div>
    </aside>
  );
}
