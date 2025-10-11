// Minimal static data service for fuel consumption and emissions calculations

export interface VehicleEfficiency {
  fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC';
  fuelEfficiency: number; // km/liter or km/kWh for electric
  co2EmissionFactor: number; // grams CO2 per km
}

export interface FuelConsumptionResult {
  fuelRequired: number; // liters or kWh
  fuelCost: number; // INR
  co2Emissions: number; // kg CO2
  fuelType: string;
  efficiency: number;
}

// Simplified vehicle efficiency data - minimal static data
const VEHICLE_EFFICIENCY_DEFAULTS: Record<string, VehicleEfficiency> = {
  'LCV_DIESEL': {
    fuelType: 'DIESEL',
    fuelEfficiency: 16.0, // km/liter
    co2EmissionFactor: 160 // grams CO2 per km
  },
  'LCV_PETROL': {
    fuelType: 'PETROL',
    fuelEfficiency: 14.0,
    co2EmissionFactor: 150
  },
  'LCV_CNG': {
    fuelType: 'CNG',
    fuelEfficiency: 25.0, // km/kg
    co2EmissionFactor: 45
  },
  'LCV_ELECTRIC': {
    fuelType: 'ELECTRIC',
    fuelEfficiency: 4.0, // km/kWh
    co2EmissionFactor: 0
  },
  'MCV_DIESEL': {
    fuelType: 'DIESEL',
    fuelEfficiency: 8.5,
    co2EmissionFactor: 310
  },
  'HCV_DIESEL': {
    fuelType: 'DIESEL',
    fuelEfficiency: 4.5,
    co2EmissionFactor: 620
  },
  'THREE_WHEELER_CNG': {
    fuelType: 'CNG',
    fuelEfficiency: 35.0,
    co2EmissionFactor: 45
  },
  'THREE_WHEELER_ELECTRIC': {
    fuelType: 'ELECTRIC',
    fuelEfficiency: 5.0,
    co2EmissionFactor: 0
  }
};

// Current average fuel prices in India (October 2025)
const FUEL_PRICES: Record<string, number> = {
  'DIESEL': 89.00, // INR per liter
  'PETROL': 106.00, // INR per liter
  'CNG': 86.00, // INR per kg
  'ELECTRIC': 8.00 // INR per kWh
};

class StaticDataService {
  calculateFuelConsumption(
    distanceKm: number,
    vehicleCategory: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER',
    fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC' = 'DIESEL'
  ): FuelConsumptionResult {
    // Get vehicle efficiency key
    const efficiencyKey = `${vehicleCategory}_${fuelType}`;
    const efficiency = VEHICLE_EFFICIENCY_DEFAULTS[efficiencyKey] || VEHICLE_EFFICIENCY_DEFAULTS['LCV_DIESEL'];
    
    // Calculate fuel required
    const fuelRequired = distanceKm / efficiency.fuelEfficiency;
    
    // Calculate fuel cost
    const fuelPrice = FUEL_PRICES[fuelType] || FUEL_PRICES['DIESEL'];
    const fuelCost = fuelRequired * fuelPrice;
    
    // Calculate CO2 emissions (convert from grams to kg)
    const co2Emissions = (distanceKm * efficiency.co2EmissionFactor) / 1000;
    
    return {
      fuelRequired: Math.round(fuelRequired * 100) / 100, // Round to 2 decimal places
      fuelCost: Math.round(fuelCost * 100) / 100,
      co2Emissions: Math.round(co2Emissions * 100) / 100,
      fuelType: fuelType,
      efficiency: efficiency.fuelEfficiency
    };
  }

  getVehicleEfficiency(
    vehicleCategory: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER',
    fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC' = 'DIESEL'
  ): VehicleEfficiency {
    const efficiencyKey = `${vehicleCategory}_${fuelType}`;
    return VEHICLE_EFFICIENCY_DEFAULTS[efficiencyKey] || VEHICLE_EFFICIENCY_DEFAULTS['LCV_DIESEL'];
  }

  getFuelPrice(fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC'): number {
    return FUEL_PRICES[fuelType] || FUEL_PRICES['DIESEL'];
  }

  // Calculate environmental impact score (0-100, higher is better)
  calculateEnvironmentalScore(co2Emissions: number, distanceKm: number): number {
    const emissionsPerKm = co2Emissions / distanceKm; // kg CO2 per km
    
    // Score based on emissions per km
    // 0 kg/km = 100 points (electric)
    // 0.5 kg/km = 50 points (average)
    // 1.0+ kg/km = 0 points (very high emissions)
    
    let score = Math.max(0, 100 - (emissionsPerKm * 100));
    return Math.round(score);
  }

  // Get route complexity factor based on distance and urban areas
  getRouteComplexityFactor(distanceKm: number, hasUrbanAreas: boolean): number {
    let factor = 1.0;
    
    // Distance factor
    if (distanceKm > 500) factor += 0.1; // Long distance adds complexity
    if (distanceKm > 1000) factor += 0.1; // Very long distance
    
    // Urban complexity
    if (hasUrbanAreas) factor += 0.15; // Urban areas add complexity
    
    return Math.round(factor * 100) / 100;
  }
}

export const staticDataService = new StaticDataService();