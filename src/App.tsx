import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { GamifiedDashboard } from './components/GamifiedDashboard';
import { MissionLearningView } from './components/MissionLearningView';
import { QuizEngine } from './components/QuizEngine';
import { WelcomeWalkthrough } from './components/WelcomeWalkthrough';
import { BossBattle } from './components/BossBattle';
import { AdminDashboard } from './components/AdminDashboard';
import { XPSummaryPopup } from './components/XPSummaryPopup';
import { fullPlaybookData } from './data/full_playbook';
import { GameProvider, useGameState } from './components/GameStateContext';

type ViewState = 'login' | 'welcome' | 'dashboard' | 'learning' | 'quiz' | 'boss' | 'admin';

interface UserInfo {
  name: string;
  company: string;
}

function AppContent({ user, setUser }: { user: UserInfo | null, setUser: (u: UserInfo | null) => void }) {
  const { completedMissions, xp } = useGameState();
  const [currentView, setCurrentView] = useState<ViewState>(user ? 'dashboard' : 'login');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [showXPSummary, setShowXPSummary] = useState(false);
  const [hasShownXPSummary, setHasShownXPSummary] = useState(false);

  const mainChapters = fullPlaybookData.filter(c => c.id.startsWith('ch-'));
  const allMissionsCompleted = mainChapters.every(c => completedMissions.includes(c.id));

  useEffect(() => {
    if (allMissionsCompleted && !hasShownXPSummary && user) {
      // Use a timeout to avoid synchronous setState in effect warning
      const timer = setTimeout(() => {
        setShowXPSummary(true);
        setHasShownXPSummary(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [allMissionsCompleted, hasShownXPSummary, user]);

  const totalPossibleXP = mainChapters.length * 500; // 5 questions * 100 XP per chapter


  const handleLogin = (name: string, company: string, isReturning: boolean) => {
    setUser({ name, company });
    setCurrentView(isReturning ? 'dashboard' : 'welcome');
  };

  const handleLogout = () => {
    localStorage.removeItem('condense_active_session');
    setUser(null);
    setCurrentView('login');
  };

  const handleWelcomeComplete = () => {
    setCurrentView('dashboard');
  };

  const handleSelectMission = (chapterId: string) => {
    if (chapterId === 'boss-battle') {
      setCurrentView('boss');
    } else {
      setActiveChapterId(chapterId);
      setCurrentView('learning');
    }
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleReturnToDashboard = () => {
    setActiveChapterId(null);
    setCurrentView('dashboard');
  };

  if (currentView === 'login' || !user) {
    return <Login onStart={handleLogin} />;
  }

  if (currentView === 'welcome') {
    return (
      <WelcomeWalkthrough
        userName={user.name}
        onComplete={handleWelcomeComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 overflow-x-hidden relative selection:bg-emerald-500/30 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px] mix-blend-screen opacity-10 bg-emerald-900" />
      </div>

      <Navigation
        user={user}
        onLogout={handleLogout}
        onAdmin={() => {
          const adminPass = (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123').toLowerCase();
          const password = window.prompt("Enter Admin Security Passcode:");
          
          if (password?.toLowerCase() === adminPass) {
            console.log("Admin access granted.");
            setCurrentView('admin');
          } else if (password !== null) {
            alert(`Access Denied. Passcode is incorrect. (Default is 'admin123')`);
          }
        }}
        onDashboard={handleReturnToDashboard}
        isAdminView={currentView === 'admin'}
      />

      <main className="relative z-10 w-full pt-28">
        {currentView === 'admin' && (
          <AdminDashboard />
        )}
        {currentView === 'dashboard' && (
          <GamifiedDashboard onSelectMission={handleSelectMission} />
        )}
        {currentView === 'learning' && activeChapterId && (
          <MissionLearningView
            chapterId={activeChapterId}
            onBack={handleReturnToDashboard}
            onStartQuiz={handleStartQuiz}
          />
        )}
        {currentView === 'quiz' && activeChapterId && (
          <QuizEngine
            chapterId={activeChapterId}
            onComplete={handleReturnToDashboard}
          />
        )}
        {currentView === 'boss' && (
          <BossBattle
            onComplete={handleReturnToDashboard}
            onBack={handleReturnToDashboard}
          />
        )}
      </main>

      <AnimatePresence>
        {showXPSummary && (
          <XPSummaryPopup 
            totalXp={xp} 
            maxXp={totalPossibleXP} 
            onClose={() => setShowXPSummary(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto-login on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const activeSession = localStorage.getItem('condense_active_session');
        if (activeSession) {
          // Verify session still exists/is valid in Firestore
          const { db } = await import('./lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');
          
          const userRef = doc(db, 'users', activeSession);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({ name: activeSession, company: userData.companyCode });
          } else {
            // Invalid session
            localStorage.removeItem('condense_active_session');
          }
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, []);


  if (isInitializing) return null;

  return (
    <GameProvider key={user?.name || 'anonymous'} userId={user?.name}>
      <AppContent user={user} setUser={setUser} />
    </GameProvider>
  );
}
