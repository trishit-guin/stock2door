// India-specific route optimization factors and constraints

export interface RouteConstraints {
  maxDrivingHours: number;
  restBreakInterval: number; // hours
  nightDrivingRestriction: boolean;
  monsoonSafetyFactor: number; // multiplier for bad weather
  tollOptimization: boolean;
  fuelStopRequired: boolean;
}

// Indian Motor Vehicle Act compliance factors
export const INDIAN_DRIVING_REGULATIONS = {
  MAX_DRIVING_HOURS_PER_DAY: 9,
  MANDATORY_REST_BREAK: 4, // hours after 4 hours of driving
  NIGHT_DRIVING_RESTRICTION: {
    'HCV': { start: '22:00', end: '06:00' }, // Heavy Commercial Vehicles
    'MCV': { start: '23:00', end: '05:00' }, // Medium Commercial Vehicles
    'LCV': null // No restriction for Light Commercial Vehicles
  },
  SPEED_LIMITS: {
    'NATIONAL_HIGHWAY': {
      'LCV': 80, // km/h
      'MCV': 70,
      'HCV': 60,
      'THREE_WHEELER': 50
    },
    'STATE_HIGHWAY': {
      'LCV': 70,
      'MCV': 60,
      'HCV': 50,
      'THREE_WHEELER': 40
    },
    'CITY_ROADS': {
      'LCV': 50,
      'MCV': 40,
      'HCV': 40,
      'THREE_WHEELER': 30
    }
  }
};

// Pollution Under Control (PUC) certificate zones
export const POLLUTION_ZONES = {
  'MUMBAI': 'CRITICAL',
  'DELHI': 'SEVERE',
  'BANGALORE': 'MODERATE',
  'CHENNAI': 'MODERATE',
  'KOLKATA': 'HIGH',
  'HYDERABAD': 'MODERATE',
  'PUNE': 'HIGH',
  'AHMEDABAD': 'HIGH',
  'JAIPUR': 'MODERATE'
};

// Fuel availability and EV charging infrastructure
export const FUEL_INFRASTRUCTURE = {
  DIESEL: {
    availability: 'ABUNDANT',
    avgDistanceBetweenPumps: 15, // km
    reliabilityScore: 0.95
  },
  PETROL: {
    availability: 'ABUNDANT', 
    avgDistanceBetweenPumps: 12, // km
    reliabilityScore: 0.98
  },
  CNG: {
    availability: 'LIMITED',
    cities: ['MUMBAI', 'DELHI', 'AHMEDABAD', 'PUNE', 'BANGALORE', 'HYDERABAD'],
    avgDistanceBetweenStations: 45, // km
    reliabilityScore: 0.85
  },
  ELECTRIC: {
    availability: 'EMERGING',
    chargingStations: {
      'MUMBAI': 245,
      'DELHI': 678,
      'BANGALORE': 189,
      'CHENNAI': 156,
      'PUNE': 123,
      'HYDERABAD': 134,
      'AHMEDABAD': 89
    },
    avgChargingTime: 45, // minutes for 80% charge
    reliabilityScore: 0.75
  }
};

// Road quality and infrastructure ratings (1-10 scale)
export const ROAD_QUALITY_RATINGS = {
  'NATIONAL_HIGHWAY': 8.2,
  'STATE_HIGHWAY': 6.8,
  'EXPRESSWAY': 9.1,
  'CITY_ROADS_TIER1': 7.2,
  'CITY_ROADS_TIER2': 5.8,
  'RURAL_ROADS': 4.5
};

// Weight and size restrictions for different vehicle categories
export const VEHICLE_RESTRICTIONS = {
  'LCV': {
    maxWeight: 7500, // kg
    maxLength: 6000, // mm
    bridgeRestrictions: false,
    tunnelRestrictions: false
  },
  'MCV': {
    maxWeight: 16500, // kg
    maxLength: 9000, // mm
    bridgeRestrictions: true,
    tunnelRestrictions: false
  },
  'HCV': {
    maxWeight: 49000, // kg
    maxLength: 18500, // mm
    bridgeRestrictions: true,
    tunnelRestrictions: true
  },
  'THREE_WHEELER': {
    maxWeight: 1000, // kg
    maxLength: 4000, // mm
    bridgeRestrictions: false,
    tunnelRestrictions: false
  }
};

// Seasonal factors affecting routes in India
export const SEASONAL_FACTORS = {
  SUMMER: {
    months: [3, 4, 5, 6], // March to June
    heatWaveAreas: ['DELHI', 'JAIPUR', 'AHMEDABAD', 'NAGPUR'],
    recommendations: {
      avoidDaytimeTravel: true,
      extraWaterStops: true,
      vehicleCoolingBreaks: true
    }
  },
  MONSOON: {
    months: [6, 7, 8, 9], // June to September
    floodProneAreas: ['MUMBAI', 'KOLKATA', 'CHENNAI', 'KOCHI'],
    recommendations: {
      avoidLowLyingRoutes: true,
      extraTravelTime: 1.3, // 30% extra time
      emergencyKitRequired: true
    }
  },
  WINTER: {
    months: [12, 1, 2], // December to February
    fogAreas: ['DELHI', 'LUCKNOW', 'PATNA', 'CHANDIGARH'],
    recommendations: {
      reducedVisibilityDriving: true,
      extraTravelTime: 1.15, // 15% extra time
      warmClothingRequired: true
    }
  },
  POST_MONSOON: {
    months: [10, 11], // October to November
    cycloneProneAreas: ['CHENNAI', 'VISAKHAPATNAM', 'KOLKATA'],
    recommendations: {
      weatherMonitoring: true,
      flexibleScheduling: true
    }
  }
};

// Multi-criteria scoring weights for Indian route optimization
export const OPTIMIZATION_WEIGHTS = {
  COST_FOCUSED: {
    fuelCost: 0.35,
    tollCost: 0.20,
    timeCost: 0.15,
    maintenanceCost: 0.15,
    emissionCost: 0.10,
    safetyRisk: 0.05
  },
  TIME_FOCUSED: {
    fuelCost: 0.15,
    tollCost: 0.10,
    timeCost: 0.40,
    maintenanceCost: 0.10,
    emissionCost: 0.15,
    safetyRisk: 0.10
  },
  ECO_FOCUSED: {
    fuelCost: 0.20,
    tollCost: 0.10,
    timeCost: 0.20,
    maintenanceCost: 0.10,
    emissionCost: 0.30,
    safetyRisk: 0.10
  },
  BALANCED: {
    fuelCost: 0.25,
    tollCost: 0.15,
    timeCost: 0.25,
    maintenanceCost: 0.15,
    emissionCost: 0.15,
    safetyRisk: 0.05
  }
};

// Indian festival calendar affecting logistics (2025)
export const FESTIVAL_CALENDAR = [
  { name: 'Holi', date: '2025-03-14', impact: 'HIGH', regions: ['NORTH', 'WEST'] },
  { name: 'Ram Navami', date: '2025-04-06', impact: 'MEDIUM', regions: ['ALL'] },
  { name: 'Eid ul-Fitr', date: '2025-04-10', impact: 'HIGH', regions: ['ALL'] },
  { name: 'Independence Day', date: '2025-08-15', impact: 'HIGH', regions: ['ALL'] },
  { name: 'Ganesh Chaturthi', date: '2025-08-29', impact: 'VERY_HIGH', regions: ['WEST'] },
  { name: 'Dussehra', date: '2025-10-02', impact: 'HIGH', regions: ['ALL'] },
  { name: 'Diwali', date: '2025-10-20', impact: 'VERY_HIGH', regions: ['ALL'] },
  { name: 'Christmas', date: '2025-12-25', impact: 'MEDIUM', regions: ['ALL'] }
];

// Emergency services and breakdown assistance availability
export const EMERGENCY_SERVICES = {
  availability: {
    'NATIONAL_HIGHWAY': 0.85, // Probability of getting help within 2 hours
    'STATE_HIGHWAY': 0.65,
    'CITY_ROADS': 0.90,
    'RURAL_ROADS': 0.35
  },
  responseTime: {
    'METRO_CITIES': 45, // minutes
    'TIER1_CITIES': 75,
    'TIER2_CITIES': 120,
    'RURAL_AREAS': 240
  }
};