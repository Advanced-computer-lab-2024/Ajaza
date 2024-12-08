// src/StripeContainer.js
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm"; // Your form component
const stripePromise = loadStripe(
  "pk_test_51QH5D3JPPPYoFOLOwIrFzM72ZruNO6s2SjF4FSQ4udADk38fSI1dnpWfmWEZ3RNZkdFxKz75gaizz4eY7V8qItSr00V7Lz9ZVq"
);

const StripeContainer = ({
  amount,
  type,
  selectedDate = null,
  userid,
  id = null,
  useWallet,
  setLeave = () => {},
  deliveryAddress = "0",
}) => {
  console.log("stripe promise:", stripePromise);
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        type={type}
        selectedDate={selectedDate}
        userid={userid}
        id={id}
        useWallet={useWallet}
        setLeave={setLeave}
        deliveryAddress={deliveryAddress}
      />
    </Elements>
  );
};

export default StripeContainer;
