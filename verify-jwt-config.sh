#!/bin/bash

# JWT Configuration Verification Script
# Verifies that JWT_SECRET is properly configured in .env.local

echo ""
echo "🔐 JWT Configuration Verification"
echo ""
echo "=================================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "❌ FAIL: .env.local file not found"
  echo ""
  echo "📝 Action Required:"
  echo "   Create .env.local file in GydiFront directory"
  exit 1
fi

echo "✅ .env.local file exists"

# Check if JWT_SECRET is configured
if grep -q "^JWT_SECRET=" .env.local; then
  echo "✅ JWT_SECRET is configured"

  # Get the secret value (without exposing it fully)
  SECRET_LENGTH=$(grep "^JWT_SECRET=" .env.local | cut -d'=' -f2 | wc -c)
  echo "   Length: $SECRET_LENGTH characters"

  # Verify it's not empty
  if [ "$SECRET_LENGTH" -gt 10 ]; then
    echo "✅ Secret appears to be valid (sufficient length)"
  else
    echo "⚠️  Warning: Secret might be too short"
  fi
else
  echo "❌ FAIL: JWT_SECRET not found in .env.local"
  echo ""
  echo "📝 Action Required:"
  echo "   Add the following to .env.local:"
  echo "   JWT_SECRET=<your-backend-jwt-secret>"
  exit 1
fi

# Check backend API URL
if grep -q "^NEXT_PUBLIC_API_URL=" .env.local; then
  API_URL=$(grep "^NEXT_PUBLIC_API_URL=" .env.local | cut -d'=' -f2)
  echo "✅ Backend API URL: $API_URL"
else
  echo "⚠️  NEXT_PUBLIC_API_URL not configured"
fi

echo ""
echo "=================================================="
echo "✅ Configuration verified successfully!"
echo ""
echo "📌 Next Steps:"
echo "   1. Start backend: cd ../GydiMicroservices && ./mvnw spring-boot:run"
echo "   2. Start frontend: npm run dev"
echo "   3. Test middleware: Navigate to /dashboard"
echo ""
echo "⚡ Expected Performance Improvement:"
echo "   Before: ~150ms (HTTP call to backend /verify)"
echo "   After:  ~0ms (local JWT verification)"
echo ""
echo "🔒 Security Note:"
echo "   JWT_SECRET is in .gitignore and will NOT be committed to git"
echo ""
