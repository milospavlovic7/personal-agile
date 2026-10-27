import { useMemo, useRef } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { generateWeekDropdownOptions, formatWeekRange, shiftWeekKey } from '../utils/date';
import { ChevronLeft, ChevronRight, Download, Upload, Plus, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface HeaderProps {
  onAddCategory: () => void;
}

export default function Header({ onAddCategory }: HeaderProps) {
  const selectedWeek = useMomentumStore(s => s.selectedWeek);
  const setSelectedWeek = useMomentumStore(s => s.setSelectedWeek);
  const autosave = useMomentumStore(s => s.autosaveIndicator);
  const importState = useMomentumStore(s => s.importState);
  const theme = useMomentumStore(s => s.theme);
  const toggleTheme = useMomentumStore(s => s.toggleTheme);
  const layoutMode = useMomentumStore(s => s.layoutMode);
  const toggleLayoutMode = useMomentumStore(s => s.toggleLayoutMode);
  const columnLimit = useMomentumStore(s => s.columnLimit);
  const setColumnLimit = useMomentumStore(s => s.setColumnLimit);
  const language = useMomentumStore(s => s.language || 'sr');
  const setLanguage = useMomentumStore(s => s.setLanguage);
  
  const t = useTranslation();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weekOptions = useMemo(() => {
    return generateWeekDropdownOptions(selectedWeek, 8);
  }, [selectedWeek]);

  const handlePrevWeek = () => {
    setSelectedWeek(shiftWeekKey(selectedWeek, -1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(shiftWeekKey(selectedWeek, 1));
  };

  // Export state to momentum-data.json
  const handleExport = () => {
    const fullState = {
      tasks: useMomentumStore.getState().tasks,
      categories: useMomentumStore.getState().categories,
      subcategories: useMomentumStore.getState().subcategories,
      selectedWeek: useMomentumStore.getState().selectedWeek,
      dailyFocus: useMomentumStore.getState().dailyFocus,
      collapsedCategories: useMomentumStore.getState().collapsedCategories,
      collapsedSubcategories: useMomentumStore.getState().collapsedSubcategories
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "momentum-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const resultStr = evt.target?.result as string;
      const success = importState(resultStr);
      if (success) {
        alert(t.importSuccess);
      } else {
        alert(t.importError);
      }
    };
    reader.readAsText(file);
  };

  return (
    <header>
      <div className="header-left">
        <div className="logo-container">
          <span className="logo-icon"></span>
          <span className="logo-text">MOMENTUM</span>
        </div>
        
        <div className="sprint-navigation">
          <button className="sprint-nav-btn" onClick={handlePrevWeek} title={language === 'en' ? "Previous Week" : "Prethodna nedelja"}>
            <ChevronLeft size={14} />
          </button>
          
          <div className="sprint-select-wrapper">
            <select
              className="sprint-select"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              {weekOptions.map(w => (
                <option key={w} value={w}>
                  {t.weekLabel} {w.split('-W')[1]} ({formatWeekRange(w)})
                </option>
              ))}
            </select>
          </div>

          <button className="sprint-nav-btn" onClick={handleNextWeek} title={language === 'en' ? "Next Week" : "Sledeća nedelja"}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="header-right">
        <div className={`autosave-badge ${autosave}`}>
          <span className="autosave-dot"></span>
          <span>{autosave === "saving" ? t.savingBadge : autosave === "error" ? t.saveFailedBadge : t.syncedBadge}</span>
        </div>

        <button className="header-btn" onClick={handleExport} title={language === 'en' ? "Save State to File" : "Sačuvaj stanje table u fajl"}>
          <Download size={12} />
          <span>{t.exportBtn}</span>
        </button>

        <button className="header-btn" onClick={handleImportClick} title={language === 'en' ? "Load State from File" : "Učitaj stanje table iz fajla"}>
          <Upload size={12} />
          <span>{t.importBtn}</span>
        </button>

        <div className="priority-limit-selector">
          <span className="selector-label">{t.displayLabel}</span>
          <select
            className="priority-select"
            value={columnLimit}
            onChange={(e) => setColumnLimit(e.target.value as 'all' | 'top3' | 'top5')}
            title={language === 'en' ? "Display limit by priority" : "Limit prikaza po prioritetu"}
          >
            <option value="all">{t.allTasks}</option>
            <option value="top3">{t.top3Priority}</option>
            <option value="top5">{t.top5Priority}</option>
          </select>
        </div>

        <div className="priority-limit-selector" style={{ marginLeft: '4px' }}>
          <span className="selector-label">{language === 'en' ? 'Language:' : 'Jezik:'}</span>
          <select
            className="priority-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'sr' | 'en')}
            title={language === 'en' ? "Change interface language" : "Promeni jezik interfejsa"}
            style={{ paddingRight: '24px' }}
          >
            <option value="sr">Srpski</option>
            <option value="en">English</option>
          </select>
        </div>

        <button className="header-btn" onClick={toggleLayoutMode} title={language === 'en' ? "Change display layout" : "Promeni format prikaza"}>
          {layoutMode === 'boxed' ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          <span>{layoutMode === 'boxed' ? t.layoutFull : t.layoutBoxed}</span>
        </button>

        <button className="header-btn" onClick={toggleTheme} title={language === 'en' ? "Toggle Theme" : "Promeni temu"}>
          {theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
          <span>{theme === 'light' ? t.themeDark : t.themeLight}</span>
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleFileImport}
        />

        <button className="header-btn primary" onClick={onAddCategory}>
          <Plus size={12} />
          <span>{t.addCategoryBtn}</span>
        </button>
      </div>
    </header>
  );
}
