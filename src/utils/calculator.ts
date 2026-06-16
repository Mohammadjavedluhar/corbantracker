import { CarbonInputs, CarbonBreakdown } from '../types';

// Constants for CO2e emission factors (in kg)
export const EMISSION_FACTORS = {
  // Transport factors
  carGas: 0.404,      // kg CO2e per mile
  carDiesel: 0.355,   // kg CO2e per mile
  carHybrid: 0.200,   // kg CO2e per mile
  carElectric: 0.080, // kg CO2e per mile (grid electricity emission average)
  publicTransitHour: 2.0, // kg CO2e per hour of transit (bus/train average)
  flightShort: 250,   // kg CO2e per short flight (roundtrip under 3h)
  flightLong: 1200,   // kg CO2e per long flight (roundtrip over 3h)

  // Energy factors
  electricityKwh: 0.38,      // kg CO2e per kWh
  electricityKwhGreen: 0.02, // kg CO2e per kWh (manufacturing/maintenance footprint)
  gasTherm: 5.3,             // kg CO2e per therm of natural gas
  waterGallon: 0.003,        // kg CO2e per gallon of tap water

  // Diet factors (annual base kg CO2e)
  dietVegan: 950,
  dietVegetarian: 1350,
  dietPescatarian: 1750,
  dietLowMeat: 2200,
  dietHighMeat: 3100,

  // Shopping factors
  clothingItem: 14,          // kg CO2e per average piece of new clothing
  electronicsItem: 85,       // kg CO2e per average consumer electronic device
};

export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonBreakdown {
  // 1. TRANSPORT CALCULATIONS (Annualized)
  let carFactor = 0;
  switch (inputs.transport.carType) {
    case 'gas': carFactor = EMISSION_FACTORS.carGas; break;
    case 'diesel': carFactor = EMISSION_FACTORS.carDiesel; break;
    case 'hybrid': carFactor = EMISSION_FACTORS.carHybrid; break;
    case 'electric': carFactor = EMISSION_FACTORS.carElectric; break;
    default: carFactor = 0;
  }
  const carEmissions = inputs.transport.carMilesWeekly * 52 * carFactor;
  const transitEmissions = inputs.transport.publicTransitHoursWeekly * 52 * EMISSION_FACTORS.publicTransitHour;
  const shortFlightEmissions = inputs.transport.flightsYearlyShort * EMISSION_FACTORS.flightShort;
  const longFlightEmissions = inputs.transport.flightsYearlyLong * EMISSION_FACTORS.flightLong;
  const transportTotal = carEmissions + transitEmissions + shortFlightEmissions + longFlightEmissions;

  // 2. ENERGY CALCULATIONS (Annualized)
  const elecFactor = inputs.energy.electricityGreen ? EMISSION_FACTORS.electricityKwhGreen : EMISSION_FACTORS.electricityKwh;
  const electricityEmissions = inputs.energy.electricityKwhMonthly * 12 * elecFactor;
  const gasEmissions = inputs.energy.gasThermMonthly * 12 * EMISSION_FACTORS.gasTherm;
  const waterEmissions = inputs.energy.waterGallonsDaily * 365 * EMISSION_FACTORS.waterGallon;
  const energyTotal = electricityEmissions + gasEmissions + waterEmissions;

  // 3. DIET CALCULATIONS (Annualized)
  let dietBase = 0;
  switch (inputs.diet.dietType) {
    case 'vegan': dietBase = EMISSION_FACTORS.dietVegan; break;
    case 'vegetarian': dietBase = EMISSION_FACTORS.dietVegetarian; break;
    case 'pescatarian': dietBase = EMISSION_FACTORS.dietPescatarian; break;
    case 'low-meat': dietBase = EMISSION_FACTORS.dietLowMeat; break;
    case 'high-meat': dietBase = EMISSION_FACTORS.dietHighMeat; break;
  }
  // Up to 15% reduction for eating 100% locally sourced food
  const localSavings = (inputs.diet.localFoodRatio / 100) * 0.15 * dietBase;
  const dietTotal = Math.max(200, dietBase - localSavings);

  // 4. SHOPPING & WASTE CALCULATIONS (Annualized)
  const clothesEmissions = inputs.shopping.clothingMonthly * 12 * EMISSION_FACTORS.clothingItem;
  const electronicsEmissions = inputs.shopping.electronicsYearly * EMISSION_FACTORS.electronicsItem;
  const shoppingBase = clothesEmissions + electronicsEmissions;
  // Up to 25% reduction for recycling waste diligently
  const recyclingSavings = (inputs.shopping.recycleRate / 100) * 0.25 * shoppingBase;
  const shoppingTotal = Math.max(50, shoppingBase - recyclingSavings);

  return {
    transport: Math.round(transportTotal),
    energy: Math.round(energyTotal),
    food: Math.round(dietTotal),
    shopping: Math.round(shoppingTotal)
  };
}

export const DEFAULT_INPUTS: CarbonInputs = {
  transport: {
    carMilesWeekly: 150,
    carType: 'gas',
    publicTransitHoursWeekly: 2,
    flightsYearlyShort: 2,
    flightsYearlyLong: 0
  },
  energy: {
    electricityKwhMonthly: 300,
    electricityGreen: false,
    gasThermMonthly: 30,
    waterGallonsDaily: 60
  },
  diet: {
    dietType: 'low-meat',
    localFoodRatio: 20
  },
  shopping: {
    clothingMonthly: 2,
    electronicsYearly: 1,
    recycleRate: 40
  }
};

export const GLOBAL_AVERAGE_FOOTPRINT = 4700; // Average global footprint in kg CO2e/year
export const TARGET_FOOTPRINT = 2000;         // Ideal sustainable target footprint in kg CO2e/year
export const DAILY_BUDGET_CO2 = 5.4;          // Daily allowance (2000kg / 365 days)

export interface PresetItem {
  name: string;
  category: 'transport' | 'energy' | 'food' | 'shopping';
  co2: number;
}

export const PRESET_LEDGER_ITEMS: PresetItem[] = [
  { name: 'Red Meat Meal (Beef/Lamb)', category: 'food', co2: 4.5 },
  { name: 'Poultry/Pork Meal (Chicken)', category: 'food', co2: 0.9 },
  { name: 'Vegan/Vegetarian Meal', category: 'food', co2: 0.35 },
  { name: 'Drive Gas Car (15 miles)', category: 'transport', co2: 6.0 },
  { name: 'Drive Hybrid Car (15 miles)', category: 'transport', co2: 3.0 },
  { name: 'Drive EV (15 miles)', category: 'transport', co2: 1.2 },
  { name: 'Commute on Bus/Train (30 mins)', category: 'transport', co2: 1.0 },
  { name: 'Long Hot Shower (15 mins)', category: 'energy', co2: 1.8 },
  { name: 'Standard Shower (5 mins)', category: 'energy', co2: 0.6 },
  { name: 'Laundry Load (Hot Wash + Dry)', category: 'energy', co2: 2.2 },
  { name: 'Laundry Load (Cold Wash + Hang Dry)', category: 'energy', co2: 0.2 },
  { name: 'Buy New Fashion Clothing Item', category: 'shopping', co2: 14.0 },
  { name: 'Buy Second-Hand Clothing Item', category: 'shopping', co2: 1.2 },
  { name: 'Buy New Small Electronic Device', category: 'shopping', co2: 45.0 }
];

