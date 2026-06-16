import React, { useState, useEffect } from 'react';
import { CarbonInputs, LogEntry, Challenge, LedgerEntry } from './types';
import { calculateCarbonFootprint, DEFAULT_INPUTS } from './utils/calculator';
import { Dashboard } from './components/Dashboard';
import { TrackerForm } from './components/TrackerForm';
import { Challenges } from './components/Challenges';
import { Insights } from './components/Insights';
import { Globe2, Leaf, BarChart3, HelpCircle, Trophy } from 'lucide-react';

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Meatless Mondays',
    description: 'Go meat-free for one day every week. Cutting down meat consumption lowers methane and agricultural transport overhead.',
    category: 'food',
    difficulty: 'low',
    impact: 210,
    accepted: false,
    completed: false
  },
  {
    id: 'c2',
    title: 'Switch to LEDs',
    description: 'Replace traditional incandescent lightbulbs in your home with energy-efficient LED bulbs.',
    category: 'energy',
    difficulty: 'low',
    impact: 140,
    accepted: false,
    completed: false
  },
  {
    id: 'c3',
    title: 'Carpool/Transit Commuting',
    description: 'Choose public transit, walking, or carpooling instead of driving alone for your weekly work commute.',
    category: 'transport',
    difficulty: 'medium',
    impact: 650,
    accepted: false,
    completed: false
  },
  {
    id: 'c4',
    title: 'Zero Vampire Power',
    description: 'Unplug chargers, computers, and TV systems when not in use, or use smart power strips to cut standby power.',
    category: 'energy',
    difficulty: 'low',
    impact: 85,
    accepted: false,
    completed: false
  },
  {
    id: 'c5',
    title: 'Adopt a Vegetarian Diet',
    description: 'Transition fully to a vegetarian diet. Eliminate poultry, red meat, and seafood from your consumption.',
    category: 'food',
    difficulty: 'high',
    impact: 850,
    accepted: false,
    completed: false
  },
  {
    id: 'c6',
    title: 'Thrifting & Second-Hand',
    description: 'Commit to buying new clothing items only when necessary. Opt for thrift stores, clothing swaps, and vintage markets.',
    category: 'shopping',
    difficulty: 'medium',
    impact: 120,
    accepted: false,
    completed: false
  },
  {
    id: 'c7',
    title: 'Flight-Free Year',
    description: 'Avoid booking short or long-haul leisure flights this year. Choose domestic destinations reachable by train or road trip.',
    category: 'transport',
    difficulty: 'high',
    impact: 1300,
    accepted: false,
    completed: false
  },
  {
    id: 'c8',
    title: 'Diligently Recycle & Compost',
    description: 'Strictly separate compostable waste and recyclable cardboard, aluminum, and plastics to minimize landfill output.',
    category: 'shopping',
    difficulty: 'low',
    impact: 190,
    accepted: false,
    completed: false
  }
];

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Input State
  const [inputs, setInputs] = useState<CarbonInputs>(() => {
    const saved = localStorage.getItem('terra_trace_inputs');
    return saved ? JSON.parse(saved) : DEFAULT_INPUTS;
  });

  // History Log State
  const [logHistory, setLogHistory] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('terra_trace_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Challenges State
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('terra_trace_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  // Daily Ledger State
  const [ledgerHistory, setLedgerHistory] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('terra_trace_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('terra_trace_inputs', JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem('terra_trace_logs', JSON.stringify(logHistory));
  }, [logHistory]);

  useEffect(() => {
    localStorage.setItem('terra_trace_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('terra_trace_ledger', JSON.stringify(ledgerHistory));
  }, [ledgerHistory]);

  // Calculations
  const breakdown = calculateCarbonFootprint(inputs);

  // Action Handlers
  const handleLogCurrent = () => {
    const total = breakdown.transport + breakdown.energy + breakdown.food + breakdown.shopping;
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      total,
      breakdown
    };

    setLogHistory([newEntry, ...logHistory]);
    showToast('Carbon entry recorded successfully! Check the history log.');
  };

  const handleClearHistory = () => {
    setLogHistory([]);
    showToast('History log cleared.');
  };

  const handleToggleAccept = (id: string) => {
    setChallenges((prev: Challenge[]) =>
      prev.map((c: Challenge) => (c.id === id ? { ...c, accepted: !c.accepted } : c))
    );
    const challenge = challenges.find((c: Challenge) => c.id === id);
    if (challenge) {
      showToast(challenge.accepted ? `Dropped challenge: ${challenge.title}` : `Accepted challenge: ${challenge.title}!`);
    }
  };

  const handleToggleComplete = (id: string) => {
    setChallenges((prev: Challenge[]) =>
      prev.map((c: Challenge) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
    const challenge = challenges.find((c: Challenge) => c.id === id);
    if (challenge) {
      showToast(challenge.completed ? `Reopened challenge: ${challenge.title}` : `Completed challenge: ${challenge.title}! 🎉`);
    }
  };

  const handleAddLedgerItem = (name: string, category: 'transport' | 'energy' | 'food' | 'shopping', co2: number) => {
    const newItem: LedgerEntry = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      category,
      co2,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setLedgerHistory([newItem, ...ledgerHistory]);
    showToast(`Logged activity: ${name} (+${co2} kg CO2e)`);
  };

  const handleDeleteLedgerItem = (id: string) => {
    setLedgerHistory((prev: LedgerEntry[]) => prev.filter((item: LedgerEntry) => item.id !== id));
    showToast('Activity removed.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="app-container">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(22, 28, 41, 0.95)',
          border: '1px solid hsl(var(--primary))',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 10px var(--primary-glow)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          color: '#fff',
          fontWeight: '500',
          backdropFilter: 'blur(8px)',
          animation: 'slideIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Leaf size={18} color="hsl(var(--primary-light))" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <a href="#" className="logo-section" onClick={() => setActiveTab('dashboard')}>
            <Globe2 className="logo-icon" size={28} />
            <span className="logo-text">TerraTrace</span>
          </a>

          <nav className="nav-links">
            <button 
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={16} /> Dashboard
            </button>
            <button 
              className={`nav-button ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracker')}
            >
              <Globe2 size={16} /> Calculator
            </button>
            <button 
              className={`nav-button ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <Trophy size={16} /> Reduce
            </button>
            <button 
              className={`nav-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <HelpCircle size={16} /> Insights
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard 
            breakdown={breakdown} 
            logHistory={logHistory} 
            onLogCurrent={handleLogCurrent} 
            onClearHistory={handleClearHistory}
            onNavigate={setActiveTab}
            challenges={challenges}
            ledgerHistory={ledgerHistory}
            onAddLedgerItem={handleAddLedgerItem}
            onDeleteLedgerItem={handleDeleteLedgerItem}
          />
        )}
        {activeTab === 'tracker' && (
          <TrackerForm 
            inputs={inputs} 
            onChange={setInputs} 
            breakdown={breakdown} 
          />
        )}
        {activeTab === 'challenges' && (
          <Challenges 
            challenges={challenges} 
            onToggleAccept={handleToggleAccept} 
            onToggleComplete={handleToggleComplete} 
          />
        )}
        {activeTab === 'insights' && (
          <Insights breakdown={breakdown} />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Leaf size={16} color="hsl(var(--primary-light))" />
            <span>TerraTrace Carbon Analytics &copy; {new Date().getFullYear()}</span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Empowering individuals to transition toward a low-carbon circular future.
          </div>
        </div>
      </footer>

      {/* Inline styles for basic CSS transitions like slideIn */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
};
export default App;
