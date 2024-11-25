require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripePay = async (req, res, next) => {

    const { paymentMethodId, total } = req.body;

    if(!paymentMethodId) {
        return next();
    }

    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total, // Amount in cents (change as necessary)
            currency: 'usd',
            payment_method: paymentMethodId, // Attach the payment method
            confirm: true, // Automatically confirm the payment intent
            return_url: 'http://localhost:3000/payment-confirmation', // Optional: if redirect is needed
            automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never", // Avoid redirect-based methods
            },
        });
    
        console.log(paymentIntent.status);

        if(paymentIntent.status !== 'succeeded') {
            return res.status(400).json({error: { message: 'Payment failed' }});
        }

        next();
    } catch (error) {
        res.status(500).json({error: { message: error.message }});
    }
};

module.exports = stripePay;
