// India-specific static data for SmartRoute optimization

export interface IndianVehicleSpecs {
  make: string;
  model: string;
  category: 'LCV' | 'MCV' | 'HCV' | 'TRUCK' | 'TEMPO' | 'THREE_WHEELER';
  fuelType: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC';
  fuelEfficiency: number; // km/liter or km/kWh for electric
  emissionStandard: 'BS6' | 'BS4' | 'ELECTRIC';
  co2EmissionFactor: number; // grams CO2 per km
  loadCapacity: number; // in kg
  engineCapacity?: number; // in cc
}

// Major Indian commercial vehicle manufacturers and their popular models
export const INDIAN_VEHICLE_DATABASE: IndianVehicleSpecs[] = [
  // TATA Motors
  {
    make: 'TATA',
    model: 'Ace Gold',
    category: 'LCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 17.0,
    emissionStandard: 'BS6',
    co2EmissionFactor: 158,
    loadCapacity: 750,
    engineCapacity: 800
  },
  {
    make: 'TATA',
    model: 'Super Ace',
    category: 'LCV',
    fuelType: 'DIESEL', 
    fuelEfficiency: 16.5,
    emissionStandard: 'BS6',
    co2EmissionFactor: 162,
    loadCapacity: 1000,
    engineCapacity: 800
  },
  {
    make: 'TATA',
    model: 'Ultra T.7',
    category: 'MCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 8.5,
    emissionStandard: 'BS6',
    co2EmissionFactor: 315,
    loadCapacity: 7000,
    engineCapacity: 3800
  },
  {
    make: 'TATA',
    model: 'Prima 2528.K',
    category: 'HCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 4.2,
    emissionStandard: 'BS6',
    co2EmissionFactor: 638,
    loadCapacity: 25000,
    engineCapacity: 5900
  },
  {
    make: 'TATA',
    model: 'Nexon EV',
    category: 'LCV',
    fuelType: 'ELECTRIC',
    fuelEfficiency: 4.2, // km/kWh
    emissionStandard: 'ELECTRIC',
    co2EmissionFactor: 0,
    loadCapacity: 500
  },

  // MAHINDRA
  {
    make: 'MAHINDRA',
    model: 'Bolero Pickup',
    category: 'LCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 16.0,
    emissionStandard: 'BS6',
    co2EmissionFactor: 167,
    loadCapacity: 1000,
    engineCapacity: 2500
  },
  {
    make: 'MAHINDRA',
    model: 'Furio 7',
    category: 'MCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 8.2,
    emissionStandard: 'BS6',
    co2EmissionFactor: 326,
    loadCapacity: 6200,
    engineCapacity: 3800
  },
  {
    make: 'MAHINDRA',
    model: 'Treo Zor',
    category: 'THREE_WHEELER',
    fuelType: 'ELECTRIC',
    fuelEfficiency: 5.5, // km/kWh
    emissionStandard: 'ELECTRIC',
    co2EmissionFactor: 0,
    loadCapacity: 550
  },

  // ASHOK LEYLAND
  {
    make: 'ASHOK_LEYLAND',
    model: 'Dost+',
    category: 'LCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 17.5,
    emissionStandard: 'BS6',
    co2EmissionFactor: 153,
    loadCapacity: 1500,
    engineCapacity: 1500
  },
  {
    make: 'ASHOK_LEYLAND',
    model: 'Partner 6 Tyre',
    category: 'MCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 9.0,
    emissionStandard: 'BS6',
    co2EmissionFactor: 298,
    loadCapacity: 7490,
    engineCapacity: 2900
  },
  {
    make: 'ASHOK_LEYLAND',
    model: '3518',
    category: 'HCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 4.5,
    emissionStandard: 'BS6',
    co2EmissionFactor: 596,
    loadCapacity: 24000,
    engineCapacity: 5900
  },

  // EICHER
  {
    make: 'EICHER',
    model: 'Pro 1049 XP',
    category: 'LCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 15.8,
    emissionStandard: 'BS6',
    co2EmissionFactor: 169,
    loadCapacity: 2500,
    engineCapacity: 2100
  },
  {
    make: 'EICHER',
    model: 'Pro 2049',
    category: 'MCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 8.8,
    emissionStandard: 'BS6',
    co2EmissionFactor: 305,
    loadCapacity: 5000,
    engineCapacity: 2900
  },

  // FORCE MOTORS
  {
    make: 'FORCE',
    model: 'Traveller 26 Seater',
    category: 'MCV',
    fuelType: 'DIESEL',
    fuelEfficiency: 10.5,
    emissionStandard: 'BS6',
    co2EmissionFactor: 255,
    loadCapacity: 2600,
    engineCapacity: 2600
  },

  // BAJAJ
  {
    make: 'BAJAJ',
    model: 'RE Compact 4S',
    category: 'THREE_WHEELER',
    fuelType: 'CNG',
    fuelEfficiency: 35.0, // km/kg for CNG
    emissionStandard: 'BS6',
    co2EmissionFactor: 45,
    loadCapacity: 400,
    engineCapacity: 236
  },
  {
    make: 'BAJAJ',
    model: 'Maxima Cargo',
    category: 'THREE_WHEELER',
    fuelType: 'DIESEL',
    fuelEfficiency: 40.0,
    emissionStandard: 'BS6',
    co2EmissionFactor: 67,
    loadCapacity: 500,
    engineCapacity: 400
  }
];

// BS6 Emission Standards for India
export const BS6_EMISSION_STANDARDS = {
  DIESEL: {
    CO: 1.5, // g/kWh
    HC: 0.13, // g/kWh  
    NOx: 0.4, // g/kWh
    PM: 0.01 // g/kWh
  },
  PETROL: {
    CO: 1.0, // g/km
    HC: 0.068, // g/km
    NOx: 0.04, // g/km
    PM: 0.0045 // g/km
  },
  CNG: {
    CO: 1.0, // g/km
    HC: 0.068, // g/km  
    NOx: 0.04, // g/km
    PM: 0.0045 // g/km
  }
};

// Current fuel prices in major Indian cities (₹/liter) - Update monthly
export const INDIAN_FUEL_PRICES = {
  // Last updated: October 2025
  DIESEL: {
    'MUMBAI': 89.25,
    'DELHI': 86.95,
    'BANGALORE': 87.85,
    'CHENNAI': 90.15,
    'KOLKATA': 89.75,
    'HYDERABAD': 90.85,
    'PUNE': 88.45,
    'AHMEDABAD': 87.25,
    'JAIPUR': 89.95,
    'LUCKNOW': 87.15,
    'KOCHI': 91.25,
    'GUWAHATI': 88.75,
    'BHOPAL': 90.35,
    'CHANDIGARH': 86.85,
    'COIMBATORE': 90.75,
    'DEFAULT': 89.00 // Average across India
  },
  PETROL: {
    'MUMBAI': 106.31,
    'DELHI': 103.41,
    'BANGALORE': 104.95,
    'CHENNAI': 107.45,
    'KOLKATA': 106.85,
    'HYDERABAD': 107.95,
    'PUNE': 105.25,
    'AHMEDABAD': 104.15,
    'JAIPUR': 106.75,
    'LUCKNOW': 103.95,
    'KOCHI': 108.35,
    'GUWAHATI': 105.65,
    'BHOPAL': 107.25,
    'CHANDIGARH': 103.51,
    'COIMBATORE': 107.85,
    'DEFAULT': 106.00 // Average across India
  },
  CNG: {
    'MUMBAI': 86.40, // ₹/kg
    'DELHI': 75.61,
    'BANGALORE': 89.25,
    'CHENNAI': 92.15,
    'KOLKATA': 88.75,
    'HYDERABAD': 90.85,
    'PUNE': 87.45,
    'AHMEDABAD': 78.25,
    'JAIPUR': 89.95,
    'LUCKNOW': 86.15,
    'KOCHI': 93.25,
    'GUWAHATI': 87.75,
    'BHOPAL': 89.35,
    'CHANDIGARH': 75.85,
    'COIMBATORE': 91.75,
    'DEFAULT': 86.00 // Average across India
  }
};

// CO2 emission factors for different fuel types in India
export const INDIAN_CO2_EMISSION_FACTORS = {
  DIESEL: 2.68, // kg CO2 per liter
  PETROL: 2.31, // kg CO2 per liter  
  CNG: 1.87, // kg CO2 per kg
  ELECTRIC: 0.82 // kg CO2 per kWh (considering India's grid mix - coal heavy)
};

// Indian road toll rates (average) for route cost calculation
export const INDIAN_TOLL_RATES = {
  NATIONAL_HIGHWAY: {
    'LCV': 1.85, // ₹/km
    'MCV': 2.95,
    'HCV': 4.25,
    'THREE_WHEELER': 0.85
  },
  STATE_HIGHWAY: {
    'LCV': 1.25,
    'MCV': 2.15,
    'HCV': 3.45,
    'THREE_WHEELER': 0.65
  }
};

// Monsoon season considerations for Indian routes
export const MONSOON_SEASON_DATA = {
  'MUMBAI': { start: '2025-06-15', end: '2025-09-30', intensity: 'HIGH' },
  'DELHI': { start: '2025-07-01', end: '2025-09-15', intensity: 'MEDIUM' },
  'BANGALORE': { start: '2025-06-01', end: '2025-09-30', intensity: 'MEDIUM' },
  'CHENNAI': { start: '2025-10-15', end: '2026-01-15', intensity: 'HIGH' }, // Northeast monsoon
  'KOLKATA': { start: '2025-06-15', end: '2025-09-30', intensity: 'HIGH' },
  'HYDERABAD': { start: '2025-06-15', end: '2025-09-30', intensity: 'MEDIUM' },
  'PUNE': { start: '2025-06-15', end: '2025-09-30', intensity: 'HIGH' },
  'AHMEDABAD': { start: '2025-06-15', end: '2025-09-15', intensity: 'MEDIUM' },
  'KOCHI': { start: '2025-06-01', end: '2025-09-30', intensity: 'HIGH' }
};