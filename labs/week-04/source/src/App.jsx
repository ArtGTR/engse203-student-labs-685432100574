import { initialTasks } from './data/initialTasks.js';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import TaskList from './components/TaskList.jsx';
import FilterBar from './components/FilterBar.jsx';
import { useState } from 'react';

const task = {
  id: 'TASK-001',
  title: 'อ่านบท JSX',
  status: 'todo',
};
function App() {
  const [tasks] = useState(initialTasks);
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = {
    total: initialTasks.length,
    todo: initialTasks.filter((task) => task.status === 'todo').length,
    doing: initialTasks.filter((task) => task.status === 'doing').length,
    done: initialTasks.filter((task) => task.status === 'done').length,
  };

  return (
    <>
      <AppHeader title="Study Task Board" subtitle="CP03 — State, derived data และ filter" />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <section className="panel">
          <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
          <TaskList tasks={filteredTasks} />
        </section>
      </main>
    </>
  );
}



export default App;

