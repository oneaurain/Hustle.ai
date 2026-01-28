const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // e.g. 499 for $4.99
            currency: currency || 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            ephemeralKey: 'ephemeral_key_mock_for_demo', // In prod, generate ephemeral key properly
            customer: 'customer_mock_id', // In prod, create/retrieve customer
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            error: e.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
