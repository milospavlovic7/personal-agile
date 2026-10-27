import { useState, useEffect, useMemo } from 'react';
import { useMomentumStore } from './store/useMomentumStore';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import AddCategoryModal from './components/modals/AddCategoryModal';
import TaskEditorModal from './components/modals/TaskEditorModal';
import CommandPalette from './components/CommandPalette';
import { getWeekKey } from './utils/date';
import { useTranslation } from './utils/translations';

export default function App() {
  const selectedWeek = useMomentumStore(s => s.selectedWeek);
  const categories = useMomentumStore(s => s.categories);
  const subcategories = useMomentumStore(s => s.subcategories);
  const tasks = useMomentumStore(s => s.tasks);
  const cmdOpen = useMomentumStore(s => s.commandPaletteOpen);
  const editingTask = useMomentumStore(s => s.editingTask);
  const layoutMode = useMomentumStore(s => s.layoutMode);
  
  const setCommandPaletteOpen = useMomentumStore(s => s.setCommandPaletteOpen);
  const setEditingTask = useMomentumStore(s => s.setEditingTask);
  const t = useTranslation();

  const [newCategoryModal, setNewCategoryModal] = useState(false);

  // Keyboard Shortcuts (Ctrl + K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!cmdOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setEditingTask(null);
        setNewCategoryModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cmdOpen, setCommandPaletteOpen, setEditingTask]);

  // Load momentum-data.json from server on startup (if local storage is blank)
  useEffect(() => {
    const LOCAL_STORAGE_KEY = "momentum-state-v1";
    let hasLogs = false;
    try {
      hasLogs = !!localStorage.getItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Autosave storage read blocked:", e);
    }
    
    if (!hasLogs) {
      fetch("momentum-data.json")
        .then(response => {
          if (response.ok) return response.text();
          throw new Error("Local json fetch failed or blocked");
        })
        .then(text => {
          const success = useMomentumStore.getState().importState(text);
          if (success) {
            console.log("Pre-loaded initial momentum-data.json database file!");
          }
        })
        .catch(() => {
          // Silent catch for CORS / file protocol security blocks
        });
    }
  }, []);

  // Filter tasks into active sprint vs backlog
  const activeSprintTasks = useMemo(() => {
    const currentRealWeek = getWeekKey();
    return tasks.filter(t => {
      if (t.status === "backlog") return false;
      // Normal current week scheduling
      if (t.sprintWeek === selectedWeek) return true;
      // Rollover: Incomplete task scheduled in the PAST AND which has actually expired in real life
      if (t.sprintWeek && t.sprintWeek < selectedWeek && t.sprintWeek < currentRealWeek && t.status !== "done") return true;
      return false;
    });
  }, [tasks, selectedWeek]);

  const backlogTasks = useMemo(() => {
    return tasks.filter(t => t.status === "backlog");
  }, [tasks]);

  return (
    <div id="app-root">
      <Header onAddCategory={() => setNewCategoryModal(true)} />
      
      <main className={layoutMode === 'boxed' ? 'layout-boxed' : ''}>
        <div className="board-header-row">
          <div className="board-header-cell subcat">{t.subcatHeader}</div>
          <div className="board-header-cell">{t.todoHeader}</div>
          <div className="board-header-cell">{t.activeHeader}</div>
          <div className="board-header-cell">{t.doneHeader}</div>
          <div className="board-header-cell">{t.backlogHeader}</div>
          <div className="board-header-cell actions"></div>
        </div>

        <div className="board-scroll-area">
          <div className="categories-stack">
            {[...categories]
              .sort((a, b) => a.order - b.order)
              .map(cat => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  subcategories={subcategories[cat.id] || []}
                  activeSprintTasks={activeSprintTasks.filter(t => t.categoryId === cat.id)}
                  backlogTasks={backlogTasks.filter(t => t.categoryId === cat.id)}
                />
              ))
            }
          </div>
        </div>
      </main>

      {/* Core Modals */}
      {newCategoryModal && <AddCategoryModal onClose={() => setNewCategoryModal(false)} />}
      {editingTask && <TaskEditorModal task={editingTask} onClose={() => setEditingTask(null)} />}
      {cmdOpen && <CommandPalette />}
    </div>
  );
}
