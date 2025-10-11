import dotenv from 'dotenv';
import { openWeatherService } from './services/openWeatherService';

// Load environment variables
dotenv.config();

async function testForecastWeather() {
  // Use the already instantiated service
  
  try {
    console.log('Testing forecast-based weather along route...');
    console.log('Route: Mumbai to Pune');
    
    // Mumbai coordinates
    const mumbaiLat = 19.0760;
    const mumbaiLon = 72.8777;
    
    // Pune coordinates  
    const puneLat = 18.5204;
    const puneLon = 73.8567;
    
    // Simulate a 3-hour drive
    const routeDurationMinutes = 180; // 3 hours
    const departureTime = new Date(); // Leave now
    
    console.log(`Departure time: ${departureTime.toLocaleString()}`);
    console.log(`Expected arrival: ${new Date(departureTime.getTime() + routeDurationMinutes * 60 * 1000).toLocaleString()}`);
    
    const result = await openWeatherService.getWeatherAlongRoute(
      mumbaiLat,
      mumbaiLon,
      puneLat,
      puneLon,
      routeDurationMinutes,
      departureTime
    );
    
    console.log('\n=== FORECAST WEATHER RESULTS ===');
    console.log(`Total waypoints: ${result.total_waypoints}`);
    console.log(`Overall safety score: ${result.overall_safety_score}/100`);
    
    result.waypoints.forEach((waypoint: any, index: number) => {
      console.log(`\n--- Waypoint ${index + 1} ---`);
      console.log(`Location: ${waypoint.location.name}`);
      console.log(`Estimated arrival: ${waypoint.estimated_arrival_time ? new Date(waypoint.estimated_arrival_time).toLocaleString() : 'Not set'}`);
      console.log(`Distance from start: ${waypoint.distance_from_start || 'Not set'} km`);
      console.log(`Weather: ${waypoint.current.weather_condition} - ${waypoint.current.weather_description}`);
      console.log(`Temperature: ${waypoint.current.temperature}°C (feels like ${waypoint.current.feels_like}°C)`);
      console.log(`Safety score: ${waypoint.driving_conditions.safety_score}/100`);
      
      if (waypoint.current.precipitation > 0) {
        console.log(`Precipitation: ${waypoint.current.precipitation} mm`);
      }
    });
    
    if (result.route_recommendations.length > 0) {
      console.log('\n=== ROUTE RECOMMENDATIONS ===');
      result.route_recommendations.forEach((rec: string) => {
        console.log(`- ${rec}`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testForecastWeather();