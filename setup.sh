#!/bin/bash

echo "🚀 Setting up Multi-Currency Payment Demo..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file and add your Stripe publishable key"
else
    echo "✅ .env file already exists"
fi

# Setup backend
echo "🔧 Setting up backend server..."
cd server

# Install backend dependencies
if [ ! -d node_modules ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    echo "STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here" > .env
    echo "PORT=3001" >> .env
    echo "⚠️  Please edit server/.env file and add your Stripe secret key"
else
    echo "✅ Backend .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Stripe keys from https://dashboard.stripe.com/apikeys"
echo "2. Edit .env and add your STRIPE_PUBLISHABLE_KEY"
echo "3. Edit server/.env and add your STRIPE_SECRET_KEY"
echo "4. Start the backend: cd server && npm start"
echo "5. Start the frontend: npm start"
echo ""
echo "🧪 Test with these card numbers:"
echo "   Success: 4242 4242 4242 4242"
echo "   Decline: 4000 0000 0000 0002"
echo "   Expiry: Any future date (e.g., 12/25)"
echo "   CVC: Any 3 digits (e.g., 123)"
echo ""
echo "🔗 Useful links:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Stripe Dashboard: https://dashboard.stripe.com/" 