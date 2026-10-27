import { useMomentumStore } from '../store/useMomentumStore';

export const translations = {
  sr: {
    // Header Cells
    subcatHeader: "SUBKATEGORIJA",
    todoHeader: "TO DO",
    activeHeader: "ACTIVE",
    doneHeader: "DONE",
    backlogHeader: "SVI TASKOVI",
    
    // Header UI
    displayLabel: "Prikaz:",
    allTasks: "Svi zadaci",
    top3Priority: "Top 3 prioriteta",
    top5Priority: "Top 5 prioriteta",
    layoutFull: "Razvučeno",
    layoutBoxed: "Kockasto",
    themeDark: "Dark",
    themeLight: "Light",
    exportBtn: "Export",
    importBtn: "Import",
    addCategoryBtn: "Dodaj kategoriju",
    weekLabel: "Nedelja",
    syncedBadge: "Sinhronizovano",
    savingBadge: "Automatsko čuvanje...",
    saveFailedBadge: "Čuvanje neuspešno",
    importSuccess: "Stanje aplikacije je uspešno učitano!",
    importError: "Neispravan JSON format. Učitajte ispravan momentum-data.json fajl.",

    // Subcategory Row
    defaultSubcatName: "Opšte",
    descPlaceholder: "Dodaj opis...",
    descTooltip: "Dvoklik za izmenu opisa",
    titleTooltip: "Dvoklik za izmenu naslova",
    tasksCount: "taskova",
    deleteSwimlaneTitle: "Obriši swimlane",
    deleteSwimlaneConfirm: "Da li ste sigurni da želite da obrišete swimlane \"{name}\"? Zadaci unutar njega će biti arhivirani.",
    addTaskToBacklog: "Dodaj task u svi taskovi",

    // Board Column
    newTaskPlaceholder: "Novi zadatak...",
    moreTask1: "zadatak",
    moreTask24: "zadatka",
    moreTask5: "zadataka",
    morePrefix: "+ Još",

    // Task Card
    rolloverBadge: "Rollover",
    pinnedFocusTooltip: "Zakačeno u Daily Focus",
    pinFocusTooltip: "Dodaj u Daily Focus",
    detailedEditTooltip: "Detaljna izmena",
    unpinTooltip: "Otkači zadatak",
    pinTopTooltip: "Zakači na vrh",
    descEditTooltip: "Dvoklik za izmenu opisa",

    // Category Section
    addSwimlaneTooltip: "Dodaj swimlane",
    deleteCategoryTooltip: "Obriši kategoriju",
    collapseCategoryTooltip: "Skupi kolonu",
    deleteCategoryConfirm: "Da li ste sigurni da želite da obrišete kategoriju \"{name}\" i sve njene zadatke?",
    newSwimlanePlaceholder: "Naziv novog swimlane-a...",
    addBtn: "Dodaj",

    // Add Category Modal
    createCategoryTitle: "Kreiraj novu kategoriju",
    categoryNameLabel: "Naziv kategorije",
    accentColorLabel: "Boja teme/reda",
    cancelBtn: "Otkaži",
    createCategoryBtn: "Kreiraj kategoriju",

    // Task Editor Modal
    editTaskTitle: "Detalji zadatka",
    taskDescLabel: "Opis zadatka",
    categoryLabel: "Kategorija",
    swimlaneLabel: "Swimlane",
    priorityLabel: "Prioritet",
    effortLabel: "Procena truda (Effort)",
    notesLabel: "Beleške",
    notesPlaceholder: "Detaljan opis, linkovi, ideje...",
    subtasksLabel: "Podzadaci",
    addSubtaskPlaceholder: "Dodaj podzadatak...",
    deleteBtn: "Obriši",
    deleteTaskConfirm: "Da li želite trajno da obrišete ovaj zadatak?",
    saveChangesBtn: "Sačuvaj izmene",
    
    // Priority options
    priNone: "Bez prioriteta",
    pri1: "P1 (Kritičan)",
    pri2: "P2 (Visok)",
    pri3: "P3 (Srednji)",
    pri4: "P4 (Nizak)",

    // Effort options
    effNone: "Bez procene",
    effXS: "XS (Minijaturan)",
    effS: "S (Mali)",
    effM: "M (Srednji)",
    effL: "L (Veliki)",
    effXL: "XL (Epski)",

    // Command Palette
    cmdPlaceholder: "Upišite komandu ili pretražite zadatke/kategorije...",
    cmdNoResults: "Nema rezultata koji se poklapaju sa",
    cmdGoCurrentWeek: "Idi na tekuću nedelju",
    cmdJumpCurrentWeek: "Skoči na današnji aktivni sprint",
    cmdGoNextWeek: "Idi na sledeću nedelju",
    cmdJumpNextWeek: "Skoči 1 nedelju unapred",
    cmdGoPrevWeek: "Idi na prethodnu nedelju",
    cmdJumpPrevWeek: "Skoči 1 nedelju unazad",
    cmdJumpCategory: "Skoči na kategoriju:",
    cmdScrollCategory: "Skroluj odmah do dela table za",
    cmdUnknown: "Nepoznato",
    cmdStatusTodo: "To Do",
    cmdStatusActive: "Active",
    cmdStatusDone: "Gotovo",
    cmdStatusBacklog: "Svi zadaci",

    // Sidebar
    dailyFocusTitle: "Dnevni fokus",
    removeFocusTooltip: "Ukloni iz fokusa",
    dailyFocusEmpty: "Kliknite dvaput ili uredite zadatak da biste ga zakačili ovde. Održite svoj dan strukturiranim.",
    sprintVelocityTitle: "Brzina sprinta",
    completionLabel: "Završeno",
    tasksStats: "Zadaci: {completed} gotovo / {total} ukupno",
    cmdPaletteLabel: "Komandna paleta",
    exitModalLabel: "Zatvori prozor",

    // Backlog Drawer
    backlogTitle: "Svi zadaci (Backlog)",
    searchBacklogPlaceholder: "Pretraži backlog...",
    allCategories: "Sve kategorije",
    naturalSort: "Prirodno sortiranje",
    prioritySort: "Prioritet (1 → 4)",
    newestCreated: "Najnovije kreirano",
    quickCapturePlaceholder: "Brzi upis u backlog...",
    captureBtn: "Upiši",
    backlogEmpty: "Nema zadataka u backlogu koji odgovaraju kriterijumima. Prevucite zadatke ovde da biste ih sačuvali na duže staze.",

    // Modals
    categoryPlaceholder: "Muzička produkcija, trening, softver..."
  },
  en: {
    // Header Cells
    subcatHeader: "SWIMLANE",
    todoHeader: "TO DO",
    activeHeader: "ACTIVE",
    doneHeader: "DONE",
    backlogHeader: "BACKLOG",
    
    // Header UI
    displayLabel: "Display:",
    allTasks: "All Tasks",
    top3Priority: "Top 3 Priority",
    top5Priority: "Top 5 Priority",
    layoutFull: "Full Width",
    layoutBoxed: "Boxed",
    themeDark: "Dark",
    themeLight: "Light",
    exportBtn: "Export",
    importBtn: "Import",
    addCategoryBtn: "Add Category",
    weekLabel: "Week",
    syncedBadge: "Synced",
    savingBadge: "Autosaving...",
    saveFailedBadge: "Save Failed",
    importSuccess: "App state loaded successfully!",
    importError: "Invalid JSON format. Please load a valid momentum-data.json file.",

    // Subcategory Row
    defaultSubcatName: "General",
    descPlaceholder: "Add description...",
    descTooltip: "Double-click to edit description",
    titleTooltip: "Double-click to edit title",
    tasksCount: "tasks",
    deleteSwimlaneTitle: "Delete Swimlane",
    deleteSwimlaneConfirm: "Are you sure you want to delete swimlane \"{name}\"? Tasks inside will be archived.",
    addTaskToBacklog: "Add task to backlog",

    // Board Column
    newTaskPlaceholder: "New task...",
    moreTask1: "task",
    moreTask24: "tasks",
    moreTask5: "tasks",
    morePrefix: "+",

    // Task Card
    rolloverBadge: "Rollover",
    pinnedFocusTooltip: "Pinned to Daily Focus",
    pinFocusTooltip: "Pin to Daily Focus",
    detailedEditTooltip: "Detailed edit",
    unpinTooltip: "Unpin Task",
    pinTopTooltip: "Pin to Top",
    descEditTooltip: "Double-click to edit description",

    // Category Section
    addSwimlaneTooltip: "Add Swimlane",
    deleteCategoryTooltip: "Delete Category",
    collapseCategoryTooltip: "Collapse Column",
    deleteCategoryConfirm: "Are you sure you want to delete category \"{name}\" and all its tasks?",
    newSwimlanePlaceholder: "New Swimlane Name...",
    addBtn: "Add",

    // Add Category Modal
    createCategoryTitle: "Create New Category",
    categoryNameLabel: "Category Name",
    accentColorLabel: "Accent Theme Color",
    cancelBtn: "Cancel",
    createCategoryBtn: "Create Category",

    // Task Editor Modal
    editTaskTitle: "Edit Task Details",
    taskDescLabel: "Task Description",
    categoryLabel: "Category",
    swimlaneLabel: "Swimlane",
    priorityLabel: "Priority",
    effortLabel: "Effort Tag",
    notesLabel: "Notes",
    notesPlaceholder: "Elaborate details, links, ideas...",
    subtasksLabel: "Subtask Checklist",
    addSubtaskPlaceholder: "Add subtask...",
    deleteBtn: "Delete",
    deleteTaskConfirm: "Delete this task permanently?",
    saveChangesBtn: "Save Changes",
    
    // Priority options
    priNone: "None",
    pri1: "P1 (Critical)",
    pri2: "P2 (High)",
    pri3: "P3 (Medium)",
    pri4: "P4 (Low)",

    // Effort options
    effNone: "None",
    effXS: "XS (Tiny)",
    effS: "S (Small)",
    effM: "M (Medium)",
    effL: "L (Large)",
    effXL: "XL (Epic)",

    // Command Palette
    cmdPlaceholder: "Type a command or search tasks/categories...",
    cmdNoResults: "No results found matching",
    cmdGoCurrentWeek: "Go to Current Week",
    cmdJumpCurrentWeek: "Jump to today's active sprint",
    cmdGoNextWeek: "Go to Next Week",
    cmdJumpNextWeek: "Jump forward by 1 week",
    cmdGoPrevWeek: "Go to Previous Week",
    cmdJumpPrevWeek: "Jump backward by 1 week",
    cmdJumpCategory: "Jump to Category:",
    cmdScrollCategory: "Scroll immediately to",
    cmdUnknown: "Unknown",
    cmdStatusTodo: "Todo",
    cmdStatusActive: "Active",
    cmdStatusDone: "Done",
    cmdStatusBacklog: "Backlog",

    // Sidebar
    dailyFocusTitle: "Daily Focus",
    removeFocusTooltip: "Remove Focus",
    dailyFocusEmpty: "Double-click or edit a task card to pin it here. Keep your day structured.",
    sprintVelocityTitle: "Sprint Velocity",
    completionLabel: "Completion",
    tasksStats: "Tasks: {completed} done / {total} total",
    cmdPaletteLabel: "Command Palette",
    exitModalLabel: "Exit Modal",

    // Backlog Drawer
    backlogTitle: "Backlog",
    searchBacklogPlaceholder: "Search backlog...",
    allCategories: "All Categories",
    naturalSort: "Natural Sort",
    prioritySort: "Priority (1 → 4)",
    newestCreated: "Newest Created",
    quickCapturePlaceholder: "Backlog fast capture objective...",
    captureBtn: "Capture",
    backlogEmpty: "No backlog tasks fit these criteria. Drag tasks here to store them long-term.",

    // Modals
    categoryPlaceholder: "Music Production, Training, Software..."
  }
};

export function useTranslation() {
  const language = useMomentumStore(s => s.language || 'sr');
  return translations[language];
}
