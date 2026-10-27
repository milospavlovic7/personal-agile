import React, { useState } from 'react';
import { useMomentumStore } from '../store/useMomentumStore';
import { Category, Subcategory, Task } from '../types';
import SubcategoryRow from './SubcategoryRow';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface CategorySectionProps {
  category: Category;
  subcategories: Subcategory[];
  activeSprintTasks: Task[];
  backlogTasks: Task[];
}

export default function CategorySection({ category, subcategories, activeSprintTasks, backlogTasks }: CategorySectionProps) {
  const toggleCollapse = useMomentumStore(s => s.toggleCollapseCategory);
  const isCollapsed = useMomentumStore(s => s.collapsedCategories).includes(category.id);
  const addSubcategory = useMomentumStore(s => s.addSubcategory);
  const deleteCategory = useMomentumStore(s => s.deleteCategory);
  
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subName, setSubName] = useState("");

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (subName.trim()) {
      addSubcategory(category.id, subName.trim());
      setSubName("");
      setIsAddingSub(false);
    }
  };

  const t = useTranslation();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t.deleteCategoryConfirm.replace("{name}", category.name))) {
      deleteCategory(category.id);
    }
  };

  const totalTasksCount = activeSprintTasks.length + backlogTasks.length;

  if (isCollapsed) {
    return (
      <div 
        id={category.id}
        className="category-section collapsed" 
        style={{ '--cat-accent': category.color } as React.CSSProperties}
      >
        <div className="category-header" onClick={() => toggleCollapse(category.id)}>
          <span className="category-accent-bar"></span>
          <div className="category-title-vertical">{category.name}</div>
          <span className="category-count" style={{ marginTop: 'auto' }}>
            {totalTasksCount}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={category.id}
      className="category-section" 
      style={{ '--cat-accent': category.color } as React.CSSProperties}
    >
      <div className="category-header" onClick={() => toggleCollapse(category.id)}>
        <div className="category-header-left">
          <span className="category-accent-bar"></span>
          <span className="category-title">{category.name}</span>
          <span className="category-count">{totalTasksCount}</span>
        </div>
        
        <div className="category-actions" onClick={e => e.stopPropagation()}>
          <button
            className="category-action-btn"
            onClick={() => setIsAddingSub(!isAddingSub)}
            title={t.addSwimlaneTooltip}
          >
            <Plus size={12} />
          </button>
          <button
            className="category-action-btn"
            onClick={handleDelete}
            title={t.deleteCategoryTooltip}
          >
            <Trash2 size={12} />
          </button>
          <button
            className="category-action-btn"
            onClick={() => toggleCollapse(category.id)}
            title={t.collapseCategoryTooltip}
          >
            <ChevronLeft size={12} />
          </button>
        </div>
      </div>

      <div className="category-content-container">
        {isAddingSub && (
          <form onSubmit={handleAddSub} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            <input
              type="text"
              className="quick-create-input"
              placeholder={t.newSwimlanePlaceholder}
              value={subName}
              onChange={e => setSubName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="header-btn primary" style={{ height: '26px', padding: '0 8px' }}>{t.addBtn}</button>
            <button type="button" className="header-btn" onClick={() => setIsAddingSub(false)} style={{ height: '26px', padding: '0 8px' }}>X</button>
          </form>
        )}

        {subcategories.length > 0 ? (
          [...subcategories]
            .sort((a, b) => a.order - b.order)
            .map(sub => (
              <SubcategoryRow
                key={sub.id}
                category={category}
                subcategory={sub}
                tasks={[
                  ...activeSprintTasks.filter(t => t.subcategoryId === sub.id),
                  ...backlogTasks.filter(t => t.subcategoryId === sub.id)
                ]}
              />
            ))
        ) : (
          <SubcategoryRow
            key="default-gen"
            category={category}
            subcategory={{ id: "General", name: t.defaultSubcatName, order: 0 }}
            tasks={[
              ...activeSprintTasks.filter(t => t.subcategoryId === "General" || !t.subcategoryId),
              ...backlogTasks.filter(t => t.subcategoryId === "General" || !t.subcategoryId)
            ]}
          />
        )}
      </div>
    </div>
  );
}
