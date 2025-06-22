// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Check if Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is required');
  console.log('Please set your Stripe secret key in the .env file:');
  console.log('STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here');
  console.log('Current working directory:', process.cwd());
  console.log('Looking for .env file in:', require('path').resolve('.env'));
  process.exit(1);
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    // Validate required fields
    if (!amount || !currency) {
      return res.status(400).json({
        error: {
          message: 'Amount and currency are required',
        },
      });
    }

    // Validate amount (should be positive integer)
    if (typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
      return res.status(400).json({
        error: {
          message: 'Amount must be a positive integer in the smallest currency unit',
        },
      });
    }

    // Validate currency (should be 3-letter code)
    if (typeof currency !== 'string' || currency.length !== 3) {
      return res.status(400).json({
        error: {
          message: 'Currency must be a 3-letter currency code',
        },
      });
    }

    console.log(`Creating payment intent: ${currency.toUpperCase()} ${amount/100}`);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        created_at: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`Payment intent created: ${paymentIntent.id}`);

    res.json({
      client_secret: paymentIntent.client_secret,
      status: paymentIntent.status,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      res.status(400).json({
        error: {
          message: error.message,
          type: 'card_error'
        },
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({
        error: {
          message: error.message,
          type: 'invalid_request_error'
        },
      });
    } else {
      res.status(500).json({
        error: {
          message: 'An unexpected error occurred',
          type: 'api_error'
        },
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test Stripe connection
    await stripe.accounts.retrieve();
    
    res.json({ 
      status: 'OK', 
      message: 'Payment server is running',
      timestamp: new Date().toISOString(),
      stripe_connected: true,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Payment server is running but Stripe connection failed',
      timestamp: new Date().toISOString(),
      stripe_connected: false,
      error: error.message
    });
  }
});

// Get supported currencies endpoint
app.get('/api/currencies', (req, res) => {
  const supportedCurrencies = [
    { code: 'usd', name: 'US Dollar', symbol: '$' },
    { code: 'eur', name: 'Euro', symbol: '€' },
    { code: 'cny', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'jpy', name: 'Japanese Yen', symbol: '¥' },
    { code: 'gbp', name: 'British Pound', symbol: '£' }
  ];
  
  res.json({
    currencies: supportedCurrencies,
    count: supportedCurrencies.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      type: 'api_error'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      type: 'not_found'
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 Payment server starting...');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Create payment: http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`🌍 Currencies: http://localhost:${PORT}/api/currencies`);
  
  if (process.env.STRIPE_SECRET_KEY) {
    const keyType = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST';
    console.log(`🔑 Stripe configured (${keyType} mode)`);
  }
  
  console.log('✅ Server ready to handle payments!');
}); 