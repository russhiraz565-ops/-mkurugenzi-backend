import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ message: 'Mkurugenzi API running!' });
});

app.post('/api/orders', (req, res) => {
    console.log('Order:', req.body);
    res.json({ success: true });
});

app.post('/api/messages', (req, res) => {
    console.log('Message:', req.body);
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
