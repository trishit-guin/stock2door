import { Request, Response } from 'express';
import { optimizeRoute } from './controllers/routeController';

// Mock request for testing
const mockRequest = {
  body: {
    source: 'Mumbai, Maharashtra, India',
    destination: 'Pune, Maharashtra, India',
    vehicleType: 'LCV',
    fuelType: 'DIESEL',
    includeWeather: true,
    includeAlternatives: true
  }
} as Request;

const mockResponse = {
  json: (data: any) => {
    console.log('\n=== ROUTE OPTIMIZATION TEST RESULTS ===');
    console.log('Source:', data.source);
    console.log('Destination:', data.destination);
    console.log('Vehicle:', data.vehicleType, data.fuelType);
    
    console.log('\n--- ROUTE BASIC INFO ---');
    console.log('Distance:', data.distance.km, 'km');
    console.log('Duration:', data.duration.with_traffic?.hours || data.duration.normal.hours, 'hours');
    console.log('Steps count:', data.route_path.steps);
    console.log('Detailed steps:', data.route_path.detailed_steps ? data.route_path.detailed_steps.length : 'Not available');
    
    console.log('\n--- WEATHER WAYPOINTS ---');
    if (data.weather) {
      console.log('Total waypoints:', data.weather.total_waypoints);
      console.log('Overall safety score:', data.weather.overall_safety_score);
      
      data.weather.waypoints.forEach((waypoint: any, index: number) => {
        console.log(`Waypoint ${index + 1}:`, waypoint.location?.name || 'Unknown location');
        if (waypoint.estimated_arrival_time) {
          console.log('  Arrival time:', new Date(waypoint.estimated_arrival_time).toLocaleString());
        }
        if (waypoint.current) {
          console.log('  Weather:', waypoint.current.weather_condition, '-', waypoint.current.weather_description);
          console.log('  Temperature:', waypoint.current.temperature + '°C');
        }
      });
    } else {
      console.log('No weather data available');
    }
    
    console.log('\n--- ALTERNATIVE ROUTES ---');
    if (data.alternatives && data.alternatives.length > 0) {
      console.log('Number of alternatives:', data.alternatives.length);
      data.alternatives.forEach((alt: any, index: number) => {
        console.log(`Alternative ${index + 1}: ${alt.summary}`);
        console.log('  Distance:', alt.distance.km, 'km');
        console.log('  Duration:', alt.duration.with_traffic ? 
          Math.round(alt.duration.with_traffic.value / 3600 * 10) / 10 : 
          Math.round(alt.duration.normal.value / 3600 * 10) / 10, 'hours');
        console.log('  Fuel cost: ₹' + alt.fuel_cost);
      });
    } else {
      console.log('No alternative routes found');
    }
    
    console.log('\n--- ROUTE STEPS SAMPLE ---');
    if (data.route_path.detailed_steps && data.route_path.detailed_steps.length > 0) {
      console.log('First 3 steps:');
      data.route_path.detailed_steps.slice(0, 3).forEach((step: any) => {
        console.log(`${step.step_number}. ${step.instruction}`);
        console.log(`   Distance: ${step.distance.text}, Duration: ${step.duration.text}`);
      });
    }
    
    return mockResponse;
  },
  status: (code: number) => mockResponse
} as Response;

// Run the test
console.log('Testing route optimization with all fixes...');
optimizeRoute(mockRequest, mockResponse);