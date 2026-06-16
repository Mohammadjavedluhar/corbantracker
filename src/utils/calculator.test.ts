import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from './calculator';
import { CarbonInputs } from '../types';

describe('Carbon Footprint Calculator Engine', () => {
  
  it('calculates carbon footprint correctly for default baseline inputs', () => {
    const defaultInputs: CarbonInputs = {
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

    const breakdown = calculateCarbonFootprint(defaultInputs);

    // Assert that breakdowns are numbers and match positive ranges
    expect(breakdown.transport).toBeGreaterThan(0);
    expect(breakdown.energy).toBeGreaterThan(0);
    expect(breakdown.food).toBeGreaterThan(0);
    expect(breakdown.shopping).toBeGreaterThan(0);

    // Verify mathematical bounds based on default constants
    // carGas = 0.404. Weekly miles = 150. Car: 150 * 52 * 0.404 = 3151.2
    // transit = 2 * 52 * 2.0 = 208
    // short flights = 2 * 250 = 500
    // transportTotal = 3151.2 + 208 + 500 = 3859.2 (Rounds to 3859)
    expect(breakdown.transport).toBe(3859);
  });

  it('reflects savings for eco-friendly configurations (vegan, electric vehicle, green electricity)', () => {
    const ecoInputs: CarbonInputs = {
      transport: {
        carMilesWeekly: 50,
        carType: 'electric', // lower factor
        publicTransitHoursWeekly: 0,
        flightsYearlyShort: 0,
        flightsYearlyLong: 0
      },
      energy: {
        electricityKwhMonthly: 150,
        electricityGreen: true, // green source factor 0.02
        gasThermMonthly: 0,
        waterGallonsDaily: 25
      },
      diet: {
        dietType: 'vegan', // base 950
        localFoodRatio: 100 // 15% reduction
      },
      shopping: {
        clothingMonthly: 0,
        electronicsYearly: 0,
        recycleRate: 100 // 25% waste reduction
      }
    };

    const breakdown = calculateCarbonFootprint(ecoInputs);

    // Electric car: 50 * 52 * 0.080 = 208 kg CO2e
    expect(breakdown.transport).toBe(208);

    // Electricity (Green): 150 * 12 * 0.02 = 36 kg CO2e
    // Water: 25 * 365 * 0.003 = 27.375 kg CO2e
    // Energy total: 36 + 27.375 = 63.375 (Rounds to 63)
    expect(breakdown.energy).toBe(63);

    // Vegan diet base: 950. Local savings: 100% * 15% = 142.5. Total: 950 - 142.5 = 807.5 (Rounds to 808)
    expect(breakdown.food).toBe(808);

    // Shopping total should hit minimum threshold (50) due to 0 purchases
    expect(breakdown.shopping).toBe(50);
  });

  it('correctly scales for high emission choices', () => {
    const highInputs: CarbonInputs = {
      transport: {
        carMilesWeekly: 400,
        carType: 'diesel',
        publicTransitHoursWeekly: 10,
        flightsYearlyShort: 5,
        flightsYearlyLong: 3
      },
      energy: {
        electricityKwhMonthly: 800,
        electricityGreen: false,
        gasThermMonthly: 100,
        waterGallonsDaily: 120
      },
      diet: {
        dietType: 'high-meat',
        localFoodRatio: 0
      },
      shopping: {
        clothingMonthly: 8,
        electronicsYearly: 4,
        recycleRate: 0
      }
    };

    const breakdown = calculateCarbonFootprint(highInputs);

    expect(breakdown.transport).toBeGreaterThan(12000);
    expect(breakdown.energy).toBeGreaterThan(5000);
    expect(breakdown.food).toBe(3100); // 3100 kg CO2e base for high-meat
    expect(breakdown.shopping).toBeGreaterThan(1500);
  });
});
