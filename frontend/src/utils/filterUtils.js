export function applyFilters(board, filters, searchQuery = '') {
  if (!board) return board;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  const in7Days = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
  const in30Days = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];

  const filterTask = (task) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title?.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }

    // Assignee filter
    if (filters.assignee && !task.assignee?.toLowerCase().includes(filters.assignee.toLowerCase())) {
      return false;
    }

    // Due date filter
    if (filters.dueDate) {
      if (!task.due_date) return false;

      switch (filters.dueDate) {
        case 'overdue':
          if (task.due_date >= today) return false;
          break;
        case 'today':
          if (task.due_date !== today) return false;
          break;
        case 'this-week':
          if (task.due_date < today || task.due_date > in7Days) return false;
          break;
        case 'this-month':
          if (task.due_date < today || task.due_date > in30Days) return false;
          break;
      }
    }

    return true;
  };

  return {
    ...board,
    columns: board.columns?.map(column => ({
      ...column,
      tasks: column.tasks?.filter(filterTask) || [],
    })) || [],
  };
}
