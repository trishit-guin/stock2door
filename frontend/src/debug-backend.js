// Simple test to check if the backend is running and accessible

async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test if backend is running
    const response = await fetch('http://localhost:5000/api/v1/optimize-route/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running!');
      console.log('📡 Health check response:', data);
      return true;
    } else {
      console.log('❌ Backend returned error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    console.log('💡 Make sure to start the backend server with: npm run dev');
    return false;
  }
}

// Test the connection
testBackendConnection();