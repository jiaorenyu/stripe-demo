import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import styled, { createGlobalStyle } from 'styled-components';

import Header from './components/Header';
import PaymentSection from './components/PaymentSection';
import FeaturesSection from './components/FeaturesSection';

// Get Stripe publishable key from environment variables
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx'
);

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  #root {
    min-height: 100vh;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 3rem;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Elements stripe={stripePromise}>
        <Container>
          <Header />
          <MainContent>
            <PaymentSection />
            <FeaturesSection />
          </MainContent>
        </Container>
      </Elements>
    </>
  );
}

export default App; 