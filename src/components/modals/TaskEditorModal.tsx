import React, { useState } from 'react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { useTranslation } from '../../utils/translations';
import { Task, Subtask } from '../../types';
import { X, Trash2 } from 'lucide-react';

interface TaskEditorModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskEditorModal({ task, onClose }: TaskEditorModalProps) {
  const t = useTranslation();
  const updateTask = useMomentumStore(s => s.updateTask);
  const deleteTask = useMomentumStore(s => s.deleteTask);
  const categories = useMomentumStore(s => s.categories);
  const subcategories = useMomentumStore(s => s.subcategories);

  const [desc, setDesc] = useState(task.description);
  const [priority, setPriority] = useState<string>(task.priority ? String(task.priority) : "");
  const [effort, setEffort] = useState<string>(task.effort || "");
  const [notes, setNotes] = useState(task.notes || "");
  const [catId, setCatId] = useState(task.categoryId);
  const [subCatId, setSubCatId] = useState(task.subcategoryId || "General");
  
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtext, setNewSubtext] = useState("");

  const handleSave = () => {
    updateTask(task.id, {
      description: desc,
      priority: priority === "" ? null : parseInt(priority, 10),
      effort: effort === "" ? null : (effort as Task['effort']),
      notes: notes,
      categoryId: catId,
      subcategoryId: subCatId,
      subtasks: subtasks
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(t.deleteTaskConfirm)) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtext.trim()) {
      setSubtasks([...subtasks, { id: "st-" + Date.now(), text: newSubtext.trim(), done: false }]);
      setNewSubtext("");
    }
  };

  const handleToggleSub = (stId: string) => {
    setSubtasks(subtasks.map(s => s.id === stId ? { ...s, done: !s.done } : s));
  };

  const handleRemoveSub = (stId: string) => {
    setSubtasks(subtasks.filter(s => s.id !== stId));
  };

  const filteredSubcats = subcategories[catId] || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{t.editTaskTitle}</span>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label className="form-label">{t.taskDescLabel}</label>
            <input
              type="text"
              className="form-input"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">{t.categoryLabel}</label>
              <select
                className="form-select"
                value={catId}
                onChange={e => {
                  setCatId(e.target.value);
                  // Switch to first subcategory of new category or General
                  const sublist = subcategories[e.target.value] || [];
                  setSubCatId(sublist[0]?.id || "General");
                }}
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.swimlaneLabel}</label>
              <select
                className="form-select"
                value={subCatId}
                onChange={e => setSubCatId(e.target.value)}
              >
                {filteredSubcats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                {filteredSubcats.length === 0 && <option value="General">{t.defaultSubcatName}</option>}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">{t.priorityLabel}</label>
              <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="">{t.priNone}</option>
                <option value="1">{t.pri1}</option>
                <option value="2">{t.pri2}</option>
                <option value="3">{t.pri3}</option>
                <option value="4">{t.pri4}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.effortLabel}</label>
              <select className="form-select" value={effort} onChange={e => setEffort(e.target.value)}>
                <option value="">{t.effNone}</option>
                <option value="XS">{t.effXS}</option>
                <option value="S">{t.effS}</option>
                <option value="M">{t.effM}</option>
                <option value="L">{t.effL}</option>
                <option value="XL">{t.effXL}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.notesLabel}</label>
            <textarea
              className="form-textarea"
              placeholder={t.notesPlaceholder}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Checklist Section */}
          <div className="form-group">
            <label className="form-label">{t.subtasksLabel}</label>
            <div className="checklist-container">
              {subtasks.map(st => (
                <div key={st.id} className="checklist-row">
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    checked={st.done}
                    onChange={() => handleToggleSub(st.id)}
                  />
                  <span className={`checklist-text-input ${st.done ? 'done' : ''}`} style={{ flexGrow: 1 }}>
                    {st.text}
                  </span>
                  <button
                    className="category-action-btn"
                    style={{ width: '18px', height: '18px' }}
                    onClick={() => handleRemoveSub(st.id)}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              
              <form onSubmit={handleAddSub} style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <input
                  type="text"
                  className="quick-create-input"
                  style={{ height: '28px' }}
                  placeholder={t.addSubtaskPlaceholder}
                  value={newSubtext}
                  onChange={e => setNewSubtext(e.target.value)}
                />
                <button type="submit" className="header-btn primary" style={{ height: '28px', padding: '0 10px' }}>{t.addBtn}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="header-btn" onClick={handleDelete} style={{ color: '#ef4444' }}>
            <Trash2 size={12} />
            <span>{t.deleteBtn}</span>
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="header-btn" onClick={onClose}>{t.cancelBtn}</button>
            <button className="header-btn primary" onClick={handleSave}>{t.saveChangesBtn}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
