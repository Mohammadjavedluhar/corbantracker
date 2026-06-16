import React, { useState } from 'react';
import { CarbonBreakdown, LogEntry, Challenge, LedgerEntry } from '../types';
import { TARGET_FOOTPRINT, GLOBAL_AVERAGE_FOOTPRINT, DAILY_BUDGET_CO2, PRESET_LEDGER_ITEMS } from '../utils/calculator';
import { Globe, Trees, History, Trash2, Plus, Sparkles, Trophy, PlusCircle, Trash } from 'lucide-react';

interface DashboardProps {
  breakdown: CarbonBreakdown;
  logHistory: LogEntry[];
  onLogCurrent: () => void;
  onClearHistory: () => void;
  onNavigate: (tab: string) => void;
  challenges: Challenge[];
  ledgerHistory: LedgerEntry[];
  onAddLedgerItem: (name: string, category: 'transport' | 'energy' | 'food' | 'shopping', co2: number) => void;
  onDeleteLedgerItem: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  breakdown,
  logHistory,
  onLogCurrent,
  onClearHistory,
  onNavigate,
  challenges,
  ledgerHistory,
  onAddLedgerItem,
  onDeleteLedgerItem
}) => {
  const total = breakdown.transport + breakdown.energy + breakdown.food + breakdown.shopping;
  
  // Ledger state for adding items
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customName, setCustomName] = useState<string>('');
  const [customCO2, setCustomCO2] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<'transport' | 'energy' | 'food' | 'shopping'>('food');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Circle Calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(1, total / 8000) * circumference);

  // Determine status color and text based on footprint size
  let statusColor = '#ef4444'; // Red
  let statusText = 'Critical Footprint';
  let forestCondition: 'critical' | 'moderate' | 'healthy' = 'critical';
  
  if (total <= TARGET_FOOTPRINT) {
    statusColor = '#10b981'; // Green
    statusText = 'Sustainable!';
    forestCondition = 'healthy';
  } else if (total <= GLOBAL_AVERAGE_FOOTPRINT) {
    statusColor = '#fbbf24'; // Amber
    statusText = 'Moderate';
    forestCondition = 'moderate';
  }

  // Calculate XP and Rank
  const acceptedCount = challenges.filter(c => c.accepted && !c.completed).length;
  const completedCount = challenges.filter(c => c.completed).length;
  const totalXP = (acceptedCount * 50) + (completedCount * 250);

  let rankName = 'Eco Novice';
  let rankColor = '#94a3b8'; // Slate
  let xpThreshold = 300;
  let nextRank = 'Carbon Conscious';
  
  if (totalXP >= 1500) {
    rankName = 'Climate Guardian';
    rankColor = '#fbbf24'; // Gold
    xpThreshold = 3000;
    nextRank = 'Max Rank Reached';
  } else if (totalXP >= 800) {
    rankName = 'Green Pioneer';
    rankColor = '#10b981'; // Emerald Green
    xpThreshold = 1500;
    nextRank = 'Climate Guardian';
  } else if (totalXP >= 300) {
    rankName = 'Carbon Conscious';
    rankColor = '#22d3ee'; // Cyan
    xpThreshold = 800;
    nextRank = 'Green Pioneer';
  }

  const xpProgress = Math.min(100, (totalXP / xpThreshold) * 100);

  // Daily Budget Math
  const dailyTotal = ledgerHistory.reduce((sum, item) => sum + item.co2, 0);
  const remainingBudget = DAILY_BUDGET_CO2 - dailyTotal;
  const budgetPercentage = Math.min(100, (dailyTotal / DAILY_BUDGET_CO2) * 100);

  // Equivalencies calculations
  const treesRequired = Math.round(total / 22);
  const flightEquiv = (total / 1000).toFixed(1);
  const carMilesEquiv = Math.round(total / 0.404);

  // Handlers for Ledger
  const handleAddPreset = () => {
    const preset = PRESET_LEDGER_ITEMS[selectedPresetIndex];
    onAddLedgerItem(preset.name, preset.category, preset.co2);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customCO2) return;
    onAddLedgerItem(customName, customCategory, parseFloat(customCO2));
    setCustomName('');
    setCustomCO2('');
  };

  // Render Virtual Forest SVG
  const renderVirtualForest = () => {
    // Healthy: lush greens, bright background
    // Moderate: sunset orange, yellow trees
    // Critical: grey haze, bare tree trunks
    let skyGradientStart = '#1e293b';
    let skyGradientEnd = '#0d1527';
    let hillColor1 = '#064e3b';
    let hillColor2 = '#022c22';
    let fogOpacity = 0.05;

    if (forestCondition === 'healthy') {
      skyGradientEnd = '#14532d'; // Dark forest green horizon
      hillColor1 = '#047857';
      hillColor2 = '#065f46';
    } else if (forestCondition === 'moderate') {
      skyGradientEnd = '#7c2d12'; // Rust red horizon
      hillColor1 = '#854d0e';
      hillColor2 = '#713f12';
    } else {
      skyGradientEnd = '#450a0a'; // Muted dark red/brown ash horizon
      hillColor1 = '#27272a'; // Zinc/gray hills
      hillColor2 = '#18181b';
      fogOpacity = 0.3; // Smoke
    }

    return (
      <svg viewBox="0 0 400 160" style={{ width: '100%', borderRadius: 'var(--radius-sm)', background: '#0a0f1d', border: '1px solid var(--glass-border)' }}>
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skyGradientStart} />
            <stop offset="100%" stopColor={skyGradientEnd} />
          </linearGradient>
          <linearGradient id="fogGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272a" stopOpacity="0" />
            <stop offset="100%" stopColor="#27272a" stopOpacity={fogOpacity} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="160" fill="url(#skyGrad)" />
        
        {/* Sun/Moon */}
        {forestCondition === 'healthy' && <circle cx="320" cy="50" r="18" fill="#a7f3d0" opacity="0.35" />}
        {forestCondition === 'moderate' && <circle cx="320" cy="50" r="18" fill="#fed7aa" opacity="0.25" />}
        {forestCondition === 'critical' && <circle cx="320" cy="50" r="14" fill="#fca5a5" opacity="0.08" />}

        {/* Clouds / Haze */}
        {forestCondition === 'critical' && (
          <>
            <path d="M 30,50 Q 50,40 70,50 Q 90,40 110,50 T 150,50" fill="none" stroke="#71717a" strokeWidth="2" opacity="0.2" />
            <path d="M 220,65 Q 240,55 260,65 Q 280,55 300,65 T 340,65" fill="none" stroke="#71717a" strokeWidth="3" opacity="0.15" />
          </>
        )}

        {/* Back Hill */}
        <path d="M 0,160 L 0,120 Q 120,95 240,135 T 400,120 L 400,160 Z" fill={hillColor2} />

        {/* Front Hill */}
        <path d="M 0,160 L 0,135 Q 150,115 300,145 T 400,130 L 400,160 Z" fill={hillColor1} />

        {/* Trees */}
        {forestCondition === 'healthy' && (
          <>
            {/* Tree 1 */}
            <polygon points="50,130 40,150 60,150" fill="#34d399" />
            <polygon points="50,120 43,135 57,135" fill="#10b981" />
            <polygon points="50,110 46,125 54,125" fill="#059669" />
            <rect x="48" y="150" width="4" height="6" fill="#064e3b" />
            {/* Tree 2 */}
            <polygon points="110,140 102,158 118,158" fill="#34d399" />
            <polygon points="110,130 105,145 115,145" fill="#10b981" />
            <rect x="108" y="158" width="4" height="5" fill="#064e3b" />
            {/* Tree 3 */}
            <polygon points="180,135 168,155 192,155" fill="#059669" />
            <polygon points="180,123 172,139 188,139" fill="#047857" />
            <polygon points="180,112 175,127 185,127" fill="#065f46" />
            <rect x="178" y="155" width="4" height="7" fill="#022c22" />
            {/* Tree 4 */}
            <polygon points="250,145 242,160 258,160" fill="#10b981" />
            <polygon points="250,137 245,148 255,148" fill="#059669" />
            <rect x="248" y="160" width="4" height="4" fill="#064e3b" />
            {/* Tree 5 */}
            <polygon points="320,138 310,158 330,158" fill="#34d399" />
            <polygon points="320,128 313,142 327,142" fill="#10b981" />
            <polygon points="320,118 316,131 324,131" fill="#059669" />
            <rect x="318" y="158" width="4" height="6" fill="#064e3b" />
            {/* Tree 6 */}
            <polygon points="360,144 353,158 367,158" fill="#10b981" />
            <rect x="358" y="158" width="4" height="4" fill="#022c22" />
          </>
        )}

        {forestCondition === 'moderate' && (
          <>
            {/* Withered/Yellowish Trees */}
            <polygon points="60,135 50,155 70,155" fill="#fbbf24" />
            <polygon points="60,125 54,138 66,138" fill="#d97706" />
            <rect x="58" y="155" width="4" height="6" fill="#451a03" />

            <polygon points="160,140 152,158 168,158" fill="#f59e0b" />
            <polygon points="160,132 155,143 165,143" fill="#b45309" />
            <rect x="158" y="158" width="4" height="5" fill="#451a03" />

            <polygon points="280,142 270,160 290,160" fill="#fbbf24" />
            <polygon points="280,132 274,145 286,145" fill="#d97706" />
            <rect x="278" y="160" width="4" height="4" fill="#451a03" />
          </>
        )}

        {forestCondition === 'critical' && (
          <>
            {/* Dead trunks only */}
            {/* Dead tree 1 */}
            <line x1="80" y1="158" x2="80" y2="120" stroke="#52525b" strokeWidth="3" />
            <line x1="80" y1="140" x2="72" y2="132" stroke="#52525b" strokeWidth="2" />
            <line x1="80" y1="130" x2="88" y2="122" stroke="#52525b" strokeWidth="2" />
            
            {/* Dead tree 2 */}
            <line x1="260" y1="160" x2="260" y2="130" stroke="#3f3f46" strokeWidth="2" />
            <line x1="260" y1="145" x2="266" y2="139" stroke="#3f3f46" strokeWidth="1.5" />
            <line x1="260" y1="138" x2="254" y2="132" stroke="#3f3f46" strokeWidth="1.5" />
          </>
        )}

        {/* Smog Layer overlay */}
        <rect width="400" height="160" fill="url(#fogGrad)" pointerEvents="none" />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner: Profile Rank & Virtual Canopy Forest */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        
        {/* Virtual Forest (Visualizer) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trees size={20} color="hsl(var(--primary-light))" /> Eco-Canopy Simulator
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '10px', background: statusColor + '1a', color: statusColor, border: `1px solid ${statusColor}4d` }}>
                {statusText} Ecosystem
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              A real-time vector layout modeled on your carbon footprint. Green offsets cultivate life, whereas high consumption triggers acid smog and deforesting.
            </p>
          </div>
          {renderVirtualForest()}
        </div>

        {/* Level & Badge Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Trophy size={20} color="hsl(var(--warning))" /> Your Sustainability Rank
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                width: '60px', 
                height: '60px', 
                background: 'rgba(0,0,0,0.3)', 
                border: `2px solid ${rankColor}`, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: `0 0 15px ${rankColor}33`
              }}>
                🌱
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: rankColor, textShadow: `0 0 10px ${rankColor}22` }}>{rankName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Score: <strong>{totalXP} XP</strong></div>
              </div>
            </div>

            {/* XP progress */}
            <div style={{ margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                <span>Progress to next rank</span>
                <span>{totalXP} / {xpThreshold} XP</span>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${xpProgress}%`, backgroundColor: rankColor, boxShadow: `0 0 8px ${rankColor}` }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right' }}>
                Next: {nextRank}
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unlocked Badges</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {completedCount === 0 ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Complete tasks in the "Reduce" tab to unlock merit badges!</span>
              ) : (
                <>
                  {challenges.find(c => c.id === 'c1')?.completed && <span title="Completed Meatless Mondays Challenge" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#34d399' }}>🥦 Mondays Veggie</span>}
                  {challenges.find(c => c.id === 'c2')?.completed && <span title="Completed Switch to LEDs Challenge" style={{ background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#fbbf24' }}>💡 Lumen Knight</span>}
                  {challenges.find(c => c.id === 'c3')?.completed && <span title="Completed Carpool Commuter Challenge" style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#38bdf8' }}>🚲 Transit Rider</span>}
                  {challenges.find(c => c.id === 'c4')?.completed && <span title="Completed Standby Unplug Challenge" style={{ background: 'rgba(129, 140, 248, 0.15)', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#818cf8' }}>🔌 Vampire Slayer</span>}
                  {challenges.find(c => c.id === 'c5')?.completed && <span title="Completed Vegetarian Diet Challenge" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid rgba(16, 185, 129, 0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>🌱 Herbivore Master</span>}
                  {challenges.find(c => c.id === 'c6')?.completed && <span title="Completed Thrifting Challenge" style={{ background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#c084fc' }}>🛍️ Circular Stylist</span>}
                  {challenges.find(c => c.id === 'c7')?.completed && <span title="Completed Flight Free Challenge" style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#f43f5e' }}>🛫 Grounded Explorer</span>}
                  {challenges.find(c => c.id === 'c8')?.completed && <span title="Completed Compost & Recycle Challenge" style={{ background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#14b8a6' }}>♻️ Waste Warden</span>}
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Dashboard Hero */}
      <div className="glass-panel dashboard-hero">
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-glow)', border: '1px solid hsla(var(--primary-hue), 72%, 45%, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '20px', marginBottom: '1rem' }}>
            <Sparkles size={16} color="hsl(var(--primary-light))" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--primary-light))' }}>Footprint Log</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Carbon Footprint</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px' }}>
            Adjust your metrics using the interactive sliders inside the calculator to fine-tune your footprint data, then log your state to history.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onLogCurrent}>
              <Plus size={18} /> Record State
            </button>
            <button className="btn-outline" onClick={() => onNavigate('tracker')}>
              Update Calculator
            </button>
          </div>
        </div>

        {/* Big Circular Progress */}
        <div className="circle-progress-container">
          <svg className="circle-progress-svg">
            <circle className="circle-bg" cx="110" cy="110" r={radius} />
            <circle 
              className="circle-fill" 
              cx="110" 
              cy="110" 
              r={radius} 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ stroke: statusColor }}
            />
          </svg>
          <div className="circle-text">
            <div className="circle-value" style={{ color: statusColor }}>
              {total.toLocaleString()}
            </div>
            <div className="circle-label">kg CO2e / year</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: statusColor, marginTop: '0.25rem' }}>
              {statusColor === '#10b981' ? 'Sustainable Rank' : 'Needs Action'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid-2">
        
        {/* Category Breakdown */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="hsl(var(--primary-light))" /> Emission Breakdown
          </h3>
          
          <div className="category-stat-row">
            <div className="category-stat-header">
              <span>Transportation</span>
              <span className="form-value">{breakdown.transport.toLocaleString()} kg</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-bar bg-transport" 
                style={{ width: `${Math.min(100, (breakdown.transport / Math.max(1, total)) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="category-stat-row">
            <div className="category-stat-header">
              <span>Home Energy</span>
              <span className="form-value">{breakdown.energy.toLocaleString()} kg</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-bar bg-energy" 
                style={{ width: `${Math.min(100, (breakdown.energy / Math.max(1, total)) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="category-stat-row">
            <div className="category-stat-header">
              <span>Food & Diet</span>
              <span className="form-value">{breakdown.food.toLocaleString()} kg</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-bar bg-food" 
                style={{ width: `${Math.min(100, (breakdown.food / Math.max(1, total)) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="category-stat-row">
            <div className="category-stat-header">
              <span>Shopping & Waste</span>
              <span className="form-value">{breakdown.shopping.toLocaleString()} kg</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-bar bg-shopping" 
                style={{ width: `${Math.min(100, (breakdown.shopping / Math.max(1, total)) * 100)}%` }} 
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Target: <strong>{TARGET_FOOTPRINT.toLocaleString()} kg</strong></span>
            <span style={{ color: 'var(--text-secondary)' }}>Global Avg: <strong>{GLOBAL_AVERAGE_FOOTPRINT.toLocaleString()} kg</strong></span>
          </div>
        </div>

        {/* Real-World Equivalents */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trees size={20} color="hsl(var(--primary-light))" /> Offset Equivalents
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Visualizing your yearly environmental load in real-world assets:
          </p>

          <div className="equiv-grid">
            <div className="equiv-card">
              <span className="equiv-icon">🌳</span>
              <div className="equiv-value">{treesRequired}</div>
              <div className="equiv-label">Trees needed to absorb this/year</div>
            </div>
            <div className="equiv-card">
              <span className="equiv-icon">✈️</span>
              <div className="equiv-value">{flightEquiv}</div>
              <div className="equiv-label">London &harr; NY roundtrip flights</div>
            </div>
            <div className="equiv-card">
              <span className="equiv-icon">Car</span>
              <div className="equiv-value">{carMilesEquiv.toLocaleString()}</div>
              <div className="equiv-label">Miles in average petrol car</div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--glass-border)', marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              🎯 Reducing your footprint by just <strong>10%</strong> offsets equivalent emissions of driving <strong>{Math.round(carMilesEquiv * 0.1).toLocaleString()} miles</strong>!
            </p>
          </div>
        </div>
      </div>

      {/* Daily Eco-Ledger & History splitting */}
      <div className="grid-2">
        
        {/* Daily Eco-Ledger (Eco-Budget Tracker) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <PlusCircle size={20} color="hsl(var(--primary-light))" /> Daily Carbon Ledger
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Log individual daily items to balance your target daily allowance of <strong>{DAILY_BUDGET_CO2} kg CO2e</strong>.
            </p>
          </div>

          {/* Dial and allowance status */}
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Logged Today:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: remainingBudget >= 0 ? 'hsl(var(--primary-light))' : 'hsl(var(--danger))' }}>
                {dailyTotal.toFixed(1)} / {DAILY_BUDGET_CO2} kg
              </span>
            </div>
            
            <div className="progress-track" style={{ height: '8px', marginBottom: '0.5rem' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${budgetPercentage}%`, 
                  backgroundColor: remainingBudget >= 0 ? 'hsl(var(--primary-light))' : 'hsl(var(--danger))' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {remainingBudget >= 0 ? (
                <span>Remaining budget: <strong>{remainingBudget.toFixed(1)} kg</strong></span>
              ) : (
                <span style={{ color: 'hsl(var(--danger))' }}>Over budget by: <strong>{Math.abs(remainingBudget).toFixed(1)} kg</strong></span>
              )}
              <span>Target: 2,000 kg/yr</span>
            </div>
          </div>

          {/* Form */}
          {isCustomMode ? (
            <form onSubmit={handleAddCustom} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="Item name (e.g. Latte coffee)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{ flex: 2, padding: '0.5rem' }}
                />
                <input 
                  type="number" 
                  step="0.1"
                  className="text-input" 
                  placeholder="kg CO2"
                  value={customCO2}
                  onChange={(e) => setCustomCO2(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select 
                  className="select-input" 
                  value={customCategory} 
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                >
                  <option value="food">Diet / Food</option>
                  <option value="transport">Transport</option>
                  <option value="energy">Energy</option>
                  <option value="shopping">Shopping</option>
                </select>
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Log
                </button>
                <button type="button" className="btn-outline" onClick={() => setIsCustomMode(false)} style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                  Presets
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                className="select-input"
                value={selectedPresetIndex}
                onChange={(e) => setSelectedPresetIndex(parseInt(e.target.value))}
                style={{ flex: '1', padding: '0.6rem 0.5rem', fontSize: '0.85rem' }}
              >
                {PRESET_LEDGER_ITEMS.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.name} (+{item.co2} kg)
                  </option>
                ))}
              </select>
              <button className="btn-primary" onClick={handleAddPreset} style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                Log Item
              </button>
              <button className="btn-outline" onClick={() => setIsCustomMode(true)} style={{ padding: '0.6rem', fontSize: '0.85rem' }}>
                Custom
              </button>
            </div>
          )}

          {/* List of entries today */}
          <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
            {ledgerHistory.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', padding: '0.5rem' }}>
                No daily items logged yet. Try logging a meal or your drive!
              </span>
            ) : (
              ledgerHistory.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '0.4rem 0.75rem', borderRadius: '4px', borderLeft: '2px solid var(--glass-border)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600' }}>{item.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '700' }}>+{item.co2.toFixed(1)} kg</span>
                    <button 
                      onClick={() => onDeleteLedgerItem(item.id)}
                      style={{ border: 'none', background: 'transparent', color: 'hsl(var(--danger))', cursor: 'pointer' }}
                      title="Delete entry"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* History Log Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} color="hsl(var(--primary-light))" /> Yearly Footprint Logs
            </h3>
            {logHistory.length > 0 && (
              <button className="nav-button" onClick={onClearHistory} style={{ color: 'hsl(var(--danger))', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>

          {logHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--glass-border)', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Record your current calculations as standard logs to plot your long-term progress!
              </p>
              <button className="btn-outline" onClick={onLogCurrent} style={{ fontSize: '0.8rem', alignSelf: 'center' }}>
                Record Initial Log
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
              <div className="log-list" style={{ maxHeight: '200px' }}>
                {logHistory.map((entry) => {
                  const entryTotal = entry.breakdown.transport + entry.breakdown.energy + entry.breakdown.food + entry.breakdown.shopping;
                  let color = 'hsl(var(--danger))';
                  if (entryTotal <= TARGET_FOOTPRINT) color = 'hsl(var(--primary))';
                  else if (entryTotal <= GLOBAL_AVERAGE_FOOTPRINT) color = 'hsl(var(--warning))';
                  
                  return (
                    <div key={entry.id} className="log-item" style={{ borderLeftColor: color, padding: '0.5rem 0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{entryTotal.toLocaleString()} kg CO2e / yr</div>
                        <div className="log-date" style={{ fontSize: '0.7rem' }}>{entry.date}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.03)', padding: '2px 4px', borderRadius: '3px' }}>🚗 {entry.breakdown.transport}</span>
                        <span style={{ background: 'rgba(255,255,255,0.03)', padding: '2px 4px', borderRadius: '3px' }}>⚡ {entry.breakdown.energy}</span>
                        <span style={{ background: 'rgba(255,255,255,0.03)', padding: '2px 4px', borderRadius: '3px' }}>🍏 {entry.breakdown.food}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
