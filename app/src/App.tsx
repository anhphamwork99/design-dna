import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import SettingsModal from './components/SettingsModal';
import { AppShell } from './components/layout';
import {
  HomeScreen,
  AnalyzeScreen,
  CompareScreen,
  StudioScreen,
  LibraryScreen,
  ViewAnalysisScreen,
  PatternDetailScreen,
  MyAnalysesScreen,
} from './screens';

export default function App() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Listen for open-settings custom event (from screens when NO_API_KEY)
  useEffect(() => {
    const handler = () => setIsSettingsOpen(true);
    document.addEventListener('open-settings', handler);
    return () => document.removeEventListener('open-settings', handler);
  }, []);

  // Auth gate: loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 rounded ai-gradient animate-pulse" />
      </div>
    );
  }

  // Auth gate: login/register
  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary font-sans">
        <AnimatePresence mode="wait">
          {authScreen === 'login' ? (
            <LoginScreen key="login" onSwitchToRegister={() => setAuthScreen('register')} />
          ) : (
            <RegisterScreen key="register" onSwitchToLogin={() => setAuthScreen('login')} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <AppShell onSettingsClick={() => setIsSettingsOpen(true)}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/analyze" element={<AnalyzeScreen />} />
        <Route path="/studio" element={<StudioScreen />} />
        <Route path="/compare" element={<CompareScreen />} />
        <Route path="/library" element={<LibraryScreen />} />
        <Route path="/library/pattern/:id" element={<PatternDetailScreen />} />
        <Route path="/library/analysis/:id" element={<ViewAnalysisScreen />} />
        <Route path="/analyses" element={<MyAnalysesScreen />} />
      </Routes>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
