import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testRouteOptimization() {
  try {
    console.log('🧪 Testing Route Optimization API...\n');

    const testData = {
      source: 'Mumbai',
      destination: 'Pune',
      vehicleType: 'LCV',
      fuelType: 'DIESEL',
      includeWeather: true,
      includeAlternatives: false
    };

    console.log('📝 Test data:', testData);
    
    // Test the backend endpoint
    const response = await axios.post('http://localhost:5000/api/v1/routes/test-optimize', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    });

    console.log('✅ Route optimization successful!');
    console.log('📊 Results:');
    console.log('- Distance:', response.data.distance?.km, 'km');
    console.log('- Duration:', response.data.duration?.with_traffic?.hours || response.data.duration?.normal?.hours, 'hours');
    console.log('- Fuel Cost: ₹', response.data.fuel_consumption?.fuel_cost);
    console.log('- CO2 Emissions:', response.data.emissions?.co2_emissions, 'kg');
    console.log('- Traffic:', response.data.traffic?.current_conditions);
    
    if (response.data.weather) {
      console.log('- Weather Safety Score:', response.data.weather.overall_safety_score + '/100');
    }

  } catch (error: any) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Please start it with: npm run dev');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testRouteOptimization();