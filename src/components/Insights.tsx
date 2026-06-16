import React from 'react';
import { CarbonBreakdown } from '../types';
import { Lightbulb, Info, AlertTriangle, Leaf, HelpCircle } from 'lucide-react';

interface InsightsProps {
  breakdown: CarbonBreakdown;
}

export const Insights: React.FC<InsightsProps> = ({ breakdown }) => {
  // Determine highest emission driver
  const categories = [
    { key: 'transport', name: 'Transportation', value: breakdown.transport, color: 'hsl(200, 85%, 50%)' },
    { key: 'energy', name: 'Home Energy', value: breakdown.energy, color: 'hsl(40, 95%, 50%)' },
    { key: 'food', name: 'Diet & Food', value: breakdown.food, color: 'hsl(142, 70%, 45%)' },
    { key: 'shopping', name: 'Shopping & Waste', value: breakdown.shopping, color: 'hsl(280, 75%, 60%)' },
  ];

  const highest = [...categories].sort((a, b) => b.value - a.value)[0];

  const getTailoredAdvice = (catKey: string) => {
    switch (catKey) {
      case 'transport':
        return {
          title: 'Optimize Commutes & Travel',
          summary: 'Your transportation habits represent your largest carbon source. Standard combustion engines and air transit release massive carbon emissions directly into the upper atmosphere.',
          tips: [
            'For commutes under 2 miles, consider walking or biking. It reduces emissions to zero and boosts cardiovascular health.',
            'For regular highway driving, slowing down by 10 mph (e.g., from 75 to 65 mph) increases fuel economy by up to 15%.',
            'Consider combining errands into a single trip or carpooling with colleagues to reduce single-occupancy vehicle miles.',
            'When booking flights, opt for direct flights if possible; takeoff and landing account for a significant portion of aviation fuel burn.'
          ]
        };
      case 'energy':
        return {
          title: 'Upgrade Domestic Efficiency',
          summary: 'Heating, cooling, and lighting your home is your primary emission source. Grid systems still rely heavily on fossil fuels, making electric efficiency crucial.',
          tips: [
            'Washing laundry in cold water instead of hot saves about 75% to 90% of the energy consumed by a washing machine.',
            'Look into smart thermostats like Nest or ecobee; adjusting temperature settings by 7-10°F for 8 hours a day can save 10% on HVAC energy.',
            'Ditch vampire power by unplugging unused electronics. Devices left plugged in on "standby" mode account for 5-10% of household electricity use.',
            'If you own your home, explore switching to community solar programs or purchasing clean energy credits from your utility provider.'
          ]
        };
      case 'food':
        return {
          title: 'Lower Your Dietary Footprint',
          summary: 'Agricultural practices, livestock farming (methane), and global transit systems drive your food carbon output. Small adjustments in diets yield huge carbon savings.',
          tips: [
            'Red meat (beef, lamb) has an carbon footprint up to 10x higher than poultry and up to 30x higher than plant-based proteins like lentils or tofu.',
            'Combat food waste: around 30% of global food goes uneaten, releasing methane in landfills. Plan weekly meals and freeze excess portions.',
            'Opt for local and seasonal produce to avoid "food miles" (the emissions spent shipping items across oceans on refrigerated planes/cargo vessels).',
            'Incorporate one or two purely plant-based days into your week (e.g., Meatless Mondays) to gradually adapt your diet.'
          ]
        };
      default:
        return {
          title: 'Shift Toward Circular Living',
          summary: 'Industrial manufacturing, supply chain logistics, and fast-fashion production lines create heavy environmental overhead for consumer goods.',
          tips: [
            'Adopt the "Buy It For Life" philosophy. Invest in durable, high-quality items that can be repaired rather than discarded.',
            'Support secondary markets: buying clothing, electronics, or furniture second-hand/refurbished avoids 100% of the initial fabrication emissions.',
            'Extend the lifecycle of electronics: keeping a smartphone or laptop for 4 years instead of 2 cut its lifetime carbon footprint in half.',
            'Avoid fast fashion brands. The fashion industry emits more carbon than international flights and maritime shipping combined.'
          ]
        };
    }
  };

  const advice = getTailoredAdvice(highest.key);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Highest Driver Alert */}
      <div className="glass-panel" style={{ borderLeft: `5px solid ${highest.color}`, background: `linear-gradient(135deg, rgba(22, 28, 41, 0.75) 0%, ${highest.color}08 100%)` }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={28} style={{ color: highest.color, flexShrink: 0, marginTop: '0.25rem' }} />
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Primary Emission Driver: {highest.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {advice.summary}
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={16} style={{ color: highest.color }} /> Actions to Reduce {highest.name} Impact:
              </h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {advice.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* General Carbon Science Section */}
      <div className="grid-2">
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} color="hsl(var(--primary-light))" /> Carbon Footprint 101
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            A **carbon footprint** represents the total amount of greenhouse gases (including carbon dioxide and methane) emitted by our actions. It is expressed in **CO2 equivalent (CO2e)** to account for different gases having varying climate impacts.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            To limit global warming to 1.5°C above pre-industrial levels, the global average carbon footprint per person needs to drop to under **2,000 kg (2 metric tons) per year** by 2050. Currently, average footprints vary widely (e.g., US averages ~16 tons, while the global average is around 4.7 tons).
          </p>
        </div>

        <div className="glass-panel">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Leaf size={18} color="hsl(var(--primary-light))" /> The "Offsetting" Myth
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Carbon offsets (planting trees, funding renewable projects elsewhere) are a helpful transition mechanism but are not a complete solution.
          </p>
          <blockquote style={{ borderLeft: '3px solid var(--glass-border)', paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
            "We cannot offset our way out of climate change. Direct reductions in our lifestyle inputs—driving less, shifting diets, improving insulation—are far more reliable than offsets."
          </blockquote>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Focus on reducing your gross emissions first using our **Challenges** module. Offset only what remains truly unavoidable.
          </p>
        </div>
      </div>

      {/* Quick FAQ Accordion */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={18} color="hsl(var(--primary-light))" /> Frequently Asked Questions
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <details style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: '600', fontSize: '0.92rem', color: '#fff', outline: 'none' }}>
              How accurate are these carbon calculations?
            </summary>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
              These metrics use annualized standard emission factors compiled by environmental protection agencies (like the EPA and DEFRA). While they capture average impact ranges very accurately, exact individual figures vary based on precise regional grid mixes and vehicle model specifications.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: '600', fontSize: '0.92rem', color: '#fff', outline: 'none' }}>
              Why is dietary methane significant?
            </summary>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
              Livestock (especially cattle) emit methane gas via enteric fermentation. Methane is a potent greenhouse gas that heats the atmosphere 28-36 times more aggressively than CO2 over a 100-year timeframe, which is why meat consumption spikes diet footprints.
            </p>
          </details>

          <details style={{ paddingBottom: '0.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: '600', fontSize: '0.92rem', color: '#fff', outline: 'none' }}>
              Can recycling really make a difference?
            </summary>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
              Yes. Producing products from recycled materials requires significantly less energy than refining raw ores or synthesizing virgin plastics. Diligent recycling offsets secondary manufacturing footprints by avoiding resource extraction energy.
            </p>
          </details>
        </div>
      </div>

    </div>
  );
};
