import React, { useState } from 'react';
import { Challenge } from '../types';
import { Check, Flame, Award, Filter, ShieldCheck } from 'lucide-react';


interface ChallengesProps {
  challenges: Challenge[];
  onToggleAccept: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({
  challenges,
  onToggleAccept,
  onToggleComplete
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filtered = challenges.filter(c => {
    const matchesCat = filterCategory === 'all' || c.category === filterCategory;
    const matchesDiff = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
    return matchesCat && matchesDiff;
  });

  const activeChallenges = challenges.filter(c => c.accepted && !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const potentialSavings = activeChallenges.reduce((sum, c) => sum + c.impact, 0);
  const achievedSavings = completedChallenges.reduce((sum, c) => sum + c.impact, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Metrics Banner */}
      <div className="grid-2">
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid hsl(var(--primary))' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '0.75rem', borderRadius: '50%' }}>
            <Award size={24} color="hsl(var(--primary-light))" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Commitments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{activeChallenges.length} Challenges</div>
            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--primary-light))' }}>
              Potential savings: <strong>{potentialSavings.toLocaleString()} kg CO2e / year</strong>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid hsl(var(--accent))' }}>
          <div style={{ background: 'rgba(23, 162, 184, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
            <ShieldCheck size={24} color="hsl(var(--accent))" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Carbon Prevented</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{completedChallenges.length} Achieved</div>
            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--accent))' }}>
              Confirmed savings: <strong>{achievedSavings.toLocaleString()} kg CO2e / year</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <Filter size={16} /> Filters:
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`nav-button ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            All Sectors
          </button>
          <button 
            className={`nav-button ${filterCategory === 'transport' ? 'active' : ''}`}
            onClick={() => setFilterCategory('transport')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Transport
          </button>
          <button 
            className={`nav-button ${filterCategory === 'energy' ? 'active' : ''}`}
            onClick={() => setFilterCategory('energy')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Energy
          </button>
          <button 
            className={`nav-button ${filterCategory === 'food' ? 'active' : ''}`}
            onClick={() => setFilterCategory('food')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Food
          </button>
          <button 
            className={`nav-button ${filterCategory === 'shopping' ? 'active' : ''}`}
            onClick={() => setFilterCategory('shopping')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Shopping
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`nav-button ${filterDifficulty === 'all' ? 'active' : ''}`}
            onClick={() => setFilterDifficulty('all')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            All Difficulties
          </button>
          <button 
            className={`nav-button ${filterDifficulty === 'low' ? 'active' : ''}`}
            onClick={() => setFilterDifficulty('low')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Easy
          </button>
          <button 
            className={`nav-button ${filterDifficulty === 'medium' ? 'active' : ''}`}
            onClick={() => setFilterDifficulty('medium')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Medium
          </button>
          <button 
            className={`nav-button ${filterDifficulty === 'high' ? 'active' : ''}`}
            onClick={() => setFilterDifficulty('high')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Challenging
          </button>
        </div>
      </div>

      {/* Grid of Challenges */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No challenges match the active filter criteria.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(challenge => (
            <div key={challenge.id} className="glass-panel challenge-card">
              <span className={`challenge-badge badge-${challenge.difficulty}`}>
                {challenge.difficulty}
              </span>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.25rem' }}>
                {challenge.category}
              </div>
              
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', paddingRight: '3.5rem' }}>
                {challenge.title}
              </h4>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flexGrow: 1, marginBottom: '1rem' }}>
                {challenge.description}
              </p>

              <div className="challenge-impact">
                <Flame size={14} /> -{challenge.impact} kg CO2e / yr
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {!challenge.accepted && !challenge.completed && (
                  <button className="btn-outline" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => onToggleAccept(challenge.id)}>
                    Accept
                  </button>
                )}
                
                {challenge.accepted && !challenge.completed && (
                  <>
                    <button className="btn-primary" style={{ flex: '1', fontSize: '0.85rem' }} onClick={() => onToggleComplete(challenge.id)}>
                      <Check size={14} /> Complete
                    </button>
                    <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }} onClick={() => onToggleAccept(challenge.id)}>
                      Drop
                    </button>
                  </>
                )}

                {challenge.completed && (
                  <button className="btn-success" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => onToggleComplete(challenge.id)}>
                    <Check size={14} /> Completed!
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
