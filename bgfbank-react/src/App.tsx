import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ConveyorPage from './pages/ConveyorPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Components
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';

function App() {
  const { user, currentPage, isChatOpen } = useAppStore();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/conveyor" element={<ConveyorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      {isChatOpen && <ChatWidget />}
    </div>
  );
}

export default App;
