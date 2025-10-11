import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? 'LOADED ✅' : 'MISSING ❌');
console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? 'LOADED ✅' : 'MISSING ❌');

// Test the services
try {
  console.log('\n--- Testing Google Maps Service ---');
  import('./services/googleMapsService.js').then((module) => {
    console.log('Google Maps Service imported successfully ✅');
  }).catch((error) => {
    console.error('Google Maps Service error:', error.message);
  });

  console.log('\n--- Testing OpenWeather Service ---');
  import('./services/openWeatherService.js').then((module) => {
    console.log('OpenWeather Service imported successfully ✅');
  }).catch((error) => {
    console.error('OpenWeather Service error:', error.message);
  });
} catch (error) {
  console.error('Service import error:', error);
}