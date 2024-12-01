// src/PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, notification } from 'antd';
import { getSetNewToken } from './Constants';

const PaymentForm = ({amount, type, selectedDate, userid, id, useWallet, setLeave, deliveryAddress}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  let amountIn = amount*100;
  // if(!(amountIn > 0 && amountIn < 999999999999)) {
  //   amountIn = 10000;
  //   amount = 100;
  // }

  const childSetLeave = () => {
    setLeave(true);
  }

  console.log("type: " + type);
  console.log("amount: " + amount);
  console.log("selectedDate: " + selectedDate);
  console.log("userid: " + userid);
  console.log("id: " + id);
  console.log("useWallet: " + useWallet);


  /*
    Visa (success): 4242 4242 4242 4242
    Visa (insufficient funds): 4000 0000 0000 9995
    MasterCard (success): 5555 5555 5555 4444
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(amount);
    if(type === "activity" && !amount) {
      setLoading(false);
      notification.error({
        message: 'Payment Failed',
        description: 'You need to select a price',
      });
      return;
    }

    if(type === "itinerary" && !selectedDate) {
      setLoading(false);
      notification.error({
        message: 'Payment Failed',
        description: 'You need to select a date.',
      });
      return;
    }

    if (!stripe || !elements ) return; // Stripe.js hasn't loaded yet

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
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: amountIn }),
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
          description: 'Your payment was successful. Booking...',
        });

        if(type === "activity") {
          const bookingResponse = await fetch(`http://localhost:5000/tourist/${userid}/activity/${id}/book`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentMethodId: paymentMethod.id, total: amount, useWallet: false }),
          });

          const bookingResult = await bookingResponse.json();

          if (bookingResult.error) {
            notification.error({
              message: 'Booking Failed',
              description: bookingResult.error.message,
            });
          } else {
            console.log("ok weselna act");
            notification.success({
              message: 'Booking Success',
              description: 'Your booking was successful.',
            });
            await getSetNewToken(id,"tourist");
            childSetLeave();
          }


        } else if (type === "itinerary") {
          const bookingResponse = await fetch(`http://localhost:5000/tourist/${userid}/itinerary/${id}/book`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentMethodId: paymentMethod.id, total: amount, useWallet: false, date: selectedDate }),
          });

          const bookingResult = await bookingResponse.json();
          console.log(bookingResult);

          if (bookingResult.error) {
            notification.error({
              message: 'Booking Failed',
              description: bookingResult.error.message,
            });
          } else {
            console.log("ok weselna itin");
            notification.success({
              message: 'Booking Success',
              description: 'Your booking was successful.',
            });
            await getSetNewToken(id,"tourist");
            childSetLeave();

          }
        } else {
          const purchaseResponse = await fetch(`http://localhost:5000/tourist/cart/checkout/${userid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentMethodId: paymentMethod.id, total: amount, useWallet: false, cod: false, deliveryAddress: deliveryAddress }),
          });

          const purchaseResult = await purchaseResponse.json();
          console.log(purchaseResult);

          if (purchaseResult.error) {
            notification.error({
              message: 'Purchase Failed',
              description: purchaseResult.error.message,
            });
          } else {
            notification.success({
              message: 'Purchase Success',
              description: 'Your purchase was successful.',
            });
            await getSetNewToken(id,"tourist");
            childSetLeave();
            window.location.href = "http://localhost:3000/tourist/orders";
          }
        }
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div style={{ marginBottom: '20px' }}>
      <br />
        <label>Card Details</label><br /><br />
        <CardElement />
      </div>

      <Button
        type="primary"
        htmlType="submit"
        disabled={!stripe}
        loading={loading}
        style={{ marginLeft: '69%' }}
      >
        {loading ? 'Processing...' : (type==="product")?'Place Order':'Pay & Book by card'}
      </Button>
    </form>
  );
};

export default PaymentForm;
