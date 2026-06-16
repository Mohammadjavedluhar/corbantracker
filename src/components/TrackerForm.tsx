import React, { useState } from 'react';
import { CarbonInputs, CarbonBreakdown } from '../types';
import { Car, Flame, Apple, ShoppingBag, Eye, Zap } from 'lucide-react';

interface TrackerFormProps {
  inputs: CarbonInputs;
  onChange: (newInputs: CarbonInputs) => void;
  breakdown: CarbonBreakdown;
}

type TabType = 'transport' | 'energy' | 'diet' | 'shopping';

export const TrackerForm: React.FC<TrackerFormProps> = ({
  inputs,
  onChange,
  breakdown
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('transport');

  const updateTransport = (field: keyof typeof inputs.transport, value: any) => {
    onChange({
      ...inputs,
      transport: {
        ...inputs.transport,
        [field]: value
      }
    });
  };

  const updateEnergy = (field: keyof typeof inputs.energy, value: any) => {
    onChange({
      ...inputs,
      energy: {
        ...inputs.energy,
        [field]: value
      }
    });
  };

  const updateDiet = (field: keyof typeof inputs.diet, value: any) => {
    onChange({
      ...inputs,
      diet: {
        ...inputs.diet,
        [field]: value
      }
    });
  };

  const updateShopping = (field: keyof typeof inputs.shopping, value: any) => {
    onChange({
      ...inputs,
      shopping: {
        ...inputs.shopping,
        [field]: value
      }
    });
  };

  const total = breakdown.transport + breakdown.energy + breakdown.food + breakdown.shopping;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Category Tabs */}
      <div role="tablist" aria-label="Calculator Categories" className="tracker-tabs">
        <button 
          role="tab"
          id="tab-transport"
          aria-selected={activeTab === 'transport'}
          aria-controls="panel-transport"
          className={`tracker-tab-btn ${activeTab === 'transport' ? 'active' : ''}`}
          onClick={() => setActiveTab('transport')}
        >
          <Car size={16} /> Transport
        </button>
        <button 
          role="tab"
          id="tab-energy"
          aria-selected={activeTab === 'energy'}
          aria-controls="panel-energy"
          className={`tracker-tab-btn ${activeTab === 'energy' ? 'active' : ''}`}
          onClick={() => setActiveTab('energy')}
        >
          <Flame size={16} /> Home Energy
        </button>
        <button 
          role="tab"
          id="tab-diet"
          aria-selected={activeTab === 'diet'}
          aria-controls="panel-diet"
          className={`tracker-tab-btn ${activeTab === 'diet' ? 'active' : ''}`}
          onClick={() => setActiveTab('diet')}
        >
          <Apple size={16} /> Diet
        </button>
        <button 
          role="tab"
          id="tab-shopping"
          aria-selected={activeTab === 'shopping'}
          aria-controls="panel-shopping"
          className={`tracker-tab-btn ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          <ShoppingBag size={16} /> Shopping
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Side: Active Calculator Tab Inputs */}
        <div className="glass-panel" style={{ minHeight: '380px' }}>
          
          {activeTab === 'transport' && (
            <div role="tabpanel" id="panel-transport" aria-labelledby="tab-transport">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={20} color="hsl(var(--primary-light))" /> Transportation Settings
              </h3>
              
              <div className="form-group">
                <label htmlFor="carMilesWeekly" className="form-label">
                  <span>Weekly driving distance</span>
                  <span className="form-value">{inputs.transport.carMilesWeekly} miles</span>
                </label>
                <input 
                  id="carMilesWeekly"
                  type="range" 
                  min="0" 
                  max="600" 
                  step="10"
                  className="slider-input" 
                  value={inputs.transport.carMilesWeekly} 
                  onChange={(e) => updateTransport('carMilesWeekly', parseInt(e.target.value))}
                  aria-label="Weekly driving distance in miles"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carType" className="form-label">Vehicle fuel/engine type</label>
                <select 
                  id="carType"
                  className="select-input"
                  value={inputs.transport.carType}
                  onChange={(e) => updateTransport('carType', e.target.value)}
                  aria-label="Vehicle fuel/engine type selection"
                >
                  <option value="gas">Gasoline / Petrol Car</option>
                  <option value="diesel">Diesel Car</option>
                  <option value="hybrid">Hybrid Car (Gas + Electric)</option>
                  <option value="electric">Electric Vehicle (EV)</option>
                  <option value="none">No car / Don't drive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="publicTransitHoursWeekly" className="form-label">
                  <span>Public transit travel time</span>
                  <span className="form-value">{inputs.transport.publicTransitHoursWeekly} hours/week</span>
                </label>
                <input 
                  id="publicTransitHoursWeekly"
                  type="range" 
                  min="0" 
                  max="40" 
                  step="1"
                  className="slider-input" 
                  value={inputs.transport.publicTransitHoursWeekly} 
                  onChange={(e) => updateTransport('publicTransitHoursWeekly', parseInt(e.target.value))}
                  aria-label="Weekly public transit travel time in hours"
                />
              </div>

              <div className="form-group">
                <label htmlFor="flightsYearlyShort" className="form-label">
                  <span>Short flights yearly (&lt; 3 hrs)</span>
                  <span className="form-value">{inputs.transport.flightsYearlyShort} flights/year</span>
                </label>
                <input 
                  id="flightsYearlyShort"
                  type="range" 
                  min="0" 
                  max="15" 
                  className="slider-input" 
                  value={inputs.transport.flightsYearlyShort} 
                  onChange={(e) => updateTransport('flightsYearlyShort', parseInt(e.target.value))}
                  aria-label="Yearly short flights (under 3 hours)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="flightsYearlyLong" className="form-label">
                  <span>Long flights yearly (&gt; 3 hrs)</span>
                  <span className="form-value">{inputs.transport.flightsYearlyLong} flights/year</span>
                </label>
                <input 
                  id="flightsYearlyLong"
                  type="range" 
                  min="0" 
                  max="10" 
                  className="slider-input" 
                  value={inputs.transport.flightsYearlyLong} 
                  onChange={(e) => updateTransport('flightsYearlyLong', parseInt(e.target.value))}
                  aria-label="Yearly long flights (over 3 hours)"
                />
              </div>
            </div>
          )}

          {activeTab === 'energy' && (
            <div role="tabpanel" id="panel-energy" aria-labelledby="tab-energy">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} color="hsl(var(--primary-light))" /> Home Energy Footprint
              </h3>

              <div className="form-group">
                <label htmlFor="electricityKwhMonthly" className="form-label">
                  <span>Monthly electricity usage</span>
                  <span className="form-value">{inputs.energy.electricityKwhMonthly} kWh</span>
                </label>
                <input 
                  id="electricityKwhMonthly"
                  type="range" 
                  min="0" 
                  max="1200" 
                  step="20"
                  className="slider-input" 
                  value={inputs.energy.electricityKwhMonthly} 
                  onChange={(e) => updateEnergy('electricityKwhMonthly', parseInt(e.target.value))}
                  aria-label="Monthly electricity usage in kilowatt hours"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                  <input 
                    type="checkbox" 
                    id="greenEnergy" 
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'hsl(var(--primary-light))' }}
                    checked={inputs.energy.electricityGreen} 
                    onChange={(e) => updateEnergy('electricityGreen', e.target.checked)}
                  />
                  <label htmlFor="greenEnergy" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500' }}>
                    My electricity comes from 100% green/renewable source
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gasThermMonthly" className="form-label">
                  <span>Monthly natural gas usage</span>
                  <span className="form-value">{inputs.energy.gasThermMonthly} therms</span>
                </label>
                <input 
                  id="gasThermMonthly"
                  type="range" 
                  min="0" 
                  max="150" 
                  className="slider-input" 
                  value={inputs.energy.gasThermMonthly} 
                  onChange={(e) => updateEnergy('gasThermMonthly', parseInt(e.target.value))}
                  aria-label="Monthly natural gas usage in therms"
                />
              </div>

              <div className="form-group">
                <label htmlFor="waterGallonsDaily" className="form-label">
                  <span>Daily water usage (per person)</span>
                  <span className="form-value">{inputs.energy.waterGallonsDaily} gallons/day</span>
                </label>
                <input 
                  id="waterGallonsDaily"
                  type="range" 
                  min="0" 
                  max="200" 
                  step="5"
                  className="slider-input" 
                  value={inputs.energy.waterGallonsDaily} 
                  onChange={(e) => updateEnergy('waterGallonsDaily', parseInt(e.target.value))}
                  aria-label="Daily water usage in gallons"
                />
              </div>
            </div>
          )}

          {activeTab === 'diet' && (
            <div role="tabpanel" id="panel-diet" aria-labelledby="tab-diet">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Apple size={20} color="hsl(var(--primary-light))" /> Diet & Nutrition
              </h3>

              <div className="form-group">
                <label htmlFor="dietType" className="form-label">General dietary profile</label>
                <select 
                  id="dietType"
                  className="select-input"
                  value={inputs.diet.dietType}
                  onChange={(e) => updateDiet('dietType', e.target.value)}
                  aria-label="General dietary profile selection"
                >
                  <option value="vegan">Vegan (No animal products)</option>
                  <option value="vegetarian">Vegetarian (No meat/fish, includes dairy/eggs)</option>
                  <option value="pescatarian">Pescatarian (Vegetarian + Seafood)</option>
                  <option value="low-meat">Low Meat (Rarely consume red meat, mostly poultry/veg)</option>
                  <option value="high-meat">High Meat (Regularly consume red meat and processed meats)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="localFoodRatio" className="form-label">
                  <span>Locally sourced food ratio</span>
                  <span className="form-value">{inputs.diet.localFoodRatio}%</span>
                </label>
                <input 
                  id="localFoodRatio"
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  className="slider-input" 
                  value={inputs.diet.localFoodRatio} 
                  onChange={(e) => updateDiet('localFoodRatio', parseInt(e.target.value))}
                  aria-label="Locally sourced food ratio percentage"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                  Eating local foods reduces shipping logistics, refrigeration, and packing emissions.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'shopping' && (
            <div role="tabpanel" id="panel-shopping" aria-labelledby="tab-shopping">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="hsl(var(--primary-light))" /> Shopping & Waste Management
              </h3>

              <div className="form-group">
                <label htmlFor="clothingMonthly" className="form-label">
                  <span>New clothing items purchased</span>
                  <span className="form-value">{inputs.shopping.clothingMonthly} items/month</span>
                </label>
                <input 
                  id="clothingMonthly"
                  type="range" 
                  min="0" 
                  max="15" 
                  className="slider-input" 
                  value={inputs.shopping.clothingMonthly} 
                  onChange={(e) => updateShopping('clothingMonthly', parseInt(e.target.value))}
                  aria-label="Monthly clothing items purchased"
                />
              </div>

              <div className="form-group">
                <label htmlFor="electronicsYearly" className="form-label">
                  <span>Personal electronic purchases (phones, laptops, TVs)</span>
                  <span className="form-value">{inputs.shopping.electronicsYearly} devices/year</span>
                </label>
                <input 
                  id="electronicsYearly"
                  type="range" 
                  min="0" 
                  max="8" 
                  className="slider-input" 
                  value={inputs.shopping.electronicsYearly} 
                  onChange={(e) => updateShopping('electronicsYearly', parseInt(e.target.value))}
                  aria-label="Yearly personal electronic devices purchased"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recycleRate" className="form-label">
                  <span>Diligence in household recycling</span>
                  <span className="form-value">{inputs.shopping.recycleRate}% of household waste</span>
                </label>
                <input 
                  id="recycleRate"
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  className="slider-input" 
                  value={inputs.shopping.recycleRate} 
                  onChange={(e) => updateShopping('recycleRate', parseInt(e.target.value))}
                  aria-label="Recycling rate percentage of household waste"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Real-time calculation feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(22, 28, 41, 0.8) 0%, rgba(16, 185, 129, 0.04) 100%)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="hsl(var(--primary-light))" /> Instant Estimation
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'hsl(var(--primary-light))' }}>
                {total.toLocaleString()}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>kg CO2e / year</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🚗 Transport Impact:</span>
                <span className="form-value">{breakdown.transport.toLocaleString()} kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>⚡ Energy Impact:</span>
                <span className="form-value">{breakdown.energy.toLocaleString()} kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🍏 Diet Impact:</span>
                <span className="form-value">{breakdown.food.toLocaleString()} kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🛍️ Shopping Impact:</span>
                <span className="form-value">{breakdown.shopping.toLocaleString()} kg</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
            <Zap size={24} color="hsl(var(--warning))" style={{ flexShrink: '0' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Interactive Tuning:</strong> Drag any slider on the left to see your footprint update immediately. Try seeing what happens if you switch to an electric vehicle, or install solar energy toggles!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
