import { Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<AboutPage />} path="about" />
        <Route element={<DashboardPage />} path="/" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}


export default App;