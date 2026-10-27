import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category, Subcategory, Subtask } from '../types';
import { getWeekKey, shiftWeekKey } from '../utils/date';

// For the import on line 3, we had import { Task, Category, Subcategory, Subtask } from '../types'
// But wait, in the types file subtask is defined. Let's look at the exact original text:
// 1: import { create } from 'zustand';
// 2: import { persist } from 'zustand/middleware';
// 3: import { Task, Category, Subcategory, Subtask } from '../types';
// 4: import { getWeekKey, shiftWeekKey } from '../utils/date';
// Let's copy it line by line exactly from step 2.

interface MomentumState {
  tasks: Task[];
  categories: Category[];
  subcategories: Record<string, Subcategory[]>;
  selectedWeek: string;
  dailyFocus: string[];
  collapsedCategories: string[];
  collapsedSubcategories: string[];
  searchQuery: string;
  priorityFilter: string;
  effortFilter: string;
  commandPaletteOpen: boolean;
  editingTask: Task | null;
  autosaveIndicator: 'saved' | 'saving' | 'error';
  theme: 'dark' | 'light';
  layoutMode: 'full' | 'boxed';
  columnLimit: 'all' | 'top3' | 'top5';
  language: 'sr' | 'en';

  // Week Actions
  setSelectedWeek: (week: string) => void;

  // Category Actions
  addCategory: (name: string, color: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  toggleCollapseCategory: (id: string) => void;

  // Subcategory Actions
  addSubcategory: (categoryId: string, name: string) => void;
  renameSubcategory: (categoryId: string, subcategoryId: string, name: string) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<Omit<Subcategory, 'id' | 'order'>>) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  toggleCollapseSubcategory: (id: string) => void;

  // Task Actions
  addTask: (taskData: {
    description: string;
    categoryId: string;
    subcategoryId: string;
    sprintWeek: string | null;
    status?: Task['status'];
    priority?: number | null;
    notes?: string;
    effort?: Task['effort'];
    subtasks?: Subtask[];
  }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, nextStatus: Task['status'], nextCategoryId?: string, nextSubcategoryId?: string) => void;
  togglePinTask: (id: string) => void;

  // Daily Focus
  toggleDailyFocus: (id: string) => void;

  // Filter / UI Actions
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (pri: string) => void;
  setEffortFilter: (eff: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  setAutosaveIndicator: (status: 'saved' | 'saving' | 'error') => void;
  toggleTheme: () => void;
  toggleLayoutMode: () => void;
  setColumnLimit: (limit: 'all' | 'top3' | 'top5') => void;
  setLanguage: (lang: 'sr' | 'en') => void;

  // Data Actions
  importState: (jsonString: string) => boolean;
}

const starterCategories: Category[] = [
  { id: "cat-dev", name: "Engineering", color: "#8b5cf6", order: 0 },
  { id: "cat-mus", name: "Music Production", color: "#10b981", order: 1 },
  { id: "cat-self", name: "Self-Refining", color: "#f59e0b", order: 2 }
];

const starterSubcategories: Record<string, Subcategory[]> = {
  "cat-dev": [
    { id: "sub-dev-core", name: "Core Engine", order: 0 },
    { id: "sub-dev-ui", name: "UI Design", order: 1 }
  ],
  "cat-mus": [
    { id: "sub-mus-beat", name: "Arranging", order: 0 },
    { id: "sub-mus-sd", name: "Sound Design", order: 1 }
  ],
  "cat-self": [
    { id: "sub-self-train", name: "Fitness & Training", order: 0 },
    { id: "sub-self-read", name: "Reading List", order: 1 }
  ]
};

const generateStarterTasks = (currentWeekKey: string): Task[] => {
  const prevWeek = shiftWeekKey(currentWeekKey, -1);
  return [
    {
      id: "task-1",
      description: "Initialize git repository & setup basic package structural folders",
      categoryId: "cat-dev",
      subcategoryId: "sub-dev-core",
      sprintWeek: prevWeek,
      status: "done",
      priority: 3,
      notes: "Basic setup complete. Ready to implement visual system layers.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      effort: null,
      subtasks: []
    },
    {
      id: "task-2",
      description: "Refactor core observer store for file-less CORS compatibility",
      categoryId: "cat-dev",
      subcategoryId: "sub-dev-core",
      sprintWeek: prevWeek,
      status: "in_progress",
      priority: 1,
      notes: "Need to make sure state binds cleanly using UMD modules without ESM issues on standard double-click runs.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "M",
      pinned: false,
      subtasks: [
        { id: "st-1", text: "Create local observer pattern", done: true },
        { id: "st-2", text: "Map custom selector hook triggers", done: false }
      ]
    },
    {
      id: "task-3",
      description: "Design glassy Matte Graphite layout layout grid system",
      categoryId: "cat-dev",
      subcategoryId: "sub-dev-ui",
      sprintWeek: currentWeekKey,
      status: "in_progress",
      priority: 2,
      notes: "Dark matte tones (#09090b / #15151b). Minimalistic aesthetic vibes inspired by Linear & Obsidian.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "L",
      pinned: true,
      subtasks: []
    },
    {
      id: "task-4",
      description: "Code dynamic inline task fast-capture fields (+ Enter to save)",
      categoryId: "cat-dev",
      subcategoryId: "sub-dev-ui",
      sprintWeek: currentWeekKey,
      status: "tasks",
      priority: 3,
      notes: "Quick add makes task flow frictionless.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "S",
      pinned: false,
      subtasks: []
    },
    {
      id: "task-5",
      description: "Generate 5 customized synth presets for future sci-fi ambient album",
      categoryId: "cat-mus",
      subcategoryId: "sub-mus-sd",
      sprintWeek: currentWeekKey,
      status: "in_progress",
      priority: 2,
      notes: "Using Vital synth. Focus on deep atmospheric pads and futuristic granular hits.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "M",
      pinned: false,
      subtasks: []
    },
    {
      id: "task-6",
      description: "Heavy legs day: squat training routine focus (5x5)",
      categoryId: "cat-self",
      subcategoryId: "sub-self-train",
      sprintWeek: currentWeekKey,
      status: "done",
      priority: 3,
      notes: "Hit target squat volume! Form was solid.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "S",
      pinned: false,
      subtasks: []
    },
    {
      id: "task-b1",
      description: "Investigate Figma mockups for next year's full procedural puzzle game",
      categoryId: "cat-dev",
      subcategoryId: "sub-dev-ui",
      sprintWeek: null,
      status: "backlog",
      priority: 4,
      notes: "Just rough sketching for now. Keep in backlog.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "XL",
      pinned: false,
      subtasks: []
    },
    {
      id: "task-b2",
      description: "Read 'Atomic Habits' chapter on environmental design setups",
      categoryId: "cat-self",
      subcategoryId: "sub-self-read",
      sprintWeek: null,
      status: "backlog",
      priority: null,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effort: "XS",
      pinned: false,
      subtasks: []
    }
  ];
};

export const useMomentumStore = create<MomentumState>()(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      categories: [],
      subcategories: {},
      selectedWeek: getWeekKey(),
      dailyFocus: [],
      collapsedCategories: [],
      collapsedSubcategories: [],
      searchQuery: "",
      priorityFilter: "all",
      effortFilter: "all",
      commandPaletteOpen: false,
      editingTask: null,
      autosaveIndicator: "saved",
      theme: "dark",
      layoutMode: "full",
      columnLimit: "all",
      language: "sr",

      // Week Actions
      setSelectedWeek: (week) => {
        set({ selectedWeek: week });
      },

      // Category Actions
      addCategory: (name, color) => {
        const id = "cat-" + Date.now();
        const order = get().categories.length;
        const newCat: Category = { id, name, color, order };
        set((state) => ({
          categories: [...state.categories, newCat],
          subcategories: {
            ...state.subcategories,
            [id]: [{ id: "sub-" + Date.now() + "-gen", name: "General", order: 0 }]
          }
        }));
      },

      renameCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, name } : c))
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          tasks: state.tasks.filter((t) => t.categoryId !== id),
          dailyFocus: state.dailyFocus.filter((fid) => {
            const t = state.tasks.find((tk) => tk.id === fid);
            return t ? t.categoryId !== id : false;
          })
        }));
      },

      toggleCollapseCategory: (id) => {
        set((state) => {
          const collapsed = state.collapsedCategories.includes(id)
            ? state.collapsedCategories.filter((x) => x !== id)
            : [...state.collapsedCategories, id];
          return { collapsedCategories: collapsed };
        });
      },

      // Subcategory Actions
      addSubcategory: (categoryId, name) => {
        const id = "sub-" + Date.now();
        const list = get().subcategories[categoryId] || [];
        const newSub: Subcategory = { id, name, order: list.length };
        set((state) => ({
          subcategories: {
            ...state.subcategories,
            [categoryId]: [...list, newSub]
          }
        }));
      },

      renameSubcategory: (categoryId, subcategoryId, name) => {
        const list = get().subcategories[categoryId] || [];
        set((state) => ({
          subcategories: {
            ...state.subcategories,
            [categoryId]: list.map((s) => (s.id === subcategoryId ? { ...s, name } : s))
          }
        }));
      },

      updateSubcategory: (categoryId, subcategoryId, updates) => {
        const list = get().subcategories[categoryId] || [];
        set((state) => ({
          subcategories: {
            ...state.subcategories,
            [categoryId]: list.map((s) => (s.id === subcategoryId ? { ...s, ...updates } : s))
          }
        }));
      },

      deleteSubcategory: (categoryId, subcategoryId) => {
        const list = get().subcategories[categoryId] || [];
        set((state) => ({
          subcategories: {
            ...state.subcategories,
            [categoryId]: list.filter((s) => s.id !== subcategoryId)
          },
          // Remove tasks inside the deleted subcategory
          tasks: state.tasks.filter((t) => t.subcategoryId !== subcategoryId),
          dailyFocus: state.dailyFocus.filter((fid) => {
            const t = state.tasks.find((tk) => tk.id === fid);
            return t ? t.subcategoryId !== subcategoryId : false;
          })
        }));
      },

      toggleCollapseSubcategory: (id) => {
        set((state) => {
          const collapsed = state.collapsedSubcategories.includes(id)
            ? state.collapsedSubcategories.filter((x) => x !== id)
            : [...state.collapsedSubcategories, id];
          return { collapsedSubcategories: collapsed };
        });
      },

      // Task Actions
      addTask: (taskData) => {
        const newTask: Task = {
          id: "task-" + Date.now(),
          description: taskData.description,
          categoryId: taskData.categoryId,
          subcategoryId: taskData.subcategoryId || "General",
          sprintWeek: taskData.sprintWeek,
          status: taskData.status || "tasks",
          priority: taskData.priority || null,
          notes: taskData.notes || "",
          effort: taskData.effort || null,
          pinned: false,
          subtasks: taskData.subtasks || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : t
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          dailyFocus: state.dailyFocus.filter((fid) => fid !== id)
        }));
      },

      moveTask: (id, nextStatus, nextCategoryId, nextSubcategoryId) => {
        const currentWeek = get().selectedWeek;
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              let sprintWeek = t.sprintWeek;

              if (nextStatus === "backlog") {
                sprintWeek = null;
              } else if (t.status === "backlog") {
                sprintWeek = currentWeek;
              } else if (t.sprintWeek && t.sprintWeek < currentWeek && nextStatus === "done") {
                sprintWeek = currentWeek;
              }

              return {
                ...t,
                status: nextStatus,
                categoryId: nextCategoryId || t.categoryId,
                subcategoryId: nextSubcategoryId || t.subcategoryId,
                sprintWeek,
                updatedAt: new Date().toISOString()
              };
            }
            return t;
          })
        }));
      },

      togglePinTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
        }));
      },

      // Daily Focus
      toggleDailyFocus: (id) => {
        set((state) => {
          const focus = [...state.dailyFocus];
          const idx = focus.indexOf(id);
          if (idx > -1) {
            focus.splice(idx, 1);
          } else {
            focus.push(id);
          }
          return { dailyFocus: focus };
        });
      },

      // Filters
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPriorityFilter: (pri) => set({ priorityFilter: pri }),
      setEffortFilter: (eff) => set({ effortFilter: eff }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setEditingTask: (task) => set({ editingTask: task }),
      setAutosaveIndicator: (status) => set({ autosaveIndicator: status }),
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        if (nextTheme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      },

      toggleLayoutMode: () => {
        const nextMode = get().layoutMode === 'boxed' ? 'full' : 'boxed';
        set({ layoutMode: nextMode });
      },

      setColumnLimit: (limit) => set({ columnLimit: limit }),
      setLanguage: (lang) => set({ language: lang }),

      // Import State
      importState: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed.tasks && parsed.categories) {
            set({
              tasks: parsed.tasks,
              categories: parsed.categories,
              subcategories: parsed.subcategories || starterSubcategories,
              selectedWeek: parsed.selectedWeek || getWeekKey(),
              dailyFocus: parsed.dailyFocus || [],
              collapsedCategories: parsed.collapsedCategories || [],
              collapsedSubcategories: parsed.collapsedSubcategories || []
            });
            return true;
          }
        } catch (e) {
          console.error("JSON Import Failed:", e);
        }
        return false;
      }
    }),
    {
      name: 'momentum-state-v1',
      partialize: (state) => ({
        tasks: state.tasks,
        categories: state.categories,
        subcategories: state.subcategories,
        selectedWeek: state.selectedWeek,
        dailyFocus: state.dailyFocus,
        collapsedCategories: state.collapsedCategories,
        collapsedSubcategories: state.collapsedSubcategories,
        theme: state.theme,
        layoutMode: state.layoutMode,
        columnLimit: state.columnLimit,
        language: state.language
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately after rehydration
        if (state) {
          const t = state.theme || 'dark';
          if (t === 'light') {
            document.documentElement.classList.add('light');
          } else {
            document.documentElement.classList.remove('light');
          }
        }
        
        // If state is empty or blank, initialize with starter data
        if (state && (!state.categories || state.categories.length === 0)) {
          const currentWeek = getWeekKey();
          state.categories = starterCategories;
          state.subcategories = starterSubcategories;
          state.tasks = generateStarterTasks(currentWeek);
          state.dailyFocus = ["task-2", "task-3"];
        }
      }
    }
  )
);
