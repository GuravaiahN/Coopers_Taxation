#!/bin/bash

# Production deployment script for Coopers Taxation
set -e

echo "🚀 Building Coopers Taxation for production..."

# Environment check
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please copy .env.example to .env.local and configure your environment variables"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📋 Node.js version: $NODE_VERSION"

if [[ $NODE_VERSION < "v18" ]]; then
    echo "❌ Error: Node.js 18+ is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Type check
echo "🔍 Running type check..."
npm run type-check

# Lint code
echo "🧹 Running linter..."
npm run lint

# Build application
echo "🏗️ Building Next.js application..."
npm run build

# Security audit
echo "🔒 Running security audit..."
npm audit --audit-level moderate

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads

echo "✅ Production build completed successfully!"
echo ""
echo "📋 Pre-deployment checklist:"
echo "  ✓ Node.js 18+ detected"
echo "  ✓ Environment variables configured"
echo "  ✓ Dependencies installed"
echo "  ✓ TypeScript compiled"
echo "  ✓ Code linted"
echo "  ✓ Next.js build completed"
echo "  ✓ Security audit passed"
echo "  ✓ Directories created"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Configure your production environment variables"
echo "2. Set up your MongoDB database"
echo "3. Configure email settings"
echo "4. Deploy with: npm start"