export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

export const DEFAULT_TAG_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export const API_BASE_URL = 'http://localhost:5000/api';

export const VIEWS = {
  KANBAN: 'kanban',
  GANTT: 'gantt',
  CALENDAR: 'calendar',
};

export const VIEW_LABELS = ['Kanban', 'Gantt', 'Calendar'];

export const TOAST_DURATION = 3000;

export const FILTER_DATE_OPTIONS = [
  { value: '', label: 'All Dates' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
];
