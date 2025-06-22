import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentContainer = styled.section`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`;

const PaymentTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const AmountDisplay = styled.div`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  color: #333;
`;

const CardElementContainer = styled.div`
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  margin-bottom: 1.5rem;

  .StripeElement {
    padding: 0.5rem 0;
  }

  .StripeElement--focus {
    border-color: #667eea;
  }
`;

const PayButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
  background: ${props => props.type === 'success' ? '#d1edff' : '#ffe6e6'};
  color: ${props => props.type === 'success' ? '#0066cc' : '#cc0000'};
  border: 1px solid ${props => props.type === 'success' ? '#99ccff' : '#ffcccc'};
`;

interface Currency {
  code: string;
  symbol: string;
  amount: number;
}

const currencies: Currency[] = [
  { code: 'usd', symbol: '$', amount: 29.99 },
  { code: 'eur', symbol: '€', amount: 27.99 },
  { code: 'cny', symbol: '¥', amount: 199.99 },
  { code: 'jpy', symbol: '¥', amount: 3999 },
  { code: 'gbp', symbol: '£', amount: 24.99 }
];

const PaymentSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = currencies.find(c => c.code === e.target.value);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const createPaymentIntent = async (amount: number, currency: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      console.log(`Creating payment intent for ${currency.toUpperCase()} ${amount}`);
      
      const response = await fetch(`${apiUrl}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata: {
            product: t('payment.description'),
            language: i18n.language
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Payment intent created successfully');
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error; // Re-throw to be handled by the calling function
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setMessage(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent on the backend
      const { client_secret } = await createPaymentIntent(
        selectedCurrency.amount,
        selectedCurrency.code
      );

      if (!client_secret) {
        throw new Error('No client secret received from server');
      }

      // Confirm the payment with the card element
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // In real app, get from form
          },
        },
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        let errorMessage = t('payment.error');
        
        // Provide specific error messages
        if (error.type === 'card_error' || error.type === 'validation_error') {
          errorMessage = error.message || errorMessage;
        }
        
        setMessage({ 
          type: 'error', 
          text: errorMessage
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        setMessage({ 
          type: 'success', 
          text: t('payment.success')
        });
        
        // Clear the card element
        cardElement.clear();
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        setMessage({ 
          type: 'error', 
          text: 'Payment requires additional authentication'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: t('payment.error')
        });
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      
      let errorMessage = t('payment.error');
      if (error.message) {
        // Check if it's a backend connection error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Unable to connect to payment server. Please check if the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PaymentContainer>
      <PaymentTitle>{t('payment.title')}</PaymentTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t('payment.selectCurrency')}</Label>
          <Select value={selectedCurrency.code} onChange={handleCurrencyChange}>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {t(`currency.${currency.code}`)} ({currency.symbol})
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('payment.amount')}</Label>
          <AmountDisplay>
            {selectedCurrency.symbol}{selectedCurrency.amount.toFixed(2)}
          </AmountDisplay>
        </FormGroup>

        <FormGroup>
          <Label>Card Details</Label>
          <CardElementContainer>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </CardElementContainer>
        </FormGroup>

        <PayButton type="submit" disabled={!stripe || processing}>
          {processing ? t('payment.processing') : t('payment.payNow')}
        </PayButton>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}
      </form>
    </PaymentContainer>
  );
};

export default PaymentSection; 