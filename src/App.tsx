import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import EnvironmentsPage from './pages/EnvironmentsPage';
import FlagsPage from './pages/FlagsPage';
import RulesPage from './pages/RulesPage';
import ProtectedRoute from './components/ProtectedRoute';

function RootRedirect() {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <EnvironmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/environments/:environmentId"
          element={
            <ProtectedRoute>
              <FlagsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/environments/:environmentId/flags/:flagId"
          element={
            <ProtectedRoute>
              <RulesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
