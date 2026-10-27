# 📋 Personal Agile (Momentum Scrum OS)

A clean, responsive personal productivity and sprint management operating system for your browser. Designed to bring the structure of Agile Scrum to solo developers, creators, and freelancers without corporate bloat or cloud dependencies.

### 🌐 Try Online: [https://milospavlovic7.github.io/personal-agile/](https://milospavlovic7.github.io/personal-agile/)

---

## ✨ Key Features

- **Agile Board Architecture**:
  - Full-featured sprint board with standard Kanban columns: **To Do**, **In Progress**, **In Review**, and **Done**.
  - Collapsible **Backlog Drawer** for triaging and grooming incoming ideas and tasks.
- **Hierarchical Taxonomy**: Organize tasks seamlessly by **Categories** and **Subcategories** to separate projects, personal goals, and client work.
- **Fast Command Palette (`Ctrl + K`)**: Keyboard-first navigation to create, search, and jump to tasks instantly.
- **Task Management**:
  - Set priorities, story point estimates, due dates, tags, and detailed markdown descriptions.
  - Subtask checklists and progress visualization.
- **Zero-Cloud Client Storage**: All data stays private on your machine, saved directly to browser storage with instantaneous load times.
- **Offline & Standalone Ready**: Compiles into a single self-contained HTML bundle (`dist/index.html`) that can be saved anywhere and executed completely offline.

---

## 🎮 Controls & Shortcuts

- **Open Command Palette**: `Ctrl + K` or `Cmd + K`
- **Toggle Backlog Drawer**: Click the Backlog tab on the left margin
- **Move Tasks**: Drag and drop task cards across status columns or click the quick-move buttons
- **Edit Task**: Click any task card to open the detailed modal editor

---

## 🚀 Quick Start

### Option 1: Use Online (No installation required)
Launch immediately in your browser:  
👉 **[https://milospavlovic7.github.io/personal-agile/](https://milospavlovic7.github.io/personal-agile/)**

### Option 2: Run Standalone Offline
Open `dist/index.html` directly in any web browser. No server or internet connection required.

### Option 3: Local Development
```bash
# Clone the repository
git clone https://github.com/milospavlovic7/personal-agile.git
cd personal-agile

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 4: Production Build
```bash
npm run build
```
Creates a zero-dependency standalone bundle at `dist/index.html`.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
- **Icons**: [Lucide React](https://lucide.dev/)
- **Bundler**: [Vite](https://vitejs.dev/) + [`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile)

---

## 📜 License

MIT License. Free for personal and educational use.
