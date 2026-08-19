# Smart Schedule - Task Manager

A full-featured task management application with Kanban board, Gantt chart, and calendar views. Built with React, Node.js, and SQLite.

## ✨ Features

### Phase 1: Kanban Board ✅
- Create/manage projects and boards
- Drag-and-drop tasks between columns
- Real-time synchronization with backend
- Add/delete/reorder tasks

### Phase 2: Metadata & Editing ✅
- Task metadata: priority, assignee, due date, tags
- Edit modal for full task management
- Autocomplete for assignees and tags
- Color-coded priority badges
- Task card metadata display

### Phase 3: Multi-View Interface ✅
- **Kanban View**: Column-based task management with drag-drop
- **Gantt Chart**: Timeline visualization of tasks by due date
- **Calendar View**: Month/week/day/agenda grid view
- Drag-to-reschedule in all views
- Full editing capability from any view

### Polish & Optimization ✅
- Error boundaries for crash recovery
- Form validation with error messages
- Toast notifications for feedback
- Confirmation dialogs for destructive actions
- Task search with debouncing
- Advanced filtering (priority, assignee, due date)
- Responsive mobile design
- Performance optimization

## 🛠️ Tech Stack

**Frontend**:
- React 18, Vite, Tailwind CSS
- react-big-calendar, dnd-kit
- Debouncing, memoization

**Backend**:
- Node.js, Express.js
- SQLite database
- RESTful API

## 🚀 Quick Start

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Terminal 1: Start backend
npm start
# Backend runs on http://localhost:5000

# Terminal 2: Start frontend
cd frontend && npm run dev
# Frontend runs on http://localhost:5173
```

## 📁 Project Structure

```
monday-clone/
├── backend/
│   ├── db/init.js              # SQLite schema
│   ├── models/                 # Database queries
│   │   ├── projects.js
│   │   ├── boards.js
│   │   ├── columns.js
│   │   ├── tasks.js
│   │   └── tags.js
│   └── routes/                 # API endpoints
│       ├── projects.js
│       ├── boards.js
│       └── tasks.js
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Board.jsx
│   │   │   ├── KanbanView.jsx
│   │   │   ├── GanttView.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── TaskDetailsModal.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── filterUtils.js
│   │   │   └── debounce.js
│   │   ├── constants.js        # Magic strings
│   │   ├── api.js              # API client
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server.js                   # Express entry point
├── tasks.db                    # SQLite database
└── package.json
```

## 🎮 Usage

1. **Create Project**: Type name → Create
2. **Create Board**: Click "+ Add Board" → Enter name
3. **Add Task**: Click "+ Add Task" in column
4. **Edit Task**: Double-click task card or click task
5. **Switch Views**: Click Kanban/Gantt/Calendar tabs
6. **Filter Tasks**: Use filter bar (priority, assignee, due date)
7. **Search Tasks**: Use search by title/description
8. **Reschedule**: Drag task in Gantt/Calendar to change date

## 📊 Task Metadata

- **Priority**: low, medium, high, urgent
- **Assignee**: Free-form name with autocomplete
- **Due Date**: YYYY-MM-DD format
- **Labels**: Multiple tags with custom colors

## 🌐 API Endpoints

**Projects**:
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `DELETE /api/projects/:id` - Delete project

**Boards**:
- `GET /api/boards/:id` - Get board with tasks
- `POST /api/boards` - Create board

**Tasks**:
- `GET /api/tasks/column/:columnId` - Get column tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly UI
- Adaptive layouts
- Works on phones, tablets, desktops

## ⚡ Performance

- Debounced search (300ms)
- Memoized computations
- Optimized re-renders
- Efficient state management

## 🐛 Troubleshooting

**Port 5000 in use?**
```bash
lsof -ti:5000 | xargs kill -9
```

**Database issues?**
```bash
rm tasks.db && npm start
```

## 🚢 Production

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Deploy
npm start
```

## 🔮 Future Enhancements

- User authentication & team collaboration
- Real-time updates (WebSocket)
- Task comments & activity log
- Integrations (Slack, GitHub, Jira)
- Mobile app (React Native)

## 📝 License

MIT
