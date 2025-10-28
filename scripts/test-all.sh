#!/bin/bash
# Run all tests with coverage for RustCare UI

set -e

echo "🧪 Running all tests for RustCare UI..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run unit tests with coverage
echo ""
echo "1️⃣  Running unit tests with coverage..."
npm run test:coverage

# Run E2E tests
echo ""
echo "2️⃣  Running E2E tests..."
npm run test:e2e

# Run type checking
echo ""
echo "3️⃣  Running TypeScript type checking..."
npm run typecheck

# Run linting
echo ""
echo "4️⃣  Running ESLint..."
npm run lint

echo ""
echo "✅ All tests completed successfully!"
echo ""
echo "📊 Coverage reports:"
echo "   - Unit tests: coverage/index.html"
echo "   - E2E tests: playwright-report/index.html"
