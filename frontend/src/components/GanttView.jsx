import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { tasksAPI } from '../api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PRIORITY_COLORS = {
  low: '#3b82f6',
  medium: '#eab308',
  high: '#f97316',
  urgent: '#ef4444',
};

export function GanttView({ board, onEditTask, onRefresh }) {
  const events = useMemo(() => {
    const allTasks = [];
    board.columns?.forEach(column => {
      column.tasks?.forEach(task => {
        if (task.due_date) {
          allTasks.push({
            id: task.id,
            title: task.title,
            start: new Date(task.due_date),
            end: addDays(new Date(task.due_date), 1),
            resource: task,
            backgroundColor: PRIORITY_COLORS[task.priority] || '#3b82f6',
          });
        }
      });
    });
    return allTasks;
  }, [board]);

  const handleSelectEvent = (event) => {
    onEditTask(event.resource);
  };

  const handleEventDrop = async ({ event, start }) => {
    const task = event.resource;
    const newDueDate = format(start, 'yyyy-MM-dd');

    try {
      await tasksAPI.update(
        task.id,
        task.title,
        task.description || '',
        task.column_id,
        task.position,
        { ...task, due_date: newDueDate }
      );
      onRefresh?.();
    } catch (err) {
      console.error('Failed to reschedule task:', err);
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.backgroundColor,
        borderRadius: '0.375rem',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-gray-500 text-lg">No tasks with due dates to display</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-white">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view="agenda"
        defaultView="agenda"
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        eventPropGetter={eventStyleGetter}
        draggableAccessor={() => true}
      />
    </div>
  );
}
