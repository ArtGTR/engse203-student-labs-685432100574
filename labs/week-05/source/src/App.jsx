import { Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NewRequestPage from './pages/NewRequestPage.jsx';
import RequestDetailPage from './pages/RequestDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="requests/new" element={<NewRequestPage />} />
        <Route path="requests/:requestId" element={<RequestDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;