import axios from 'axios';

export async function testBackendConnection() {
  const urls = [
    'http://10.0.2.2:8000/api',
    'http://localhost:8000/api',
    'http://10.0.2.2:8000',
    'http://localhost:8000',
  ];

  for (const url of urls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await axios.get(`${url}/health-check/`, { timeout: 5000 });
      console.log(`✅ Success: ${url}`, response.status);
      return url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`❌ Failed: ${url}`, error.message);
      }
    }
  }
  
  console.log('🔥 No working URL found!');
  return null;
}