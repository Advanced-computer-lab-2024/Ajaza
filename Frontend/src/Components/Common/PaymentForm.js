// src/PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, notification } from 'antd';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  /*
Visa (success): 4242 4242 4242 4242
Visa (insufficient funds): 4000 0000 0000 9995
MasterCard (success): 5555 5555 5555 4444
*/

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return; // Stripe.js hasn't loaded yet

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    // Create a payment method using the card details
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      notification.error({
        message: 'Payment Failed',
        description: error.message,
      });
      setLoading(false);
    } else {
      // Send the payment method to your server for processing
      const paymentResponse = await fetch('http://localhost:5000/tourist/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      const paymentResult = await paymentResponse.json();

      console.log(paymentResult);

      if (paymentResult.error) {
        notification.error({
          message: 'Payment Failed',
          description: paymentResult.error.message,
        });
      } else {
        notification.success({
          message: 'Payment Success',
          description: 'Your payment was successful.',
        });
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div style={{ marginBottom: '20px' }}>
      <br />
        <label>Card Details</label><br />
        <CardElement />
      </div>

      <Button
        type="primary"
        htmlType="submit"
        disabled={!stripe}
        loading={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

export default PaymentForm;
