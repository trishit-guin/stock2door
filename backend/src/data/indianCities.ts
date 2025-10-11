// Major Indian cities with coordinates for route optimization

export interface IndianCity {
  name: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  population: number;
  zone: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'CENTRAL' | 'NORTHEAST';
  trafficLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  industrialHub: boolean;
  majorPorts?: string[];
}

export const INDIAN_CITIES: IndianCity[] = [
  // Metro Cities
  {
    name: 'MUMBAI',
    state: 'Maharashtra',
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    population: 20411274,
    zone: 'WEST',
    trafficLevel: 'VERY_HIGH',
    industrialHub: true,
    majorPorts: ['Mumbai Port', 'JNPT']
  },
  {
    name: 'DELHI',
    state: 'Delhi',
    coordinates: { latitude: 28.7041, longitude: 77.1025 },
    population: 32941308,
    zone: 'NORTH',
    trafficLevel: 'VERY_HIGH',
    industrialHub: true
  },
  {
    name: 'BANGALORE',
    state: 'Karnataka', 
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    population: 13608000,
    zone: 'SOUTH',
    trafficLevel: 'VERY_HIGH',
    industrialHub: true
  },
  {
    name: 'CHENNAI',
    state: 'Tamil Nadu',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    population: 11503293,
    zone: 'SOUTH',
    trafficLevel: 'HIGH',
    industrialHub: true,
    majorPorts: ['Chennai Port']
  },
  {
    name: 'KOLKATA',
    state: 'West Bengal',
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    population: 15134000,
    zone: 'EAST',
    trafficLevel: 'HIGH',
    industrialHub: true,
    majorPorts: ['Kolkata Port']
  },
  {
    name: 'HYDERABAD',
    state: 'Telangana',
    coordinates: { latitude: 17.3850, longitude: 78.4867 },
    population: 10268653,
    zone: 'SOUTH',
    trafficLevel: 'HIGH',
    industrialHub: true
  },

  // Major Tier-1 Cities
  {
    name: 'PUNE',
    state: 'Maharashtra',
    coordinates: { latitude: 18.5204, longitude: 73.8567 },
    population: 7541946,
    zone: 'WEST',
    trafficLevel: 'HIGH',
    industrialHub: true
  },
  {
    name: 'AHMEDABAD',
    state: 'Gujarat',
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    population: 8450228,
    zone: 'WEST',
    trafficLevel: 'HIGH',
    industrialHub: true
  },
  {
    name: 'JAIPUR',
    state: 'Rajasthan',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    population: 4073350,
    zone: 'NORTH',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'SURAT',
    state: 'Gujarat',
    coordinates: { latitude: 21.1702, longitude: 72.8311 },
    population: 6564343,
    zone: 'WEST',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'LUCKNOW',
    state: 'Uttar Pradesh',
    coordinates: { latitude: 26.8467, longitude: 80.9462 },
    population: 3609218,
    zone: 'NORTH',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },
  {
    name: 'KANPUR',
    state: 'Uttar Pradesh',
    coordinates: { latitude: 26.4499, longitude: 80.3319 },
    population: 3971308,
    zone: 'NORTH',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'NAGPUR',
    state: 'Maharashtra',
    coordinates: { latitude: 21.1458, longitude: 79.0882 },
    population: 3145797,
    zone: 'CENTRAL',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },
  {
    name: 'INDORE',
    state: 'Madhya Pradesh',
    coordinates: { latitude: 22.7196, longitude: 75.8577 },
    population: 3272335,
    zone: 'CENTRAL',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'THANE',
    state: 'Maharashtra',
    coordinates: { latitude: 19.2183, longitude: 72.9781 },
    population: 2080625,
    zone: 'WEST',
    trafficLevel: 'HIGH',
    industrialHub: true
  },
  {
    name: 'BHOPAL',
    state: 'Madhya Pradesh',
    coordinates: { latitude: 23.2599, longitude: 77.4126 },
    population: 2371061,
    zone: 'CENTRAL',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },
  {
    name: 'VISAKHAPATNAM',
    state: 'Andhra Pradesh',
    coordinates: { latitude: 17.6868, longitude: 83.2185 },
    population: 2170000,
    zone: 'SOUTH',
    trafficLevel: 'MEDIUM',
    industrialHub: true,
    majorPorts: ['Visakhapatnam Port']
  },
  {
    name: 'VADODARA',
    state: 'Gujarat',
    coordinates: { latitude: 22.3072, longitude: 73.1812 },
    population: 2239068,
    zone: 'WEST',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'PATNA',
    state: 'Bihar',
    coordinates: { latitude: 25.5941, longitude: 85.1376 },
    population: 2458070,
    zone: 'EAST',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },
  {
    name: 'LUDHIANA',
    state: 'Punjab',
    coordinates: { latitude: 30.9010, longitude: 75.8573 },
    population: 1837436,
    zone: 'NORTH',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'AGRA',
    state: 'Uttar Pradesh',
    coordinates: { latitude: 27.1767, longitude: 78.0081 },
    population: 1760285,
    zone: 'NORTH',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },
  {
    name: 'NASHIK',
    state: 'Maharashtra',
    coordinates: { latitude: 19.9975, longitude: 73.7898 },
    population: 1695134,
    zone: 'WEST',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'COIMBATORE',
    state: 'Tamil Nadu',
    coordinates: { latitude: 11.0168, longitude: 76.9558 },
    population: 1696986,
    zone: 'SOUTH',
    trafficLevel: 'MEDIUM',
    industrialHub: true
  },
  {
    name: 'KOCHI',
    state: 'Kerala',
    coordinates: { latitude: 9.9312, longitude: 76.2673 },
    population: 2119724,
    zone: 'SOUTH',
    trafficLevel: 'MEDIUM',
    industrialHub: false,
    majorPorts: ['Kochi Port']
  },
  {
    name: 'CHANDIGARH',
    state: 'Chandigarh',
    coordinates: { latitude: 30.7333, longitude: 76.7794 },
    population: 1179007,
    zone: 'NORTH',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },
  {
    name: 'GUWAHATI',
    state: 'Assam',
    coordinates: { latitude: 26.1445, longitude: 91.7362 },
    population: 1116267,
    zone: 'NORTHEAST',
    trafficLevel: 'MEDIUM',
    industrialHub: false
  },

  // Port Cities (Important for Logistics)
  {
    name: 'KANDLA',
    state: 'Gujarat',
    coordinates: { latitude: 23.0333, longitude: 70.2167 },
    population: 50000,
    zone: 'WEST',
    trafficLevel: 'LOW',
    industrialHub: false,
    majorPorts: ['Kandla Port']
  },
  {
    name: 'MANGALORE',
    state: 'Karnataka',
    coordinates: { latitude: 12.9141, longitude: 74.8560 },
    population: 724159,
    zone: 'SOUTH',
    trafficLevel: 'MEDIUM',
    industrialHub: false,
    majorPorts: ['New Mangalore Port']
  },
  {
    name: 'PARADIP',
    state: 'Odisha',
    coordinates: { latitude: 20.3167, longitude: 86.6167 },
    population: 75000,
    zone: 'EAST',
    trafficLevel: 'LOW',
    industrialHub: false,
    majorPorts: ['Paradip Port']
  },
  {
    name: 'TUTICORIN',
    state: 'Tamil Nadu',
    coordinates: { latitude: 8.7642, longitude: 78.1348 },
    population: 400000,
    zone: 'SOUTH',
    trafficLevel: 'LOW',
    industrialHub: false,
    majorPorts: ['Tuticorin Port']
  }
];

// Industrial corridors and logistics hubs in India
export const INDUSTRIAL_CORRIDORS = [
  {
    name: 'Delhi-Mumbai Industrial Corridor (DMIC)',
    cities: ['DELHI', 'MUMBAI', 'AHMEDABAD'],
    length: 1504, // km
    type: 'FREIGHT_CORRIDOR'
  },
  {
    name: 'Eastern Dedicated Freight Corridor',
    cities: ['DELHI', 'KOLKATA'],
    length: 1856, // km
    type: 'FREIGHT_CORRIDOR'
  },
  {
    name: 'Chennai-Bangalore Industrial Corridor',
    cities: ['CHENNAI', 'BANGALORE'],
    length: 362, // km
    type: 'INDUSTRIAL_CORRIDOR'
  },
  {
    name: 'Mumbai-Pune Expressway',
    cities: ['MUMBAI', 'PUNE'],
    length: 94, // km
    type: 'EXPRESSWAY'
  },
  {
    name: 'Golden Quadrilateral',
    cities: ['DELHI', 'MUMBAI', 'CHENNAI', 'KOLKATA'],
    length: 5846, // km
    type: 'HIGHWAY_NETWORK'
  }
];

// Peak hours and traffic patterns for major Indian cities
export const TRAFFIC_PATTERNS = {
  'MUMBAI': {
    morningPeak: { start: '07:30', end: '11:00' },
    eveningPeak: { start: '17:30', end: '21:30' },
    weekendPattern: 'MODERATE'
  },
  'DELHI': {
    morningPeak: { start: '08:00', end: '11:00' },
    eveningPeak: { start: '18:00', end: '21:00' },
    weekendPattern: 'MODERATE'
  },
  'BANGALORE': {
    morningPeak: { start: '08:30', end: '11:30' },
    eveningPeak: { start: '18:30', end: '21:30' },
    weekendPattern: 'LOW'
  },
  'CHENNAI': {
    morningPeak: { start: '08:00', end: '10:30' },
    eveningPeak: { start: '18:00', end: '20:30' },
    weekendPattern: 'MODERATE'
  },
  'PUNE': {
    morningPeak: { start: '08:30', end: '11:00' },
    eveningPeak: { start: '18:30', end: '21:00' },
    weekendPattern: 'LOW'
  }
};