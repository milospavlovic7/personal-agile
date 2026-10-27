import { useState, useEffect, useRef, useMemo } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { useTranslation } from '../utils/translations';
import { Search, Folder, Terminal, CheckCircle2, Circle } from 'lucide-react';
import { getWeekKey, shiftWeekKey } from '../utils/date';

interface PaletteItem {
  id: string;
  type: 'task' | 'category' | 'action';
  text: string;
  subtitle?: string;
  badge?: string;
  handler: () => void;
}

export default function CommandPalette() {
  const t = useTranslation();
  const categories = useMomentumStore(s => s.categories);
  const tasks = useMomentumStore(s => s.tasks);
  const selectedWeek = useMomentumStore(s => s.selectedWeek);
  const setSelectedWeek = useMomentumStore(s => s.setSelectedWeek);
  const setEditingTask = useMomentumStore(s => s.setEditingTask);
  const setCommandPaletteOpen = useMomentumStore(s => s.setCommandPaletteOpen);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close palette on backdrop click
  const handleBackdropClick = () => {
    setCommandPaletteOpen(false);
  };

  // Compile search options list
  const paletteItems = useMemo(() => {
    const list: PaletteItem[] = [];

    // 1. Actions / Week Jumps
    list.push({
      id: "act-current-week",
      type: 'action',
      text: t.cmdGoCurrentWeek,
      subtitle: t.cmdJumpCurrentWeek,
      badge: t.weekLabel,
      handler: () => {
        setSelectedWeek(getWeekKey());
        setCommandPaletteOpen(false);
      }
    });
    list.push({
      id: "act-next-week",
      type: 'action',
      text: t.cmdGoNextWeek,
      subtitle: t.cmdJumpNextWeek,
      badge: t.weekLabel,
      handler: () => {
        setSelectedWeek(shiftWeekKey(selectedWeek, 1));
        setCommandPaletteOpen(false);
      }
    });
    list.push({
      id: "act-prev-week",
      type: 'action',
      text: t.cmdGoPrevWeek,
      subtitle: t.cmdJumpPrevWeek,
      badge: t.weekLabel,
      handler: () => {
        setSelectedWeek(shiftWeekKey(selectedWeek, -1));
        setCommandPaletteOpen(false);
      }
    });

    // 2. Categories
    categories.forEach(cat => {
      list.push({
        id: `cat-${cat.id}`,
        type: 'category',
        text: `${t.cmdJumpCategory} ${cat.name}`,
        subtitle: `${t.cmdScrollCategory} ${cat.name}`,
        badge: t.categoryLabel,
        handler: () => {
          setCommandPaletteOpen(false);
          // Wait for palette to close then scroll
          setTimeout(() => {
            const element = document.getElementById(cat.id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }, 50);
        }
      });
    });

    // 3. Tasks
    tasks.forEach(task => {
      const cat = categories.find(c => c.id === task.categoryId);
      list.push({
        id: `task-${task.id}`,
        type: 'task',
        text: task.description,
        subtitle: `${cat ? cat.name : t.cmdUnknown} • Status: ${
          task.status === 'tasks' ? t.cmdStatusTodo : task.status === 'in_progress' ? t.cmdStatusActive : task.status === 'done' ? t.cmdStatusDone : t.cmdStatusBacklog
        }`,
        badge: task.status === 'backlog' ? t.cmdStatusBacklog : task.sprintWeek || 'Sprint',
        handler: () => {
          setEditingTask(task);
          setCommandPaletteOpen(false);
        }
      });
    });

    return list;
  }, [categories, tasks, selectedWeek, setSelectedWeek, setEditingTask, setCommandPaletteOpen, t]);

  // Fuzzy/Substring Filter
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // Display actions and categories as default list when search query is blank
      return paletteItems.filter(item => item.type !== 'task');
    }
    const q = query.toLowerCase();
    return paletteItems.filter(item => {
      return (
        item.text.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    });
  }, [paletteItems, query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].handler();
      }
    }
  };

  // Scroll active item into view inside results container
  useEffect(() => {
    const listEl = resultsRef.current;
    if (!listEl) return;
    const selectedEl = listEl.children[selectedIndex] as HTMLElement;
    if (!selectedEl) return;

    const listHeight = listEl.clientHeight;
    const listScrollTop = listEl.scrollTop;
    const selectedHeight = selectedEl.clientHeight;
    const selectedOffsetTop = selectedEl.offsetTop;

    if (selectedOffsetTop < listScrollTop) {
      listEl.scrollTop = selectedOffsetTop;
    } else if (selectedOffsetTop + selectedHeight > listScrollTop + listHeight) {
      listEl.scrollTop = selectedOffsetTop + selectedHeight - listHeight;
    }
  }, [selectedIndex]);

  return (
    <div className="cmd-palette-backdrop" onClick={handleBackdropClick}>
      <div className="cmd-palette-box" onClick={e => e.stopPropagation()}>
        <div className="cmd-palette-input-row">
          <Search size={16} className="cmd-palette-item-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            placeholder={t.cmdPlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div ref={resultsRef} className="cmd-palette-results">
          {filteredItems.map((item, idx) => {
            const isSel = idx === selectedIndex;
            return (
              <div
                key={item.id}
                className={`cmd-palette-item ${isSel ? 'selected' : ''}`}
                onClick={item.handler}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="cmd-palette-item-left">
                  <span className="cmd-palette-item-icon">
                    {item.type === 'action' && <Terminal size={14} />}
                    {item.type === 'category' && <Folder size={14} />}
                    {item.type === 'task' && (
                      item.subtitle?.includes(t.cmdStatusDone) ? (
                        <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                      ) : (
                        <Circle size={14} />
                      )
                    )}
                  </span>
                  <div>
                    <span className="cmd-palette-item-text">{item.text}</span>
                    {item.subtitle && (
                      <span className="cmd-palette-item-subtitle">{item.subtitle}</span>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <span className="cmd-palette-item-badge">{item.badge}</span>
                )}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="cmd-palette-empty">{t.cmdNoResults} "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
