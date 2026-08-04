import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api';
import Sidebar from './components/Sidebar';
import QuickTaskInput from './components/QuickTaskInput';
import StatsOverview from './components/StatsOverview';
import TaskFilters from './components/TaskFilters';
import TaskItem from './components/TaskItem';
import TaskKanban from './components/TaskKanban';
import TaskModal from './components/TaskModal';
import TagManager from './components/TagManager';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import UserProfileDropdown from './components/UserProfileDropdown';
import Toast from './components/Toast';
import { 
  CheckSquare, 
  AlertCircle, 
  RefreshCw, 
  Menu, 
  Plus, 
  Calendar,
  Search,
  LayoutList,
  Kanban,
  ChevronDown,
  Inbox,
  Clock,
  Sun,
  CheckCircle2,
  X,
  PanelLeftOpen,
  PanelLeftClose,
  Briefcase,
  User as UserIcon,
  Zap,
  Check,
  Feather,
  Sparkles
} from 'lucide-react';

export default function App() {
  const { user, login, register, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Active Workspace Dropdown State
  const [activeWorkspace, setActiveWorkspace] = useState('personal'); // 'personal', 'urgent', 'work'
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  // Live Clock Updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(formatted);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    priority: '',
    tagId: '',
    search: '',
    sort: 'createdAt'
  });

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Compute Task Counts for Sidebar Badges & Topbar Stats
  const taskCounts = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      all: safeTasks.length,
      pending: safeTasks.filter(t => t && !t.is_complete).length,
      completed: safeTasks.filter(t => t && t.is_complete).length,
      dueToday: safeTasks.filter(t => t && !t.is_complete && t.due_date === todayStr).length,
      overdue: safeTasks.filter(t => t && !t.is_complete && t.due_date && t.due_date < todayStr).length
    };
  }, [tasks]);

  // Fetch Tasks from Backend
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await api.getTasks(filters);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks from server');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  // Fetch Tags from Backend
  const loadTags = useCallback(async () => {
    if (!user) {
      setTags([]);
      return;
    }
    try {
      const data = await api.getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setTags([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTasks();
      loadTags();
    }
  }, [user, loadTasks, loadTags]);

  const handleInstantDemo = async () => {
    setError('');
    const demoEmail = 'demo@example.com';
    const demoPass = 'password123';
    const demoName = 'Demo User';

    try {
      await login(demoEmail, demoPass);
      showToast('Logged in with Demo Account!');
    } catch (err) {
      try {
        await register(demoName, demoEmail, demoPass);
        showToast('Created and logged into Demo Account!');
      } catch (regErr) {
        showToast(regErr.message || 'Demo login failed', 'error');
      }
    }
  };

  // Switch Workspace Handler
  const handleSelectWorkspace = (wsId) => {
    setActiveWorkspace(wsId);
    setIsWorkspaceMenuOpen(false);

    if (wsId === 'personal') {
      setFilters(prev => ({ ...prev, status: 'all', priority: '', tagId: '' }));
      showToast('Switched to Personal Workspace');
    } else if (wsId === 'urgent') {
      setFilters(prev => ({ ...prev, status: 'pending', priority: 'urgent', tagId: '' }));
      showToast('Switched to Urgent Focus Workspace');
    } else if (wsId === 'work') {
      const safeTags = Array.isArray(tags) ? tags : [];
      const workTag = safeTags.find(t => t && t.name && (t.name.toLowerCase().includes('work') || t.name.toLowerCase().includes('job')));
      if (workTag) {
        setFilters(prev => ({ ...prev, status: 'all', priority: '', tagId: String(workTag.id) }));
      } else {
        setFilters(prev => ({ ...prev, status: 'all', priority: 'high', tagId: '' }));
      }
      showToast('Switched to Work & Projects Workspace');
    }
  };

  // Task Handlers
  const handleToggleComplete = async (task) => {
    const updatedStatus = !task.is_complete;
    setTasks(prev => (Array.isArray(prev) ? prev : []).map(t => t.id === task.id ? { ...t, is_complete: updatedStatus } : t));

    try {
      await api.updateTask(task.id, { is_complete: updatedStatus });
      showToast(updatedStatus ? 'Task marked as complete' : 'Task marked as active');
    } catch (err) {
      setTasks(prev => (Array.isArray(prev) ? prev : []).map(t => t.id === task.id ? { ...t, is_complete: task.is_complete } : t));
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleQuickCreate = async ({ title, priority }) => {
    try {
      const res = await api.createTask({ title, priority });
      setTasks(prev => [res, ...(Array.isArray(prev) ? prev : [])]);
      showToast('Task added to Inbox');
      loadTasks();
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, taskData);
        showToast('Task updated');
      } else {
        await api.createTask(taskData);
        showToast('Task created');
      }
      loadTasks();
    } catch (err) {
      showToast(err.message || 'Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => (Array.isArray(prev) ? prev : []).filter(t => t.id !== id));
      showToast('Task deleted');
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ee] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Loading TaskPulse SaaS...</p>
        </div>
      </div>
    );
  }

  // Render Full SaaS Landing Page when unauthenticated
  if (!user) {
    return (
      <>
        <LandingPage
          onInstantDemo={handleInstantDemo}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          showToast={showToast}
        />

        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  const getActiveViewTitle = () => {
    if (filters.tagId) {
      const safeTags = Array.isArray(tags) ? tags : [];
      const foundTag = safeTags.find(t => t && String(t.id) === filters.tagId);
      return { title: `#${foundTag?.name || 'Tag'}`, icon: CheckSquare };
    }
    switch (filters.status) {
      case 'due_today': return { title: 'Due Today', icon: Sun };
      case 'overdue': return { title: 'Overdue Tasks', icon: AlertCircle };
      case 'completed': return { title: 'Completed Tasks', icon: CheckCircle2 };
      case 'pending': return { title: 'In Progress', icon: Clock };
      default: return { title: 'Workspace Inbox', icon: Inbox };
    }
  };

  const currentView = getActiveViewTitle();
  const CurrentIcon = currentView.icon;

  const workspaceOptions = [
    { id: 'personal', name: 'Personal Workspace', desc: 'All personal tasks & inbox', icon: UserIcon, dotColor: 'bg-emerald-500' },
    { id: 'urgent', name: 'Urgent Focus', desc: 'High & urgent priority tasks', icon: Zap, dotColor: 'bg-red-500' },
    { id: 'work', name: 'Work & Projects', desc: 'Professional work assignments', icon: Briefcase, dotColor: 'bg-indigo-500' },
  ];

  const currentWorkspaceObj = workspaceOptions.find(w => w.id === activeWorkspace) || workspaceOptions[0];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <div className="min-h-screen bg-[#f8f5ee] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex transition-colors duration-200">
      
      {/* SaaS Left Sidebar */}
      <Sidebar
        filters={filters}
        setFilters={setFilters}
        tags={safeTags}
        taskCounts={taskCounts}
        onOpenTagManager={() => setIsTagManagerOpen(true)}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        isOpenMobile={isOpenMobileSidebar}
        setIsOpenMobile={setIsOpenMobileSidebar}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main SaaS Workspace Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:pl-0' : 'md:pl-56'
      }`}>
        
        {/* Executive SaaS Inside Topbar Header */}
        <header className="sticky top-0 z-30 bg-[#fffefb]/90 dark:bg-stone-900/90 border-b border-[#e6ded1] dark:border-stone-800 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between gap-4 transition-colors">
          
          {/* Left: Desktop Toggle + Workspace Selector + Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            
            {/* Desktop Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 rounded-lg hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpenMobileSidebar(true)}
              className="md:hidden p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 rounded-lg hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Clickable Workspace Badge Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f4efe6] hover:bg-[#e8decb] dark:bg-stone-950 dark:hover:bg-stone-800/80 border border-[#e6ded1] dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-all cursor-pointer shadow-sm"
              >
                <span className={`w-2 h-2 rounded-full ${currentWorkspaceObj.dotColor}`} />
                <span>{currentWorkspaceObj.name}</span>
                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isWorkspaceMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Workspace Dropdown Menu Popup */}
              {isWorkspaceMenuOpen && (
                <>
                  <div 
                    onClick={() => setIsWorkspaceMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute left-0 top-full mt-1.5 w-60 z-50 bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 p-1.5 rounded-2xl shadow-xl animate-fade-in space-y-1">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Switch Workspace
                    </p>
                    {workspaceOptions.map(ws => {
                      const Icon = ws.icon;
                      const isSelected = activeWorkspace === ws.id;
                      return (
                        <button
                          key={ws.id}
                          onClick={() => handleSelectWorkspace(ws.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#f2ece1] dark:bg-indigo-600/20 text-stone-900 dark:text-indigo-300 font-bold border border-[#e2d7c5] dark:border-indigo-500/30'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-[#f4efe6] dark:hover:bg-stone-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 rounded-lg bg-[#e8decb] dark:bg-stone-800 text-indigo-600 dark:text-indigo-400">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-left">
                              <p className="leading-tight font-semibold">{ws.name}</p>
                              <p className="text-[10px] text-stone-400 font-normal">{ws.desc}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <span className="text-stone-300 dark:text-stone-700 hidden lg:inline">/</span>

            {/* Active View Title & Icon */}
            <div className="flex items-center gap-2 text-xs truncate">
              <CurrentIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="font-bold text-stone-900 dark:text-stone-100 truncate">{currentView.title}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#f4efe6] dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-[#e6ded1] dark:border-stone-700/80">
                {taskCounts.all}
              </span>
            </div>
          </div>

          {/* Center: Search Bar Component */}
          <div className="hidden md:flex items-center relative max-w-sm w-full my-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search or filter tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-8 pr-12 h-8 bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner leading-normal"
            />
            {filters.search ? (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-500 bg-[#e8decb] dark:bg-stone-900 border border-[#ddcfba] dark:border-stone-800 px-1.5 py-0.5 rounded leading-none">
                ⌘K
              </span>
            )}
          </div>

          {/* Right: Live Clock + View Toggle + New Task CTA + Hover Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Live Clock Badge */}
            {currentTime && (
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{currentTime}</span>
              </div>
            )}

            {/* View Mode Switcher Pills */}
            <div className="hidden sm:flex items-center bg-[#f4efe6] dark:bg-stone-950 p-1 rounded-lg border border-[#e6ded1] dark:border-stone-800 text-[11px]">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white font-semibold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <LayoutList className="w-3 h-3" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white font-semibold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Kanban className="w-3 h-3" />
                <span>Board</span>
              </button>
            </div>

            {/* Topbar CTA: + New Task */}
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">New Task</span>
            </button>

            {/* User Profile Hover Dropdown */}
            <UserProfileDropdown onOpenTagManager={() => setIsTagManagerOpen(true)} />

          </div>

        </header>

        {/* Main Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          
          {/* Executive Metrics Overview Cards */}
          <StatsOverview
            tasks={safeTasks}
            onFilterClick={(statusId) => setFilters(prev => ({ ...prev, status: statusId, tagId: '' }))}
          />

          {/* Quick Task Input Bar */}
          <QuickTaskInput onQuickCreate={handleQuickCreate} />

          {/* View Switcher & Toolbar */}
          <TaskFilters
            filters={filters}
            setFilters={setFilters}
            tags={safeTags}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-stone-900 border border-red-200 dark:border-stone-700 text-red-700 dark:text-stone-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 dark:text-indigo-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={loadTasks}
                className="px-2.5 py-1 bg-red-100 dark:bg-stone-800 hover:bg-red-200 dark:hover:bg-stone-700 font-semibold rounded-md flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          {/* Task Views (List vs Kanban Board) */}
          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : safeTasks.length === 0 ? (
            /* Empty State */
            <div className="py-12 text-center slate-card p-8 my-2">
              <div className="w-10 h-10 rounded-xl bg-[#f4efe6] dark:bg-stone-900 text-[#9a3412] dark:text-amber-400 mx-auto flex items-center justify-center mb-3 border border-[#e6ded1] dark:border-stone-800 shadow-sm">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-1">No tasks in this view</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mb-4">
                {filters.search || filters.priority || filters.tagId
                  ? 'No tasks match your filter criteria.'
                  : 'You are all clear! Add a task using the input bar above.'}
              </p>
            </div>
          ) : viewMode === 'kanban' ? (
            /* Kanban View */
            <TaskKanban
              tasks={safeTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={handleDeleteTask}
            />
          ) : (
            /* List View */
            <div className="space-y-2">
              {safeTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        showToast={showToast}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        tags={safeTags}
      />

      <TagManager
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={safeTags}
        onTagCreated={(newTag) => setTags(prev => [...(Array.isArray(prev) ? prev : []), newTag])}
        onTagDeleted={(deletedId) => setTags(prev => (Array.isArray(prev) ? prev : []).filter(t => t.id !== deletedId))}
        showToast={showToast}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
