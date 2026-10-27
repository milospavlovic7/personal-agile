import React, { useState } from 'react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { useTranslation } from '../../utils/translations';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
  onClose: () => void;
}

export default function AddCategoryModal({ onClose }: AddCategoryModalProps) {
  const t = useTranslation();
  const addCategory = useMomentumStore(s => s.addCategory);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#a78bfa");

  const colors = [
    "#a78bfa", // Soft Purple
    "#6ee7b7", // Soft Emerald
    "#93c5fd", // Soft Blue
    "#fdba74", // Soft Amber
    "#fda4af", // Soft Rose
    "#fbcfe8", // Soft Pink
    "#67e8f9", // Soft Cyan
    "#bef264", // Soft Lime
    "#fca5a5", // Soft Crimson
    "#cbd5e1"  // Soft Slate
  ];

  const handleSave = () => {
    if (name.trim()) {
      addCategory(name.trim(), color);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{t.createCategoryTitle}</span>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label className="form-label">{t.categoryNameLabel}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t.categoryPlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.accentColorLabel}</label>
            <div className="color-picker-grid">
              {colors.map(col => (
                <div
                  key={col}
                  className={`color-dot-option ${color === col ? 'selected' : ''}`}
                  style={{ backgroundColor: col }}
                  onClick={() => setColor(col)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: '8px' }}>
          <button className="header-btn" onClick={onClose}>{t.cancelBtn}</button>
          <button className="header-btn primary" onClick={handleSave}>{t.createCategoryBtn}</button>
        </div>
      </div>
    </div>
  );
}
