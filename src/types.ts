export interface TransportInputs {
  carMilesWeekly: number;
  carType: 'gas' | 'diesel' | 'hybrid' | 'electric' | 'none';
  publicTransitHoursWeekly: number;
  flightsYearlyShort: number; // under 3 hours
  flightsYearlyLong: number;  // over 3 hours
}

export interface EnergyInputs {
  electricityKwhMonthly: number;
  electricityGreen: boolean; // if energy is 100% green
  gasThermMonthly: number;
  waterGallonsDaily: number;
}

export interface DietInputs {
  dietType: 'vegan' | 'vegetarian' | 'pescatarian' | 'low-meat' | 'high-meat';
  localFoodRatio: number; // 0 to 100
}

export interface ShoppingInputs {
  clothingMonthly: number; // items per month
  electronicsYearly: number; // items per year
  recycleRate: number; // 0 to 100 percentage of recycling
}

export interface CarbonInputs {
  transport: TransportInputs;
  energy: EnergyInputs;
  diet: DietInputs;
  shopping: ShoppingInputs;
}

export interface CarbonBreakdown {
  transport: number; // kg CO2e per year
  energy: number;
  food: number;
  shopping: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'shopping';
  difficulty: 'low' | 'medium' | 'high';
  impact: number; // Annual kg CO2e saved
  accepted: boolean;
  completed: boolean;
}

export interface LogEntry {
  id: string;
  date: string;
  total: number;
  breakdown: CarbonBreakdown;
}

export interface LedgerEntry {
  id: string;
  name: string;
  category: 'transport' | 'energy' | 'food' | 'shopping';
  co2: number;
  date: string;
}

