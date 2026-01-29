const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Admin (Backend only - bypasses RLS)
const supabaseAdmin = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/delete-request', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'delete-request.html'));
});

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

app.post('/delete-account', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        console.log(`Requesting deletion for user: ${userId}`);

        // 1. Delete from Auth (This cascades to public.users/profiles if set up with cascade, 
        //    but let's manually clean up public tables just in case or trust cascading)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) {
            console.error('Auth deletion error:', authError);
            throw authError;
        }

        // 2. Explicitly delete from public tables if needed (usually handled by Supabase Cascade on Reference)
        // verify deletion or cleanup auxiliary data if constraints prevent cascade
        // await supabaseAdmin.from('profiles').delete().eq('id', userId);

        res.json({ success: true, message: 'Account deleted successfully' });

    } catch (e) {
        console.error('Delete account failed:', e);
        res.status(500).json({
            error: e.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
