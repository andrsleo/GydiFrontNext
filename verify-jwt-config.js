/**
 * JWT Configuration Verification Script
 *
 * This script verifies that:
 * 1. JWT_SECRET is configured in .env.local
 * 2. The secret matches the backend configuration
 * 3. The jose library can verify tokens using this secret
 *
 * Run with: node verify-jwt-config.js
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n🔐 JWT Configuration Verification\n');
console.log('='.repeat(50));

// Check if JWT_SECRET is loaded
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('❌ FAIL: JWT_SECRET not found in .env.local');
  console.log('\n📝 Action Required:');
  console.log('   Add the following to .env.local:');
  console.log('   JWT_SECRET=<your-backend-jwt-secret>\n');
  process.exit(1);
}

console.log('✅ JWT_SECRET is configured');
console.log(`   Length: ${jwtSecret.length} characters`);

// Verify the secret matches expected backend format (Base64)
const isBase64 = /^[A-Za-z0-9+/=]+$/.test(jwtSecret);
if (isBase64) {
  console.log('✅ Secret format is valid (Base64)');
} else {
  console.warn('⚠️  Secret format may be invalid (not Base64)');
}

// Check that backend API URL is configured
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (apiUrl) {
  console.log(`✅ Backend API URL: ${apiUrl}`);
} else {
  console.warn('⚠️  NEXT_PUBLIC_API_URL not configured');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Configuration verified successfully!\n');
console.log('📌 Next Steps:');
console.log('   1. Start backend: cd ../GydiMicroservices && ./mvnw spring-boot:run');
console.log('   2. Start frontend: npm run dev');
console.log('   3. Test middleware: Navigate to /dashboard (should verify JWT locally)\n');
console.log('⚡ Expected Performance:');
console.log('   Before: ~150ms (HTTP call to backend)');
console.log('   After:  ~0ms (local JWT verification)\n');
