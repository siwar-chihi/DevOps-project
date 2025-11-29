import axios from 'axios';

const BASE_URL = process.env.APP_URL || 'http://localhost:8080';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      await axios.get(`${BASE_URL}/health`, { timeout: 2000 });
      console.log('✅ Server ready\n');
      return true;
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/30...`);
      await sleep(1000);
    }
  }
  throw new Error('Server timeout');
}

async function runTests() {
  console.log('\n🔥 SMOKE TESTS\n');

  let passed = 0;
  let failed = 0;

  await waitForServer();

  // Test 1: Health endpoint
  console.log('Test 1: Health Check');
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.status === 200) {
      console.log('✅ PASSED\n');
      passed++;
    }
  } catch (e) {
    console.log('❌ FAILED\n');
    failed++;
  }

  // Test 2: Homepage loads
  console.log('Test 2: Homepage');
  try {
    const res = await axios.get(BASE_URL);
    if (res.status === 200 && res.data.includes('html')) {
      console.log('✅ PASSED\n');
      passed++;
    }
  } catch (e) {
    console.log('❌ FAILED\n');
    failed++;
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
